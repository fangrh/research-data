"""Git-trackable, inert project import profiles and plotting structures.

The JSON document is configuration, never executable Python. Resolved templates
carry their original bytes, hash and Git identity so a saved recipe is replayable
even after the project is edited or moved.
"""
from __future__ import annotations

from copy import deepcopy
import hashlib
import json
import os
from pathlib import Path
import tempfile
from typing import Any

from .provenance import _git

CONFIG_NAME = "research-data.project.json"
SCHEMA = "research-data.project.v1"


def default_config() -> dict:
    return {
        "schema": SCHEMA,
        "description": "Project-local templates. Replace x/y and declare known units before use.",
        "profiles": {
            "table": {"x": "x", "rename": {}, "units": {}, "descriptions": {}}
        },
        "plots": {
            "line": {"kind": "line", "x": "x", "y": ["y"], "theme": "paper",
                     "style": {"font_family": "Arial, sans-serif", "font_size": 14}},
            "two-panel": {"kind": "panels", "columns": 2, "theme": "paper",
                          "title": "Real and imaginary components", "height": 520,
                          "panels": [
                              {"kind": "line", "x": "x", "y": "y", "component": "real", "title": "Real"},
                              {"kind": "line", "x": "x", "y": "y", "component": "imag", "title": "Imaginary"},
                          ]},
        },
    }


def _object(value: Any, label: str) -> dict:
    if not isinstance(value, dict):
        raise ValueError(f"{label} must be a JSON object")
    return value


def _validate(config: Any) -> dict:
    config = _object(config, "Project configuration")
    if config.get("schema") != SCHEMA:
        raise ValueError(f"Project schema must be {SCHEMA!r}")
    unknown = set(config) - {"schema", "description", "profiles", "plots"}
    if unknown:
        raise ValueError(f"Unknown project fields: {', '.join(sorted(unknown))}")
    for section in ("profiles", "plots"):
        mapping = _object(config.get(section, {}), section)
        for name, definition in mapping.items():
            _name(name)
            _object(definition, f"{section}.{name}")
            if section == "profiles":
                validate_profile(definition)
    return config


def validate_profile(profile: dict) -> None:
    """Check the mapping contract, leaving actual variable availability to readers."""
    for field in ("rename", "units", "descriptions"):
        mapping = _object(profile.get(field, {}), f"profile.{field}")
        if any(not isinstance(v, str) for v in mapping.values()):
            raise ValueError(f"profile.{field} values must be strings")
    coordinates = _object(profile.get("coordinates", {}), "profile.coordinates")
    for names in coordinates.values():
        if not isinstance(names, list) or any(not isinstance(name, str) or not name for name in names):
            raise ValueError("profile.coordinates values must be lists of dimension names")
    if "x" in profile and (not isinstance(profile["x"], str) or not profile["x"]):
        raise ValueError("profile.x must be a non-empty variable name")
    if "variables" in profile:
        variables = profile["variables"]
        values = variables.values() if isinstance(variables, dict) else variables
        if not isinstance(variables, (list, dict)) or any(not isinstance(v, str) for v in values):
            raise ValueError("profile.variables must be a list or source-to-variable mapping")


def _name(name: str) -> str:
    if not isinstance(name, str) or not name.strip() or len(name) > 120 or any(c in name for c in "/\\\x00"):
        raise ValueError("Template name must be non-empty, at most 120 characters and contain no path separators")
    return name


def _encode(config: dict) -> str:
    return json.dumps(config, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


class ProjectTemplates:
    """Read one explicit project directory, without searching or executing code."""

    def __init__(self, directory: str | Path):
        self.directory = Path(directory).expanduser().resolve()
        self.path = self.directory / CONFIG_NAME
        self._bytes = self.path.read_bytes()
        self._source = self._bytes.decode("utf-8")
        # Reject NaN/Infinity: these are not JSON numbers or useful style values.
        def bad_constant(value):
            raise ValueError(f"Invalid JSON number: {value}")
        self.config = _validate(json.loads(self._source.lstrip("\ufeff"), parse_constant=bad_constant))
        self.sha256 = hashlib.sha256(self._bytes).hexdigest()
        self._git_identity = {
            "git_commit": _git(self.directory, "rev-parse", "HEAD"),
            "git_branch": _git(self.directory, "symbolic-ref", "--quiet", "--short", "HEAD"),
            "git_dirty": None,
        }
        if _git(self.directory, "rev-parse", "--show-toplevel"):
            self._git_identity["git_dirty"] = bool(_git(self.directory, "status", "--porcelain", "--untracked-files=all"))

    @classmethod
    def initialize(cls, directory: str | Path) -> Path:
        folder = Path(directory).expanduser().resolve()
        folder.mkdir(parents=True, exist_ok=True)
        path = folder / CONFIG_NAME
        # Exclusive creation protects a user's existing project configuration.
        with path.open("x", encoding="utf-8", newline="\n") as stream:
            stream.write(_encode(default_config()))
        return path

    def _resolve(self, section: str, name: str) -> dict:
        _name(name)
        if name not in self.config.get(section, {}):
            raise ValueError(f"Unknown project {section} template {name!r}; inspect {self.path}")
        value = deepcopy(self.config[section][name])
        value["_project_template"] = {
            "schema": SCHEMA, "path": str(self.path), "name": name,
            "kind": section, "sha256": self.sha256, "source": self._source,
            **self._git_identity,
        }
        return value

    def profile(self, name: str) -> dict:
        return self._resolve("profiles", name)

    def recipe(self, name: str) -> dict:
        return self._resolve("plots", name)

    def summary(self) -> dict:
        return {"schema": SCHEMA, "path": str(self.path), "sha256": self.sha256,
                "profiles": list(self.config.get("profiles", {})),
                "plots": list(self.config.get("plots", {})), **self._git_identity}

    def save_plot(self, name: str, recipe: dict, overwrite: bool = False) -> Path:
        _name(name)
        _object(recipe, "Plot recipe")
        from .plotting import validate_recipe
        validate_recipe(recipe)
        if name in self.config.get("plots", {}) and not overwrite:
            raise ValueError(f"Plot template {name!r} exists; explicitly allow overwrite or choose another name")
        if self.path.read_bytes() != self._bytes:
            raise ValueError("Project configuration changed since loading; reload before saving")
        config = deepcopy(self.config)
        saved = deepcopy(recipe)
        saved.pop("_project_template", None)
        config.setdefault("plots", {})[name] = saved
        payload = _encode(_validate(config))
        handle, temporary = tempfile.mkstemp(prefix=".research-data-project-", suffix=".tmp", dir=self.directory)
        try:
            with os.fdopen(handle, "w", encoding="utf-8", newline="\n") as stream:
                stream.write(payload)
            os.replace(temporary, self.path)
        finally:
            Path(temporary).unlink(missing_ok=True)
        self.__init__(self.directory)
        return self.path


def resolve_project(value: str, directory: str | Path | None, section: str) -> dict:
    """Resolve an explicit project:NAME reference for CLI/API callers."""
    if not value.startswith("project:"):
        raise ValueError("Project reference must use project:NAME")
    project = ProjectTemplates(directory or os.environ.get("RESEARCH_DATA_PROJECT") or Path.cwd())
    return project.profile(value[8:]) if section == "profiles" else project.recipe(value[8:])
