# Proof CLI route

Use parser discovery first:

```text
research-data help proof --json
research-data guide proof --json
```

The browser run page's “从当前数据图创建草稿” action is the initial seed for the “工作区 编辑与校样” workspace. Its mounted tabs are “图形编辑”, “文章排版”, and “校样审阅”; they remain mounted while autosave or proof generation is in flight. Generated proof cards open “校样审阅” at the exact owner revision. The “草稿文件与编辑器信息” expander contains draft download, reload, and editor information controls. Before that action, `proof show --output draft.json` writes JSON `null` because no draft exists; this is an expected empty state.

After seeding, inspect and edit the inert JSON draft:

```text
research-data proof show --run-id RUN_ID --output draft.json
research-data proof save --run-id RUN_ID --draft draft.json --expected-hash HASH
research-data proof publish --run-id RUN_ID --draft draft.json --figure matching.png
```

Publishing freezes an immutable revision with HTML, PDF, PNG, scene, document, assets, recipe, manifest, source provenance, and input artifact hashes. The review view reads frozen content on the left with passage highlights and figure pins, comments on the right, stacks panes on narrow screens, and places downloads above. Select text within one paragraph, click a paragraph or figure point, then post a comment. Review an exact revision:

```text
research-data proof list --run-id RUN_ID
research-data proof comments --run-id RUN_ID --revision REVISION_ID
research-data proof check --run-id RUN_ID --revision REVISION_ID
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor caption --text "Review this caption."
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor figure --text "Reply." --reply-to COMMENT_ID
research-data proof comments --run-id RUN_ID --revision REVISION_ID --status open
research-data proof comment-status --run-id RUN_ID --revision REVISION_ID --comment-id COMMENT_ID --status resolved --note "Addressed."
research-data proof comment-status --run-id RUN_ID --revision REVISION_ID --comment-id COMMENT_ID --status open
```

Comments must use `document`, `title`, `abstract`, `body`, `caption`, `figure`, or `element:UUID` anchors. Add `--locator FILE.json` for a precise text range (`kind: text`, Unicode code-point `start`/`end`, matching `exact`) on a text anchor, or a normalized figure point (`kind: point`, `x`/`y` in 0–1) on `figure`. Replies inherit the root's location. Resolve/reopen applies to the whole thread and retains an actor/time/status audit history; a new reply reopens a resolved thread. Missing legacy status reads as open without rewriting old files. Comments and status use a mutable per-revision sidecar; frozen exports and hashes remain untouched. Do not automatically copy old comments onto a new revision. Resolution does not establish scientific acceptance. Proof editing does not alter data values or scientific validation.
