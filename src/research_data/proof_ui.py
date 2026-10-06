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
    draft, revisions = store.draft(rid), store.revisions(rid)
    title = html.escape(run.get("title") or "未命名运行")
    project = html.escape(run.get("project") or "未分类项目")
    st.markdown(f'<div class="rd-proof-context"><div><span class="rd-proof-project">{project}</span><h1>{title}</h1><p>{html.escape(rid)}</p></div><div class="rd-proof-state"><span>{"草稿已建立" if draft else "尚无草稿"}</span><span>{len(revisions)} 个校样版本</span></div></div>', unsafe_allow_html=True)
    if entry_revision:
        from .ui import browse_url
        owner_url = html.escape(browse_url(dict(st.query_params), pick=rid) + "&view=proof", quote=True)
        st.markdown(f'<p class="rd-proof-origin">当前为校样 {entry_revision[:8]} · <a href="{owner_url}" target="_self">打开源数据与全部校样</a></p>', unsafe_allow_html=True)
    saved_error = st.session_state.get(prefix + "error", "")
    if saved_error:
        st.error(saved_error)
    # All panes stay mounted: changing the visible tab must not cancel an
    # inspector edit, debounce, or in-flight save acknowledgment in the canvas.
    with st.container(key="rd_proof_workspace"):
        canvas_tab, article_tab, review_tab = st.tabs(
            ["图形编辑", "文章排版", "校样审阅"],
            default="校样审阅" if entry_revision else "图形编辑", key=prefix + "panes")
        with canvas_tab:
            published = st.session_state.get(prefix + "published")
            if published:
                st.success(f"校样 {published[:8]} 已生成；切换到「校样审阅」下载和评论。")
            if draft is None:
                if st.button("从当前数据图创建草稿", key=prefix + "create", type="primary"):
                    try:
                        store.save_draft(rid, _seed(st, catalog, run))
                        st.session_state[prefix + "reset"] = 1
                        st.rerun()
                    except Exception as exc:
                        st.error(f"无法创建草稿：{exc}")
                st.info("在数据工作区选择文件、变量和风格，再创建可编辑草稿；也可使用已登记的 PNG/JPEG 图形。")
            else:
                _canvas(st, store, catalog, run, rid, prefix, draft, saved_error)
        with article_tab:
            if draft is None:
                st.info("先在「图形编辑」中创建草稿，再填写文章内容。")
            else:
                st.caption("填写校样内容与版式，保存后回到「图形编辑」生成校样。")
                _article(st, store, rid, prefix, draft)
                notice = st.session_state.get(prefix + "article_notice")
                if notice:
                    st.success(notice)
        with review_tab:
            if not revisions:
                st.info("在「图形编辑」中点击「保存并生成校样」，即可在这里阅读、下载和评论。")
            else:
                _review(st, store, rid, prefix, revisions)


def _article(st, store, rid, prefix, draft):
    doc = draft["document"]
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
                st.session_state[prefix + "article_notice"] = "文章内容已保存；再次生成校样时会采用这些内容。"
                st.rerun()
            except Exception as exc:
                st.error(str(exc))


def _canvas(st, store, catalog, run, rid, prefix, draft, saved_error):
    from .figure_editor import editor, vendor_metadata
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
                st.session_state[prefix + "notice"] = f"校样 {revision['revision_id'][:8]} 已生成 · 在「校样审阅」中查看和评论"
                st.session_state[prefix + "published"] = revision["revision_id"]
            else:
                st.session_state[prefix + "notice"] = "草稿已保存到资料库"
            st.rerun()
        except Exception as exc:
            st.session_state[prefix + "error"] = f"保存失败：{exc}。重新载入草稿后重试；当前画布仍保留。"
            st.rerun()
    with st.expander("草稿文件与编辑器信息", expanded=False):
        st.caption(f"草稿 {draft['hash'][:12]} · 图形引擎 Three Interact {vendor_metadata()['version']}")
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
    st.caption("图形编辑自动保存 · Ctrl+S 保存图形 · 生成后在「校样审阅」查看版本与评论")


