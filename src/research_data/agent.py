"""Install the discoverable agent skill without changing unrelated skills."""
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path


def config_path() -> Path:
    return Path(os.environ.get("RESEARCH_DATA_CONFIG", str(Path.home() / ".research-data" / "config.json")))


def default_catalog() -> str:
    if os.environ.get("RESEARCH_DATA_CATALOG"):
        return os.environ["RESEARCH_DATA_CATALOG"]
    path = config_path()
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))["catalog"]
    return str(Path.home() / "ResearchData")


def install_agent(target=None, catalog=None) -> dict:
    source = Path(__file__).parent / "resources" / "skill"
    if not (source / "SKILL.md").is_file():
        raise ValueError("Agent skill resources are missing from this installation")
    target = Path(target or Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "skills") / "research-data"
    if target.exists() and not (target / "installation.json").is_file():
        existing = target / "SKILL.md"
        if not existing.is_file() or existing.read_bytes() != (source / "SKILL.md").read_bytes():
            raise ValueError(f"An unmanaged research-data skill already exists: {target}; select another target or review it first")
    target.mkdir(parents=True, exist_ok=True)
    files = []
    for path in source.rglob("*"):
        if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc":
            rel = path.relative_to(source)
            dest = target / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, dest)
            files.append(rel.as_posix())
    selected_catalog = str(Path(catalog or default_catalog()).resolve())
    runtime = {"python": sys.executable, "catalog": selected_catalog}
    (target / "runtime.json").write_text(json.dumps(runtime, indent=2), encoding="utf-8")
    (target / "installation.json").write_text(json.dumps({"package": "research-data", "files": files}, indent=2), encoding="utf-8")
    settings = config_path()
    settings.parent.mkdir(parents=True, exist_ok=True)
    configuration = json.loads(settings.read_text(encoding="utf-8")) if settings.is_file() else {}
    configuration["catalog"] = selected_catalog
    settings.write_text(json.dumps(configuration, indent=2), encoding="utf-8")
    return {"skill": str(target), "catalog": selected_catalog, "python": sys.executable, "automatic_selection": True}


def configure(browser=None):
    path = config_path()
    settings = json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {"catalog": default_catalog()}
    if browser:
        browser = str(Path(browser).resolve())
        if not Path(browser).is_file():
            raise ValueError("Browser executable does not exist")
        settings["browser_path"] = browser
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(settings, indent=2), encoding="utf-8")
    return settings
