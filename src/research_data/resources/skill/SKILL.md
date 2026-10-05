---
name: research-data
description: Generate, import, inspect or plot scientific computation and experiment datasets with searchable descriptions, exact source provenance and reusable plot recipes. Use before a task writes scientific data or figures, including Julia and QCoDeS workflows.
---

# Research Data

Use the installed Research Data package as the default registration layer when producing scientific data or figures. Keep the user's scientific model, solver and original files intact.

The launcher is `python <this-skill>/scripts/research_data.py`. It selects the installed package runtime and shared catalog. Pass `--root PATH` when the user selects another catalog. Run `doctor` and `--help` to verify availability; missing software is a setup prerequisite, not permission to silently create an unregistered parallel data store.

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
