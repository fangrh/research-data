"""Like / favorite / comment state for the browser UI.

Stored in ``interactions.json`` at the catalog root: UI-layer state kept
separate from the append-only run manifests. Single-user local app; writes
are atomic via tmp+replace, mirroring the catalog's manifest discipline.
"""
from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path

AUTHOR = "本地用户"


class Interactions:
    def __init__(self, catalog_root: str | Path):
        self.path = Path(catalog_root) / "interactions.json"

    def _load(self) -> dict:
        if not self.path.is_file():
            return {}
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except ValueError:
            return {}

    def _save(self, data: dict) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp = tempfile.mkstemp(prefix="interactions-", suffix=".tmp", dir=self.path.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=1)
            os.replace(tmp, self.path)
        finally:
            if os.path.exists(tmp):
                os.unlink(tmp)

    def _entry(self, data: dict, run_id: str) -> dict:
        return data.setdefault(run_id, {"liked": False, "favorite": False, "comments": []})

    # ── likes ──
    def like(self, run_id: str, on: bool = True) -> dict:
        data = self._load(); e = self._entry(data, run_id); e["liked"] = on
        self._save(data); return e

    def likes(self, run_id: str) -> int:
        return 1 if self._load().get(run_id, {}).get("liked") else 0

    # ── favorites ──
    def favorite(self, run_id: str, on: bool = True) -> dict:
        data = self._load(); e = self._entry(data, run_id); e["favorite"] = on
        self._save(data); return e

    def is_favorite(self, run_id: str) -> bool:
        return bool(self._load().get(run_id, {}).get("favorite"))

    def favorites(self) -> list[str]:
        data = self._load()
        return sorted(rid for rid, e in data.items() if e.get("favorite"))

    # ── comments ──
    def add_comment(self, run_id: str, text: str, author: str = AUTHOR) -> dict:
        if not text.strip():
            raise ValueError("comment text is empty")
        data = self._load(); e = self._entry(data, run_id)
        entry = {"ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                 "author": author, "text": text.strip()[:2000]}
        e["comments"].append(entry)
        self._save(data); return entry

    def comments(self, run_id: str) -> list[dict]:
        return list(self._load().get(run_id, {}).get("comments", []))

    def state(self, run_id: str) -> dict:
        e = self._load().get(run_id, {})
        return {"liked": bool(e.get("liked")), "favorite": bool(e.get("favorite")),
                "comments": len(e.get("comments", []))}
