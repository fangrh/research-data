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
import math
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


def _image_bytes(value: str, label: str) -> tuple[bytes, str]:
    """Validate an embedded PNG/JPEG and return bytes plus MIME type."""
    checked = _data_url(value, label)
    mime = checked.split(";", 1)[0].split(":", 1)[1]
    return base64.b64decode(checked.split(",", 1)[1]), mime


def _document_extras(document: dict) -> None:
    equations = document.get("equations", [])
    if equations is None:
        equations = []
        document["equations"] = equations
    if not isinstance(equations, list) or len(equations) > 100:
        raise ValueError("document.equations must be a list of at most 100 items")
    for item in equations:
        if not isinstance(item, Mapping) or set(item) - {"latex", "description"}:
            raise ValueError("each equation requires only latex and description")
        if not isinstance(item.get("latex"), str) or not item["latex"].strip() or "$" in item["latex"]:
            raise ValueError("equation.latex must be raw non-empty MathText without $ delimiters")
        if not isinstance(item.get("description", ""), str) or len(item.get("description", "")) > 4000:
            raise ValueError("equation.description must be text of at most 4000 characters")
    illustrations = document.get("illustrations", [])
    if illustrations is None:
        illustrations = []
        document["illustrations"] = illustrations
    if not isinstance(illustrations, list) or len(illustrations) > 100:
        raise ValueError("document.illustrations must be a list of at most 100 items")
    for item in illustrations:
        if not isinstance(item, Mapping) or set(item) - {"image", "caption", "artifact_id", "run_id", "sha256"}:
            raise ValueError("each illustration has image, caption, artifact_id, run_id and sha256")
        for key in ("image", "caption", "artifact_id", "run_id", "sha256"):
            if not isinstance(item.get(key), str) or not item[key].strip():
                raise ValueError(f"illustration.{key} must be non-empty text")
        _data_url(item["image"], "illustration.image")
        if not re.fullmatch(r"[0-9a-f]{64}", item["sha256"]):
            raise ValueError("illustration.sha256 must be a lowercase SHA-256")
        if len(item["caption"]) > 4000:
            raise ValueError("illustration.caption must be at most 4000 characters")


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
    _document_extras(document)
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

    def _freeze_article_resources(self, document: dict, folder: Path, frozen_inputs: list[dict]) -> tuple[dict, dict]:
        """Render/copy optional article resources once into a revision folder."""
        from .math_render import render_equation
        frozen = json.loads(json.dumps(document, ensure_ascii=False))
        resources = {"equations": [], "illustrations": []}
        for index, item in enumerate(document.get("equations", [])):
            rendered = render_equation(item["latex"])
            png_name, svg_name = f"equation-{index}.png", f"equation-{index}.svg"
            (folder / png_name).write_bytes(rendered.png)
            (folder / svg_name).write_bytes(rendered.svg)
            entry = {"index": index, "png": png_name, "svg": svg_name,
                     "png_sha256": hashlib.sha256(rendered.png).hexdigest(),
                     "svg_sha256": hashlib.sha256(rendered.svg).hexdigest(),
                     "width": rendered.width, "height": rendered.height,
                     "dpi": rendered.dpi, "fontsize": rendered.fontsize}
            resources["equations"].append(entry)
            frozen["equations"][index]["resource"] = entry
        allowed = {(item["run_id"], item["artifact_id"], item["sha256"]) for item in frozen_inputs}
        for index, item in enumerate(document.get("illustrations", [])):
            key = (item["run_id"], item["artifact_id"], item["sha256"])
            if key not in allowed:
                raise ValueError("illustration must reference a verified payload input artifact")
            image_bytes, mime = _image_bytes(item["image"], f"illustration {index}")
            if hashlib.sha256(image_bytes).hexdigest() != item["sha256"]:
                raise ValueError(f"illustration {index} hash does not match image bytes")
            artifact = self.catalog.select_artifact(item["run_id"], item["artifact_id"])
            source = (self.root / "runs" / item["run_id"] / artifact["path"]).resolve()
            run_root = (self.root / "runs" / item["run_id"]).resolve()
            if not source.is_file() or not source.is_relative_to(run_root) or _file_hash(source) != item["sha256"]:
                raise ValueError(f"illustration {index} source artifact is missing or tampered")
            suffix = ".jpg" if mime == "image/jpeg" else ".png"
            name = f"illustration-{index}{suffix}"
            (folder / name).write_bytes(image_bytes)
            entry = {"index": index, "path": name, "sha256": item["sha256"],
                     "run_id": item["run_id"], "artifact_id": item["artifact_id"]}
            resources["illustrations"].append(entry)
            frozen["illustrations"][index]["resource"] = entry
        return frozen, resources

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
        article_source = None
        article_ref = base.get("document", {}).get("article_provenance")
        if article_ref is not None:
            if not isinstance(article_ref, Mapping) or set(article_ref) != {"revision_id", "draft_sha256"} or not isinstance(article_ref.get("revision_id"), str) or not re.fullmatch(r"[a-f0-9]{32}", article_ref["revision_id"]) or not re.fullmatch(r"[a-f0-9]{64}", str(article_ref.get("draft_sha256"))):
                raise ValueError("invalid article provenance reference")
            from .articles import ArticleStore
            try:
                source_revision = ArticleStore(self.root).get_revision(rid, article_ref["revision_id"])
            except Exception as exc:
                raise ValueError("article provenance reference is missing or tampered") from exc
            if source_revision["receipt"].get("sha256") != article_ref["draft_sha256"]:
                raise ValueError("article provenance draft hash does not match frozen revision")
            source_folder = Path(source_revision["path"])
            article_source = {"article": (source_folder / "article.json").read_bytes(), "receipt": (source_folder / "receipt.json").read_bytes(), "revision_id": article_ref["revision_id"]}
        parents, frozen_inputs = self._verify_inputs(base)
        if rid not in parents:
            parents.insert(0, rid)
        revision_id = str(uuid4())
        folder = self._run(rid) / revision_id
        payload_hash = _hash(base)
        vendor = Path(__file__).resolve().parent / "resources" / "three_interact" / "vendor.json"
        source_root = Path(__file__).resolve().parent
        source_paths = ["proofs.py", "math_render.py", "figure_editor.py"] + (["resources/three_interact"] if vendor.is_file() else [])
        run_kwargs = {"title": base["document"].get("title") or "Research proof", "project": owner.get("project", "default"), "kind": "analysis", "description": "Immutable editor proof revision", "parameters": {"proof_revision_id": revision_id, "proof_payload_hash": payload_hash, "inputs": frozen_inputs}, "parent_run_ids": parents, "repo": str(source_root), "entrypoint": "proofs.py", "source_paths": source_paths}
        # Freeze the producing source before rendering, including the actual vendored editor bytes.
        with self.catalog.run(**run_kwargs) as analysis:
            folder.mkdir(parents=True)
            scene_path = folder / "scene.json"; document_path = folder / "document.json"; assets_path = folder / "assets.json"; recipe_path = folder / "recipe.json"; png_path = folder / "figure.png"; html_path = folder / "report.html"; pdf_path = folder / "report.pdf"
            frozen_document, resources = self._freeze_article_resources(base["document"], folder, frozen_inputs)
            article_submission = None
            if article_source is not None:
                article_path = folder / "article-source.json"; receipt_path = folder / "article-receipt.json"
                article_path.write_bytes(article_source["article"]); receipt_path.write_bytes(article_source["receipt"])
                article_submission = {"revision_id": article_source["revision_id"], "article": article_path.name, "article_sha256": _file_hash(article_path), "receipt": receipt_path.name, "receipt_sha256": _file_hash(receipt_path)}
            scene_path.write_bytes(json.dumps(base["scene"], ensure_ascii=False, allow_nan=False).encode("utf-8") + b"\n"); document_path.write_bytes(_canonical(frozen_document) + b"\n"); assets_path.write_bytes(_canonical({"assets": base["assets"], "editor": base["editor"]}) + b"\n"); recipe_path.write_bytes(_canonical(base.get("recipe", {})) + b"\n")
            png_bytes = base64.b64decode(base["figure_png"].split(",", 1)[1]); png_path.write_bytes(png_bytes)
            self._render_html(html_path, {**base, "document": frozen_document}, revision_id, rid, frozen_inputs, folder, resources)
            self._render_pdf(pdf_path, {**base, "document": frozen_document}, revision_id, png_bytes, rid, folder, resources)
            manifest = {"schema": "research-data.proof.v1", "revision_id": revision_id, "run_id": rid, "created_at": _now(), "payload_hash": payload_hash, "analysis_run_id": analysis.run_id, "scene_sha256": _file_hash(scene_path), "document_sha256": _file_hash(document_path), "assets_sha256": _file_hash(assets_path), "recipe_sha256": _file_hash(recipe_path), "figure_sha256": _file_hash(png_path), "html_sha256": _file_hash(html_path), "pdf_sha256": _file_hash(pdf_path), "resources": resources, "inputs": frozen_inputs, "source_runs": parents, "owner_provenance": owner.get("provenance", {}), "editor": base["editor"], "files": {"scene": scene_path.name, "document": document_path.name, "assets": assets_path.name, "recipe": recipe_path.name, "figure_png": png_path.name, "html": html_path.name, "pdf": pdf_path.name}}
            if article_submission is not None: manifest["article_submission"] = article_submission
            vendor_copy = folder / "editor-vendor.json"
            if vendor.is_file():
                vendor_copy.write_bytes(vendor.read_bytes())
                manifest["editor_asset"] = {"path": vendor_copy.name, "sha256": _file_hash(vendor_copy)}
                manifest["files"]["editor_vendor"] = vendor_copy.name
            _atomic_json(folder / "manifest.json", manifest)
            resource_files = [folder / item[key] for item in resources["equations"] for key in ("png", "svg")] + [folder / item["path"] for item in resources["illustrations"]]
            artifact_files = [(scene_path, "scene"), (document_path, "document"), (assets_path, "assets"), (recipe_path, "recipe"), (png_path, "figure"), (html_path, "report"), (pdf_path, "report"), *[(item, "proof-resource") for item in resource_files], (folder / "manifest.json", "proof-manifest")]
            if article_source is not None: artifact_files.extend([(folder / "article-source.json", "article-source"), (folder / "article-receipt.json", "article-receipt")])
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
        for item in value.get("resources", {}).get("equations", []):
            for key, digest_key in (("png", "png_sha256"), ("svg", "svg_sha256")):
                candidate = (folder / item[key]).resolve()
                if not candidate.is_file() or not candidate.is_relative_to(folder) or _file_hash(candidate) != item[digest_key]:
                    raise ValueError(f"immutable proof file is missing or tampered: equation {key}")
        for item in value.get("resources", {}).get("illustrations", []):
            candidate = (folder / item["path"]).resolve()
            if not candidate.is_file() or not candidate.is_relative_to(folder) or _file_hash(candidate) != item["sha256"]:
                raise ValueError("immutable proof file is missing or tampered: illustration")
        article_submission = value.get("article_submission")
        if article_submission:
            for key, digest_key in (("article", "article_sha256"), ("receipt", "receipt_sha256")):
                candidate = (folder / article_submission.get(key, "")).resolve()
                if not candidate.is_relative_to(folder) or not candidate.is_file() or _file_hash(candidate) != article_submission.get(digest_key):
                    raise ValueError(f"immutable article submission file is missing or tampered: {key}")
        vendor = value.get("editor_asset")
        if vendor:
            candidate = (folder / vendor["path"]).resolve()
            if not candidate.is_relative_to(folder) or not candidate.is_file() or _file_hash(candidate) != vendor["sha256"]:
                raise ValueError("immutable editor metadata is missing or tampered")
        value["path"] = str(folder); return value

    def _comment_target(self, revision: dict, anchor: str, locator: Mapping[str, Any] | None = None) -> dict:
        scene = json.loads((Path(revision["path"]) / "scene.json").read_text(encoding="utf-8"))
        document = json.loads((Path(revision["path"]) / "document.json").read_text(encoding="utf-8"))
        extra = re.fullmatch(r"(equation|illustration|illustration-caption):(\d+)", anchor or "") if isinstance(anchor, str) else None
        if extra:
            kind_name, index = extra.group(1), int(extra.group(2))
            collection = "equations" if kind_name == "equation" else "illustrations"
            if index >= len(document.get(collection, [])) or (kind_name == "illustration-caption" and index >= len(document.get("illustrations", []))):
                raise ValueError("comment anchor index is not present in frozen document")
        if not isinstance(anchor, str) or (anchor not in _ANCHORS and not extra and not (anchor.startswith("element:") and anchor[8:] in scene["elements"])):
            raise ValueError("unknown comment anchor")
        if locator is None:
            return {"anchor": anchor, "locator": None}
        if not isinstance(locator, Mapping) or not isinstance(locator.get("kind"), str):
            raise ValueError("comment locator must be an object with a valid kind")
        kind = locator["kind"]
        if kind == "text":
            text_anchor = anchor in {"title", "abstract", "body", "caption"}
            if not text_anchor and extra and extra.group(1) in {"equation", "illustration-caption"}:
                value = document["equations" if extra.group(1) == "equation" else "illustrations"][int(extra.group(2))].get("description" if extra.group(1) == "equation" else "caption", "")
            elif text_anchor:
                value = document.get(anchor)
            else:
                raise ValueError("text locator requires a document text anchor")
            if set(locator) != {"kind", "start", "end", "exact"}:
                raise ValueError("text locator has unknown keys")
            start, end, exact = locator["start"], locator["end"], locator["exact"]
            if isinstance(start, bool) or isinstance(end, bool) or not isinstance(start, int) or not isinstance(end, int) or start < 0 or end <= start or not isinstance(exact, str) or not exact:
                raise ValueError("text locator offsets or exact text are invalid")
            if not isinstance(value, str) or end > len(value) or value[start:end] != exact:
                raise ValueError("text locator does not match frozen document")
            return {"anchor": anchor, "locator": {"kind": "text", "start": start, "end": end, "exact": exact}}
        if kind == "point":
            if not ((anchor == "figure" or (extra and extra.group(1) == "illustration")) and set(locator) == {"kind", "x", "y"}):
                raise ValueError("point locator requires figure or illustration anchor and only x/y keys")
            x, y = locator["x"], locator["y"]
            if any(isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not 0 <= value <= 1 for value in (x, y)):
                raise ValueError("point locator coordinates must be finite numbers from 0 to 1")
            return {"anchor": anchor, "locator": {"kind": "point", "x": x, "y": y}}
        raise ValueError("unknown comment locator kind")

    def comment_target(self, run_id: str, revision_id: str, anchor: str, locator: Mapping[str, Any] | None = None) -> dict:
        return self._comment_target(self.get(run_id, revision_id), anchor, locator)

    def _comment_view(self, raw: list[dict]) -> list[dict]:
        by_id = {item.get("id"): item for item in raw}
        result = []
        for item in raw:
            root = item
            seen = set()
            while root.get("parent_id") is not None and root.get("parent_id") in by_id and root.get("id") not in seen:
                seen.add(root.get("id")); root = by_id[root["parent_id"]]
            value = dict(item)
            value["thread_id"] = root.get("id")
            value["status"] = root.get("status", "open")
            if root.get("anchor") is not None:
                value["anchor"] = root["anchor"]
            if "locator" in root:
                value["locator"] = root["locator"]
            result.append(value)
        return result

    def comments(self, run_id: str, revision_id: str, status: str = "all") -> list[dict]:
        revision = self.get(run_id, revision_id); path = Path(revision["path"]) / "comments.json"
        raw = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
        if not isinstance(raw, list):
            raise ValueError("comments sidecar must be a list")
        result = self._comment_view(raw)
        if status not in {"all", "open", "resolved"}:
            raise ValueError("comment status must be all, open, or resolved")
        return result if status == "all" else [item for item in result if item["status"] == status]

    def set_comment_status(self, run_id: str, revision_id: str, comment_id: str, status: str, author: str = "本地用户", note: str = "") -> dict:
        if status not in {"open", "resolved"}:
            raise ValueError("comment status must be open or resolved")
        _safe_id(comment_id, "comment id")
        if not isinstance(author, str) or not author.strip() or len(author) > 200:
            raise ValueError("comment author must be non-empty and at most 200 characters")
        if not isinstance(note, str) or len(note) > 12000:
            raise ValueError("status note must be at most 12000 characters")
        revision = self.get(run_id, revision_id); path = Path(revision["path"]) / "comments.json"
        with _lock(Path(revision["path"]) / ".comments.lock"):
            raw = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
            by_id = {item.get("id"): item for item in raw}
            if comment_id not in by_id:
                raise KeyError(comment_id)
            root = by_id[comment_id]
            seen = set()
            while root.get("parent_id") is not None:
                if root.get("id") in seen or root.get("parent_id") not in by_id:
                    raise ValueError("comment thread is malformed")
                seen.add(root.get("id")); root = by_id[root["parent_id"]]
            event = {"at": _now(), "author": author.strip(), "status": status, "note": note.strip()}
            root["status"] = status
            root.setdefault("status_history", []).append(event)
            _atomic_json(path, raw)
        return next(item for item in self._comment_view(raw) if item["id"] == comment_id)

    def add_comment(self, run_id: str, revision_id: str, text: str, anchor: str = "figure", author: str = "本地用户", parent_id: str | None = None, locator: Mapping[str, Any] | None = None) -> dict:
        if not isinstance(text, str) or not text.strip() or len(text) > 12000: raise ValueError("comment text must be non-empty and at most 12000 characters")
        revision = self.get(run_id, revision_id)
        target = None if parent_id is not None else self._comment_target(revision, anchor, locator)
        if not isinstance(author, str) or not author.strip() or len(author) > 200: raise ValueError("comment author must be non-empty and at most 200 characters")
        if parent_id is not None: _safe_id(parent_id, "parent comment id")
        path = Path(revision["path"]) / "comments.json"
        with _lock(Path(revision["path"]) / ".comments.lock"):
            raw = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
            by_id = {item.get("id"): item for item in raw}
            root = None
            if parent_id is not None:
                if parent_id not in by_id: raise ValueError("parent comment does not exist")
                root = by_id[parent_id]
                seen = set()
                while root.get("parent_id") is not None:
                    if root.get("id") in seen or root.get("parent_id") not in by_id: raise ValueError("comment thread is malformed")
                    seen.add(root.get("id")); root = by_id[root["parent_id"]]
                target = {"anchor": root["anchor"], "locator": root.get("locator")}
            comment = {"id": str(uuid4()), "revision_id": revision_id, "anchor": target["anchor"], "author": author.strip(), "text": text.strip(), "parent_id": parent_id, "created_at": _now()}
            if target["locator"] is not None: comment["locator"] = target["locator"]
            if root is not None and root.get("status", "open") == "resolved":
                root["status"] = "open"
                root.setdefault("status_history", []).append({"at": _now(), "author": author.strip(), "status": "open", "note": "reply added"})
            _atomic_json(path, raw + [comment])
        return self._comment_view(raw + [comment])[-1]

    @staticmethod
    def _render_html(path: Path, payload: dict, revision_id: str, run_id: str, frozen_inputs: list[dict], folder: Path | None = None, resources: dict | None = None) -> None:
        d = payload["document"]; fig = payload["figure_png"]
        body = "<br>".join(html.escape(d["body"]).splitlines())
        editor_version = payload.get("editor", {}).get("upstream", payload.get("editor", {}).get("bundle", {})).get("version", "unknown")
        inputs = "; ".join(f"{html.escape(str(i['run_id']))}/{html.escape(str(i['artifact_id']))} ({html.escape(str(i['sha256']))})" for i in frozen_inputs) or "none"
        layout = "double" if d.get("layout") == "double" else "single"
        def data_url(name: str, mime: str) -> str:
            return "data:" + mime + ";base64," + base64.b64encode((folder / name).read_bytes()).decode("ascii") if folder else ""
        equations = []
        for item, resource in zip(d.get("equations", []), (resources or {}).get("equations", [])):
            equations.append(f"<figure class='equation'><img src='{data_url(resource['png'], 'image/png')}' alt='{html.escape(item['latex'], quote=True)}'><figcaption>{html.escape(item.get('description', ''))}</figcaption></figure>")
        illustrations = []
        for item, resource in zip(d.get("illustrations", []), (resources or {}).get("illustrations", [])):
            mime = 'image/jpeg' if resource['path'].endswith('.jpg') else 'image/png'
            illustrations.append(f"<figure class='illustration'><img src='{data_url(resource['path'], mime)}' alt='supplementary illustration'><figcaption>{html.escape(item['caption'])}</figcaption></figure>")
        extras = ''.join(equations) + ("<h2>Supplementary illustrations</h2>" + ''.join(illustrations) if illustrations else '')
        text = f"<!doctype html><meta charset='utf-8'><article class='proof {layout}'><header><h1>{html.escape(d['title'])}</h1><p class='authors'>{html.escape(d['authors'])}</p><p class='meta'>Run {html.escape(run_id)} · Revision {html.escape(revision_id)} · Editor {html.escape(str(editor_version))}</p></header><h2>Abstract</h2><p>{html.escape(d['abstract'])}</p><figure><img src='{html.escape(fig, quote=True)}' alt='figure'><figcaption>{html.escape(d['caption'])}</figcaption></figure>{extras}<section>{body}</section><footer>Inputs: {inputs}<br>Payload SHA-256: {html.escape(_hash(payload))}</footer></article><style>body{{font-family:Georgia,serif;margin:40px;line-height:1.55;color:#18212b}}article{{max-width:900px;margin:auto}}h1{{font-size:32px;margin-bottom:4px}}.authors{{color:#576575}}.meta,footer{{font:12px ui-monospace,monospace;color:#536273}}img{{max-width:100%;height:auto}}figcaption{{font-size:.9em;color:#576575}}footer{{margin-top:32px;border-top:1px solid #ccd3da;padding-top:8px}}.double section{{column-count:2;column-gap:32px}}.double figure{{break-inside:avoid}}.equation img{{max-width:80%}}</style>"
        path.write_text(text, encoding="utf-8")

    @staticmethod
    def _render_pdf(path: Path, payload: dict, revision_id: str, png_bytes: bytes, run_id: str = "", folder: Path | None = None, resources: dict | None = None) -> None:
        try:
            from reportlab.lib.enums import TA_CENTER
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
            from reportlab.lib.units import mm
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.cidfonts import UnicodeCIDFont
            from reportlab.pdfbase.ttfonts import TTFont
            from reportlab.platypus import BaseDocTemplate, Frame, FrameBreak, Image, NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer
        except ImportError as exc:
            raise RuntimeError("PDF export requires reportlab>=4,<5; install the PDF extras and retry") from exc
        cjk_text = [str(payload["document"].get(k, "")) for k in ("title", "authors", "abstract", "body", "caption")]
        cjk_text.extend(str(item.get("description", "")) for item in payload["document"].get("equations", []))
        cjk_text.extend(str(item.get("caption", "")) for item in payload["document"].get("illustrations", []))
        cjk_range = r"[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]"
        has_cjk = any(re.search(cjk_range, value) for value in cjk_text)
        font = "Times-Roman"; cjk_font = None; latin_font = "Times-Roman"
        try:
            import matplotlib
            latin_path = Path(matplotlib.get_data_path()) / "fonts" / "ttf" / "DejaVuSerif.ttf"
            if latin_path.is_file():
                pdfmetrics.registerFont(TTFont("ProofLatin", str(latin_path))); latin_font = "ProofLatin"
        except Exception:
            pass
        if has_cjk:
            candidates = [
                (Path("C:/Windows/Fonts/simsun.ttc"), 0),
                (Path("C:/Windows/Fonts/simhei.ttf"), None),
                (Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"), 0),
                (Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"), 0),
            ]
            for candidate, subfont in candidates:
                if not candidate.is_file():
                    continue
                try:
                    kwargs = {} if subfont is None else {"subfontIndex": subfont}
                    pdfmetrics.registerFont(TTFont("ProofCJK", str(candidate), **kwargs)); cjk_font = "ProofCJK"; break
                except Exception:
                    continue
            if cjk_font is None:
                pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light")); cjk_font = "STSong-Light"
        font = latin_font
        def mixed(value: Any) -> str:
            text = str(value or "")
            if not cjk_font or not re.search(cjk_range, text): return html.escape(text)
            pieces = []; current = []; current_cjk = None
            for char in text:
                is_cjk = bool(re.match(cjk_range, char))
                if current_cjk is not None and is_cjk != current_cjk:
                    pieces.append((current_cjk, "".join(current))); current = []
                current_cjk = is_cjk; current.append(char)
            if current: pieces.append((current_cjk, "".join(current)))
            return "".join((f"<font name='{cjk_font if is_cjk else latin_font}'>{html.escape(part)}</font>" for is_cjk, part in pieces))
        d = payload["document"]; styles = getSampleStyleSheet(); styles.add(ParagraphStyle(name="ProofTitle", parent=styles["Title"], fontName=font, alignment=TA_CENTER, fontSize=19, leading=24)); styles.add(ParagraphStyle(name="ProofBody", parent=styles["BodyText"], fontName=font, fontSize=9.5, leading=13)); styles.add(ParagraphStyle(name="ProofSmall", parent=styles["BodyText"], fontName=font, fontSize=8, leading=10, textColor="#536273"))
        width, height = A4; usable = width - 32 * mm
        single = Frame(16 * mm, 16 * mm, usable, height - 34 * mm, id="single")
        column_width = (usable - 8 * mm) / 2
        def footer(canvas, _doc):
            canvas.saveState(); canvas.setFont(latin_font, 7); canvas.setFillColorRGB(.3, .35, .4)
            canvas.drawString(16 * mm, 11 * mm, f"Run {run_id} | revision {revision_id[:16]}")
            canvas.drawRightString(width - 16 * mm, 11 * mm, str(_doc.page))
            canvas.setFont("Helvetica", 6)
            canvas.drawString(16 * mm, 7 * mm, f"SHA-256 {_hash(payload)}")
            canvas.restoreState()
        doc = BaseDocTemplate(str(path), pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm, topMargin=18 * mm, bottomMargin=16 * mm)
        from reportlab.lib.utils import ImageReader
        iw, ih = ImageReader(io.BytesIO(png_bytes)).getSize()
        maxw = usable - 12; scale = min(maxw / iw, 90 * mm / ih)
        header = [Paragraph(mixed(d["title"]), styles["ProofTitle"]), Paragraph(mixed(d["authors"]), styles["ProofSmall"]), Spacer(1, 5 * mm), Paragraph("<b>Abstract</b><br/>" + mixed(d["abstract"]).replace("\n", "<br/>"), styles["ProofBody"]), Spacer(1, 5 * mm), Image(io.BytesIO(png_bytes), width=iw * scale, height=ih * scale), Paragraph("<b>Figure.</b> " + mixed(d["caption"]), styles["ProofSmall"]), Spacer(1, 5 * mm)]
        if folder and resources:
            for item, resource in zip(d.get("equations", []), resources.get("equations", [])):
                raw = (folder / resource["png"]).read_bytes()
                ew, eh = ImageReader(io.BytesIO(raw)).getSize(); escale = min(72 / float(resource.get("dpi", 180)), maxw / ew, 45 * mm / eh)
                header.extend([Image(io.BytesIO(raw), width=ew * escale, height=eh * escale), Paragraph(mixed(item.get("description", "")), styles["ProofSmall"]), Spacer(1, 3 * mm)])
            for item, resource in zip(d.get("illustrations", []), resources.get("illustrations", [])):
                raw = (folder / resource["path"]).read_bytes()
                ew, eh = ImageReader(io.BytesIO(raw)).getSize(); escale = min(maxw / ew, 55 * mm / eh)
                header.extend([Image(io.BytesIO(raw), width=ew * escale, height=eh * escale), Paragraph("<b>Supplementary illustration.</b> " + mixed(item["caption"]), styles["ProofSmall"]), Spacer(1, 3 * mm)])
        body_parts = [part.strip() for part in re.split(r"\n\s*\n", d["body"]) if part.strip()] or [""]
        body = [Paragraph(mixed(part).replace("\n", "<br/>"), styles["ProofBody"]) for part in body_parts]
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
