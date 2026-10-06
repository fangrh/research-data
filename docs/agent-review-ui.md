# ResearchData 0.5.0 first use UI review

Review date: 2026-10-06. Target: `http://127.0.0.1:8771/`, catalog `D:\research-data\demo-catalog-datasets`.

## Completed journey

1. Opened the assigned run `20261006T140031-110b18bb` from the catalog home. The run page exposed four files, file and variable selectors, chart/table/details/animation tabs, a plot editor, and a separate “编辑与校样” workspace. The synthetic run was clearly marked `not_checked`.
2. Opened the existing proof run `20261006T151305-f42726be` and switched to “编辑与校样”. Scrolling to the lower section changed the URL to `view=proof` and revealed the actual “从当前数据图创建草稿” / editor surface.
3. Expanded “文章内容与排版”; edited title, author, abstract, body, caption, and changed layout from “单栏 · 研究校样” to “双栏 · 期刊校样”. “保存文章内容” retained the values in the visible controls.
4. In Three Interact, inserted a text element and a rectangle, selected the text on canvas after an initial tree-row click failed, changed text to `Panel label` and font size to `18`, saved, and used “重新载入本地草稿”. After reload the editor showed `Saved · 3 elements · version 5` and the text/shape remained.
5. Clicked “保存并生成校样”. After the save completed, the UI showed revision `71a9c106`, an embedded “阅读期刊校样” preview, and download controls for PDF, HTML, and scene JSON. PDF and HTML download buttons were exercised.
6. Selected the exact anchor “图形元素 · text 2”, submitted `Please keep this label above the imported plot.`, selected that comment as the parent, and submitted `Confirmed; the label is retained in revision 71a9c106.`. The rendered review area visibly showed both the anchored comment (`ede6d5ae`) and reply (`ea9707c9`).
7. Switched to sibling immutable proof runs `20261006T150836-8e642580` (revision `5ecd9de6…`) and generated revision run `20261006T154742-2a6f7ad4` (revision `71a9c106…`) to compare version identity and confirm the new run appears in “同项目数据”. The in-page “查看校样版本” selector itself exposed only one option for this run.

## Findings

### P1 — proof entry is hard to discover

Expected: a first-time user following the “编辑与校样” tab should see the draft editor and article controls.

Observed: after switching to “编辑与校样”, the page remained at the large data viewer. The proof entry and “从当前数据图创建草稿” appeared only after scrolling far down; scrolling also silently added `view=proof` to the URL. The initial click on the proof button appeared to do nothing when the current file was `scene.json`. Minimal fix: make the proof workspace switch scroll/focus to the proof section, or show a persistent “Create draft” call to action near the workspace tabs, with a disabled reason when no plot is selected.

### P1 — proof generation has no immediate progress/result signal

Observed: after clicking “保存并生成校样”, the embedded editor displayed `正在保存到本地资料库…` for several observations. Only after waiting did it change to `校样已保存 · 下方可查看和评论` and reveal the revision/download/review section. Minimal fix: show a determinate or explicit completion toast with the new revision ID and disable the button while saving.

### P2 — draft state is split across two save concepts

Observed: article content has “保存文章内容”; the iframe has “保存编辑”; edits also autosave and show `草稿已保存到资料库`. The workflow is usable, but a first-time user cannot tell whether the article and scene are in the same draft until reloading. Minimal fix: one draft status line with dirty/saved scope (article, scene, or both) and one clear “save all” action.

### P2 — version switching is project/run navigation rather than an obvious revision history

Observed: the proof selector for generated run `20261006T154742-2a6f7ad4` contained one option. Earlier and later immutable proof revisions were discoverable only through “同项目数据” sibling runs. Minimal fix: expose all revisions in the “查看校样版本” selector or label sibling runs as revision navigation.

### P2 — direct manipulation is recoverable but accessibility targeting is fragile

Observed: clicking the newly added scene-tree row through the accessibility index returned `Could not check the click target's shadow root`; clicking the visible text on the canvas selected it and recovery succeeded. Minimal fix: make scene-tree rows actionable through the host accessibility surface and preserve selection after iframe rerenders.

## Completed vs untested

Completed: dataset browse, figure use/import path, article text and layout edits, text/shape insertion, typography edit, save and reload, proof generation, PDF/HTML download controls, exact revision comment and reply, mistaken action and recovery, sibling revision/run switching.

