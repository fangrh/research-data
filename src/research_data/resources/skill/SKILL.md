---
name: research-data
description: Generate, import, inspect or plot scientific computation and experiment datasets with searchable descriptions, exact source provenance and reusable plot recipes. Use before a task writes scientific data or figures, including Julia and QCoDeS workflows.
---

# Research Data

Use the installed Research Data package as the default registration layer when producing scientific data or figures. Keep the user's scientific model, solver and original files intact.

The launcher is `python <this-skill>/scripts/research_data.py`. It selects the installed package runtime and shared catalog. Pass `--root PATH` when the user selects another catalog. Run `doctor` and `--help` to verify availability; missing software is a setup prerequisite, not permission to silently create an unregistered parallel data store.

## Discover before choosing a command

Use the installed parser and workflow map first:

```text
research-data help --json
research-data guide --json
research-data guide generate --json
```

The catalog reports actual flags and required arguments, so agents should not
invent command options. Human users can omit `--json`; `research-data open`
starts the managed local browser service, while `serve` remains the foreground
option and `browse` remains a compatibility alias. See [workflow guidance](references/workflow.md).

## Project-local data and plot structures

Before inventing another data/plot wrapper, inspect the scientific project's
research-data.project.json. Use project init/show/check and guide customize
--json. Profiles declare names, units and dimensions; plots declare styles and
single/multiple panels. Use --profile project:NAME or --recipe project:NAME with
--project-dir SOURCE_ROOT. Commit the project JSON alongside the source code.
Resolved templates freeze their exact file content, hash and Git identity.
Keep the template version distinct from the input data's generating source.
The browser supports live font/style editing and saving project templates.
See [project templates](references/project-templates.md).

## Generate data

Start the record before executing code so the commit, branch, source bytes and parameters describe the run that produces the data. The command wrapper works with Julia, Python and other existing computational stacks:

```text
research-data run --title TITLE --project PROJECT --description PURPOSE --repo SOURCE_ROOT --entrypoint SCRIPT --source SOURCE_DIRECTORY --parameter temperature_K=2 --category domain=transport --tag sweep -- COMMAND ARGUMENTS
```

The process receives `RESEARCH_DATA_OUTPUT`, `RESEARCH_DATA_RUN_ID` and `RESEARCH_DATA_CATALOG`. Write outputs to `RESEARCH_DATA_OUTPUT`; the wrapper registers those files and retains logs and failures. Declare all local source/configuration paths the run needs. Default snapshot coverage is repository source files, not every external dependency. Record package environment and scientific configuration too.

For Python integration use `Catalog(root).run(...)` and `run.add_artifact(...)`; see [the integration reference](references/integration.md) for the exact API. Give meaningful descriptions, stable project/sample identities, variable meanings, units, coordinates, physical/numerical parameters and classifications. Unknown facts stay unknown. Link an existing Backlog task with task_id; the data catalog does not replace task management.

## Import and plot

Historical data uses `import`, with source identity unknown unless actual provenance is supplied. Use a reusable import profile for column/axis names, units and HDF5 coordinate mappings; do not infer physical meaning from shape alone.

Use `plot` with registered run IDs and a saved recipe. The browser is `browse`; it provides classification, details, source inspection and plot controls. Styles change appearance only. Preserve acquisition order, especially hysteresis scans; any slicing or complex-component selection belongs in the recipe. Generated figures must retain input artifact hashes, recipe and rendering/source version. Verify artifact integrity before replay.

Keep execution status separate from scientific validation. Mark validation passed only with explicit evidence. Software tests and successful process exits do not establish convergence or physical support.

Return the run IDs, catalog location and figure/data links. `check` verifies recorded bytes; `rebuild` reconstructs the SQLite index from manifests. Do not migrate, delete or publish unrelated existing datasets without the user's scope.

## Registration interview fields

When registering data on behalf of a user, follow the canonical field checklist in
`docs/REGISTRATION_FIELDS.md` (title/project channel, kind, categories including
generator "UP", site/backend/language/accelerator facets, compute command, file
counts). Ask per field with existing facet values as choices; embedded file fields
(exact_command, gpu_name, backend) take precedence verbatim. Historical imports
keep provenance unknown; generated runs capture provenance via the run wrapper.

## Cover is a required thinking step

Before finishing registration, generate a model-schematic cover with
`research_data.schematics.draw_archetype(...)` (choose honeycomb / flake /
magnetic_cell / landau / chain / kernel / spectrum from what the data
physically is) and register it with `role="cover"`, or place a shared
`catalog/covers/<project>.png`. Auto sparklines and parameter fingerprints
are fallbacks only, never the agent's delivered cover. See
docs/REGISTRATION_FIELDS.md.

## Review dispatch (user comments -> your evaluation -> actions)

Users click 派 agent 评价 on a run page; the request lands in
`reviews/pending/`. Claim it with `research-data review list` /
`review show --request-id ID`, READ the run and its data, then post your
evaluation with `review complete --request-id ID --reply-file reply.md
[--validation partial|failed|passed --validation-notes ...]`. Your reply
appears in the comment thread as author `AI agent`; a validation status,
when justified by the user's comments and your check, records the
follow-up. `passed` requires evidence.
