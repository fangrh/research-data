"""Machine-readable CLI shared by human users, scripts and coding agents."""

from __future__ import annotations

import argparse
import importlib.metadata
import json
import os
import subprocess
import sys
from pathlib import Path


def _emit(value):
    print(json.dumps(value, ensure_ascii=False, indent=2, default=str))


def _json(value, default=None):
    if value is None:
        return default
    if value.lstrip().startswith(("{", "[")):
        return json.loads(value)
    path = Path(value)
    text = path.read_text(encoding="utf-8-sig") if path.is_file() else value
    return json.loads(text)


def _pairs(values):
    output = {}
    for item in values or []:
        if "=" not in item:
            raise ValueError(f"Expected NAME=VALUE, got {item!r}")
        key, value = item.split("=", 1)
        try:
            value = json.loads(value)
        except json.JSONDecodeError:
            pass
        output[key] = value
    return output


def _run_options(parser):
    parser.add_argument("--title", required=True)
    parser.add_argument("--project", default="default")
    parser.add_argument("--kind", choices=["simulation", "experiment", "analysis"], default="simulation")
    parser.add_argument("--sample")
    parser.add_argument("--description", default="")
    parser.add_argument("--tag", action="append", default=[])
    parser.add_argument("--category", action="append", default=[], help="Classification NAME=VALUE")
    parser.add_argument("--parameter", action="append", default=[], help="Parameter NAME=JSON_OR_TEXT")
    parser.add_argument("--parameters", help="JSON object or JSON file")
    parser.add_argument("--parent", action="append", default=[])
    parser.add_argument("--task-id")
    parser.add_argument("--repo", help="Source root; defaults to cwd for generated runs")
    parser.add_argument("--entrypoint")
    parser.add_argument("--source", action="append", help="Declared source file/directory, relative to source root")


