"""Data-detail figure composition, saved proofs and revision-specific discussions."""
from __future__ import annotations

import copy
import json
import html
from pathlib import Path


def proof_context(catalog, run):
    """A generated proof card opens its actual owner's draft and revision history."""
    expected = (run.get("parameters") or {}).get("proof_revision_id")
    if not expected:
        return run, None
    from .catalog import _inside, _sha
    artifact = next((a for a in run.get("artifacts", []) if a.get("role") == "proof-manifest"), None)
    if artifact is None:
        raise ValueError("该校样缺少来源清单，请检查此运行的完整性")
    path = _inside(catalog.root / "runs" / run["run_id"], artifact["path"])
    if _sha(path) != artifact["sha256"]:
        raise ValueError("校样来源清单完整性校验失败")
    manifest = json.loads(path.read_text(encoding="utf-8"))
    if (manifest.get("schema") != "research-data.proof.v1"
            or manifest.get("analysis_run_id") != run["run_id"]
            or manifest.get("revision_id") != expected):
        raise ValueError("校样来源清单与此运行不一致")
    return catalog.get(manifest["run_id"]), expected


def _seed(st, catalog, run):
    from .figure_editor import initial_payload
    from .plotting import render_plot
    from .dataset_view import default_recipe
    figure, inputs, recipe = None, [], {}
    if st.session_state.get("figure") is not None:
        figure = st.session_state["figure"]
        inputs = st.session_state.get("figure_inputs", [])
        recipe = st.session_state.get("figure_recipe", {})
    elif st.session_state.get("datasets"):
        index = st.session_state.get("primary_dataset_index", 0)
        ds = st.session_state["datasets"][index]
        recipe = st.session_state.get("viewer_recipe") or default_recipe(ds, next(iter(ds.data_vars)))
        if recipe:
            figure = render_plot([ds], recipe, labels=[run["title"]])
            inputs = [st.session_state["dataset_ids"][index]]
    else:
        images = [a for a in run.get("artifacts", []) if a.get("format") in {"png", "jpg", "jpeg"}]
        if images:
            from .catalog import _inside, _sha
            artifact = images[0]
            path = _inside(catalog.root / "runs" / run["run_id"], artifact["path"])
            if _sha(path) != artifact["sha256"]:
                raise ValueError("输入图片完整性校验失败")
            import io
            from PIL import Image
            output = io.BytesIO()
            with Image.open(path) as image:
                image.convert("RGB").save(output, format="PNG")
            return initial_payload(run, output.getvalue(), [{"run_id": run["run_id"], "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}])
        from .dataset_view import artifact_inventory
        candidates = [a for a in artifact_inventory(run) if a.get("loadable")]
        preferred = st.session_state.get("viewer_artifact_id")
        artifact = next((a for a in candidates if a["artifact_id"] == preferred), candidates[0] if candidates else None)
        if artifact:
            artifact = catalog.select_artifact(run["run_id"], artifact["artifact_id"])
            ds = catalog.load_dataset(run["run_id"], artifact_id=artifact["artifact_id"])
            recipe = next((r for name in ds.data_vars if (r := default_recipe(ds, name))), None)
            if recipe:
                figure = render_plot([ds], recipe, labels=[run["title"]])
                inputs = [{"run_id": run["run_id"], "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}]
    payload = initial_payload(run, None, inputs, recipe)
    if figure is not None:
        # Render in the user's existing browser; the draft does not require a second headless Chrome.
        payload["editor"]["seed_plotly"] = json.loads(figure.to_json())
    return payload


def render(st, catalog, run):
    from .proofs import ProofStore
    from .figure_editor import editor, vendor_metadata
    store = ProofStore(catalog.root)
    opened_run = run
    try:
        run, entry_revision = proof_context(catalog, run)
    except Exception as exc:
        st.error(f"无法定位校样来源：{exc}")
        return
    rid = run["run_id"]
    prefix = f"proof_{rid}_"
    if entry_revision and st.session_state.get(prefix + "entry") != opened_run["run_id"]:
        st.session_state[prefix + "entry"] = opened_run["run_id"]
        st.session_state[prefix + "revision"] = entry_revision
        st.session_state[prefix + "version"] = entry_revision
    if entry_revision:
        from .ui import browse_url
        st.info(f"此卡片是已发布校样 {entry_revision[:8]}；下方编辑源运行「{run['title']}」的当前草稿，并查看它的全部校样版本。")
        owner_url = html.escape(browse_url(dict(st.query_params), pick=rid) + "&view=proof", quote=True)
        st.markdown(f'<a href="{owner_url}" target="_self">打开源数据与全部校样</a>', unsafe_allow_html=True)
    draft = store.draft(rid)
    revisions = store.revisions(rid)
    st.markdown("**✍️ 图形编辑与期刊校样**")
    st.caption("数据图作为可移动面板；文字、箭头、图片和组件可以继续添加。保存校样后，评论绑定该版本。")
    st.caption("① 编辑图形（自动保存） → ② 保存文章内容 → ③ 保存并生成校样 → ④ 选择版本并评论")
    published = st.session_state.get(prefix + "published")
    if published:
        st.success(f"校样 {published[:8]} 已生成；PDF、HTML 与评论入口位于下方。")
    saved_error = st.session_state.get(prefix + "error", "")
    if saved_error:
        st.error(saved_error)
    if revisions:
        st.markdown(f'<a href="#proof-review-{rid}" target="_self">查看校样与评论（{len(revisions)} 个版本）</a>', unsafe_allow_html=True)
    if draft is None:
        if st.button("从当前数据图创建草稿", key=prefix + "create", type="primary"):
            try:
                draft = store.save_draft(rid, _seed(st, catalog, run))
                st.session_state[prefix + "reset"] = 1
                st.rerun()
            except Exception as exc:
                st.error(f"无法创建草稿：{exc}")
        st.info("先在数据工作区选好文件、变量和风格，或登记 PNG/JPEG 图形，再创建可编辑草稿。")
    else:
        doc = draft["document"]
        # A form changes the whole document atomically; untouched fields remain stable on canvas autosaves.
        with st.expander("文章内容与排版", expanded=False):
            with st.form(prefix + "document"):
                title = st.text_input("校样标题", doc.get("title", ""))
                authors = st.text_input("作者 / 单位", doc.get("authors", ""))
                abstract = st.text_area("摘要", doc.get("abstract", ""), height=80)
                body = st.text_area("正文 / 说明", doc.get("body", ""), height=140)
                caption = st.text_area("图注", doc.get("caption", ""), height=80)
                layout = st.selectbox("校样版式", ["single", "double"], index=int(doc.get("layout") == "double"),
                                      format_func=lambda value: "单栏 · 研究校样" if value == "single" else "双栏 · 期刊校样")
                if st.form_submit_button("保存文章内容"):
                    payload = copy.deepcopy(draft)
                    payload["document"] = dict(title=title, authors=authors, abstract=abstract, body=body, caption=caption, layout=layout)
                    try:
                        store.save_draft(rid, payload, expected_hash=draft["hash"])
                        st.session_state[prefix + "notice"] = "文章内容已保存 · 图形编辑自动保存"
                        st.rerun()
                    except Exception as exc:
                        st.error(str(exc))
        value = editor(draft, draft["hash"], str(catalog.root) + "/" + rid,
                       reset_token=st.session_state.get(prefix + "reset", 0),
                       saved_notice=st.session_state.pop(prefix + "notice", ""),
                       acknowledged_event=st.session_state.get(prefix + "event", ""),
                       save_error=saved_error, key=prefix + "editor")
        if value and value.get("event_id") != st.session_state.get(prefix + "event"):
            st.session_state[prefix + "event"] = value["event_id"]
            st.session_state.pop(prefix + "error", None)
            try:
                payload = copy.deepcopy(draft)
                payload.update(scene=value["scene"], assets=value.get("assets", {}),
                               editor={**value.get("editor", {}), "upstream": vendor_metadata()})
                # Never retain a stale rendered image across a scene edit.
                payload.pop("figure_png", None)
                if value.get("figure_png"):
                    payload["figure_png"] = value["figure_png"]
                store.save_draft(rid, payload, expected_hash=value.get("base_hash") or draft["hash"])
                if value.get("action") == "publish":
                    with st.spinner("正在冻结图形、记录来源并生成 PDF / HTML 校样…"):
                        revision = store.publish(rid)
                    st.session_state[prefix + "revision"] = revision["revision_id"]
                    st.session_state[prefix + "version"] = revision["revision_id"]
                    st.session_state[prefix + "notice"] = f"校样 {revision['revision_id'][:8]} 已生成 · 下方可查看和评论"
                    st.session_state[prefix + "published"] = revision["revision_id"]
                else:
                    st.session_state[prefix + "notice"] = "草稿已保存到资料库"
                st.rerun()
            except Exception as exc:
                st.session_state[prefix + "error"] = f"保存失败：{exc}。重新载入草稿后重试；当前画布仍保留。"
                st.rerun()
        col_a, col_b = st.columns(2)
        col_a.download_button("下载可编辑场景与资源", json.dumps(draft, ensure_ascii=False, indent=2), file_name="figure.proof-draft.json", mime="application/json")
        if col_b.button("重新载入本地草稿", key=prefix + "reload"):
            st.session_state[prefix + "reset"] = st.session_state.get(prefix + "reset", 0) + 1
            st.rerun()
        if not draft["scene"]["elements"] and not draft.get("editor", {}).get("seed_plotly"):
            if st.button("导入当前数据图", key=prefix + "seed"):
                try:
                    imported = _seed(st, catalog, run)
                    imported["document"] = draft["document"]
                    store.save_draft(rid, imported, expected_hash=draft["hash"])
                    st.session_state[prefix + "reset"] = st.session_state.get(prefix + "reset", 0) + 1
                    st.rerun()
                except Exception as exc:
                    st.error(str(exc))
        st.caption(f"草稿 {draft['hash'][:12]} · 图形自动保存，文章需点击「保存文章内容」 · Three Interact {vendor_metadata()['version']} · Ctrl+S 保存图形")

    if not revisions:
        return
    st.markdown(f'<div id="proof-review-{rid}"></div>', unsafe_allow_html=True)
    st.markdown("**📄 校样版本与评论**")
    options = [r["revision_id"] for r in revisions]
    remembered = st.session_state.get(prefix + "revision")
    selected = st.selectbox("查看校样版本", options, index=options.index(remembered) if remembered in options else len(options) - 1,
                           format_func=lambda value: next(f"{i+1:02d} · {r['created_at'][:16].replace('T', ' ')} · {value[:8]}" for i,r in enumerate(revisions) if r["revision_id"] == value), key=prefix + "version")
    revision = store.get(rid, selected)
    folder = Path(revision["path"])
    st.image(str(folder / "figure.png"), caption=f"Figure 1 · 校样 {selected[:8]}", width="stretch")
    links = st.columns(3)
    for col, name, mime in zip(links, ["report.pdf", "report.html", "scene.json"], ["application/pdf", "text/html", "application/json"]):
        file = folder / name
        col.download_button({"report.pdf": "下载 PDF 校样", "report.html": "下载 HTML 校样", "scene.json": "下载场景 JSON"}[name], file.read_bytes(), file_name=name, mime=mime, key=prefix + selected + name)
    with st.expander("阅读期刊校样", expanded=False):
        import streamlit.components.v1 as components
        components.html((folder / "report.html").read_text(encoding="utf-8"), height=720, scrolling=True)
    scene = json.loads((folder / "scene.json").read_text(encoding="utf-8"))
    anchors = ["document", "title", "abstract", "body", "caption", "figure", *["element:" + key for key in scene["elements"]]]
    labels = dict(document="整份校样", title="标题", abstract="摘要", body="正文", caption="图注", figure="Figure 1")
    labels.update({"element:" + key: "图形元素 · " + value.get("name", key) for key,value in scene["elements"].items()})
    comments = store.comments(rid, selected)
    for comment in comments:
        st.markdown(f"**{comment['author']}** · {labels.get(comment['anchor'], comment['anchor'])} · `{comment['id'][:8]}`")
        if comment.get("parent_id"):
            st.caption("回复 " + comment["parent_id"][:8])
        st.markdown(comment["text"])
    with st.form(prefix + selected + "comment_form", clear_on_submit=True):
        anchor = st.selectbox("评论位置", anchors, format_func=labels.get)
        reply = st.selectbox("回复评论", [None, *[c["id"] for c in comments]], format_func=lambda value: "新评论" if value is None else next(c["text"][:50] for c in comments if c["id"] == value))
        text = st.text_area("校样评论", height=90)
        if st.form_submit_button("提交校样评论"):
            try:
                store.add_comment(rid, selected, text, anchor=anchor, parent_id=reply)
                st.rerun()
            except Exception as exc:
                st.error(str(exc))
    st.caption(f"评论只属于校样 {selected[:8]}；后续编辑会生成新版本。分析记录：{revision.get('analysis_run_id', '未登记')}")
