"""Capture inert, verifiable source bytes before a scientific run starts."""

from __future__ import annotations

import hashlib
import importlib.metadata
import importlib
import json
import platform
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

SOURCE_SUFFIXES = {".py", ".jl", ".toml", ".yaml", ".yml", ".json", ".md", ".sh", ".ps1", ".bat", ".cmd", ".c", ".cpp", ".h", ".hpp", ".rs", ".js", ".ts", ".ipynb", ".tex"}
SOURCE_NAMES = {"Makefile", "Dockerfile", "requirements.txt", "requirements.lock", "uv.lock", "poetry.lock", "Manifest.toml", "Project.toml", ".gitignore", "LICENSE"}
IGNORED_DIRS = {".git", ".venv", "venv", "node_modules", "__pycache__", ".pytest_cache", ".research-data", "runs", "dist", "build"}
MAX_SOURCE_FILE = 32 * 1024 * 1024
MAX_SNAPSHOT = 256 * 1024 * 1024


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _git(root: Path, *args: str) -> str | None:
    try:
        proc = subprocess.run(["git", "-C", str(root), *args], capture_output=True, encoding="utf-8", errors="replace", timeout=30)
    except FileNotFoundError:
        return None
    return proc.stdout.strip() if proc.returncode == 0 else None


def environment_info() -> dict:
    versions = {}
    installed_distributions = {}
    for package in ("research-data", "numpy", "pandas", "xarray", "plotly", "h5py", "streamlit", "qcodes", "pyarrow", "kaleido", "matplotlib", "reportlab", "Pillow"):
        try:
            installed = importlib.metadata.version(package)
            installed_distributions[package] = installed
            versions[package] = installed
        except importlib.metadata.PackageNotFoundError:
            pass
    try:
        runtime = importlib.import_module("research_data")
        runtime_version = str(runtime.__version__)
        versions["research-data"] = runtime_version
        module_file = getattr(runtime, "__file__", None)
        module_locations = {"research-data": str(Path(module_file).resolve())} if module_file else {}
    except (ImportError, AttributeError):
        module_locations = {}
    return {"python": sys.version, "platform": platform.platform(), "packages": versions,
            "installed_distributions": installed_distributions, "module_locations": module_locations}


def _inside(path: Path, root: Path) -> Path:
    resolved = path.resolve()
    try:
        return resolved.relative_to(root)
    except ValueError as exc:
        raise ValueError(f"Source must stay within its declared root: {path}") from exc


