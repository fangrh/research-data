"""Human and machine-readable command discovery for ResearchData.

The parser remains the source of truth for flags.  This module adds the
intent, examples and workflow decision points that argparse cannot express.
It deliberately has no dependency on :mod:`research_data.cli` at import time
so it can be used by launchers and documentation tooling without side effects.
"""

from __future__ import annotations

import argparse
import json
from typing import Any


_INTENT = {
    "init": "Create or prepare a catalog without changing source data.",
    "start": "Capture provenance and begin a run before generating data.",
    "run": "Wrap an existing Python, Julia, or other command and register its outputs.",
    "register": "Attach an existing file to a previously recorded run.",
    "import": "Register historical data while keeping unknown provenance explicit.",
    "finish": "Record execution outcome separately from scientific validation.",
    "search": "Find runs by text, tags, classifications, or parameter filters.",
    "show": "Read one complete run and its artifact/data card.",
    "check": "Verify managed bytes and captured source integrity.",
    "rebuild": "Rebuild the SQLite index from durable manifests.",
    "validation": "Attach an evidence-backed scientific validation status.",
    "plot": "Render a reusable recipe for one or more registered datasets.",
    "profile": "Save a reusable import mapping.",
    "themes": "List available plot styles.",
    "browse": "Open the catalog browser and plot studio.",
    "open": "Start the managed local browser service and open it.",
    "status": "Inspect the managed local browser service.",
    "stop": "Stop the managed local browser service.",
    "serve": "Run the local browser service in the foreground.",
    "demo": "Generate a labeled synthetic demonstration catalog.",
    "doctor": "Inspect optional dependencies and runtime configuration.",
    "install-agent": "Install the discoverable ResearchData agent skill.",
    "configure": "Configure an optional static-export browser.",
    "help": "Show command discovery and contextual examples.",
    "guide": "Show a workflow decision guide for people or agents.",
}

_EXAMPLES = {
    "init": "research-data init",
    "start": "research-data start --title TITLE --repo SOURCE_ROOT --entrypoint SCRIPT --source SCRIPT",
    "register": "research-data register RUN_ID DATA_FILE --description DESCRIPTION --profile profile.json",
    "finish": "research-data finish RUN_ID --status completed",
    "show": "research-data show RUN_ID",
    "check": "research-data check RUN_ID",
    "rebuild": "research-data rebuild",
    "validation": "research-data validation RUN_ID partial --notes LIMITATIONS",
    "profile": "research-data profile transport profile.json",
    "themes": "research-data themes",
    "status": "research-data status",
    "stop": "research-data stop",
    "doctor": "research-data doctor",
    "install-agent": "research-data install-agent --catalog CATALOG_FOLDER",
    "configure": "research-data configure --browser BROWSER_EXECUTABLE",
    "demo": "research-data demo --root demo-catalog",
    "help": "research-data help run --json",
    "guide": "research-data guide generate",
    "run": "research-data run --title TITLE --repo SOURCE_ROOT --source SCRIPT -- python SCRIPT",
    "import": "research-data import DATA_FILE --title TITLE --project PROJECT --profile PROFILE_JSON",
    "plot": "research-data plot RUN_ID --recipe recipe.json --output figure.html",
    "browse": "research-data browse",
    "open": "research-data open",
    "serve": "research-data serve --port 8765 --no-open",
    "search": "research-data search KEYWORDS --filter project=PROJECT",
    "agent": "research-data guide agent --json",
}

_GROUPS = {
    "startup": ["open", "status", "stop", "serve", "browse"],
    "data": ["init", "start", "run", "register", "import", "finish", "validation"],
    "search": ["search", "show", "check", "rebuild"],
    "plot": ["plot", "profile", "themes"],
    "maintenance": ["doctor", "configure", "demo", "install-agent"],
    "agent": ["help", "guide", "install-agent"],
}

_WORKFLOWS = {
    "generate": {
        "purpose": "Generate new data with source provenance and managed outputs.",
        "steps": ["doctor", "init", "run", "check", "validation"],
        "decision": "Use run when an existing command creates files; use the Python Catalog API when generation is embedded in Python.",
        "example": _EXAMPLES["run"],
        "notes": ["Write outputs to RESEARCH_DATA_OUTPUT.", "A successful process is not scientific validation."],
    },
    "import": {
        "purpose": "Register historical data while preserving uncertainty about its origin.",
        "steps": ["profile", "import", "check", "validation"],
        "decision": "Use a profile when variable names, units, or coordinates are known; retain unknown source identity when it is not.",
        "example": _EXAMPLES["import"],
        "notes": ["Do not infer physical meaning from shape alone.", "Use --repo/--source only when provenance is supported."],
    },
    "plot": {
        "purpose": "Create a reproducible figure from registered datasets.",
        "steps": ["search", "show", "plot", "check"],
        "decision": "Use a saved recipe for repeated plots and keep input run/artifact IDs with the resulting figure.",
        "example": _EXAMPLES["plot"],
        "notes": ["Preserve acquisition order and declared units.", "A figure does not establish physical validity."],
    },
    "browse": {
        "purpose": "Inspect runs interactively in the local browser UI.",
        "steps": ["open", "status", "stop"],
        "decision": "Use open for a managed background service; use serve for a foreground process controlled with Ctrl+C.",
        "example": _EXAMPLES["open"],
        "notes": ["The default listener is local-only.", "status and stop address only a ResearchData-managed service."],
    },
    "agent": {
        "purpose": "Let an agent discover valid commands, flags, workflows, and launcher outputs.",
        "steps": ["help", "guide", "doctor", "install-agent"],
        "decision": "Call help --json for parser-derived options and guide --json for workflow selection before mutating a catalog.",
        "example": _EXAMPLES["agent"],
        "notes": ["Required flags are included in command option metadata.", "Wrapper runs expose RESEARCH_DATA_RUN_ID, RESEARCH_DATA_RUN_DIR, RESEARCH_DATA_OUTPUT, and RESEARCH_DATA_CATALOG."],
    },
}


