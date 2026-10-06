"""Structured, hash-addressed article drafts and immutable submissions."""
from __future__ import annotations

import hashlib
import json
import os
import re
import tempfile
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping
from uuid import uuid4

from .catalog import Catalog, _inside, _rid, _sha, _run_lock

SCHEMA = "research-data.article.v1"
_EXCLUDED_ROLES = {"log", "figure", "plot", "cover", "recipe", "proof", "proof-manifest", "document", "report", "assets", "scene", "editor-vendor"}
_HEX = re.compile(r"^[0-9a-f]{64}$")

def _now() -> str:
    return datetime.now(timezone.utc).isoformat()

def _canon(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")

def _hash(value: Any) -> str:
    return hashlib.sha256(_canon(value)).hexdigest()

def _atomic(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(value, stream, ensure_ascii=False, indent=2, allow_nan=False)
            stream.write("\n")
        os.replace(tmp, path)
    finally:
        Path(tmp).unlink(missing_ok=True)

def data_artifacts(manifest: Mapping[str, Any]) -> list[dict[str, Any]]:
    """Return managed scientific data artifacts, excluding explicit support files."""
    return [dict(a) for a in manifest.get("artifacts", []) if a.get("role", "raw") not in _EXCLUDED_ROLES]

def _article(value: Mapping[str, Any]) -> dict[str, Any]:
    if not isinstance(value, Mapping) or value.get("schema") != SCHEMA:
        raise ValueError(f"article schema must be {SCHEMA!r}")
    out = dict(value)
    out.setdefault("authors", []); out.setdefault("references", []); out.setdefault("datasets", []); out.setdefault("equations", []); out.setdefault("figures", []); out.setdefault("equation_note", ""); out.setdefault("figure_note", "")
    for field in ("title", "summary", "methods", "results", "limitations"):
        if not isinstance(out.get(field), str): raise ValueError(f"{field} must be text")
    if not isinstance(out.get("authors", []), list) or any(not isinstance(x, str) for x in out["authors"]): raise ValueError("authors must be a list of text")
    if not isinstance(out.get("references", []), list) or any(not isinstance(x, str) for x in out["references"]): raise ValueError("references must be a list of text")
    datasets = out.get("datasets", [])
    if not isinstance(datasets, list): raise ValueError("datasets must be a list")
    for item in datasets:
        if not isinstance(item, Mapping) or not isinstance(item.get("artifact_id"), str) or not isinstance(item.get("description"), str) or not isinstance(item.get("variables"), str):
            raise ValueError("each dataset needs artifact_id, description and variables text")
    for key in ("equations", "figures"):
        if not isinstance(out.get(key, []), list): raise ValueError(f"{key} must be a list")
    for item in out["equations"]:
        if not isinstance(item, Mapping) or not isinstance(item.get("latex"), str) or not isinstance(item.get("description"), str): raise ValueError("each equation needs latex and description")
    for item in out["figures"]:
        if not isinstance(item, Mapping) or not isinstance(item.get("artifact_id"), str) or not isinstance(item.get("caption"), str): raise ValueError("each figure needs artifact_id and caption")
    for key in ("equation_note", "figure_note"):
        if key in out and not isinstance(out[key], str): raise ValueError(f"{key} must be text")
    out["schema"] = SCHEMA
    return out

def proof_document(article: Mapping[str, Any]) -> dict[str, Any]:
    a = _article(article)
    equations = [{"latex": x["latex"], "description": x["description"]} for x in a.get("equations", [])]
    figures = [{"artifact_id": x["artifact_id"], "caption": x["caption"]} for x in a.get("figures", [])]
    datasets = "\n".join(f"- {x['artifact_id']}: {x['description']} (variables: {x['variables']})" for x in a.get("datasets", [])) or "- No managed data artifacts."
    parts = [f"Methods\n{a['methods']}", f"Results\n{a['results']}", f"Limitations\n{a['limitations']}", f"Datasets\n{datasets}"]
    if not equations and a.get('equation_note'):
        parts.append('Equations\n' + a['equation_note'])
    if not figures and a.get('figure_note'):
        parts.append('Figures\n' + a['figure_note'])
    if a.get('references'):
        parts.append('References\n' + '\n'.join(a['references']))
    body = '\n\n'.join(parts)
    return {"title": a["title"], "authors": "; ".join(a.get("authors", [])), "abstract": a["summary"], "body": body, "caption": "\n".join(x["caption"] for x in figures), "layout": "single", "equations": equations, "figures": figures, "equation_note": a.get("equation_note", ""), "figure_note": a.get("figure_note", "")}

class ArticleStore:
    def __init__(self, root: str | Path):
        self.root = Path(root).expanduser().resolve(); self.catalog = Catalog(self.root)

    def _run(self, rid: str) -> Path: return self.root / "runs" / _rid(rid)
    def _folder(self, rid: str) -> Path: return self._run(rid) / "articles"
    def _draft_path(self, rid: str) -> Path: return self._folder(rid) / "draft.json"

    def _manifest_fingerprint(self, m: Mapping[str, Any]) -> dict[str, Any]:
        return {"execution_status": m.get("execution_status"), "parameters": m.get("parameters", {}), "parent_run_ids": m.get("parent_run_ids", []), "artifacts": [dict(a) for a in m.get("artifacts", [])], "provenance": m.get("provenance", {})}

    def template(self, run_id: str) -> dict[str, Any]:
        m = self.catalog.get(run_id)
        datasets = [{"artifact_id": a["artifact_id"], "description": a.get("description") or "", "variables": json.dumps(a.get("variables") or "unknown / units not recorded", ensure_ascii=False)} for a in data_artifacts(m)]
        return {"schema": SCHEMA, "title": m.get("title", ""), "authors": [], "summary": m.get("description", ""), "methods": "", "results": "", "limitations": "", "datasets": datasets, "equations": [], "equation_note": "", "figures": [], "figure_note": "", "references": []}

    def draft(self, run_id: str) -> dict[str, Any] | None:
        p = self._draft_path(run_id)
        if not p.is_file(): return None
        raw = json.loads(p.read_text(encoding="utf-8")); article = _article(raw.get("article", raw)); computed = _hash(article); digest = raw.get("sha256") or computed
        if digest != computed: raise ValueError("draft hash does not match article bytes")
        return {"article": article, "sha256": digest}

    def save(self, run_id: str, article: Mapping[str, Any], expected_hash: str | None = None) -> dict[str, Any]:
        rid = _rid(run_id); clean = _article(article)
        self.catalog.get(rid)
        with _run_lock(self._run(rid)):
            current = self.draft(rid); current_hash = current["sha256"] if current else None
            if expected_hash is not None and expected_hash != current_hash: raise ValueError("draft changed since it was read; reload before saving")
            result = {"article": clean, "sha256": _hash(clean)}; _atomic(self._draft_path(rid), result)
        return result

    def _validate(self, rid: str, article: Mapping[str, Any], strict: bool) -> dict[str, Any]:
        errors: list[str] = []
        try: clean = _article(article)
        except Exception as exc: return {"ok": False, "errors": [str(exc)]}
        m = self.catalog.get(rid); arts = {a["artifact_id"]: a for a in data_artifacts(m)}; listed = {x["artifact_id"] for x in clean.get("datasets", [])}
        if strict and m.get("execution_status") not in {"completed", "imported"}: errors.append(f"execution status is not submission-ready: {m.get('execution_status')}")
        if strict:
            snapshot = (m.get("provenance") or {}).get("snapshot")
            if snapshot:
                try:
                    p = _inside(self._run(rid), snapshot.get("path", ""))
                    if not p.is_file() or _sha(p) != snapshot.get("sha256"): errors.append("recorded provenance snapshot is missing or tampered")
                except Exception as exc: errors.append(str(exc))
        missing = set(arts) - listed; extra = listed - set(arts)
        if len(listed) != len(clean.get("datasets", [])): errors.append("dataset artifact IDs must be unique")
        if strict:
            for aid in sorted(missing): errors.append(f"dataset artifact is omitted: {aid}")
        for aid in sorted(extra): errors.append(f"dataset artifact is not a managed data artifact: {aid}")
        for x in clean.get("datasets", []):
            if not x["description"].strip(): errors.append(f"dataset description is empty: {x['artifact_id']}")
            if not x["variables"].strip(): errors.append(f"dataset variables are empty: {x['artifact_id']}")
            if strict and x["artifact_id"] in arts:
                a = arts[x["artifact_id"]]
                try:
                    p = _inside(self._run(rid), a["path"])
                    if not p.is_file() or _sha(p) != a.get("sha256"): errors.append(f"dataset artifact is missing or tampered: {x['artifact_id']}")
                except Exception as exc: errors.append(str(exc))
        for field in ("title", "summary", "methods", "results", "limitations"):
            if strict and not clean[field].strip(): errors.append(f"{field} is required")
        if strict and not clean.get("equations") and not clean.get("equation_note", "").strip(): errors.append("equations require entries or equation_note")
        if strict and not clean.get("figures") and not clean.get("figure_note", "").strip(): errors.append("figures require entries or figure_note")
        if len({x.get("artifact_id") for x in clean.get("figures", [])}) != len(clean.get("figures", [])): errors.append("figure artifact IDs must be unique")
        for x in clean.get("equations", []):
            if strict and (not x["latex"].strip() or not x["description"].strip()): errors.append("equation latex and description must be non-empty")
            if strict and x["latex"].strip():
                try:
                    from .math_render import render_equation
                    render_equation(x["latex"])
                except ImportError: errors.append("equation validation requires research-data[ui]")
                except Exception as exc: errors.append(str(exc))
        for x in clean.get("figures", []):
            if strict and not x["caption"].strip(): errors.append(f"figure caption is empty: {x['artifact_id']}")
            a = next((a for a in m.get("artifacts", []) if a.get("artifact_id") == x["artifact_id"]), None)
            if not a: errors.append(f"figure artifact is missing: {x['artifact_id']}"); continue
            if a.get("role") not in {"figure"} and str(a.get("format", "")).lower() not in {"png", "jpg", "jpeg"}: errors.append(f"figure artifact is not PNG/JPEG or role=figure: {x['artifact_id']}")
            try:
                p = _inside(self._run(rid), a["path"])
                if not p.is_file() or _sha(p) != a.get("sha256"): errors.append(f"figure artifact is missing or tampered: {x['artifact_id']}")
                elif str(a.get("format", "")).lower() in {"png", "jpg", "jpeg"}:
                    head = p.read_bytes()[:12]
                    if not (head.startswith(b"\x89PNG\r\n\x1a\n") or head.startswith(b"\xff\xd8\xff")): errors.append(f"figure bytes are not valid PNG/JPEG: {x['artifact_id']}")
                if a.get("role") == "figure" or str(a.get("format", "")).lower() in {"png", "jpg", "jpeg"}:
                    try:
                        from PIL import Image
                        import io
                        with Image.open(io.BytesIO(p.read_bytes())) as image: image.verify()
                    except ImportError: errors.append("figure validation requires Pillow")
                    except Exception: errors.append(f"figure bytes are not a readable image: {x['artifact_id']}")
            except Exception as exc: errors.append(str(exc))
        return {"ok": not errors, "errors": errors, "article": clean, "fingerprint": self._manifest_fingerprint(m), "integrity_checked": strict}

    def check(self, run_id: str, article: Mapping[str, Any] | None = None) -> dict[str, Any]:
        rid = _rid(run_id); current = self.draft(rid); target = article if article is not None else (current["article"] if current else None)
        if target is None: return {"ok": False, "errors": ["no article draft"], "integrity_checked": False}
        return self._validate(rid, target, True)

    def submit(self, run_id: str, article: Mapping[str, Any] | None = None, expected_hash: str | None = None) -> dict[str, Any]:
        rid = _rid(run_id)
        self.catalog.get(rid)
        with _run_lock(self._run(rid)):
            current_locked = self.draft(rid)
            target = article if article is not None else (current_locked["article"] if current_locked else None)
            if target is None: raise ValueError("no article draft")
            if expected_hash is not None and (not current_locked or current_locked["sha256"] != expected_hash): raise ValueError("draft changed since it was read; reload before submitting")
            if article is not None:
                clean_target = _article(article); _atomic(self._draft_path(rid), {"article": clean_target, "sha256": _hash(clean_target)})
            result = self._validate(rid, target, True)
            if not result["ok"]: raise ValueError("article is not ready: " + "; ".join(result["errors"]))
            m = self.catalog.get(rid); revision = uuid4().hex; folder = self._folder(rid) / revision; folder.mkdir(parents=True)
            article_bytes = _canon(result["article"]) + b"\n"; (folder / "article.json").write_bytes(article_bytes)
            receipt = {"schema": "research-data.article-submission.v1", "run_id": rid, "revision_id": revision, "created_at": _now(), "sha256": _hash(result["article"]), "article_sha256": hashlib.sha256(article_bytes).hexdigest(), "fingerprint": self._manifest_fingerprint(m), "provenance": m.get("provenance", {}), "files": {"article": "article.json"}}
            _atomic(folder / "receipt.json", receipt)
            entry = {"revision_id": revision, "receipt_path": f"runs/{rid}/articles/{revision}/receipt.json", "receipt_sha256": _sha(folder / "receipt.json"), "created_at": receipt["created_at"], "search_text": json.dumps(result['article'], ensure_ascii=False)}
            registry = dict(m.get("article_submissions", {})); registry[revision] = entry
            m["article_submissions"] = registry
            m["article_submission"] = {**entry, "latest_revision": revision}
            self.catalog._write(m); self.catalog._index(m)
        return self.get_revision(rid, revision)

    def revisions(self, run_id: str) -> list[dict[str, Any]]:
        m = self.catalog.get(run_id); out = []
        for revision in m.get("article_submissions", {}):
            out.append(self.get_revision(run_id, revision)["receipt"])
        return sorted(out, key=lambda x: x.get("created_at", ""))

    def get_revision(self, run_id: str, revision_id: str) -> dict[str, Any]:
        rid = _rid(run_id)
        if not isinstance(revision_id, str) or not re.fullmatch(r"[a-f0-9]{32}", revision_id): raise ValueError("invalid revision id")
        folder = self._folder(rid) / revision_id; receipt_path = folder / "receipt.json"; article_path = folder / "article.json"
        receipt = json.loads(receipt_path.read_text(encoding="utf-8")); article = json.loads(article_path.read_text(encoding="utf-8"))
        manifest = self.catalog.get(rid); entry = manifest.get("article_submissions", {}).get(revision_id)
        if not entry or _sha(receipt_path) != entry.get("receipt_sha256"): raise ValueError("receipt bytes failed integrity check")
        if receipt.get("run_id") != rid or receipt.get("revision_id") != revision_id: raise ValueError("receipt identity does not match requested revision")
        if _hash(_article(article)) != receipt.get("sha256"): raise ValueError("frozen article content failed integrity check")
        if hashlib.sha256((folder / "article.json").read_bytes()).hexdigest() != receipt.get("article_sha256"): raise ValueError("frozen article bytes failed integrity check")
        return {"receipt": receipt, "article": article, "revision_id": receipt.get("revision_id"), "article_sha256": receipt.get("article_sha256"), "path": str(folder), "status": "submitted"}

    def status(self, run_id: str) -> dict[str, Any]:
        rid = _rid(run_id); draft = self.draft(rid); current = self.catalog.get(rid); pointer = current.get("article_submission", {}).get("latest_revision")
        if not pointer: return {"status": "draft", "draft": draft, "integrity_checked": False}
        frozen = self.get_revision(rid, pointer); receipt = frozen["receipt"]
        stale = receipt.get("fingerprint") != self._manifest_fingerprint(current) or not draft or draft.get("sha256") != receipt.get("sha256")
        return {"status": "stale" if stale else "submitted", "draft": draft, "revision_id": pointer, "receipt": receipt, "integrity_checked": False}