def capture_provenance(repo, run_dir, entrypoint=None, command=None, source_paths=None) -> dict:
    """Snapshot declared sources; an omitted repo means historical identity is unknown.

    Default coverage includes Git-listed source/configuration files. Explicit
    source_paths includes every file under those paths, regardless of extension.
    Neither mode claims to capture undeclared external dependencies or input data.
    """
    timestamp = datetime.now(timezone.utc).isoformat()
    result = {"captured_at": timestamp, "repo_path": None, "repo_url": None, "git_commit": None, "git_branch": None, "git_dirty": None,
              "entrypoint": str(entrypoint) if entrypoint else None, "command": command, "environment": environment_info(),
              "snapshot": None, "status": "unknown", "coverage": "unknown", "limitations": []}
    if repo is None:
        result["limitations"] = ["Historical source was not supplied; current checkout identity was not assigned to imported data."]
        return result
    root = Path(repo).resolve()
    if not root.is_dir():
        raise ValueError(f"Source root does not exist: {root}")
    result["repo_path"] = str(root)
    git_root = _git(root, "rev-parse", "--show-toplevel")
    is_git = git_root is not None
    if is_git:
        # Keep declared root boundaries even when it is a directory within a repo.
        result["git_root"] = git_root
        result["git_commit"] = _git(root, "rev-parse", "HEAD")
        result["git_branch"] = _git(root, "symbolic-ref", "--quiet", "--short", "HEAD")
        result["repo_url"] = _git(root, "remote", "get-url", "origin")
        result["git_dirty"] = bool(_git(root, "status", "--porcelain", "--untracked-files=all"))
        result["head_state"] = "branch" if result["git_branch"] else "detached_or_unborn"
    candidates: set[Path] = set()
    declared = source_paths is not None
    if declared:
        for supplied in source_paths:
            path = Path(supplied)
            if not path.is_absolute():
                path = root / path
            _inside(path, root)
            if not path.exists():
                raise ValueError(f"Declared source does not exist: {supplied}")
            if path.is_dir():
                candidates.update(p for p in path.rglob("*") if p.is_file() and not any(part in IGNORED_DIRS for part in p.relative_to(root).parts))
            else:
                candidates.add(path)
    elif is_git:
        listing = _git(root, "ls-files", "-z", "--cached", "--others", "--exclude-standard") or ""
        candidates = {root / relative for relative in listing.split("\x00") if relative and (Path(relative).suffix.lower() in SOURCE_SUFFIXES or Path(relative).name in SOURCE_NAMES)}
    else:
        candidates = {p for p in root.rglob("*") if p.is_file() and (p.suffix.lower() in SOURCE_SUFFIXES or p.name in SOURCE_NAMES) and not any(part in IGNORED_DIRS for part in p.relative_to(root).parts)}
    if entrypoint:
        entry = Path(entrypoint)
        if not entry.is_absolute():
            entry = root / entry
        relative = _inside(entry, root)
        if not entry.is_file():
            raise ValueError(f"Entrypoint does not exist: {entrypoint}")
        candidates.add(entry)
        result["entrypoint"] = relative.as_posix()
    run_root = Path(run_dir).resolve()
    filtered = []
    for path in candidates:
        relative = _inside(path, root)
        if not path.is_file() or any(part in IGNORED_DIRS for part in relative.parts):
            continue
        if path.is_symlink():
            raise ValueError(f"Declare source bytes directly instead of a symlink: {path}")
        if path.resolve().is_relative_to(run_root):
            continue
        filtered.append((relative.as_posix(), path))
    source_dir = run_root / "source"
    source_dir.mkdir(parents=True, exist_ok=True)
    archive = source_dir / "snapshot.zip"
    file_records = []
    total = 0
    with zipfile.ZipFile(archive, "x", compression=zipfile.ZIP_DEFLATED) as zipped:
        for relative, path in sorted(filtered):
            size = path.stat().st_size
            if size > MAX_SOURCE_FILE or total + size > MAX_SNAPSHOT:
                raise ValueError("Source snapshot exceeds its byte limit; explicitly narrow source_paths to the code and dependency files used by the run.")
            payload = path.read_bytes()
            if len(payload) != size:
                raise ValueError(f"Source changed during capture: {relative}; retry from a stable checkout.")
            total += len(payload)
            zipped.writestr(relative, payload)
            file_records.append({"path": relative, "sha256": hashlib.sha256(payload).hexdigest(), "size_bytes": len(payload)})
    result["coverage"] = "declared_paths" if declared else "repository_source_files"
    result["status"] = "captured"
    result["snapshot"] = {"path": "source/snapshot.zip", "sha256": sha256_file(archive), "files": file_records, "size_bytes": total}
    result["limitations"] = ["Snapshot covers the listed source files; runtime dependencies are identified by environment records, not bundled."]
    if not declared:
        result["limitations"].append("Default coverage is source/configuration files; declare source_paths for additional runtime assets or nonstandard source files.")
    if is_git and _git(root, "rev-parse", "HEAD") != result["git_commit"]:
        raise ValueError("Git HEAD changed during source capture; retry from a stable checkout.")
    (source_dir / "manifest.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


def inspect_snapshot(provenance: dict, run_dir: Path) -> dict:
    """Verify archived bytes and report subsequent edits separately from integrity."""
    snapshot = provenance.get("snapshot")
    if not snapshot:
        return {"ok": True, "status": "unknown", "errors": [], "source_changed_since_capture": []}
    root = Path(run_dir).resolve()
    archive = (root / snapshot["path"]).resolve()
    if not archive.is_relative_to(root):
        raise ValueError("Source archive path escapes the run directory")
    errors = []
    changed = []
    if not archive.is_file() or sha256_file(archive) != snapshot["sha256"]:
        return {"ok": False, "status": "corrupt", "errors": ["Source archive is missing or has changed"], "source_changed_since_capture": []}
    with zipfile.ZipFile(archive) as zipped:
        for item in snapshot["files"]:
            member = Path(item["path"])
            if member.is_absolute() or ".." in member.parts:
                errors.append(f"Unsafe source member: {item['path']}")
                continue
            try:
                data = zipped.read(item["path"])
            except KeyError:
                errors.append(f"Missing archived source: {item['path']}")
                continue
            if hashlib.sha256(data).hexdigest() != item["sha256"]:
                errors.append(f"Changed archived source: {item['path']}")
            current = Path(provenance["repo_path"]) / member
            if not current.is_file() or sha256_file(current) != item["sha256"]:
                changed.append(item["path"])
    return {"ok": not errors, "status": "captured", "errors": errors, "source_changed_since_capture": changed}