def _subparsers(parser: argparse.ArgumentParser) -> dict[str, argparse.ArgumentParser]:
    for action in parser._actions:
        if isinstance(action, argparse._SubParsersAction):
            return dict(action.choices)
    return {}


def _action_record(action: argparse.Action) -> dict[str, Any]:
    record: dict[str, Any] = {"dest": action.dest, "required": bool(getattr(action, "required", False))}
    if action.option_strings:
        record["flags"] = list(action.option_strings)
    if action.help and action.help != argparse.SUPPRESS:
        record["help"] = action.help
    if action.default not in (None, argparse.SUPPRESS):
        record["default"] = action.default
    if getattr(action, "choices", None) is not None:
        record["choices"] = list(action.choices)
    if action.nargs is not None:
        record["nargs"] = action.nargs
    if action.type is not None:
        record["type"] = getattr(action.type, "__name__", str(action.type))
    return record


def _command_record(name: str, command: argparse.ArgumentParser) -> dict[str, Any]:
    options = [_action_record(a) for a in command._actions if not isinstance(a, argparse._SubParsersAction)]
    return {
        "name": name,
        "description": _INTENT.get(name, command.description or ""),
        "options": options,
        "example": _EXAMPLES.get(name),
    }


def command_catalog(parser: argparse.ArgumentParser, topic: str | None = None) -> dict[str, Any]:
    """Return parser-derived command metadata plus stable discovery hints."""
    commands = _subparsers(parser)
    if topic in {"agent", "all"}:
        selected = commands
    elif topic:
        selected = {topic: commands[topic]} if topic in commands else {}
    else:
        selected = commands
    if topic and not selected and topic not in _WORKFLOWS:
        raise ValueError(f"Unknown command or topic: {topic}; use help to list commands")
    result = {
        "schema": "research-data.command-catalog.v1",
        "program": parser.prog,
        "topic": topic,
        "commands": {name: _command_record(name, command) for name, command in selected.items()},
        "global_options": [_action_record(a) for a in parser._actions if not isinstance(a, argparse._SubParsersAction)],
        "workflows": {name: {"purpose": value["purpose"], "steps": value["steps"], "decision": value["decision"], "example": value["example"]} for name, value in _WORKFLOWS.items()},
        "environment": ["RESEARCH_DATA_RUN_ID", "RESEARCH_DATA_RUN_DIR", "RESEARCH_DATA_OUTPUT", "RESEARCH_DATA_CATALOG"],
        "exit_codes": {"0": "success", "1": "integrity check failed", "2": "invalid input or runtime error", "130": "foreground serve interrupted with Ctrl+C"},
        "wrapped_command_exit": "run propagates the wrapped program's exit code; consult execution_status for the recorded outcome",
        "groups": _GROUPS,
    }
    return result


def workflow_guide(topic: str | None = None, machine: bool = False) -> dict[str, Any] | str:
    """Return a workflow decision map for humans or agents."""
    selected = _WORKFLOWS if topic in (None, "all") else ({topic: _WORKFLOWS[topic]} if topic in _WORKFLOWS else {})
    payload = {"schema": "research-data.workflow-guide.v1", "topic": topic, "workflows": selected}
    if topic and not selected:
        raise ValueError(f"Unknown workflow: {topic}; use guide to list workflows")
    if machine:
        return payload
    if not selected:
        return payload["error"]
    lines = ["ResearchData workflow guide", ""]
    for name, guide in selected.items():
        lines.extend([f"{name}: {guide['purpose']}", f"  Steps: {' -> '.join(guide['steps'])}", f"  Choose: {guide['decision']}", f"  Example: {guide['example']}", ""])
    return "\n".join(lines).rstrip()


def render_help(parser: argparse.ArgumentParser, topic: str | None = None) -> str:
    """Render readable parser help with contextual examples and workflows."""
    # ``help plot`` is command help; workflows are selected through ``guide``.
    if topic in _WORKFLOWS and topic not in _subparsers(parser):
        return str(workflow_guide(topic))
    text = parser.format_help()
    commands = _subparsers(parser)
    if topic and topic in commands:
        text = commands[topic].format_help()
    record = command_catalog(parser, topic)
    if topic and topic in _EXAMPLES:
        text += f"\nExample:\n  {_EXAMPLES[topic]}\n"
    elif topic in (None, "agent", "all"):
        text += "\nCommand groups:\n"
        for group, names in _GROUPS.items():
            text += f"  {group}: {', '.join(names)}\n"
        text += "Workflows: generate, import, plot, browse, agent\nUse `help COMMAND` for command options or `guide WORKFLOW` for decisions.\n"
    return text


def catalog_json(parser: argparse.ArgumentParser, topic: str | None = None) -> str:
    """Convenience serializer for launcher integrations."""
    return json.dumps(command_catalog(parser, topic), ensure_ascii=False, indent=2, default=str)
