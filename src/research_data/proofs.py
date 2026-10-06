"""Immutable editor-to-publication proof packages.

The proof store deliberately keeps drafts separate from catalog runs.  A
published proof creates a new analysis run and copies the immutable revision
files into that run as ordinary catalog artifacts.
"""
from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import os
import re
import tempfile
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping
from uuid import UUID, uuid4

from .catalog import Catalog

SCHEMA = "research-data.proof-draft.v1"
_ANCHORS = {"document", "title", "abstract", "body", "caption", "figure"}
_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,119}$")
_DATA = re.compile(r"^data:image/(png|jpeg);base64,([A-Za-z0-9+/]+=*)$")
_TYPES_2D = {"rect", "ellipse", "line", "polyline", "path", "text", "image", "viewport3d", "group"}
_TYPES_3D = {"box", "sphere", "cylinder", "plane", "image", "group"}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_id(value: str, label: str = "id") -> str:
    if not isinstance(value, str) or not _ID.fullmatch(value) or value in {".", ".."}:
        raise ValueError(f"invalid {label}")
    return value


def _canonical(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")


def _hash(value: Any) -> str:
    return hashlib.sha256(_canonical(value)).hexdigest()


def _file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _atomic_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(value, stream, ensure_ascii=False, indent=2, allow_nan=False)
            stream.write("\n")
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


@contextmanager
def _lock(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    handle = path.open("a+")
    try:
        if os.name == "nt":
            import msvcrt
            handle.seek(0); handle.write("0"); handle.flush(); handle.seek(0)
            msvcrt.locking(handle.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        yield
    finally:
        if os.name == "nt":
            import msvcrt
            handle.seek(0); msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl
            fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
        handle.close()


def _data_url(value: Any, label: str) -> str:
    if isinstance(value, bytes):
        if not value.startswith(b"\x89PNG\r\n\x1a\n"):
            raise ValueError(f"{label} must be PNG bytes")
        value = "data:image/png;base64," + base64.b64encode(value).decode("ascii")
    if not isinstance(value, str) or not _DATA.fullmatch(value):
        raise ValueError(f"{label} must be a PNG/JPEG data URL")
    try:
        decoded = base64.b64decode(value.split(",", 1)[1], validate=True)
    except Exception as exc:
        raise ValueError(f"{label} contains invalid base64") from exc
    try:
        from PIL import Image
        with Image.open(io.BytesIO(decoded)) as image: image.verify()
    except ImportError as exc:
        raise RuntimeError("Image validation requires Pillow; install the UI/test extras and retry") from exc
    except Exception as exc:
        raise ValueError(f"{label} is not a readable image") from exc
    return value


def _scene(scene: Any) -> dict:
    if not isinstance(scene, dict) or scene.get("schema") != "three-interact.scene" or scene.get("version") != 1:
        raise ValueError("scene must be a three-interact.scene v1 object")
    try:
        UUID(str(scene["id"]))
    except Exception as exc:
        raise ValueError("scene id must be a UUID") from exc
    mode = scene.get("mode")
    if mode not in {"2d", "3d"} or not isinstance(scene.get("units"), str) or not isinstance(scene.get("coordinates"), str):
        raise ValueError("scene mode, units and coordinates are invalid")
    elements = scene.get("elements")
    if not isinstance(elements, dict) or len(elements) > 10000:
        raise ValueError("scene elements must be an object")
    allowed = _TYPES_2D if mode == "2d" else _TYPES_3D
    for key, element in elements.items():
        try:
            UUID(str(key)); UUID(str(element.get("id")))
        except Exception as exc:
            raise ValueError("scene element IDs must be UUIDs") from exc
        if not isinstance(element, dict) or element.get("id") != key or element.get("type") not in allowed:
            raise ValueError("scene element identity or type is invalid")
        if not isinstance(element.get("name"), str) or not isinstance(element.get("visible"), bool) or not isinstance(element.get("locked"), bool):
            raise ValueError("scene element metadata is invalid")
        transform = element.get("transform")
        if not isinstance(transform, dict) or any(not isinstance(transform.get(k), list) or len(transform[k]) != 3 for k in ("position", "rotation", "scale")):
            raise ValueError("scene element transform is invalid")
        if any(not isinstance(n, (int, float)) or isinstance(n, bool) for k in ("position", "rotation", "scale") for n in transform[k]):
            raise ValueError("scene transform values must be finite numbers")
        if any(n <= 0 for n in transform["scale"]):
            raise ValueError("scene scale must be positive")
        if not isinstance(element.get("properties"), dict):
            raise ValueError("scene element properties are invalid")
        src = element["properties"].get("src")
        if src is not None and (not isinstance(src, str) or (src.startswith("data:") and not _DATA.fullmatch(src)) or (not src.startswith("data:") and (".." in Path(src).parts or Path(src).is_absolute() or "://" in src or "\\" in src))):
            raise ValueError("scene image source is unsafe")
        embedded = element["properties"].get("scene")
        if embedded is not None:
            _scene(embedded)
    for key, element in elements.items():
        parent = element.get("parent")
        if parent is not None and parent not in elements:
            raise ValueError("scene parent does not exist")
        ancestors = {key}
        while parent is not None:
            if parent in ancestors:
                raise ValueError("scene parent cycle")
            ancestors.add(parent)
            parent = elements[parent].get("parent")
    return scene


def _payload(payload: Mapping[str, Any]) -> dict:
    if not isinstance(payload, Mapping) or payload.get("schema") != SCHEMA:
        raise ValueError(f"payload schema must be {SCHEMA!r}")
    scene = _scene(payload.get("scene"))
    document = payload.get("document")
    if not isinstance(document, Mapping):
        raise ValueError("document is required")
    document = dict(document)
    if document.get("layout", "single") not in {"single", "double"}:
        raise ValueError("document.layout must be single or double")
    for field in ("title", "authors", "abstract", "body", "caption"):
        if not isinstance(document.get(field, ""), str):
            raise ValueError(f"document.{field} must be text")
    inputs = payload.get("inputs")
    if not isinstance(inputs, list):
        raise ValueError("inputs must be a list")
    cleaned_inputs = []
    for item in inputs:
        if not isinstance(item, Mapping) or not isinstance(item.get("run_id"), str) or not isinstance(item.get("artifact_id"), str) or not re.fullmatch(r"[0-9a-f]{64}", str(item.get("sha256", ""))):
            raise ValueError("each input requires run_id, artifact_id and sha256")
        cleaned_inputs.append({"run_id": item["run_id"], "artifact_id": item["artifact_id"], "sha256": item["sha256"]})
    assets = payload.get("assets", {})
    if not isinstance(assets, Mapping):
        raise ValueError("assets must be an object")
    clean_assets = {}
    for name, value in assets.items():
        asset_path = Path(name) if isinstance(name, str) else Path(".")
        if (not isinstance(name, str) or not name or asset_path.is_absolute() or ".." in asset_path.parts or "\\" in name or "://" in name or name in {".", ".."}):
            raise ValueError("asset names must be safe relative paths")
        clean_assets[name] = _data_url(value, f"asset {name}")
    def check_assets(current: Mapping[str, Any]) -> None:
        for element in current["elements"].values():
            src = element["properties"].get("src")
            if src and not src.startswith("data:") and src not in clean_assets:
                raise ValueError(f"scene image asset is missing: {src}")
            embedded = element["properties"].get("scene")
            if isinstance(embedded, Mapping):
                check_assets(embedded)
    check_assets(scene)
    editor = payload.get("editor", {})
    if not isinstance(editor, Mapping):
        raise ValueError("editor must be an object")
    # Three Interact draws equal-layer 2D elements in insertion order.
    # Keep that order in JSON and include it explicitly in the canonical hash.
    result = {"schema": SCHEMA, "scene": scene, "scene_order": list(scene["elements"]), "document": document, "inputs": cleaned_inputs, "assets": clean_assets, "editor": dict(editor)}
    if "recipe" in payload:
        result["recipe"] = payload["recipe"]
    if payload.get("figure_png") is not None:
        result["figure_png"] = _data_url(payload["figure_png"], "figure_png")
    return result


class ProofStore:
    def __init__(self, root: str | Path):
        self.root = Path(root).expanduser().resolve()
        self.proofs = self.root / "proofs"
        self.proofs.mkdir(parents=True, exist_ok=True)
        self.catalog = Catalog(self.root)

    def _run(self, run_id: str) -> Path:
        return self.proofs / _safe_id(run_id, "run id")

    def _draft_path(self, run_id: str) -> Path:
        return self._run(run_id) / "draft.json"

    def draft(self, run_id: str) -> dict | None:
        path = self._draft_path(run_id)
        if not path.exists():
            return None
        value = json.loads(path.read_text(encoding="utf-8"))
        value["path"] = str(path)
        value["hash"] = _hash({k: v for k, v in value.items() if k not in {"path", "hash"}})
        return value

    def save_draft(self, run_id: str, payload: Mapping[str, Any], expected_hash: str | None = None) -> dict:
        rid = _safe_id(run_id, "run id")
        clean = _payload(payload)
        path = self._draft_path(rid)
        with _lock(self._run(rid) / ".lock"):
            current = self.draft(rid)
            current_hash = current.get("hash") if current else None
            if expected_hash is not None and expected_hash != current_hash:
                raise ValueError("draft changed since it was read; reload before saving")
            _atomic_json(path, clean)
        return {**clean, "path": str(path), "hash": _hash(clean)}

    def revisions(self, run_id: str) -> list[dict]:
        folder = self._run(run_id)
        if not folder.exists():
            return []
        out = []
        for manifest in folder.glob("*/manifest.json"):
            try:
                value = json.loads(manifest.read_text(encoding="utf-8"))
                value["path"] = str(manifest.parent)
                out.append(value)
            except (OSError, ValueError, TypeError):
                continue
        return sorted(out, key=lambda x: x.get("created_at", ""))

    def _verify_inputs(self, payload: dict) -> tuple[list[str], list[dict]]:
        parents, frozen = [], []
        for item in payload["inputs"]:
            run_id = _safe_id(item["run_id"], "run id")
            artifact = self.catalog.select_artifact(run_id, item["artifact_id"])
            run_path = self.root / "runs" / run_id
            path = (run_path / artifact["path"]).resolve()
            if not path.is_relative_to(run_path.resolve()) or not path.is_file() or _file_hash(path) != artifact.get("sha256") or artifact.get("sha256") != item["sha256"]:
                raise ValueError(f"input artifact is missing or tampered: {run_id}/{item['artifact_id']}")
            if run_id not in parents:
                parents.append(run_id)
            frozen.append({"run_id": run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"], "source_run_provenance": self.catalog.get(run_id).get("provenance", {})})
        return parents, frozen

    def publish(self, run_id: str, payload: Mapping[str, Any] | None = None, figure_png: bytes | str | None = None) -> dict:
        rid = _safe_id(run_id, "run id")
        base = _payload(payload) if payload is not None else None
        if base is None:
            saved = self.draft(rid)
            if not saved:
                raise ValueError("no draft exists for this run")
            base = _payload(saved)
        if figure_png is not None:
            base["figure_png"] = _data_url(figure_png, "figure_png")
        if "figure_png" not in base:
            raise RuntimeError("publish requires figure_png bytes or a saved figure_png data URL")
        owner = self.catalog.get(rid)
        parents, frozen_inputs = self._verify_inputs(base)
        if rid not in parents:
            parents.insert(0, rid)
        revision_id = str(uuid4())
        folder = self._run(rid) / revision_id
        payload_hash = _hash(base)
        vendor = Path(__file__).resolve().parent / "resources" / "three_interact" / "vendor.json"
        source_root = Path(__file__).resolve().parent
        source_paths = ["proofs.py", "figure_editor.py"] + (["resources/three_interact"] if vendor.is_file() else [])
        run_kwargs = {"title": base["document"].get("title") or "Research proof", "project": owner.get("project", "default"), "kind": "analysis", "description": "Immutable editor proof revision", "parameters": {"proof_revision_id": revision_id, "proof_payload_hash": payload_hash, "inputs": frozen_inputs}, "parent_run_ids": parents, "repo": str(source_root), "entrypoint": "proofs.py", "source_paths": source_paths}
        # Freeze the producing source before rendering, including the actual vendored editor bytes.
        with self.catalog.run(**run_kwargs) as analysis:
            folder.mkdir(parents=True)
            scene_path = folder / "scene.json"; document_path = folder / "document.json"; assets_path = folder / "assets.json"; recipe_path = folder / "recipe.json"; png_path = folder / "figure.png"; html_path = folder / "report.html"; pdf_path = folder / "report.pdf"
            scene_path.write_bytes(json.dumps(base["scene"], ensure_ascii=False, allow_nan=False).encode("utf-8") + b"\n"); document_path.write_bytes(_canonical(base["document"]) + b"\n"); assets_path.write_bytes(_canonical({"assets": base["assets"], "editor": base["editor"]}) + b"\n"); recipe_path.write_bytes(_canonical(base.get("recipe", {})) + b"\n")
            png_bytes = base64.b64decode(base["figure_png"].split(",", 1)[1]); png_path.write_bytes(png_bytes)
            self._render_html(html_path, base, revision_id, rid, frozen_inputs)
            self._render_pdf(pdf_path, base, revision_id, png_bytes, rid)
            manifest = {"schema": "research-data.proof.v1", "revision_id": revision_id, "run_id": rid, "created_at": _now(), "payload_hash": payload_hash, "analysis_run_id": analysis.run_id, "scene_sha256": _file_hash(scene_path), "document_sha256": _file_hash(document_path), "assets_sha256": _file_hash(assets_path), "recipe_sha256": _file_hash(recipe_path), "figure_sha256": _file_hash(png_path), "html_sha256": _file_hash(html_path), "pdf_sha256": _file_hash(pdf_path), "inputs": frozen_inputs, "source_runs": parents, "owner_provenance": owner.get("provenance", {}), "editor": base["editor"], "files": {"scene": scene_path.name, "document": document_path.name, "assets": assets_path.name, "recipe": recipe_path.name, "figure_png": png_path.name, "html": html_path.name, "pdf": pdf_path.name}}
            vendor_copy = folder / "editor-vendor.json"
            if vendor.is_file():
                vendor_copy.write_bytes(vendor.read_bytes())
                manifest["editor_asset"] = {"path": vendor_copy.name, "sha256": _file_hash(vendor_copy)}
                manifest["files"]["editor_vendor"] = vendor_copy.name
            _atomic_json(folder / "manifest.json", manifest)
            artifact_files = [(scene_path, "scene"), (document_path, "document"), (assets_path, "assets"), (recipe_path, "recipe"), (png_path, "figure"), (html_path, "report"), (pdf_path, "report"), (folder / "manifest.json", "proof-manifest")]
            if vendor_copy.is_file(): artifact_files.append((vendor_copy, "editor-vendor"))
            for path, role in artifact_files:
                analysis.add_artifact(path, role=role, copy=True, description=f"Proof revision {revision_id}")
        return {**manifest, "revision_id": revision_id, "analysis_run_id": manifest["analysis_run_id"], "html": str(html_path), "pdf": str(pdf_path), "png": str(png_path), "scene": str(scene_path), "document": str(document_path), "manifest": str(folder / "manifest.json"), "sha256": manifest["payload_hash"]}

    def get(self, run_id: str, revision_id: str) -> dict:
        path = self._run(run_id) / _safe_id(revision_id, "revision id") / "manifest.json"
        if not path.is_file():
            raise KeyError(revision_id)
        value = json.loads(path.read_text(encoding="utf-8")); folder = path.parent.resolve()
        if not folder.is_relative_to(self._run(run_id).resolve()): raise ValueError("revision path escapes proof store")
        hashes = {"scene": value.get("scene_sha256"), "document": value.get("document_sha256"), "assets": value.get("assets_sha256"), "figure_png": value.get("figure_sha256"), "html": value.get("html_sha256"), "pdf": value.get("pdf_sha256")}
        if "recipe" in value.get("files", {}):
            hashes["recipe"] = value.get("recipe_sha256")
        for key, expected in hashes.items():
            file_value = value.get("files", {}).get(key)
            if not isinstance(file_value, str) or expected is None:
                raise ValueError(f"revision manifest missing hash for {key}")
            candidate = (folder / file_value).resolve()
            if not candidate.is_relative_to(folder) or not candidate.is_file() or _file_hash(candidate) != expected:
                raise ValueError(f"immutable proof file is missing or tampered: {key}")
        vendor = value.get("editor_asset")
        if vendor:
            candidate = (folder / vendor["path"]).resolve()
            if not candidate.is_relative_to(folder) or not candidate.is_file() or _file_hash(candidate) != vendor["sha256"]:
                raise ValueError("immutable editor metadata is missing or tampered")
        value["path"] = str(folder); return value

    def comments(self, run_id: str, revision_id: str) -> list[dict]:
        revision = self.get(run_id, revision_id); path = Path(revision["path"]) / "comments.json"
        return json.loads(path.read_text(encoding="utf-8")) if path.exists() else []

    def add_comment(self, run_id: str, revision_id: str, text: str, anchor: str = "figure", author: str = "本地用户", parent_id: str | None = None) -> dict:
        if not isinstance(text, str) or not text.strip() or len(text) > 12000: raise ValueError("comment text must be non-empty and at most 12000 characters")
        revision = self.get(run_id, revision_id); scene = json.loads((Path(revision["path"]) / "scene.json").read_text(encoding="utf-8"))
        if anchor not in _ANCHORS and not (anchor.startswith("element:") and anchor[8:] in scene["elements"]): raise ValueError("unknown comment anchor")
        if not isinstance(author, str) or not author.strip() or len(author) > 200: raise ValueError("comment author must be non-empty and at most 200 characters")
        if parent_id is not None: _safe_id(parent_id, "parent comment id")
        path = Path(revision["path"]) / "comments.json"
        with _lock(Path(revision["path"]) / ".comments.lock"):
            comments = self.comments(run_id, revision_id)
            if parent_id is not None and not any(c.get("id") == parent_id for c in comments): raise ValueError("parent comment does not exist")
            comment = {"id": str(uuid4()), "revision_id": revision_id, "anchor": anchor, "author": author, "text": text.strip(), "parent_id": parent_id, "created_at": _now()}
            _atomic_json(path, comments + [comment])
        return comment

    @staticmethod
    def _render_html(path: Path, payload: dict, revision_id: str, run_id: str, frozen_inputs: list[dict]) -> None:
        d = payload["document"]; fig = payload["figure_png"]
        body = "<br>".join(html.escape(d["body"]).splitlines())
        editor_version = payload.get("editor", {}).get("upstream", payload.get("editor", {}).get("bundle", {})).get("version", "unknown")
        inputs = "; ".join(f"{html.escape(str(i['run_id']))}/{html.escape(str(i['artifact_id']))} ({html.escape(str(i['sha256']))})" for i in frozen_inputs) or "none"
        layout = "double" if d.get("layout") == "double" else "single"
        text = f"<!doctype html><meta charset='utf-8'><article class='proof {layout}'><header><h1>{html.escape(d['title'])}</h1><p class='authors'>{html.escape(d['authors'])}</p><p class='meta'>Run {html.escape(run_id)} · Revision {html.escape(revision_id)} · Editor {html.escape(str(editor_version))}</p></header><h2>Abstract</h2><p>{html.escape(d['abstract'])}</p><figure><img src='{html.escape(fig, quote=True)}' alt='figure'><figcaption>{html.escape(d['caption'])}</figcaption></figure><section>{body}</section><footer>Inputs: {inputs}<br>Payload SHA-256: {html.escape(_hash(payload))}</footer></article><style>body{{font-family:Georgia,serif;margin:40px;line-height:1.55;color:#18212b}}article{{max-width:900px;margin:auto}}h1{{font-size:32px;margin-bottom:4px}}.authors{{color:#576575}}.meta,footer{{font:12px ui-monospace,monospace;color:#536273}}img{{max-width:100%;height:auto}}figcaption{{font-size:.9em;color:#576575}}footer{{margin-top:32px;border-top:1px solid #ccd3da;padding-top:8px}}.double section{{column-count:2;column-gap:32px}}.double figure{{break-inside:avoid}}</style>"
        path.write_text(text, encoding="utf-8")

    @staticmethod
    def _render_pdf(path: Path, payload: dict, revision_id: str, png_bytes: bytes, run_id: str = "") -> None:
        try:
            from reportlab.lib.enums import TA_CENTER
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
            from reportlab.lib.units import mm
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.cidfonts import UnicodeCIDFont
            from reportlab.platypus import BaseDocTemplate, Frame, FrameBreak, Image, NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer
        except ImportError as exc:
            raise RuntimeError("PDF export requires reportlab>=4,<5; install the PDF extras and retry") from exc
        if not any(re.search(r"[\u2e80-\u9fff\uf900-\ufaff]", str(payload["document"].get(k, ""))) for k in ("title", "authors", "abstract", "body", "caption")):
            font = "Times-Roman"
        else:
            pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light")); font = "STSong-Light"
        d = payload["document"]; styles = getSampleStyleSheet(); styles.add(ParagraphStyle(name="ProofTitle", parent=styles["Title"], fontName=font, alignment=TA_CENTER, fontSize=19, leading=24)); styles.add(ParagraphStyle(name="ProofBody", parent=styles["BodyText"], fontName=font, fontSize=9.5, leading=13)); styles.add(ParagraphStyle(name="ProofSmall", parent=styles["BodyText"], fontName=font, fontSize=8, leading=10, textColor="#536273"))
        width, height = A4; usable = width - 32 * mm
        single = Frame(16 * mm, 16 * mm, usable, height - 34 * mm, id="single")
        column_width = (usable - 8 * mm) / 2
        def footer(canvas, _doc):
            canvas.saveState(); canvas.setFont(font, 7); canvas.setFillColorRGB(.3, .35, .4)
            canvas.drawString(16 * mm, 11 * mm, f"Run {run_id} | revision {revision_id[:16]}")
            canvas.drawRightString(width - 16 * mm, 11 * mm, str(_doc.page))
            canvas.setFont("Helvetica", 6)
            canvas.drawString(16 * mm, 7 * mm, f"SHA-256 {_hash(payload)}")
            canvas.restoreState()
        doc = BaseDocTemplate(str(path), pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm, topMargin=18 * mm, bottomMargin=16 * mm)
        from reportlab.lib.utils import ImageReader
        iw, ih = ImageReader(io.BytesIO(png_bytes)).getSize()
        maxw = usable - 12; scale = min(maxw / iw, 90 * mm / ih)
        header = [Paragraph(html.escape(d["title"]), styles["ProofTitle"]), Paragraph(html.escape(d["authors"]), styles["ProofSmall"]), Spacer(1, 5 * mm), Paragraph("<b>Abstract</b><br/>" + html.escape(d["abstract"]).replace("\n", "<br/>"), styles["ProofBody"]), Spacer(1, 5 * mm), Image(io.BytesIO(png_bytes), width=iw * scale, height=ih * scale), Paragraph("<b>Figure.</b> " + html.escape(d["caption"]), styles["ProofSmall"]), Spacer(1, 5 * mm)]
        body_parts = [part.strip() for part in re.split(r"\n\s*\n", d["body"]) if part.strip()] or [""]
        body = [Paragraph(html.escape(part).replace("\n", "<br/>"), styles["ProofBody"]) for part in body_parts]
        if d.get("layout", "single") == "double":
            header_height = sum(item.wrap(maxw, height)[1] + item.getSpaceBefore() + item.getSpaceAfter() for item in header) + 18
            columns = [Frame(16 * mm, 16 * mm, column_width, height - 34 * mm, id="left"), Frame(16 * mm + (usable + 8 * mm) / 2, 16 * mm, column_width, height - 34 * mm, id="right")]
            if header_height < height - 80 * mm:
                bottom = height - 18 * mm - header_height
                first_header = Frame(16 * mm, bottom, usable, header_height, id="header")
                first_columns = [Frame(16 * mm, 16 * mm, column_width, bottom - 22 * mm, id="first-left"), Frame(16 * mm + (usable + 8 * mm) / 2, 16 * mm, column_width, bottom - 22 * mm, id="first-right")]
                doc.addPageTemplates([PageTemplate(id="first", frames=[first_header, *first_columns], onPage=footer, autoNextPageTemplate="double"), PageTemplate(id="double", frames=columns, onPage=footer)])
                story = header + [FrameBreak()] + body
            else:
                doc.addPageTemplates([PageTemplate(id="first", frames=[single], onPage=footer), PageTemplate(id="double", frames=columns, onPage=footer)])
                story = header + [NextPageTemplate("double"), PageBreak()] + body
        else:
            doc.addPageTemplates([PageTemplate(id="single", frames=[single], onPage=footer)])
            story = header + body
        doc.build(story)
