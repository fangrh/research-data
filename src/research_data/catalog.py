"""Durable manifests and rebuildable indexed run catalog."""
from __future__ import annotations

import hashlib, json, os, shutil, sqlite3, tempfile, traceback
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from .adapters import load_file


def _now() -> str: return datetime.now(timezone.utc).isoformat()
def _safe(name: str) -> str:
    if not name or Path(name).name != name or name in {".", ".."} or any(c in name for c in "/\\"):
        raise ValueError("recipe name must be a simple filename")
    return name
def _sha(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""): h.update(block)
    return h.hexdigest()

_EXECUTION = {"running", "completed", "failed", "imported"}
_VALIDATION = {"not_checked", "partial", "passed", "failed"}

def _rid(value: str) -> str:
    if not value or Path(value).name != value or value in {".", ".."} or any(c in value for c in "/\\"):
        raise ValueError("invalid run id")
    return value

def _inside(base: Path, rel: str) -> Path:
    p = (base / rel).resolve()
    if not p.is_relative_to(base.resolve()): raise ValueError("artifact path escapes run directory")
    return p

def _load_run_summaries(db_path: str):
    """Read run summaries from the SQLite index without touching manifests.

    Uses the optional Rust accelerator when importable; the pure-Python
    path below is the reference implementation.
    """
    try:
        from research_data_rspeed import load_run_summaries  # optional native build
        return [dict(r) for r in load_run_summaries(db_path)]
    except ImportError:
        pass
    with sqlite3.connect(f"file:{Path(db_path).as_posix()}?mode=ro", uri=True) as c:
        c.row_factory = sqlite3.Row
        rows = c.execute(
            "SELECT run_id, title, project, sample, kind, execution_status,"
            " created_at, updated_at, tags, categories, parameters, description FROM runs"
        ).fetchall()
    defaults = {"tags": [], "categories": {}, "parameters": {}}
    out = []
    for row in rows:
        d = dict(row)
        for key, fallback in defaults.items():
            try:
                d[key] = json.loads(d.get(key) or json.dumps(fallback))
            except ValueError:
                d[key] = fallback
        out.append(d)
    return out


def _nested(obj: dict, key: str):
    cur = obj
    for part in key.split("."):
        if not isinstance(cur, dict): return None
        cur = cur.get(part)
    return cur

