# ResearchData 0.5.0 CLI usage review

Date: 2026-10-06 (Windows 11, PowerShell)

Scope: bounded software-only synthetic fixture. No physical interpretation was attempted. The catalog and all generated files are isolated under `.artifacts/agent-cli-usage-20261006/`.

## Discovery and environment

Commands used:

```powershell
& '.venv\Scripts\python.exe' -m research_data --help
& '.venv\Scripts\python.exe' -m research_data --version
& '.venv\Scripts\python.exe' -m research_data help --json
& '.venv\Scripts\python.exe' -m research_data guide --json
& '.venv\Scripts\python.exe' -m research_data guide generate --json
& '.venv\Scripts\python.exe' -m research_data help proof --json
& '.venv\Scripts\python.exe' -m research_data guide proof --json
```

The CLI reports `0.5.0` and exposes the expected `run`, `import`, `show`, `check`, `plot`, `proof`, `review`, and maintenance commands. `doctor` completed successfully and found ReportLab, Plotly, Kaleido, NumPy, Pandas, and Xarray. Its package field reports `research-data: 0.3.0`, which conflicts with the CLI version. This is P1 documentation/release identity friction: make the version source consistent or explain the distinction in `doctor`.

## Reproducible happy path

Fixture source: `.artifacts/agent-cli-usage-20261006/source with spaces/generate_synthetic.py`. It writes a 21-row CSV (`time_s`, `signal`, `uncertainty`) to `RESEARCH_DATA_OUTPUT`.

```powershell
$root=(Resolve-Path '.artifacts\agent-cli-usage-20261006').Path
& '.venv\Scripts\python.exe' -m research_data --root $root init
& '.venv\Scripts\python.exe' -m research_data --root $root run --title 'Synthetic CLI trace' --project agent-cli --kind simulation --description 'Software-only synthetic fixture for CLI usage' --repo (Resolve-Path '.artifacts\agent-cli-usage-20261006\source with spaces').Path --source generate_synthetic.py --entrypoint generate_synthetic.py --profile (Resolve-Path '.artifacts\agent-cli-usage-20261006\profile.json').Path --tag synthetic --category domain=software --parameter points=21 -- '.venv\Scripts\python.exe' (Resolve-Path '.artifacts\agent-cli-usage-20261006\source with spaces\generate_synthetic.py').Path
```

Resulting source run: `20261006T154644-562ce75c`; raw artifact `d1b0397f27f74be0a57a91cc2318470e`; source check passed. `show` returned the complete data card with provenance, source snapshot, artifact SHA-256, and detected variables. A path containing spaces worked.

The first plot fixture used `"style": "default"` and failed with `{"error":"style must be a mapping","type":"TypeError"}` even though parser help accepts `style` without describing its shape. Changing it to the valid mapping `{ "line_width": 2, "font_size": 14, "title_size": 18 }` succeeded:

```powershell
& '.venv\Scripts\python.exe' -m research_data --root $root plot 20261006T154644-562ce75c --recipe (Resolve-Path '.artifacts\agent-cli-usage-20261006\recipe.json').Path --output (Join-Path $root 'synthetic-trace.html')
```

Result: figure `synthetic-trace.html`, analysis run `20261006T154731-23b9bfde`. Minimal fix (P2): add a parser-derived recipe example/schema or validate `style` with a concise CLI error before renderer execution.

## Proof draft, hash, publish, comments, integrity

`proof show` on a run with no draft returns JSON `null` and exit 0. This is usable as a probe, but the guide should state that the browser “create draft from current plot” seed is required before CLI editing. I seeded a valid draft from the same run, then used only CLI operations for inspection/edit/save/publish.

```powershell
& '.venv\Scripts\python.exe' -m research_data --root $root proof show --run-id 20261006T154644-562ce75c --output draft.json
& '.venv\Scripts\python.exe' -m research_data --root $root proof save --run-id 20261006T154644-562ce75c --draft draft-seeded.json
& '.venv\Scripts\python.exe' -m research_data --root $root proof show --run-id 20261006T154644-562ce75c --output evidence\draft-after-save.json
```