def parser():
    from . import __version__
    p = argparse.ArgumentParser(prog="research-data", description="Local scientific data browser, exact source provenance and reusable plotting",
                                epilog="Quick start: research-data open | research-data help | research-data guide agent | research-data help run")
    p.add_argument("--version", action="version", version=__version__)
    from .agent import default_catalog
    p.add_argument("--root", default=default_catalog(), help="Catalog folder (or RESEARCH_DATA_CATALOG / installed default)")
    subs = p.add_subparsers(dest="action")
    def command(name, help):
        child = subs.add_parser(name, help=help, description=help)
        child.add_argument("--root", default=argparse.SUPPRESS, help="Catalog folder; overrides the shared default")
        return child
    help_command = command("help", "Discover commands, their options and examples")
    help_command.add_argument("topic", nargs="?", help="Command name; omit for grouped command overview")
    help_command.add_argument("--json", action="store_true", help="Machine-readable command and option catalog")
    guide = command("guide", "Choose a workflow: browse, generate, import, plot or agent")
    guide.add_argument("topic", nargs="?", help="Workflow name; omit to list workflows")
    guide.add_argument("--json", action="store_true", help="Machine-readable workflow steps and selection rules")
    opener = command("open", "Start or reuse a managed local Web service and open your browser")
    opener.add_argument("--port", type=int, default=8765, help="Preferred port; automatically chooses a nearby free port")
    opener.add_argument("--no-open", action="store_true", help="Start the service without opening a browser")
    opener.add_argument("--timeout", type=float, default=45, help="Startup readiness timeout in seconds")
    opener.add_argument("--project-dir", help="Select this project's templates in the opened browser")
    command("status", "Show the managed service for the selected catalog (JSON)")
    command("stop", "Stop only this catalog's managed service; retain all data")
    command("init", "Create a catalog without modifying source data")
    start = command("start", "Capture source and begin a run before data generation")
    _run_options(start)
    run = command("run", "Wrap any Python/Julia/other command and register generated outputs")
    _run_options(run)
    run.add_argument("--profile", help="Import mapping JSON, file, or saved profile name for generated data")
    run.add_argument("--project-dir", help="Directory containing research-data.project.json for project:NAME profiles")
    run.add_argument("command", nargs=argparse.REMAINDER, help="Command after --; write outputs into RESEARCH_DATA_OUTPUT")
    register = command("register", "Copy and describe a file under an existing run")
    register.add_argument("run_id")
    register.add_argument("path")
    register.add_argument("--role", default="raw")
    register.add_argument("--description", default="")
    register.add_argument("--profile", help="Import mapping as JSON or JSON file")
    register.add_argument("--project-dir", help="Directory for a project:NAME import profile")
    register.add_argument("--metadata", help="Additional artifact metadata as JSON or file")
    imp = command("import", "Register historical data with explicitly unknown source identity")
    _run_options(imp)
    imp.add_argument("path")
    imp.add_argument("--profile")
    imp.add_argument("--project-dir", help="Directory for a project:NAME import profile")
    finish = command("finish", "Record execution outcome independently of scientific validation")
    finish.add_argument("run_id")
    finish.add_argument("--status", choices=["completed", "failed", "imported"], default="completed")
    finish.add_argument("--error")
    review = command("review", "Agent review dispatch: list/show pending user-review requests and complete them")
    review.add_argument("operation", choices=["list", "show", "complete"], nargs="?", default="list")
    review.add_argument("--request-id", help="Review request id (see review list)")
    review.add_argument("--reply", default="", help="Agent evaluation text for complete")
    review.add_argument("--reply-file", help="Read the evaluation reply from a file")
    review.add_argument("--validation", choices=["not_checked", "partial", "passed", "failed"], help="Optional validation status to record with the review")
    review.add_argument("--validation-notes", default="", help="Notes stored with the validation update")
    search = command("search", "Search descriptions, metadata and structured classifications")
    search.add_argument("query", nargs="?", default="")
    search.add_argument("--filter", action="append", default=[])
    show = command("show", "Read a full data card")
    show.add_argument("run_id")
    check = command("check", "Check original managed bytes and captured source integrity")
    check.add_argument("run_id", nargs="?")
    command("rebuild", "Rebuild SQLite from durable manifests")
    validate = command("validation", "Attach a declared validation status and evidence")
    validate.add_argument("run_id")
    validate.add_argument("status", choices=["not_checked", "partial", "passed", "failed"])
    validate.add_argument("--evidence", action="append", default=[])
    validate.add_argument("--notes", default="")
    plot = command("plot", "Apply a reusable recipe to one or multiple registered datasets")
    plot.add_argument("run_ids", nargs="+")
    plot.add_argument("--recipe", required=True, help="Saved recipe, JSON/file, or project:NAME template")
    plot.add_argument("--project-dir", help="Directory for a project:NAME plotting template")
    plot.add_argument("--artifact", action="append", help="Artifact ID for each selected run")
    plot.add_argument("--output", default="figure.html")
    plot.add_argument("--title")
    profile = command("profile", "Save a reusable import mapping")
    profile.add_argument("name")
    profile.add_argument("json", help="Mapping JSON or JSON file")
    command("themes", "List selectable plot styles")
    project = command("project", "Initialize, inspect, validate or save Git-trackable project templates")
    project.add_argument("operation", choices=["init", "show", "check", "save-plot"], nargs="?", default="show")
    project.add_argument("--project-dir", help="Project directory (default: RESEARCH_DATA_PROJECT or cwd)")
    project.add_argument("--name", help="Plot template name for save-plot")
    project.add_argument("--recipe", help="Plot recipe JSON or file for save-plot")
    project.add_argument("--overwrite", action="store_true", help="Explicitly replace an existing plot template")
    for name in ("serve", "browse"):
        service = command(name, "Run the local Web service in this terminal (Ctrl+C to stop)" + ("; legacy alias of serve" if name == "browse" else ""))
        service.add_argument("--port", type=int, default=8765, help="Exact localhost port")
        service.add_argument("--no-open", action="store_true", help="Do not open a browser")
    demo = command("demo", "Generate a labeled cross-format demonstration catalog")
    demo.add_argument("--with-qcodes", action="store_true")
    command("doctor", "Inspect installed optional dependencies and runtime")
    agent = command("install-agent", "Install the automatically discoverable data-generation skill")
    agent.add_argument("--target", help="Skills parent folder; defaults to Codex user skills")
    agent.add_argument("--catalog", help="Shared default catalog for future runs and agents")
    configure = command("configure", "Configure an optional static-export browser")
    configure.add_argument("--browser", help="Path to a working Chrome/Chromium executable")
    return p


def _options(args, imported=False):
    parameters = _json(args.parameters, {})
    if not isinstance(parameters, dict):
        raise ValueError("parameters must be a JSON object")
    parameters.update(_pairs(args.parameter))
    return dict(title=args.title, project=args.project, kind=args.kind, sample=args.sample, description=args.description,
                parameters=parameters, tags=args.tag, categories=_pairs(args.category), parent_run_ids=args.parent,
                task_id=args.task_id, repo=args.repo if imported else (args.repo or str(Path.cwd())),
                entrypoint=args.entrypoint, source_paths=args.source)


def _profile(cat, value, project_dir=None):
    if value is None:
        return None
    if value.startswith("project:"):
        from .project import resolve_project
        return resolve_project(value, project_dir, "profiles")
    return _json(value) if value.lstrip().startswith("{") or Path(value).is_file() else cat.load_recipe("import-" + value)


