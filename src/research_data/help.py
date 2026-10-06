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
    "article": "Prepare and check the mandatory article describing a dataset, its formulas and managed figures.",
    "submit": "Formally submit data only with a complete, integrity-checked article and frozen provenance receipt.",
    "review": "Agent review dispatch: list/show pending user-review requests and complete them.",
    "proof": "Compose editable Three Interact figures, freeze journal proofs, and review exact revisions.",
    "search": "Find runs by text, tags, classifications, or parameter filters.",
    "show": "Read one complete run and its artifact/data card.",
    "check": "Verify managed bytes and captured source integrity.",
    "rebuild": "Rebuild the SQLite index from durable manifests.",
    "validation": "Attach an evidence-backed scientific validation status.",
    "plot": "Render a reusable recipe for one or more registered datasets.",
    "profile": "Save a reusable import mapping.",
    "themes": "List available plot styles.",
    "project": "Manage versioned project import profiles and custom plot structures.",
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
    "article": "research-data article template --run-id RUN_ID --output article.json",
    "submit": "research-data submit RUN_ID --article article.json",
    "review": "research-data review complete --request-id ID --reply-file reply.md --validation partial",
    "show": "research-data show RUN_ID",
    "check": "research-data check RUN_ID",
    "rebuild": "research-data rebuild",
    "validation": "research-data validation RUN_ID partial --notes LIMITATIONS",
    "profile": "research-data profile transport profile.json",
    "themes": "research-data themes",
    "project": "research-data project init --project-dir SOURCE_ROOT",
    "status": "research-data status",
    "stop": "research-data stop",
    "doctor": "research-data doctor",
    "install-agent": "research-data install-agent --catalog CATALOG_FOLDER",
    "configure": "research-data configure --browser BROWSER_EXECUTABLE",
    "demo": "research-data demo --root demo-catalog",
    "help": "research-data help run --json",
    "guide": "research-data guide generate",
    "run": "research-data run --title TITLE --repo SOURCE_ROOT --source SCRIPT -- python SCRIPT",
    "proof": "research-data proof list --run-id RUN_ID",
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
    "data": ["init", "start", "run", "register", "import", "finish", "article", "submit", "validation"],
    "search": ["search", "show", "check", "rebuild"],
    "review": ["review", "proof"],
    "plot": ["plot", "profile", "themes", "project"],
    "maintenance": ["doctor", "configure", "demo", "install-agent"],
    "agent": ["help", "guide", "install-agent"],
}