The returned draft hash was `88bc6827b04161112e56768061fc7346520f4d8806b4371fe41c25fe82d3ab1d`. Editing the draft and saving with that exact `--expected-hash` succeeded, producing hash `12233d7364934d7c5b9ffe4dd38e876b884050833bbc04b2d00c0a97df3844d9`.

```powershell
& '.venv\Scripts\python.exe' -m research_data --root $root proof publish --run-id 20261006T154644-562ce75c --draft draft-seeded.json --figure matching.png
```

Publish succeeded with revision `069b3ce4-d57d-4753-9760-9395b5166e1d`, analysis run `20261006T154859-77ff420c`, and matching `report.html`, `report.pdf`, and `figure.png`. Exact-revision caption comment, figure reply using `--reply-to`, `comments`, `list`, and `proof check` all succeeded. `proof check` returned `{"ok":true,...}` with all frozen file hashes.

## Negative and recovery checks

* Appending bytes to the managed CSV made `check` return `ok: false`, issue `missing_or_changed`, and process exit 1. Restoring the original bytes made the same check return `ok: true`.
* An unsupported `--bogus` plot argument returned argparse exit 2 with `unrecognized arguments`.
* An invalid `element:missing` comment anchor returned exit 2 with `unknown comment anchor`.
* Importing a text file at a path containing spaces succeeded as an explicit historical import, preserving unknown provenance. The artifact is recorded as `format: txt` with `inspection_error: Unsupported data format: txt`; this is an honest and recoverable result.

## Evidence inventory

Machine outputs are retained in `.artifacts/agent-cli-usage-20261006/evidence/`, including `show.json`, `plot-success.json`, `proof-save-edited.json`, `proof-publish.json`, `comments.json`, `proof-check.json`, `proof-list-final.json`, stale-check output, unsupported-argument output, invalid-anchor output, and text-import output. Fixture inputs are `profile.json`, `recipe.json`, `source with spaces/generate_synthetic.py`, `make_draft.py`, and `edit_draft.py`.

Recommendation: accept the exercised route as operational for the bounded synthetic case. Prioritize the version identity mismatch (P1), then document/validate recipe style mappings and clarify the no-draft `proof show` state (P2). No source changes were made during this review.

## Follow-up fix verification

The bounded fixes were applied after the initial review. Focused validation passed:

```text
26 passed in 7.13s
```

The same real catalog now reports consistent runtime identity while retaining the editable-install clue separately:

```json
{"packages":{"research-data":"0.5.0"},"installed_distributions":{"research-data":"0.3.0"},"module_locations":{"research-data":"D:\\research-data\\src\\research_data\\__init__.py"}}
```

An invalid style recipe now exits 2 with an actionable message naming the valid mapping shape and available themes: `style must be a mapping, for example {'line_width': 2, 'font_size': 14}; choose a top-level theme from: ...`. The bundled skill now links to its installed-relative `references/proofs.md`, which documents the `proof show` JSON-null empty state and the browser seed route.

## Final 0.5.1 retest after editable install

The editable runtime and managed skill were refreshed to 0.5.1. Replaying the existing isolated fixture produced:

```text
research-data --version -> 0.5.1
doctor packages[research-data] -> 0.5.1
doctor installed_distributions[research-data] -> 0.5.1
doctor module_locations[research-data] -> D:\research-data\src\research_data\__init__.py
```

The original valid recipe rendered again as `synthetic-trace-0.5.1.html` with analysis run `20261006T155939-36c3c6f4`. The bad style recipe still exits 2 and now returns the actionable mapping/theme message. Existing proof revision `069b3ce4-d57d-4753-9760-9395b5166e1d` passed `proof check` with `ok: true`; its caption comment and figure reply remained present under the exact revision, with the same frozen file hashes. `proof list` reopened the same immutable revision.

The installed skill was checked directly: `C:\Users\fangr\.codex\skills\research-data\references\proofs.md` exists, `SKILL.md` links to `references/proofs.md`, and the reference contains the parser commands, browser seed instruction, JSON-null explanation, hash-save/publish commands, exact revision checks, and anchored comment/reply commands. The old synthetic run's embedded provenance still records `0.3.0` because it was captured before the editable refresh; the current doctor and newly generated analysis run report 0.5.1.