def _wrap(cat, args):
    command = args.command
    if command and command[0] == "--":
        command = command[1:]
    if not command:
        raise ValueError("run requires an executable command after --")
    options = _options(args)
    options["command"] = command
    # Freeze the import mapping before running the producer, not after it exits.
    profile = _profile(cat, args.profile, args.project_dir)
    if profile:
        options["parameters"]["import_profile"] = profile
    run = cat.start_run(**options)
    output_dir = run.path / "output"
    output_dir.mkdir()
    env = dict(os.environ, RESEARCH_DATA_RUN_ID=run.run_id, RESEARCH_DATA_RUN_DIR=str(run.path),
               RESEARCH_DATA_OUTPUT=str(output_dir), RESEARCH_DATA_CATALOG=str(Path(args.root).resolve()))
    try:
        with (run.path / "stdout.log").open("wb") as stdout, (run.path / "stderr.log").open("wb") as stderr:
            process = subprocess.run(command, env=env, stdout=stdout, stderr=stderr)
        for path in sorted(output_dir.rglob("*")):
            if path.is_file():
                run.add_artifact(path, profile=profile, description="Generated output; variable meanings/units follow the declared import profile.")
        for name in ("stdout.log", "stderr.log"):
            run.add_artifact(run.path / name, role="log", description=name)
        run.finish("completed" if process.returncode == 0 else "failed", error=None if process.returncode == 0 else f"Command exited with {process.returncode}")
        _emit(cat.get(run.run_id))
        return process.returncode
    except Exception as exc:
        run.finish("failed", error=f"{type(exc).__name__}: {exc}")
        raise


def _plot(cat, args):
    from . import __version__
    from .plotting import export_plot, render_plot
    if args.recipe.startswith("project:"):
        from .project import resolve_project
        recipe = resolve_project(args.recipe, args.project_dir, "plots")
    else:
        recipe = _json(args.recipe) if args.recipe.lstrip().startswith("{") or Path(args.recipe).is_file() else cat.load_recipe(args.recipe)
    datasets, labels, inputs = [], [], []
    if args.artifact and len(args.artifact) != len(args.run_ids):
        raise ValueError("Provide one --artifact ID per selected run")
    for index, run_id in enumerate(args.run_ids):
        manifest = cat.get(run_id)
        artifact = cat.select_artifact(run_id, args.artifact[index] if args.artifact else None)
        datasets.append(cat.load_dataset(run_id, artifact["artifact_id"]))
        labels.append(manifest["title"])
        inputs.append({"run_id": run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]})
    destination = Path(args.output).resolve()
    if destination.exists():
        raise ValueError(f"Output already exists: {destination}; choose a new output filename")
    analysis = cat.start_run(title=args.title or recipe.get("title") or "Figure", project=cat.get(args.run_ids[0])["project"], kind="analysis",
                             description="Reusable plot generated from registered input datasets.", parent_run_ids=args.run_ids,
                             repo=str(Path(__file__).resolve().parent), entrypoint="plotting.py", source_paths=["plotting.py", "cli.py", "project.py"],
                             parameters={"plot_recipe": recipe, "inputs": inputs, "research_data_version": __version__, "plotly_version": importlib.metadata.version("plotly")})
    try:
        figure = render_plot(datasets, recipe, labels=labels)
        export_plot(figure, destination)
        analysis.add_artifact(destination, role="figure", description="Rendered figure", metadata={"recipe": recipe, "inputs": inputs})
        recipe_path = analysis.path / "plot_recipe.json"
        recipe_path.write_text(json.dumps(recipe, ensure_ascii=False, indent=2), encoding="utf-8")
        analysis.add_artifact(recipe_path, role="recipe", description="Exact plot configuration")
        analysis.finish()
    except Exception as exc:
        analysis.finish("failed", error=str(exc))
        raise
    _emit({"figure": str(destination), "analysis_run_id": analysis.run_id})