def _review(st, store, rid, prefix, revisions):
    from .proof_review import reader, review_event, review_payload, review_threads
    options = [r["revision_id"] for r in revisions]
    remembered = st.session_state.get(prefix + "revision")
    selected = st.selectbox("查看校样版本", options, index=options.index(remembered) if remembered in options else len(options) - 1,
                           format_func=lambda value: next(f"{i+1:02d} · {r['created_at'][:16].replace('T', ' ')} · {value[:8]}" for i,r in enumerate(revisions) if r["revision_id"] == value), key=prefix + "version")
    revision = store.get(rid, selected)
    folder = Path(revision["path"])
    st.session_state[prefix + "revision"] = selected
    comments = store.comments(rid, selected)
    threads = review_threads(comments)
    review_key = prefix + selected + "_review_"
    focus_key, selection_key = review_key + "focus", review_key + "selection"
    pending_focus = st.session_state.pop(review_key + "pending_focus", None)
    if pending_focus:
        st.session_state[focus_key] = pending_focus
        st.session_state[prefix + "review_filter"] = "全部"
    open_count = sum(t["root"].get("status", "open") == "open" for t in threads)
    st.caption(f"校样 {selected[:8]} · {open_count} 条未处理 / {len(threads) - open_count} 条已解决 · 意见与定位只属于此版本")
    links = st.columns(3)
    for col, name, mime in zip(links, ["report.pdf", "report.html", "scene.json"], ["application/pdf", "text/html", "application/json"]):
        file = folder / name
        col.download_button({"report.pdf": "下载 PDF 校样", "report.html": "下载 HTML 校样", "scene.json": "下载场景 JSON"}[name], file.read_bytes(), file_name=name, mime=mime, key=prefix + selected + name)
    view = st.segmented_control("审阅意见筛选", ["全部", "未处理", "已解决"], default="全部", key=prefix + "review_filter")
    visible = [t for t in threads if view == "全部" or t["root"].get("status", "open") == {"未处理": "open", "已解决": "resolved"}.get(view)]
    if st.session_state.get(focus_key) not in [t["id"] for t in visible]:
        st.session_state[focus_key] = None
    if st.session_state.pop(review_key + "clear_text", False):
        st.session_state[review_key + "text"] = ""
        st.session_state[review_key + "reply"] = None
    scene = json.loads((folder / "scene.json").read_text(encoding="utf-8"))
    anchors = ["document", "title", "abstract", "body", "caption", "figure", *["element:" + key for key in scene["elements"]]]
    labels = dict(document="整份校样", title="标题", abstract="摘要", body="正文", caption="图注", figure="Figure 1")
    labels.update({"element:" + key: "图形元素 · " + value.get("name", key) for key, value in scene["elements"].items()})
    preview, discussion = st.columns([2.1, 1], gap="large")
    with preview:
        value = reader(review_payload(revision), visible, selection=st.session_state.get(selection_key),
                       focus=st.session_state.get(focus_key), focus_token=st.session_state.get(review_key + "focus_token", 0),
                       key=prefix + "review_reader")
        if isinstance(value, dict) and value.get("event_id") != st.session_state.get(prefix + "review_event"):
            st.session_state[prefix + "review_event"] = value.get("event_id")
            try:
                event = review_event(store, rid, selected, value, comments)
                if event:
                    if event["action"] == "select":
                        st.session_state[selection_key] = {"anchor": event["anchor"], "locator": event["locator"]}
                        st.session_state[review_key + "anchor"] = event["anchor"]
                        st.session_state[review_key + "reply"] = None
                        st.session_state[focus_key] = None
                    else:
                        st.session_state[focus_key] = event["thread_id"]
                        st.session_state.pop(selection_key, None)
                    st.rerun()
            except ValueError as exc:
                st.warning(f"无法定位此意见：{exc}")
    with discussion, st.container(border=True):
        st.markdown("**审阅意见**")
        notice = st.session_state.pop(review_key + "notice", None)
        if notice:
            st.success(notice)
        by_id = {t["id"]: t for t in visible}
        focused = st.selectbox("审阅线程", [None, *by_id], key=focus_key, placeholder="新意见 / 从校样选择位置",
                               format_func=lambda value: "新意见 / 从校样选择位置" if value is None else
                               f"{by_id[value]['number']:02d} · {labels.get(by_id[value]['root']['anchor'], '意见')} · {by_id[value]['root']['text'][:40]}")
        if focused:
            thread = by_id[focused]
            root = thread["root"]
            st.caption(f"意见 {thread['number']:02d} · {'已解决' if root.get('status') == 'resolved' else '未处理'} · {labels.get(root['anchor'], root['anchor'])} · {root['id'][:8]}")
            _review_target(st, root)
            for comment in thread["comments"]:
                st.markdown(f"**{comment['author']}** · `{comment['created_at'][:16].replace('T', ' ')}`")
                if comment.get("parent_id"):
                    st.caption("回复 " + comment["parent_id"][:8])
                st.markdown(comment["text"])
            locate, reply_button, status = st.columns(3)
            if locate.button("定位", key=review_key + "locate", use_container_width=True):
                st.session_state[review_key + "focus_token"] = st.session_state.get(review_key + "focus_token", 0) + 1
                st.rerun()
            if reply_button.button("回复", key=review_key + "reply_button", use_container_width=True):
                st.session_state[review_key + "reply"] = root["id"]
                st.session_state[review_key + "anchor"] = root["anchor"]
                st.session_state.pop(selection_key, None)
                st.rerun()
            next_status = "open" if root.get("status") == "resolved" else "resolved"
            if status.button("重新打开" if next_status == "open" else "解决", key=review_key + "status", use_container_width=True):
                try:
                    store.set_comment_status(rid, selected, root["id"], next_status)
                    st.session_state[review_key + "notice"] = "意见已重新打开。" if next_status == "open" else "意见已标记为已解决；可从「已解决」筛选查看和重开。"
                    st.rerun()
                except ValueError as exc:
                    st.error(str(exc))
            if root.get("status_history"):
                with st.expander("处理记录"):
                    for event in root["status_history"]:
                        st.caption(f"{event.get('at', '')[:16].replace('T', ' ')} · {event.get('author', '')} · {event.get('status', '')} {event.get('note', '')}")
        elif not visible:
            st.caption("此筛选下暂无意见。选取原文、点击图中位置，或选择下方评论位置即可创建意见。")
        selection = st.session_state.get(selection_key)
        if selection:
            st.markdown("**已选择评论位置**")
            st.caption(labels.get(selection["anchor"], selection["anchor"]))
            _review_target(st, selection)
            if st.button("清除定位", key=review_key + "clear_selection"):
                st.session_state.pop(selection_key, None)
                st.rerun()
        with st.form(prefix + selected + "comment_form", clear_on_submit=False):
            anchor = st.selectbox("评论位置", anchors, format_func=labels.get, key=review_key + "anchor")
            reply = st.selectbox("回复评论", [None, *[c["id"] for c in comments]], key=review_key + "reply", placeholder="新评论",
                                 format_func=lambda value: "新评论" if value is None else next(c["text"][:50] for c in comments if c["id"] == value))
            st.caption("回复沿用原线程的位置；向已解决线程回复会重新打开它。")
            text = st.text_area("校样评论", height=90, key=review_key + "text")
            if st.form_submit_button("提交校样评论"):
                try:
                    locator = selection.get("locator") if selection and selection["anchor"] == anchor and reply is None else None
                    created = store.add_comment(rid, selected, text, anchor=anchor, parent_id=reply, locator=locator)
                    st.session_state[review_key + "pending_focus"] = created.get("thread_id", created["id"])
                    st.session_state.pop(selection_key, None)
                    st.session_state[review_key + "clear_text"] = True
                    st.session_state[review_key + "notice"] = "意见已保存到此校样版本。"
                    st.rerun()
                except Exception as exc:
                    st.error(str(exc))
        st.caption(f"评论只属于校样 {selected[:8]}；后续编辑会生成新版本。分析记录：{revision.get('analysis_run_id', '未登记')}")


def _review_target(st, comment):
    locator = comment.get("locator") or {}
    if locator.get("kind") == "text":
        st.text(locator["exact"][:600] + ("…" if len(locator["exact"]) > 600 else ""))
        st.caption(f"原文字符 {locator['start']}–{locator['end']} · 按此版本定位")
    elif locator.get("kind") == "point":
        st.caption(f"图中位置 · x {locator['x']:.1%} / y {locator['y']:.1%}")
