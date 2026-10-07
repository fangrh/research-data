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

## Edit and freeze a proof

When a user asks to turn a registered data figure into an editable article proof,
discover the exact contract first:

```text
research-data help proof --json
research-data guide proof --json
```

Use the run detail page's “工作区 编辑与校样” → “从当前数据图创建草稿”.
Submit structured datasets and recipes, retaining Plotly figure JSON for custom
plots. The bundled editor imports curves, individual markers, axes/ticks,
legend text and heatmap cells as independently selectable native elements.
Each element retains its plot role and source identity; editing its presentation
does not alter original data values or recipes. A PNG/JPEG alone remains an image;
never claim its internal curves or points are editable. Existing image drafts
have an explicit upgrade from verified frozen inputs/recipe. Unsupported SVG
features, smoothing and scenes above 10,000 elements reject conversion atomically;
split panels or explicitly reduce data, never silently flatten or truncate.
Fill the article
content and choose `single` or `double`, then save and generate a proof with the
PNG rendered for that exact scene event.

For a full draft editing route, use `proof show --output draft.json`, edit the
JSON without executing scene code, and `proof save --expected-hash HASH`.
Publish with `proof publish --figure matching.png`; use an exact revision and
`--anchor caption`, `--anchor figure`, or `--anchor element:UUID` for comments.
Replies use `--reply-to` in the same revision. The local proof creates a new
analysis run with source and input hashes; it does not publish data remotely.
See [the bundled proof guide](references/proofs.md) for the complete route and
parser-derived command examples. This relative link remains valid after skill
installation.

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

## Write and formally submit a data article

`run` and `finish` retain execution output and status; they are not formal submission. For a completed or imported run:

```text
research-data article template --run-id RUN_ID --output article.json
# edit UTF-8 article.json
research-data article save --run-id RUN_ID --file article.json
research-data article check --run-id RUN_ID
research-data submit RUN_ID --article article.json
```

Submission requires non-empty title, summary, methods, results and limitations, every managed data artifact with its description and variable/unit/order explanation, and either described raw MathText equations or `equation_note` explaining nonapplicability. Provide managed PNG/JPEG figures with captions or `figure_note`. Do not invent units, results, equations or figures. Use the supported offline limited MathText subset without `$` delimiters; do not execute TeX or depend on a CDN. See [Matplotlib MathText](https://matplotlib.org/stable/users/explain/text/mathtext.html) and [MathText API](https://matplotlib.org/stable/api/mathtext_api.html).

Formal agent delivery must include a successful receipt with `run_id` and `revision_id`; a draft or successful `finish` is insufficient. Draft or managed-input changes make a submission stale and require resubmission. The article reader supports font/size and single/double layout. Adopting an article into proof creates a new proof with frozen math/images and retains existing proof comments and revisions. These instructions are not OS enforcement.

## Import and plot

Historical data uses `import`, with source identity unknown unless actual provenance is supplied. Use a reusable import profile for column/axis names, units and HDF5 coordinate mappings; do not infer physical meaning from shape alone.

Use `plot` with registered run IDs and a saved recipe. The browser is `browse`; it provides classification, details, source inspection and plot controls. Styles change appearance only. Preserve acquisition order, especially hysteresis scans; any slicing or complex-component selection belongs in the recipe. Generated figures must retain input artifact hashes, recipe and rendering/source version. Verify artifact integrity before replay.

Keep execution status separate from scientific validation. Mark validation passed only with explicit evidence. Software tests and successful process exits do not establish convergence or physical support.

## Organize related runs with collections

Use collections for explicit, reference-only many-to-many organization:

```text
research-data help collection --json
research-data guide collection --json
research-data collection create --title TITLE --description DESCRIPTION --run RUN_ID_1 --run RUN_ID_2
research-data collection add --id COLLECTION_ID --run-id RUN_ID --role ROLE --note NOTE --expected-hash HASH
```

A collection preserves each run's source/Git provenance, article and proof;
it does not infer scientific causation or automatically group runs. Keep
roles and notes explicit. Missing or historical members remain visible. Use
`collection archive`/`restore`, `collection reorder` with the exact complete
permutation, and `--expected-hash` for concurrent edit protection. The Web
catalog exposes a 合集 entry and each run's 所属合集 memberships. See
`docs/COLLECTIONS.md` for all operations and JSON output.

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
