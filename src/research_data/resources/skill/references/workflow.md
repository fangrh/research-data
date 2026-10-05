# Workflow and command discovery

Start with discovery so the command and option contract comes from the installed
parser:

```text
research-data help --json
research-data guide --json
```

Choose `generate`, `import`, `plot`, `browse`, or `agent` with
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
