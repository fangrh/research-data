"""Persistent many-to-many collections of catalog runs."""
from __future__ import annotations

import hashlib
import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from uuid import uuid4

from .catalog import Catalog, _run_lock


_ID = re.compile(r"^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,127})$")
_FIELDS = ("schema_version", "collection_id", "title", "description", "tags", "created_at", "updated_at", "archived", "members")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _text(value: Any, field: str, *, nonempty: bool = False) -> str:
    if not isinstance(value, str) or (nonempty and not value.strip()):
        raise ValueError(f"{field} must be {'non-empty ' if nonempty else ''}text")
    return value


def _tags(value: Any) -> list[str]:
    if not isinstance(value, list) or any(not isinstance(item, str) for item in value):
        raise ValueError("tags must be a list of text")
    return list(value)


def _safe_id(value: str, field: str = "collection_id") -> str:
    if not isinstance(value, str) or not _ID.fullmatch(value):
        raise ValueError(f"invalid {field}")
    return value


class CollectionStore:
    """Store collection JSON files below a catalog root's ``collections`` directory."""

    def __init__(self, root: str | Path):
        self.root = Path(root).expanduser().resolve()
        self.catalog = Catalog(self.root)
        self.folder = self.root / "collections"
        self.folder.mkdir(parents=True, exist_ok=True)
        if not self.folder.resolve().is_relative_to(self.root):
            raise ValueError("collections directory escapes catalog root")

    def _path(self, collection_id: str) -> Path:
        cid = _safe_id(collection_id)
        path = (self.folder / f"{cid}.json").resolve()
        if not path.is_relative_to(self.root) or not path.is_relative_to(self.folder.resolve()):
            raise ValueError("collection path escapes catalog root")
        return path

    @staticmethod
    def _validate_members(members: Any) -> list[dict[str, str]]:
        if not isinstance(members, list):
            raise ValueError("members must be a list")
        result: list[dict[str, str]] = []
        seen: set[str] = set()
        for item in members:
            if not isinstance(item, dict) or set(item) != {"run_id", "role", "note", "added_at"}:
                raise ValueError("each member must contain run_id, role, note and added_at")
            rid = _safe_id(item["run_id"], "run_id")
            if rid in seen:
                raise ValueError("collection members must be unique")
            seen.add(rid)
            result.append({
                "run_id": rid,
                "role": _text(item["role"], "role"),
                "note": _text(item["note"], "note"),
                "added_at": _text(item["added_at"], "added_at", nonempty=True),
            })
        return result

    def _clean(self, raw: Any) -> dict[str, Any]:
        if not isinstance(raw, dict) or set(raw) != set(_FIELDS):
            raise ValueError("malformed collection payload")
        if type(raw["schema_version"]) is not int or raw["schema_version"] != 1:
            raise ValueError("unsupported collection schema_version")
        cid = _safe_id(raw["collection_id"])
        if not isinstance(raw["title"], str) or not raw["title"].strip():
            raise ValueError("title must be non-empty text")
        if not isinstance(raw["description"], str):
            raise ValueError("description must be text")
        if not isinstance(raw["archived"], bool):
            raise ValueError("archived must be boolean")
        for key in ("created_at", "updated_at"):
            _text(raw[key], key, nonempty=True)
        return {
            "schema_version": 1,
            "collection_id": cid,
            "title": raw["title"],
            "description": raw["description"],
            "tags": _tags(raw["tags"]),
            "created_at": raw["created_at"],
            "updated_at": raw["updated_at"],
            "archived": raw["archived"],
            "members": self._validate_members(raw["members"]),
        }

    @staticmethod
    def _with_hash(data: bytes, value: dict[str, Any]) -> dict[str, Any]:
        digest = hashlib.sha256(data).hexdigest()
        return {**value, "hash": digest}

    def _load_path(self, path: Path) -> dict[str, Any]:
        try:
            data = path.read_bytes()
            raw = json.loads(data.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError(f"malformed collection JSON: {path.name}") from exc
        except UnicodeDecodeError as exc:
            raise ValueError(f"malformed collection JSON: {path.name}") from exc
        value = self._clean(raw)
        if value["collection_id"] != path.stem:
            raise ValueError("collection_id does not match filename")
        return self._with_hash(data, value)

    def get(self, collection_id: str) -> dict[str, Any]:
        path = self._path(collection_id)
        if not path.is_file():
            raise FileNotFoundError(path)
        return self._load_path(path)

    def _write(self, value: dict[str, Any]) -> dict[str, Any]:
        path = self._path(value["collection_id"])
        payload = {key: value[key] for key in _FIELDS}
        fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as stream:
                json.dump(payload, stream, ensure_ascii=False, indent=2, allow_nan=False)
                stream.write("\n")
            os.replace(temp_name, path)
        finally:
            Path(temp_name).unlink(missing_ok=True)
        return self._with_hash(path.read_bytes(), payload)

    def _current(self, collection_id: str, expected_hash: str | None) -> dict[str, Any]:
        current = self.get(collection_id)
        if expected_hash is not None and expected_hash != current["hash"]:
            raise ValueError("collection changed since it was read; reload before saving")
        return current

    def _validate_run(self, run_id: str) -> str:
        rid = _safe_id(run_id, "run_id")
        self.catalog.get(rid)
        return rid

    def create(self, title: str, *, description: str = "", tags: list[str] | None = None, run_ids: Iterable[str] | None = None) -> dict[str, Any]:
        title = _text(title, "title", nonempty=True)
        description = _text(description, "description")
        clean_tags = _tags([] if tags is None else tags)
        ids = [] if run_ids is None else list(run_ids)
        if any(not isinstance(rid, str) for rid in ids) or len(set(ids)) != len(ids):
            raise ValueError("run_ids must contain unique text IDs")
        ids = [self._validate_run(rid) for rid in ids]
        now = _now()
        value = {"schema_version": 1, "collection_id": uuid4().hex, "title": title, "description": description, "tags": clean_tags,
                 "created_at": now, "updated_at": now, "archived": False,
                 "members": [{"run_id": rid, "role": "", "note": "", "added_at": now} for rid in ids]}
        with _run_lock(self.root):
            return self._write(value)

    def list(self, query: str = "", *, include_archived: bool = False) -> list[dict[str, Any]]:
        if not isinstance(query, str):
            raise ValueError("query must be text")
        rows = []
        for candidate in sorted(self.folder.glob("*.json")):
            path = self._path(candidate.stem)
            value = self._load_path(path)
            if not include_archived and value["archived"]:
                continue
            needle = query.casefold()
            haystack = " ".join([value["title"], value["description"], *value["tags"], *(x["run_id"] + " " + x["role"] + " " + x["note"] for x in value["members"])])
            if not needle or needle in haystack.casefold():
                rows.append(value)
        return sorted(rows, key=lambda item: (item["created_at"], item["collection_id"]))

    def update(self, collection_id: str, *, title: str | None = None, description: str | None = None, tags: list[str] | None = None, expected_hash: str | None = None) -> dict[str, Any]:
        with _run_lock(self.root):
            value = self._current(collection_id, expected_hash)
            if title is not None: value["title"] = _text(title, "title", nonempty=True)
            if description is not None: value["description"] = _text(description, "description")
            if tags is not None: value["tags"] = _tags(tags)
            value["updated_at"] = _now()
            return self._write(value)

    def add(self, collection_id: str, run_id: str, *, role: str | None = None, note: str | None = None, expected_hash: str | None = None) -> dict[str, Any]:
        rid = self._validate_run(run_id)
        if role is not None: role = _text(role, "role")
        if note is not None: note = _text(note, "note")
        with _run_lock(self.root):
            value = self._current(collection_id, expected_hash)
            member = next((item for item in value["members"] if item["run_id"] == rid), None)
            if member is None:
                member = {"run_id": rid, "role": role or "", "note": note or "", "added_at": _now()}
                value["members"].append(member)
            else:
                if role is not None: member["role"] = role
                if note is not None: member["note"] = note
            value["updated_at"] = _now()
            return self._write(value)

    def remove(self, collection_id: str, run_id: str, *, expected_hash: str | None = None) -> dict[str, Any]:
        rid = _safe_id(run_id, "run_id")
        with _run_lock(self.root):
            value = self._current(collection_id, expected_hash)
            value["members"] = [item for item in value["members"] if item["run_id"] != rid]
            value["updated_at"] = _now()
            return self._write(value)

    def reorder(self, collection_id: str, run_ids: Iterable[str], *, expected_hash: str | None = None) -> dict[str, Any]:
        ids = list(run_ids)
        if any(not isinstance(rid, str) for rid in ids) or len(set(ids)) != len(ids):
            raise ValueError("run_ids must contain unique text IDs")
        ids = [_safe_id(rid, "run_id") for rid in ids]
        with _run_lock(self.root):
            value = self._current(collection_id, expected_hash)
            current = [item["run_id"] for item in value["members"]]
            if set(ids) != set(current):
                raise ValueError("run_ids must be an exact permutation of collection members")
            by_id = {item["run_id"]: item for item in value["members"]}
            value["members"] = [by_id[rid] for rid in ids]
            value["updated_at"] = _now()
            return self._write(value)

    def archive(self, collection_id: str, archived: bool = True, *, expected_hash: str | None = None) -> dict[str, Any]:
        if not isinstance(archived, bool): raise ValueError("archived must be boolean")
        with _run_lock(self.root):
            value = self._current(collection_id, expected_hash); value["archived"] = archived; value["updated_at"] = _now(); return self._write(value)

    def memberships(self, run_id: str, *, include_archived: bool = False) -> list[dict[str, Any]]:
        rid = _safe_id(run_id, "run_id")
        return [value for value in self.list(include_archived=include_archived) if any(item["run_id"] == rid for item in value["members"])]