def main(argv=None):
    command_parser = parser()
    args = command_parser.parse_args(argv)
    try:
        if args.action in (None, "help", "guide"):
            from .help import command_catalog, render_help, workflow_guide
            topic = getattr(args, "topic", None)
            machine = getattr(args, "json", False)
            if args.action == "guide":
                result = workflow_guide(topic, machine=machine)
            else:
                result = command_catalog(command_parser, topic) if machine else render_help(command_parser, topic)
            _emit(result) if machine else print(result)
            return 0
        if args.action in ("open", "status", "stop", "serve", "browse"):
            from . import server
            if args.action in ("serve", "browse"):
                return server.serve(args.root, args.port, args.no_open)
            if args.action == "open":
                result = server.open_catalog(args.root, args.port, args.no_open or bool(args.project_dir), args.timeout)
                if args.project_dir:
                    from urllib.parse import urlencode
                    import webbrowser
                    result["url"] += "?" + urlencode({"project_dir": str(Path(args.project_dir).expanduser().resolve())})
                    result["browser_opened"] = bool(webbrowser.open(result["url"])) if not args.no_open else False
                _emit(result)
            elif args.action == "status":
                _emit(server.status(args.root))
            else:
                _emit(server.stop(args.root))
            return 0
        if args.action == "doctor":
            from .provenance import environment_info
            _emit(environment_info())
            return 0
        if args.action == "install-agent":
            from .agent import install_agent
            _emit(install_agent(args.target, args.catalog))
            return 0
        if args.action == "configure":
            from .agent import configure
            _emit(configure(args.browser))
            return 0
        if args.action == "project":
            from .project import ProjectTemplates
            directory = args.project_dir or os.environ.get("RESEARCH_DATA_PROJECT") or Path.cwd()
            if args.operation == "init":
                _emit({"project_file": str(ProjectTemplates.initialize(directory))})
                return 0
            templates = ProjectTemplates(directory)
            if args.operation in ("check", "save-plot"):
                from .plotting import validate_recipe
                if args.operation == "check":
                    for recipe in templates.config.get("plots", {}).values():
                        validate_recipe(recipe)
                else:
                    if not args.name or not args.recipe:
                        raise ValueError("project save-plot requires --name and --recipe")
                    recipe = _json(args.recipe)
                    validate_recipe(recipe)
                    templates.save_plot(args.name, recipe, overwrite=args.overwrite)
            _emit({"ok": True, **templates.summary(), "configuration": templates.config})
            return 0
        from .catalog import Catalog
        cat = Catalog(args.root)
        if args.action == "init":
            _emit({"root": str(Path(args.root).resolve()), "status": "ready"})
        elif args.action == "start":
            _emit(cat.start_run(**_options(args)).manifest)
        elif args.action == "run":
            return _wrap(cat, args)
        elif args.action == "register":
            profile = _profile(cat, args.profile, args.project_dir)
            _emit(cat.register_artifact(args.run_id, args.path, role=args.role, description=args.description, profile=profile, metadata=_json(args.metadata, {})))
        elif args.action == "import":
            run = cat.start_run(**_options(args, imported=True))
            try:
                run.add_artifact(args.path, description=args.description, profile=_profile(cat, args.profile, args.project_dir))
                run.finish("imported")
            except Exception as exc:
                run.finish("failed", error=str(exc))
                raise
            _emit(run.manifest)
        elif args.action == "finish":
            _emit(cat.finish_run(args.run_id, status=args.status, error=args.error))
        elif args.action == "review":
            from . import review as review_api
            if args.operation == "list":
                _emit(review_api.list_pending(args.root))
            elif args.operation == "show":
                if not args.request_id:
                    raise ValueError("--request-id is required for review show")
                matches = [r for r in review_api.list_pending(args.root) if r["request_id"] == args.request_id]
                if not matches:
                    raise FileNotFoundError(args.request_id)
                _emit(matches[0])
            else:
                if not args.request_id:
                    raise ValueError("--request-id is required for review complete")
                reply = args.reply
                if args.reply_file:
                    reply = Path(args.reply_file).read_text(encoding="utf-8")
                _emit(review_api.complete_review(args.root, args.request_id, reply,
                                                  validation=args.validation,
                                                  validation_notes=args.validation_notes))
        elif args.action == "search":
            _emit(cat.list_runs(args.query, filters=_pairs(args.filter)))
        elif args.action == "show":
            _emit(cat.get(args.run_id))
        elif args.action == "check":
            from .provenance import inspect_snapshot
            result = cat.check(args.run_id)
            runs = [cat.get(args.run_id)] if args.run_id else cat.list_runs()
            result["source_checks"] = {r["run_id"]: inspect_snapshot(r["provenance"], Path(args.root) / "runs" / r["run_id"]) for r in runs}
            result["ok"] = result.get("ok", not result.get("errors")) and all(v["ok"] for v in result["source_checks"].values())
            _emit(result)
            return 0 if result["ok"] else 1
        elif args.action == "rebuild":
            _emit({"indexed_runs": cat.rebuild_index()})
        elif args.action == "validation":
            if args.status == "passed" and not args.evidence:
                raise ValueError("passed validation requires explicit evidence; process completion is not scientific validation")
            _emit(cat.set_validation(args.run_id, args.status, evidence=args.evidence, notes=args.notes))
        elif args.action == "profile":
            _emit({"profile": str(cat.save_recipe("import-" + args.name, _json(args.json)))})
        elif args.action == "plot":
            _plot(cat, args)
        elif args.action == "themes":
            from .plotting import THEMES
            _emit(THEMES)
        elif args.action == "demo":
            from .demo import build_demo
            _emit(build_demo(cat, with_qcodes=args.with_qcodes))
        return 0
    except (ValueError, TypeError, IndexError, OSError, KeyError, ImportError, RuntimeError) as exc:
        print(json.dumps({"error": str(exc), "type": type(exc).__name__}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