@contextmanager
def _run_lock(path: Path):
    """Small cross-process advisory lock for manifest read-modify-write."""
    lock_path = path / ".manifest.lock"
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    fh = lock_path.open("a+")
    try:
        if os.name == "nt":
            import msvcrt
            fh.seek(0); fh.write("0"); fh.flush(); fh.seek(0)
            msvcrt.locking(fh.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl
            fcntl.flock(fh.fileno(), fcntl.LOCK_EX)
        yield
    finally:
        if os.name == "nt":
            import msvcrt
            fh.seek(0); msvcrt.locking(fh.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl
            fcntl.flock(fh.fileno(), fcntl.LOCK_UN)
        fh.close()


class Run:
    def __init__(self, catalog: "Catalog", manifest: dict):
        self.catalog, self.manifest = catalog, manifest
        self.run_id = manifest["run_id"]
        self.path = catalog.root / "runs" / self.run_id
    def add_artifact(self, path, **kwargs):
        result = self.catalog.register_artifact(self.run_id, path, **kwargs)
        self.manifest = self.catalog._manifest(self.run_id)
        return result
    def finish(self, status="completed", error=None): self.manifest = self.catalog.finish_run(self.run_id, status, error); return self
    def __enter__(self): return self
    def __exit__(self, typ, value, tb):
        if typ:
            self.finish("failed", "".join(traceback.format_exception(typ, value, tb)))
            return False
        if self.manifest["execution_status"] == "running": self.finish()
        return False


class Catalog:
    def __init__(self, root):
        self.root = Path(root); self.root.mkdir(parents=True, exist_ok=True); (self.root / "runs").mkdir(exist_ok=True); (self.root / "recipes").mkdir(exist_ok=True)
        self.db = self.root / "catalog.sqlite3"; self._init_db()
    def _connect(self):
        c = sqlite3.connect(self.db); c.row_factory = sqlite3.Row; return c
    def _init_db(self):
        with self._connect() as c:
            c.executescript("CREATE TABLE IF NOT EXISTS runs (run_id TEXT PRIMARY KEY, title TEXT, project TEXT, sample TEXT, kind TEXT, execution_status TEXT, validation_status TEXT, created_at TEXT, updated_at TEXT, manifest_path TEXT, tags TEXT, categories TEXT, parameters TEXT, description TEXT); CREATE VIRTUAL TABLE IF NOT EXISTS runs_fts USING fts5(run_id UNINDEXED, title, description, project, sample, tags, categories); CREATE TABLE IF NOT EXISTS artifacts (artifact_id TEXT PRIMARY KEY, run_id TEXT, path TEXT, original_name TEXT, role TEXT, description TEXT, sha256 TEXT, size_bytes INTEGER, format TEXT, variables TEXT, profile TEXT, metadata TEXT);")
    def _manifest(self, rid):
        rid = _rid(rid)
        return json.loads((self.root / "runs" / rid / "manifest.json").read_text(encoding="utf-8"))
    def start_run(self, title, project="default", kind="simulation", sample=None, description="", parameters=None, tags=None, categories=None, repo=None, entrypoint=None, command=None, source_paths=None, parent_run_ids=None, task_id=None):
        rid = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}-{uuid4().hex[:8]}"; now = _now(); d = self.root / "runs" / rid; d.mkdir(parents=True)
        prov = {"status": "unknown", "git_commit": None, "git_branch": None, "reason": "provenance omitted"}
        try:
            from .provenance import capture_provenance
            prov = capture_provenance(repo, d, entrypoint, command, source_paths)
        except ImportError:
            if repo is not None:
                raise
        except Exception:
            if repo is not None:
                raise
        parents = parent_run_ids or []
        for parent in parents: self._manifest(_rid(parent))
        m = {"schema_version": 1, "run_id": rid, "title": title, "description": description, "project": project, "sample": sample, "kind": kind, "created_at": now, "updated_at": now, "execution_status": "running", "validation": {"status": "not_checked", "evidence": [], "notes": ""}, "parameters": parameters or {}, "tags": tags or [], "categories": categories or {}, "task_id": task_id, "parent_run_ids": parents, "provenance": prov, "artifacts": []}
        self._write(m); self._index(m); return Run(self, m)
    @contextmanager
    def run(self, **kwargs):
        r = self.start_run(**kwargs)
        try: yield r
        except Exception as exc: r.finish("failed", str(exc)); raise
        else: r.finish()
    def _write(self, m):
        m["updated_at"] = _now(); d = self.root / "runs" / m["run_id"]
        fd, tmp_name = tempfile.mkstemp(prefix="manifest-", suffix=".tmp", dir=d)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as tmp: json.dump(m, tmp, indent=2, default=str)
            os.replace(tmp_name, d / "manifest.json")
        finally:
            if os.path.exists(tmp_name): os.unlink(tmp_name)
        card = f"# {m['title']}\n\nRun `{m['run_id']}` ({m['kind']})\n\n{m['description']}\n\n- Sample: `{m.get('sample')}`\n- Tags: `{m.get('tags', [])}`\n- Categories: `{m.get('categories', {})}`\n- Task: `{m.get('task_id')}`\n- Parents: `{m.get('parent_run_ids', [])}`\n\n## Lifecycle\n- Execution: `{m['execution_status']}`\n- Validation: `{m['validation']}`\n\n## Parameters\n```json\n{json.dumps(m['parameters'], indent=2, default=str)}\n```\n\n## Provenance\n```json\n{json.dumps(m['provenance'], indent=2, default=str)}\n```\n\n## Artifacts\n" + "\n".join(f"- `{a['path']}` ({a.get('format')}, {a.get('size_bytes')} bytes): variables={json.dumps(a.get('variables', []), default=str)} descriptions={json.dumps(a.get('metadata', {}).get('descriptions', {}), default=str)}" for a in m['artifacts']) + "\n"
        (d / "README.md").write_text(card, encoding="utf-8")
    def _index(self, m):
        with self._connect() as c:
            c.execute("INSERT OR REPLACE INTO runs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (m["run_id"],m["title"],m["project"],m.get("sample"),m["kind"],m["execution_status"],m["validation"]["status"],m["created_at"],m["updated_at"],f"runs/{m['run_id']}/manifest.json",json.dumps(m["tags"]),json.dumps(m["categories"]),json.dumps(m["parameters"]),m["description"]))
            cats = m.get("categories", {})
            cat_text = " ".join(str(k) + "=" + str(v) for k,v in cats.items()) if isinstance(cats, dict) else " ".join(map(str, cats))
            c.execute("DELETE FROM runs_fts WHERE run_id=?", (m["run_id"],)); c.execute("INSERT INTO runs_fts VALUES (?,?,?,?,?,?,?)", (m["run_id"],m["title"],m["description"],m["project"],m.get("sample") or "", " ".join(map(str,m["tags"])), cat_text))
            c.execute("DELETE FROM artifacts WHERE run_id=?", (m["run_id"],))
            for a in m["artifacts"]: c.execute("INSERT INTO artifacts VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", (a["artifact_id"],m["run_id"],a["path"],a["original_name"],a["role"],a["description"],a["sha256"],a["size_bytes"],a["format"],json.dumps(a.get("variables",[])),json.dumps(a.get("profile")),json.dumps(a.get("metadata",{}))))
    def register_artifact(self, run_id, path, role="raw", description="", variables=None, profile=None, copy=True, metadata=None):
        artifacts, _ = self.register_artifacts(run_id, [path], role=role, description=description, variables=variables, profile=profile, copy=copy, metadata=metadata)
        return artifacts[0]
    def register_artifacts(self, run_id, paths, role="raw", description="", descriptions=None, variables=None, profile=None, copy=True, metadata=None, strict=True):
        """Register many artifacts with one manifest write and index refresh.

        Returns (artifacts, errors); errors maps str(path) to str(exception).
        strict=True keeps the single-file API semantics and re-raises the first
        failure; strict=False records failures and registers the rest.
        """
        base = (self.root / "runs" / _rid(run_id)).resolve()
        with _run_lock(base):
            m = self._manifest(run_id)
            from .adapters import inspect_file
            descriptions = descriptions or {}
            artifacts, errors = [], {}
            for path in paths:
                try:
                    src = Path(path).resolve(); aid = uuid4().hex
                    if not src.exists(): raise FileNotFoundError(src)
                    dest = base / "artifacts" / f"{aid}-{src.name}"; dest.parent.mkdir(exist_ok=True)
                    managed = dest if copy else src
                    if copy:
                        if src.suffix.lower() in {".db", ".sqlite", ".sqlite3"}:
                            source_db = sqlite3.connect(f"file:{src.as_posix()}?mode=ro", uri=True)
                            target_db = sqlite3.connect(dest)
                            try: source_db.backup(target_db)
                            finally: target_db.close(); source_db.close()
                        else:
                            shutil.copy2(src, dest)
                    rel = managed.relative_to(base) if managed.is_relative_to(base) else None
                    if rel is None and copy is False:
                        raise ValueError("copy=False artifact must be inside the run directory")
                    inferred = variables or []
                    file_metadata = dict(metadata or {})
                    if not inferred:
                        try: inferred = inspect_file(managed, profile).get("variables", [])
                        except Exception as exc: file_metadata["inspection_error"] = str(exc)
                    file_description = description
                    for key in (str(path), src.name):
                        if key in descriptions:
                            file_description = descriptions[key]; break
                    artifacts.append({"artifact_id": aid, "path": str(rel).replace("\\", "/"), "original_name": src.name, "role": role, "description": file_description, "sha256": _sha(managed), "size_bytes": managed.stat().st_size, "format": src.suffix.lower().lstrip("."), "variables": inferred, "profile": profile, "metadata": file_metadata or {}})
                except Exception as exc:
                    if strict: raise
                    errors[str(path)] = str(exc)
            if artifacts:
                m["artifacts"].extend(artifacts); self._write(m); self._index(m)
            return artifacts, errors
    def finish_run(self, run_id, status="completed", error=None):
        if status not in _EXECUTION: raise ValueError(f"invalid execution status: {status}")
        with _run_lock(self.root / "runs" / _rid(run_id)):
            m=self._manifest(run_id); m["execution_status"] = status; m["error"] = error; self._write(m); self._index(m); return m
    def set_validation(self, run_id, status, evidence=None, notes=""):
        if status not in _VALIDATION: raise ValueError(f"invalid validation status: {status}")
        if status == "passed" and not evidence: raise ValueError("passed validation requires evidence")
        with _run_lock(self.root / "runs" / _rid(run_id)):
            m=self._manifest(run_id); m["validation"]={"status":status,"evidence":evidence or [],"notes":notes}; self._write(m); self._index(m); return m["validation"]
    def get(self, run_id): return self._manifest(run_id)
    def attach_provenance(self, run_id, provenance, archive_bytes):
        """Attach a source snapshot captured earlier, preserving its Git identity."""
        from .provenance import inspect_snapshot
        snapshot = provenance.get("snapshot") or {}
        if snapshot.get("path") != "source/snapshot.zip":
            raise ValueError("Expected a captured source/snapshot.zip")
        if hashlib.sha256(archive_bytes).hexdigest() != snapshot.get("sha256"):
            raise ValueError("Source archive integrity check failed")
        with _run_lock(self.root / "runs" / _rid(run_id)):
            m = self._manifest(run_id)
            if m["provenance"].get("snapshot"):
                raise ValueError("Run already has a source snapshot")
            source = self.root / "runs" / run_id / "source"
            source.mkdir(exist_ok=True)
            (source / "snapshot.zip").write_bytes(archive_bytes)
            result = inspect_snapshot(provenance, source.parent)
            if not result["ok"]:
                raise ValueError("Captured source members failed integrity checks")
            (source / "manifest.json").write_text(json.dumps(provenance, indent=2), encoding="utf-8")
            m["provenance"] = provenance
            self._write(m); self._index(m)
        return provenance
    def list_runs(self, query="", filters=None):
        filters=filters or {}; sql="SELECT run_id FROM runs"; args=[]; clauses=[]
        for key in filters:
            if key not in {"project","sample","kind","execution_status","validation_status","tag","git_commit","git_branch"} and not key.startswith("category.") and not key.startswith("parameter."):
                raise ValueError(f"unknown run filter: {key}")
            if key.startswith("parameter.") and ("." not in key[10:] or key.rsplit(".", 1)[1] not in {"eq","gte","lte"}):
                raise ValueError(f"unknown parameter filter operator: {key}")
        for k in ("project","sample","kind","execution_status","validation_status"):
            if k in filters: clauses.append(f"{k}=?"); args.append(filters[k])
        if query:
            safe_query = '"' + query.replace('"', '""') + '"'
            clauses.append("run_id IN (SELECT run_id FROM runs_fts WHERE runs_fts MATCH ?)"); args.append(safe_query)
        if clauses: sql += " WHERE " + " AND ".join(clauses)
        try:
            with self._connect() as c: ids=[r[0] for r in c.execute(sql,args)]
        except sqlite3.OperationalError:
            ids=[]
        if query and not ids:
            with self._connect() as c:
                base_sql = "SELECT run_id FROM runs" + ((" WHERE " + " AND ".join(clauses[:-1])) if query and clauses and clauses[-1].startswith("run_id IN") else (" WHERE " + " AND ".join(clauses) if clauses else ""))
                base_args = args[:-1] if clauses and clauses[-1].startswith("run_id IN") else args
                candidates = [r[0] for r in c.execute(base_sql, base_args)]
            needle = query.casefold()
            ids = [rid for rid in candidates if needle in json.dumps(self._manifest(rid), ensure_ascii=False).casefold()]
        rows=[self._manifest(rid) for rid in ids]
        for k,v in filters.items():
            if k in {"project","sample","kind","execution_status","validation_status"}: continue
            if k.startswith("parameter."):
                field, op = k[10:].rsplit(".", 1)
                rows=[m for m in rows if _nested(m.get("parameters",{}), field) is not None and ((op == "gte" and _nested(m["parameters"],field) >= v) or (op == "lte" and _nested(m["parameters"],field) <= v) or (op == "eq" and _nested(m["parameters"],field) == v))]
            elif k == "category.domain": rows=[m for m in rows if _nested(m.get("categories",{}), "domain") == v]
            elif k == "git_commit": rows=[m for m in rows if m.get("provenance",{}).get("git_commit") == v]
            elif k == "git_branch": rows=[m for m in rows if m.get("provenance",{}).get("git_branch") == v]
            elif k == "tag": rows=[m for m in rows if v in m.get("tags", [])]
            elif rows and isinstance(rows[0].get(k), list): rows=[m for m in rows if v in m.get(k, [])]
        return sorted(rows, key=lambda x:x["created_at"])
    def list_runs_summary(self, query="", filters=None):
        """Index-only run summaries: no manifest files are read.

        Returns dicts with run_id, title, project, sample, kind,
        execution_status, created_at, updated_at, tags, categories,
        parameters and description. Supports the scalar, tag, category.*
        and parameter.* filters plus FTS/case-insensitive text query;
        provenance filters require list_runs() and raise ValueError here.
        """
        summary = _load_run_summaries(str(self.db))
        for key in (filters or {}):
            if key in {"project", "sample", "kind", "execution_status", "tag"} or (
                key.startswith(("category.", "parameter."))
                and (not key.startswith("parameter.") or key.rsplit(".", 1)[1] in {"eq", "gte", "lte"})
            ):
                continue
            raise ValueError(f"unsupported summary filter: {key}")
        rows = summary
        for k, v in (filters or {}).items():
            if k in {"project", "sample", "kind", "execution_status"}:
                rows = [r for r in rows if r.get(k) == v]
            elif k == "tag":
                rows = [r for r in rows if v in r.get("tags", [])]
            elif k.startswith("category."):
                field = k[9:]
                rows = [r for r in rows if _nested(r.get("categories", {}), field) == v]
            elif k.startswith("parameter."):
                field, op = k[10:].rsplit(".", 1)
                def match(r, field=field, op=op, v=v):
                    value = _nested(r.get("parameters", {}), field)
                    if value is None: return False
                    return (op == "gte" and value >= v) or (op == "lte" and value <= v) or (op == "eq" and value == v)
                rows = [r for r in rows if match(r)]
        if query:
            needle = query.casefold()
            rows = [r for r in rows if needle in json.dumps(r, ensure_ascii=False, default=str).casefold()]
        return sorted(rows, key=lambda x: x.get("created_at") or "")
    def rebuild_index(self):
        with self._connect() as c: c.execute("DELETE FROM runs"); c.execute("DELETE FROM runs_fts"); c.execute("DELETE FROM artifacts")
        for p in (self.root / "runs").glob("*/manifest.json"): self._index(json.loads(p.read_text(encoding="utf-8")))
        return len(list((self.root / "runs").glob("*/manifest.json")))
    def check(self, run_id=None):
        ms=[self._manifest(run_id)] if run_id else self.list_runs(); issues=[]
        for m in ms:
            for a in m["artifacts"]:
                try: p = _inside((self.root/"runs"/m["run_id"]), a["path"])
                except ValueError: issues.append({"run_id":m["run_id"],"artifact_id":a.get("artifact_id"),"issue":"path_traversal"}); continue
                if not p.exists() or _sha(p)!=a["sha256"]: issues.append({"run_id":m["run_id"],"artifact_id":a["artifact_id"],"issue":"missing_or_changed"})
        return {"ok":not issues,"issues":issues,"runs":len(ms)}
    def select_artifact(self, run_id, artifact_id=None):
        m = self._manifest(run_id)
        artifacts = m.get("artifacts", [])
        if artifact_id is not None:
            for artifact in artifacts:
                if artifact.get("artifact_id") == artifact_id: return dict(artifact)
            raise KeyError(artifact_id)
        for artifact in artifacts:
            if artifact.get("role") not in {"log", "figure", "plot", "recipe"}:
                return dict(artifact)
        raise KeyError("no loadable data artifact")
    def load_dataset(self, run_id, artifact_id=None, profile=None):
        m=self._manifest(run_id); a = self.select_artifact(run_id, artifact_id)
        p = _inside(self.root/"runs"/_rid(run_id), a["path"])
        if not p.exists() or _sha(p)!=a["sha256"]: raise ValueError("artifact integrity check failed")
        return load_file(p, profile or a.get("profile"))
    def save_recipe(self, name, recipe): p=self.root/"recipes"/(f"{_safe(name)}.json"); p.write_text(json.dumps(recipe,indent=2),encoding="utf-8"); return p
    def load_recipe(self, name): return json.loads((self.root/"recipes"/(f"{_safe(name)}.json")).read_text(encoding="utf-8"))
    def list_recipes(self): return sorted(p.stem for p in (self.root/"recipes").glob("*.json"))