Untested: actual downloaded-file contents outside the UI, changing an existing immutable revision, 3D insertion, image upload, multi-panel layout, agent dispatch, and source/run mutation. No existing immutable revision was edited or deleted.

## Evidence

Visible browser captures were taken during the journey at the dataset page, editor with article controls, inserted text/shape canvas, comment-anchor menu, proof preview, and comment/reply area. The CUA subagent browser could emit these captures into the review trace, but cannot persist binary screenshot files under `docs/`; therefore no fabricated PNG files are claimed here.

## Export progress implementation (follow-up)

The bounded host bridge change now assigns an explicit event ID before a Save or Publish request and sends that ID with `exportRequest` and the eventual component value. The toolbar immediately sets `aria-busy="true"`, marks its status text with `role="status"`/`aria-live`, and disables both export buttons. It shows a rendering stage before the parent asks for SVG and a PNG/proof generation stage while the export is running.

Controls remain disabled after the client emits the component value. They are restored only when a render argument carries the matching `acknowledged_event`; a matching `save_error` leaves the current scene intact and exposes an actionable error. A stale acknowledgement cannot finish a newer export. Autosave timers are cancelled for explicit export, and edits made while it is pending defer autosave until the acknowledgement; the deferred save is scheduled only when the scene version advanced beyond the export snapshot.

The follow-up path also preserves the controller's `saved_notice` (including the generated revision ID) after acknowledgement, continues to show later article/autosave notices, and cancels a pending export cleanly when a reset token or identity reloads the editor.

## Typography multi-field correction

The host bridge now tracks pending inspector edits by stable inspector element ID and property name instead of DOM input identity. When the upstream inspector redraw replaces an input, the pending value is resolved against the replacement input and sent through its existing `change` validation path. Pending edits are serialized through scene-version updates, and explicit Save/Publish waits for this queue before taking its export snapshot, preventing a second field such as Font size from being dropped after a text edit redraw.

The export request now starts outside the host operation queue, so it cannot wait on an inspector edit that is queued behind the export handler. Save/Publish disables immediately with `正在提交图形属性…`, then proceeds after the serialized inspector queue; flush errors and reset-token changes clear the preparation state and restore recovery controls. Blank text values remain eligible for upstream validation, while blank or nonfinite numeric values are withheld.

Autosave is now single-flight: a second autosave cannot emit while the first event's acknowledgement is outstanding. Explicit export cancels scheduled autosave, waits for any emitted autosave acknowledgement to advance `parentHash`, and only then requests the export. Edits during that wait defer a follow-up autosave. A failed export preserves dirty state and its error status across the acknowledgement refresh instead of replacing it with a generic connected notice.

## Post-fix UI retest limitation

The requested fresh-tab retest could not start in the CUA environment. `cua.getState()` returned no available browsers, and opening `http://127.0.0.1:8771/?run=20261006T151305-f42726be&view=proof` with the in-app browser returned `Browser is not available: iab`. Therefore the post-fix banner, selector, export progress, revision comment/reply, and reload checks remain untested in this turn; no UI result is claimed from this tool-entry failure.


## Controller actual-browser retest after repair

2026-10-06. The controller used the available in-app browser on the same isolated synthetic catalog. Opening analysis card `20261006T151305-f42726be` correctly showed original owner `20261006T140031-110b18bb` and its direct revision history. Quick text and Font size edits followed by immediate Save initially reproduced lost typography and a stale autosave hash; both were repaired in the host. The final replay retained `Agent review: ordered save succeeds` and `22` pt, showed disabled save/publish buttons while pending, and received `草稿已保存到资料库`.

Publish generated revision `b40ac882-bdfd-42ac-8451-0413fc3e26f2`, analysis run `20261006T161149-e451729c`, with explicit completion and three direct versions. Comment `7960a290` and reply `e103b9d7` appeared only on this revision. Switching to revision `5ecd9de6` retained its original element comment; reopening the source in a fresh tab retained typography, draft version 17 and the new revision comments. Backend integrity reads passed for all three frozen root revisions. The older nested agent trial was preserved rather than merged into a different owner's history.

Visual inspection also identified low contrast caused by the bridge body foreground overriding the editor's dark theme. The host now inherits upstream theme foreground/background variables; white bridge controls retain their own colors. Source navigation uses the same tab. Screenshots are retained with the release validation record.
