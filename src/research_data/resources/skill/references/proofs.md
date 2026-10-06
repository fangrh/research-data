# Proof CLI route

Use parser discovery first:

```text
research-data help proof --json
research-data guide proof --json
```

The browser run page's “从当前数据图创建草稿” action is the initial seed. Before that action, `proof show --output draft.json` writes JSON `null` because no draft exists; this is an expected empty state.

After seeding, inspect and edit the inert JSON draft:

```text
research-data proof show --run-id RUN_ID --output draft.json
research-data proof save --run-id RUN_ID --draft draft.json --expected-hash HASH
research-data proof publish --run-id RUN_ID --draft draft.json --figure matching.png
```

Publishing freezes an immutable revision with HTML, PDF, PNG, scene, document, assets, recipe, manifest, source provenance, and input artifact hashes. Review an exact revision:

```text
research-data proof list --run-id RUN_ID
research-data proof comments --run-id RUN_ID --revision REVISION_ID
research-data proof check --run-id RUN_ID --revision REVISION_ID
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor caption --text "Review this caption."
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor figure --text "Reply." --reply-to COMMENT_ID
```

Comments must use `document`, `title`, `abstract`, `body`, `caption`, `figure`, or `element:UUID` anchors. Proof editing does not alter data values or scientific validation.
