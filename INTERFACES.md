# Shared implementation contract

## Project templates and presentation (v0.2)

`ProjectTemplates(directory)` reads inert research-data.project.json (schema
research-data.project.v1). `.profile(name)` / `.recipe(name)` return detached
definitions with exact file text/hash/Git identity. `.save_plot(name, recipe,
overwrite=False)` validates and preserves existing definitions by default;
`initialize(directory)` refuses overwrite. `project:NAME` references work from
run/import/register/plot with --project-dir, and the browser uses the same file.
`validate_recipe(recipe)` checks structure without claiming data compatibility.
Plot recipes add `style`, safe `layout`, and `kind=panels` with independent
ordinary panels, columns1..4, at most12 panels and per-panel dataset_indices.
Live UI styling updates the displayed recipe and invalidates stale exports.
See docs/PROJECT_TEMPLATES.md for the supported keys and replay boundary.

This is the approved product scope and the controller/worker interface contract.
Python handles storage, adapters and visualization; scientific numerical solvers remain in their original stack.

## Storage and catalog

`Catalog(root)` owns `catalog.sqlite3`, `runs/<run_id>/manifest.json`, run-managed artifact copies, recipes, source snapshots and human-readable `README.md` data cards. Manifests are durable source records; the SQLite index is rebuildable. Originals must remain untouched. Unknown historical Git identity stays unknown.

Manifest: schema_version, run_id, title, description, project, sample, kind (simulation/experiment/analysis), created_at, updated_at, execution_status (running/completed/failed/imported), validation {status:not_checked/partial/passed/failed, evidence, notes}, parameters, tags, categories, task_id, parent_run_ids, provenance, artifacts.

Artifacts: artifact_id, path (relative to run directory), original_name, role, description, sha256, size_bytes, format, variables, profile, metadata. Artifact paths are managed within their run. Readers reject traversal or changed checksum before claiming a reproducible plot.

Methods:
- `start_run(title, project='default', kind='simulation', sample=None, description='', parameters=None, tags=None, categories=None, repo=None, entrypoint=None, command=None, source_paths=None, parent_run_ids=None, task_id=None) -> Run`.
- `run(**kwargs) -> Run` context manager, captures provenance before data generation; exceptions persist failed execution and re-raise.
- `get(run_id) -> dict`, `list_runs(query='', filters=None) -> list[dict]`, `rebuild_index() -> int`, `check(run_id=None) -> dict`.
- `register_artifact(run_id, path, role='raw', description='', variables=None, profile=None, copy=True, metadata=None) -> dict`.
- `finish_run(run_id, status='completed', error=None) -> dict`; `set_validation(run_id, status, evidence=None, notes='') -> dict`.
- `load_dataset(run_id, artifact_id=None, profile=None) -> xarray.Dataset`.
- `save_recipe(name, recipe) -> Path`, `load_recipe(name) -> dict`, `list_recipes() -> list[str]` (safe names).
- `Run`: `.run_id`, `.path`, `.manifest`; `.add_artifact(path, **kwargs)`, `.finish(status='completed', error=None)`; supports context entry/exit.

Core imports `capture_provenance(repo, run_dir, entrypoint=None, command=None, source_paths=None)` from controller-owned provenance.py. If repo is omitted, provenance is explicitly unknown (existing imports); CLI or API caller passes repo for generated data. `source_paths` chooses declared files/directories; default captures repository source files. Coverage and omitted files must be explicit. Source archives are read as inert bytes, never executed by browsing.

## Format adapters

`inspect_file(path, profile=None) -> dict` returns format, variables (name, dims, shape, dtype, unit, description), summary and any warnings.
`load_file(path, profile=None) -> xarray.Dataset` normalizes CSV, TSV, columnar/record JSON, HDF5, NetCDF, Parquet, and real QCoDeS .db.
Profile fields: `format`, `x`, `rename`, `units`, `descriptions`, `coordinates` (variable -> coordinate list), `qcodes_guid`/`qcodes_run_id`, `variables` (optional selected variable names), plus documented reader-specific selection. HDF5 and JSON can require explicit mappings when self-description is absent. Preserve acquisition order and complex values; never guess units or implicitly sort/regrid/normalize.

## Plotting and UI

`THEMES` mapping with >=8 named styles and display descriptions.
`render_plot(datasets: list[xarray.Dataset], recipe: dict, labels=None) -> plotly.graph_objects.Figure`.
Recipe: kind (line/scatter/heatmap/complex/compare), x, y (str or list), z (heatmap), component (real/imag/abs/phase), slices (dim -> integer index), theme, title, x_label, y_label, width, height, optional log_x/log_y. Plot transforms are explicit and stored. Styles never change numerical data. Missing required axes, dimensionality, incompatible units and nonpositive log data produce useful errors. Preserve acquisition order.
`export_plot(fig, path) -> Path`: HTML plus PNG/SVG/PDF using Kaleido, with clear dependency errors. Controller CLI registers outputs and exact data hashes/recipe/rendering version as figure lineage.
`app.py` runs via Streamlit with root argument after `--`: browse/classify/search, data card and variable preview, inert source viewing, multi-data plot selection, templates/themes, recipe save/load and figure export/registration. Theme choice must survive Streamlit chart defaults (`theme=None`). Controller validates real browser behavior.

## Acceptance

Behavioral fixture checks cover lifecycle/failure, immutable inputs, exact Git identity and dirty/untracked source, adapter numerical values/dimensions/units, portable rebuild, mixed-format plot values, recipe replay, classification filters, styles, figure lineage, wheel installation and actual browser actions. Product evidence is software validation, never physical validation. A realistic fresh-agent invocation must generate and register data using the installed skill.
