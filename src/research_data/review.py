"""Review dispatch: user comments -> AI agent evaluation -> recorded actions.

A review request snapshots the run's comments plus the user's instruction
into ``reviews/pending/``. An agent picks it up, evaluates the run/data,
posts its evaluation back into the comment thread (author ``AI agent``)
and records actions — currently updating the run's validation status with
notes referencing the review. Completed requests move to ``reviews/done/``.
"""
from __future__ import annotations

import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from .social import Interactions

AGENT_AUTHOR = "AI agent"


def _reviews_root(catalog_root: str | Path) -> Path:
    root = Path(catalog_root) / "reviews"
    (root / "pending").mkdir(parents=True, exist_ok=True)
    (root / "done").mkdir(parents=True, exist_ok=True)
    return root


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")


def _safe_id(run_id: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9_\-]+", run_id or ""))


def request_review(catalog_root: str | Path, run_id: str, instruction: str = "") -> Path:
    """Create a pending review request for the user's latest comments."""
    if not _safe_id(run_id):
        raise ValueError(f"invalid run_id: {run_id!r}")
    comments = Interactions(catalog_root).comments(run_id)
    payload = {
        "schema": "research-data.review.v1",
        "request_id": f"{_now()}-{run_id[:15]}",
        "run_id": run_id,
        "instruction": instruction.strip()[:2000],
        "comments_snapshot": comments,
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    path = _reviews_root(catalog_root) / "pending" / f"{payload['request_id']}.json"
    fd, tmp = tempfile.mkstemp(prefix="review-", suffix=".tmp", dir=path.parent)
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
    os.replace(tmp, path)
    return path


def list_pending(catalog_root: str | Path) -> list[dict]:
    out = []
    for p in sorted((_reviews_root(catalog_root) / "pending").glob("*.json")):
        try:
            out.append(json.loads(p.read_text(encoding="utf-8")))
        except ValueError:
            continue
    return out


def complete_review(catalog_root: str | Path, request_id: str, reply: str,
                    validation: str | None = None, validation_notes: str = "") -> dict:
    """Post the agent's evaluation and apply requested follow-up actions.

    reply  -> appended to the run's comment thread as author 'AI agent'.
    validation -> optional 'not_checked'/'partial'/'passed'/'failed' applied
    via Catalog.set_validation (notes reference the review request).
    The request file moves from pending/ to done/.
    """
    if not reply.strip():
        raise ValueError("reply text is empty")
    root = _reviews_root(catalog_root)
    src = root / "pending" / f"{request_id}.json"
    if not src.is_file():
        raise FileNotFoundError(f"no pending review request: {request_id}")
    payload = json.loads(src.read_text(encoding="utf-8"))
    run_id = payload["run_id"]
    social = Interactions(catalog_root)
    entry = social.add_comment(run_id, reply, author=AGENT_AUTHOR)
    actions = {"comment": entry}
    if validation:
        from .catalog import Catalog
        cat = Catalog(catalog_root)
        notes = validation_notes.strip()[:2000] or f"review {request_id}"
        actions["validation"] = cat.set_validation(run_id, validation, notes=notes)
    payload["completed_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    payload["reply"] = reply[:4000]
    payload["actions"] = {k: (v if k == "comment" else {"status": v["status"], "notes": v["notes"]})
                          for k, v in actions.items() if isinstance(v, dict)}
    dest = root / "done" / f"{request_id}.json"
    fd, tmp = tempfile.mkstemp(prefix="done-", suffix=".tmp", dir=root / "done")
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
    os.replace(tmp, dest)
    os.unlink(src)
    return {"request_id": request_id, "run_id": run_id, "done": dest.name, "actions": list(actions)}
