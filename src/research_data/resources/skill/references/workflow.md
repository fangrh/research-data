# Workflow and command discovery

Start with discovery so the command and option contract comes from the installed
parser:

```text
research-data help --json
research-data guide --json
```

Choose `generate`, `import`, `plot`, `proof`, `browse`, or `agent` with
`research-data guide WORKFLOW --json`. `generate` uses `run` and the existing
program's output directory; `import` keeps historical provenance unknown until
there is evidence; `plot` reuses registered run IDs and recipes; `browse` uses
`open`/`status`/`stop` for a managed local service or `serve` for a foreground
session.

The JSON catalog includes actual subcommands, flags, required arguments,
defaults, choices, workflow steps, exit codes, and wrapper variables. The
wrapper exports `RESEARCH_DATA_RUN_ID`, `RESEARCH_DATA_RUN_DIR`,
`RESEARCH_DATA_OUTPUT`, and `RESEARCH_DATA_CATALOG`.

Discovery does not replace scientific provenance. Record source root, entrypoint,
declared source paths, parameters, units, and known limitations before
generation. Keep execution status separate from scientific validation and attach
explicit evidence before claiming validation passed.

## Proof route

Use the proof route when a registered run needs an editable figure and a frozen
article 校样. Run `research-data help proof --json` and `research-data guide proof
--json` before relying on flags. In the detail page choose “工作区 编辑与校样”
and create a draft from the current plot. Configure data-axis typography and
panel layout before seeding; the bundled Three Interact editor adds editable
vector content and components over the plot pixels without changing data values.
Fill article content and choose single or double layout, then save and generate
the proof with the PNG matching that scene event. The UI uses the bundled editor,
Plotly import and ReportLab package; no VS Code, Node server, or separate editor
service is needed at runtime.

Agents can inspect and edit the full draft with:

```text
research-data proof show --run-id RUN_ID --output draft.json
research-data proof save --run-id RUN_ID --draft draft.json --expected-hash HASH
research-data proof publish --run-id RUN_ID --draft draft.json --figure matching.png
research-data proof list --run-id RUN_ID
research-data proof comments --run-id RUN_ID --revision REVISION_ID
research-data proof check --run-id RUN_ID --revision REVISION_ID
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor element:UUID --text TEXT
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor caption --text REPLY --reply-to COMMENT_ID
```

Published HTML/PDF, scene/assets, vendor metadata, input hashes and source
provenance are local immutable revision artifacts. Comments and replies are
separate local review records; they do not change scientific validation or
dispatch messages to an agent.