_WORKFLOWS = {
    "article": {
        "purpose": "Every formally submitted dataset requires a structured article explaining the data, mathematics and illustrations.",
        "steps": ["article", "submit", "proof"],
        "decision": "Capture data first, create article template --run-id ID --output article.json, fill recorded facts and limitations, article save --file article.json, article check, then submit ID. Execution finish is capture completion; it does not formally submit a dataset.",
        "example": _EXAMPLES["submit"],
        "notes": ["Required title, summary, methods, results and limitations; every managed data artifact requires its own description and variable/unit/order explanation.", "Provide equations with raw LaTeX and symbol descriptions, or equation_note explaining nonapplicability. Provide same-run PNG/JPEG artifact IDs and captions, or figure_note explaining nonapplicability; do not invent formulas, pictures or missing units.", "Incomplete submit returns an error and retains captured files. Successful submit freezes article/input/source provenance; later edits or metadata/input changes require resubmission.", "article status is metadata-only; article check and submit verify current input bytes. Scientific validation remains a separate evidence-based status.", "The data page has 数据文章 for reading/editing, typography and self-contained HTML. In 文章排版 adopt the submitted article to use formulas and illustrations in a new proof.", "Supported offline display mathematics uses Matplotlib MathText, with UI extras installed; full TeX documents are outside this renderer."],
    },
    "proof": {
        "purpose": "Compose figures in Three Interact, publish versioned journal-style proofs and review exact revisions.",
        "steps": ["open", "proof", "check"],
        "decision": "Open a run, choose 编辑与校样, create a draft from the current plot, edit or add elements, then save a new proof. Agents use proof show --output draft.json, save with --expected-hash, and publish with a matching PNG export. If proof show writes JSON null, no draft exists yet; create the initial draft from the browser run page before CLI editing.",
        "example": "research-data proof list --run-id RUN_ID",
        "notes": ["The editor, component library and host are bundled; no separate Three Interact server is needed.", "Source plot pixels are a panel; add vector labels, shapes, images and 3D viewports without altering scientific values.", "PDF/HTML, editable JSON/assets, input artifact hashes, generating source and editor identity are frozen per revision.", "Comment on an exact --revision and --anchor figure/caption/element:UUID. Use --locator JSON_FILE for text ranges (Unicode code-point start/end and matching exact) or normalized figure points (x/y from 0 to 1).", "In 校样审阅 select text, click a paragraph or figure point, then submit; markers and the thread selector locate existing opinions.", "proof comments --status open|resolved filters whole threads; proof comment-status --comment-id ID --status resolved|open --note TEXT records a reversible status change. Replies inherit the thread location and reopen resolved threads.", "Comments/status use a per-revision sidecar; old missing statuses read as open without rewriting the file. Frozen exports stay unchanged and comments never transfer automatically to a new revision.", "Review comments and editorial changes do not update scientific validation.", "Existing figure drafts and proofs are local; opening the browser does not publish or send them to an agent."],
    },
    "generate": {
        "purpose": "Generate new data with source provenance and managed outputs.",
        "steps": ["doctor", "init", "run", "article", "submit", "check", "validation"],
        "decision": "Use run when an existing command creates files; use the Python Catalog API when generation is embedded in Python.",
        "example": _EXAMPLES["run"],
        "notes": ["Write outputs to RESEARCH_DATA_OUTPUT.", "Before reporting data as submitted, complete the article workflow and return a verified submission revision; finish only records execution.", "A successful process is not scientific validation."],
    },
    "import": {
        "purpose": "Register historical data while preserving uncertainty about its origin.",
        "steps": ["profile", "import", "article", "submit", "check", "validation"],
        "decision": "Use a profile when variable names, units, or coordinates are known; retain unknown source identity when it is not.",
        "example": _EXAMPLES["import"],
        "notes": ["Do not infer physical meaning from shape alone.", "Use --repo/--source only when provenance is supported."],
    },
    "plot": {
        "purpose": "Create a reproducible figure from registered datasets.",
        "steps": ["search", "show", "plot", "check"],
        "decision": "Use a saved recipe for repeated plots and keep input run/artifact IDs with the resulting figure.",
        "example": _EXAMPLES["plot"],
        "notes": ["Preserve acquisition order and declared units.", "Use --recipe project:NAME --project-dir PATH for project-local single or multi-panel structures.", "A line recipe uses a mapping such as {\"kind\":\"line\",\"x\":\"time_s\",\"y\":\"signal\",\"theme\":\"paper\",\"style\":{\"line_width\":2,\"font_size\":14}}; style must be a mapping and theme is a top-level named palette.", "A figure does not establish physical validity."],
    },
    "customize": {
        "purpose": "Reuse project-local data mappings, typography and panel layouts.",
        "steps": ["project", "import", "plot", "check"],
        "decision": "Initialize research-data.project.json in the scientific project; edit profiles and plots, run project check, then select project:NAME from CLI or the browser.",
        "example": _EXAMPLES["project"],
        "notes": ["Commit the project JSON with source code.", "Templates are inert JSON; resolved definitions and exact file/Git identity are frozen with artifacts.", "Browser style edits update the displayed figure and its saved recipe together."],
    },
    "browse": {
        "purpose": "Inspect runs interactively in the local browser UI.",
        "steps": ["open", "status", "stop"],
        "decision": "Use open for a managed background service; use serve for a foreground process controlled with Ctrl+C.",
        "example": _EXAMPLES["open"],
        "notes": ["The default listener is local-only.", "status and stop address only a ResearchData-managed service.",
                  "Open a run card, search its registered file list, and select a file and dependent variable for graph/table views.",
                  "Preview styles and font sizes are editable; apply the preview recipe to the full plot editor or a project template.",
                  "File selection controls displayed data and analysis input hashes; tables preview at most 100 values. Readers load the selected file fully."],
    },
    "agent": {
        "purpose": "Let an agent discover valid commands, flags, workflows, and launcher outputs.",
        "steps": ["help", "guide", "doctor", "install-agent"],
        "decision": "Call help --json for parser-derived options and guide --json for workflow selection before mutating a catalog.",
        "example": _EXAMPLES["agent"],
        "notes": ["Required flags are included in command option metadata.", "Every formal data delivery requires a successful submit receipt. Follow guide article; raw registration or completed execution does not meet this condition.", "Wrapper runs expose RESEARCH_DATA_RUN_ID, RESEARCH_DATA_RUN_DIR, RESEARCH_DATA_OUTPUT, and RESEARCH_DATA_CATALOG."],
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
        "environment": ["RESEARCH_DATA_RUN_ID", "RESEARCH_DATA_RUN_DIR", "RESEARCH_DATA_OUTPUT", "RESEARCH_DATA_CATALOG", "RESEARCH_DATA_PROJECT"],
        "exit_codes": {"0": "success", "1": "integrity check failed", "2": "invalid input or runtime error", "130": "foreground serve interrupted with Ctrl+C"},
        "wrapped_command_exit": "run propagates the wrapped program's exit code; consult execution_status for the recorded outcome",
        "groups": _GROUPS,
        "formal_delivery": {"required_command": "submit", "required_receipt_schema": "research-data.article-submission.v1",
                            "required_fields": ["run_id", "revision_id", "sha256", "article_sha256", "fingerprint"],
                            "capture_is_submission": False},
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
        lines.extend(f"  - {note}" for note in guide.get('notes', []))
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
