"""Collection browsing and editing, kept separate from scientific run records."""
from __future__ import annotations

import hashlib
import html
import json

from .collections import CollectionStore
from .ui import browse_url


def _esc(value):
    return html.escape(str(value or ""), quote=True)


STYLES = """<style>
.rd-collection-grid {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:18px 0;}
.rd-collection-card {border:1px solid var(--rd-line);border-radius:14px;background:white;overflow:hidden;min-width:0;}
.rd-collection-cover {background:linear-gradient(115deg,#e5f7fc,#f3f5ff 65%,#fff0f5);padding:22px;display:flex;justify-content:space-between;align-items:center;color:#008dbd;}
.rd-collection-symbol {font-size:32px;letter-spacing:-9px;}
.rd-collection-card-body {padding:16px 18px;}
.rd-collection-card h3 {font-size:17px!important;margin:0 0 8px!important;padding:0!important;overflow-wrap:anywhere;}
.rd-collection-card a,.rd-collection-links a {color:inherit!important;text-decoration:none!important;}
.rd-collection-card a:hover,.rd-collection-links a:hover {color:var(--rd-blue)!important;}
.rd-collection-card p {font-size:13px;color:var(--rd-muted);margin:8px 0;overflow-wrap:anywhere;}
.rd-collection-tags {display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;}
.rd-collection-tag {font-size:11px;background:#f0f8fb;color:#008dbd;padding:3px 8px;border-radius:6px;overflow-wrap:anywhere;}
.rd-collection-links {display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0;}
.rd-collection-links a {border:1px solid var(--rd-line);border-radius:7px;padding:6px 11px;font-size:12px;background:white;}
.rd-collection-links a:first-child {background:#eaf8fc;color:#008dbd!important;border-color:#c4e7f3;}
.rd-collection-summary {white-space:pre-wrap;overflow-wrap:anywhere;color:var(--rd-muted);line-height:1.7;}
.rd-collection-role {font-size:12px;color:#008dbd;background:#eaf8fc;border-radius:6px;padding:4px 8px;}
@media(max-width:900px){.rd-collection-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:550px){.rd-collection-grid{grid-template-columns:1fr;}}
</style>"""


def collection_card_html(collection, url):
    """Escaped card with an accessible, same-tab collection entry."""
    tags = "".join(f"<span class='rd-collection-tag'>{_esc(tag)}</span>" for tag in collection["tags"])
    return ("<article class='rd-collection-card'>"
            f"<a href='{_esc(url)}' target='_self'>"
            "<div class='rd-collection-cover'><span class='rd-collection-symbol' aria-hidden='true'>▤▤</span>"
            f"<span>{len(collection['members'])} 条数据</span></div>"
            f"<div class='rd-collection-card-body'><h3>{_esc(collection['title'])}</h3>"
            f"<p>{_esc(collection['description'][:180]) or '为相关结果建立共同的阅读入口。'}</p>"
            f"<div class='rd-collection-tags'>{tags}</div>"
            f"<p>{'已归档 · ' if collection['archived'] else ''}更新于 {_esc(collection['updated_at'][:10])}</p>"
            "</div></a></article>")


def member_links_html(context, collection_id, run_id):
    links = [("查看数据", "data"), ("数据文章", "article"), ("编辑与校样", "proof")]
    return "<div class='rd-collection-links'>" + "".join(
        f"<a href='{_esc(browse_url(context, pick=run_id, view=view, from_collection=collection_id))}' target='_self'>{label}</a>"
        for label, view in links) + "</div>"


def _key(catalog, suffix):
    scope = hashlib.sha256(str(catalog.root.resolve()).encode()).hexdigest()[:10]
    return f"collection_{scope}_{suffix}"


def _navigate(st, **params):
    for key in ("pick", "up", "fav", "view", "from_collection", "collection", "collections"):
        st.query_params.pop(key, None)
    st.query_params.update(params)
    if params.get("pick"):
        st.session_state.pop(f"workspace_{params['pick']}", None)
    st.rerun()


def _tags(text):
    return [tag.strip() for tag in text.replace("，", ",").split(",") if tag.strip()]


def _create(st, catalog, store, run_id=None):
    suffix = f"create_{run_id or 'index'}"
    with st.form(_key(catalog, suffix)):
        title = st.text_input("合集标题", placeholder="例如：低温输运 · 实验与模拟对照")
        description = st.text_area("合集简介", placeholder="这些数据共同回答什么问题？它们之间是什么关系？")
        tags = st.text_input("合集标签", placeholder="逗号分隔，例如：输运, 温度扫描, 实验对照")
        if st.form_submit_button("创建合集", type="primary"):
            try:
                new = store.create(title, description=description, tags=_tags(tags), run_ids=[run_id] if run_id else [])
                _navigate(st, collection=new["collection_id"])
            except (ValueError, OSError, KeyError) as exc:
                st.error(f"无法创建合集：{exc}")


def _edit(st, catalog, store, collection):
    cid = collection["collection_id"]
    hash_key = _key(catalog, f"edit_hash_{cid}")
    st.session_state.setdefault(hash_key, collection["hash"])
    with st.expander("编辑合集简介与标签"):
        if st.button("重新加载编辑内容", key=_key(catalog, f"refresh_{cid}")):
            for field in ("title", "description", "tags"):
                st.session_state.pop(_key(catalog, f"{field}_{cid}"), None)
            st.session_state.pop(hash_key, None)
            st.rerun()
        with st.form(_key(catalog, f"edit_{cid}")):
            title = st.text_input("合集标题", value=collection["title"], key=_key(catalog, f"title_{cid}"))
            description = st.text_area("合集简介", value=collection["description"], key=_key(catalog, f"description_{cid}"))
            tags = st.text_input("合集标签", value=", ".join(collection["tags"]), key=_key(catalog, f"tags_{cid}"))
            if st.form_submit_button("保存合集信息"):
                try:
                    store.update(cid, title=title, description=description, tags=_tags(tags), expected_hash=st.session_state[hash_key])
                    _clear_edit_hashes(st, catalog, cid)
                    st.rerun()
                except (ValueError, OSError, KeyError) as exc:
                    st.error(f"保存未完成：{exc}。如已被修改，请重新加载编辑内容。")
        if st.button("恢复此合集" if collection["archived"] else "归档此合集", key=_key(catalog, f"archive_{cid}"),
                     help="归档后仍可在“显示已归档合集”中查看并恢复。"):
            try:
                store.archive(cid, not collection["archived"], expected_hash=st.session_state[_key(catalog, f"view_hash_{cid}")])
                _clear_edit_hashes(st, catalog, cid)
                st.rerun()
            except (ValueError, OSError, KeyError) as exc:
                st.error(f"归档未完成：{exc}")


def render(st, catalog, runs, context, *, query="", collection_id=None):
    st.markdown(STYLES, unsafe_allow_html=True)
    store = CollectionStore(catalog.root)
    try:
        if not collection_id:
            st.markdown("<div class='rd-kicker'>研究数据 · 合集</div>", unsafe_allow_html=True)
            st.title("把相关结果放在一起")
            st.caption("用简介交代共同问题，用角色和关联说明串起每条数据。一个数据可以属于多个合集。")
            with st.expander("＋ 新建合集"):
                _create(st, catalog, store)
            archived = st.checkbox("显示已归档合集", key=_key(catalog, "include_archived"))
            collections = store.list(query, include_archived=archived)
            st.caption(f"{len(collections)} 个合集" + (f" · 搜索：{query}" if query else ""))
            if not collections:
                st.info("还没有匹配的合集。创建一个合集，再添加相关数据。")
                return
            cards = [collection_card_html(c, browse_url(context, collection=c["collection_id"])) for c in collections]
            st.markdown("<div class='rd-collection-grid'>" + "".join(cards) + "</div>", unsafe_allow_html=True)
            return
        collection = store.get(collection_id)
        cid = collection["collection_id"]
        view_hash_key = _key(catalog, f"view_hash_{cid}")
        st.session_state.setdefault(view_hash_key, collection["hash"])
        expected_hash = st.session_state[view_hash_key]
        if expected_hash != collection["hash"]:
            st.warning("合集已在其他窗口更新。重新加载后再修改，避免覆盖。")
        back, refresh = st.columns([5, 1], vertical_alignment="center")
        back.markdown(f"<a class='rd-back' href='{_esc(browse_url(context, collections='1'))}' target='_self'>← 全部合集</a>", unsafe_allow_html=True)
        if refresh.button("刷新合集", key=_key(catalog, f"reload_{cid}"), use_container_width=True):
            _reload_collection_state(st, catalog, cid)
            st.rerun()
        st.markdown("<div class='rd-kicker'>研究数据 · 合集</div>", unsafe_allow_html=True)
        st.title(collection["title"])
        st.markdown(f"<div class='rd-collection-summary'>{_esc(collection['description'])}</div>", unsafe_allow_html=True)
        tags = "".join(f"<span class='rd-collection-tag'>{_esc(t)}</span>" for t in collection["tags"])
        st.markdown(f"<div class='rd-collection-tags'>{tags}</div>", unsafe_allow_html=True)
        by_id = {r["run_id"]: r for r in runs}
        available = [m for m in collection["members"] if m["run_id"] in by_id]
        projects = {by_id[m["run_id"]].get("project") for m in available} - {None, ""}
        st.caption(f"{len(collection['members'])} 条数据 · {len(projects)} 个项目 · 手动排序 · 更新于 {collection['updated_at'][:10]}")
        if collection["archived"]:
            st.info("此合集已归档，可以在编辑区点击“恢复此合集”。")
        _edit(st, catalog, store, collection)
        existing = {m["run_id"] for m in collection["members"]}
        choices = [r["run_id"] for r in runs if r["run_id"] not in existing]
        with st.expander("＋ 添加相关数据"):
            if not choices:
                st.caption("资料库中的数据都已加入此合集。")
            else:
                hash_key = _key(catalog, f"add_hash_{cid}")
                st.session_state.setdefault(hash_key, collection["hash"])
                with st.form(_key(catalog, f"add_{cid}")):
                    rid = st.selectbox("选择数据", choices, format_func=lambda r: f"{by_id[r]['title']} · {r}")
                    role = st.text_input("数据角色", placeholder="例如：实验结果、对应模拟、参考数据")
                    note = st.text_area("关联说明", placeholder="说明这条数据与合集及其他结果的联系。")
                    if st.form_submit_button("加入合集", type="primary"):
                        store.add(cid, rid, role=role, note=note, expected_hash=st.session_state[hash_key])
                        _clear_edit_hashes(st, catalog, cid)
                        st.rerun()
        if len(available) > 1 and st.button("对比合集数据", help="选择前 6 条可用数据并进入绘图工作区；点击“加载所选运行”加载它们。"):
            st.session_state["compare_ids"] = [m["run_id"] for m in available[:6]]
            _navigate(st, pick=available[0]["run_id"], view="data", from_collection=cid)
        members = collection["members"]
        needle = query.strip().casefold()
        visible = [(i, m) for i, m in enumerate(members) if not needle or needle in
                   json.dumps({"member": m, "run": by_id.get(m["run_id"], {})}, ensure_ascii=False).casefold()]
        st.subheader("合集数据")
        if not members:
            st.info("合集已创建。点击“添加相关数据”，建立第一条关联。")
        elif not visible:
            st.info("没有匹配的数据，清空顶部搜索即可查看全部条目。")
        pages = max(1, (len(visible) + 11) // 12)
        page_key = _key(catalog, f"page_{cid}")
        page = min(max(1, st.session_state.get(page_key, 1)), pages)
        for index, member in visible[(page - 1) * 12:page * 12]:
            rid = member["run_id"]
            with st.container(border=True):
                summary = by_id.get(rid)
                st.markdown(f"**{index + 1:02d} · {_esc(summary['title'] if summary else rid)}**")
                st.markdown(f"<span class='rd-collection-role'>{_esc(member['role']) or '未标注角色'}</span>", unsafe_allow_html=True)
                if member["note"]:
                    st.markdown(f"<div class='rd-collection-summary'>{_esc(member['note'])}</div>", unsafe_allow_html=True)
                if summary:
                    st.caption(f"{summary.get('project') or '未分类项目'} · {summary.get('kind') or ''} · {rid}")
                    st.markdown(member_links_html(context, cid, rid), unsafe_allow_html=True)
                else:
                    st.warning("该数据当前不可用，已保留关联记录。")
                with st.expander("调整关联与顺序"):
                    member_hash_key = _key(catalog, f"member_hash_{cid}_{rid}")
                    st.session_state.setdefault(member_hash_key, collection["hash"])
                    with st.form(_key(catalog, f"member_{cid}_{rid}")):
                        role = st.text_input("数据角色", value=member["role"], key=_key(catalog, f"member_role_{cid}_{rid}"))
                        note = st.text_area("关联说明", value=member["note"], key=_key(catalog, f"member_note_{cid}_{rid}"))
                        if st.form_submit_button("保存关联说明", disabled=summary is None):
                            store.add(cid, rid, role=role, note=note, expected_hash=st.session_state[member_hash_key])
                            _clear_edit_hashes(st, catalog, cid)
                            st.rerun()
                    left, right, remove = st.columns(3)
                    direction = -1 if left.button("↑ 上移", key=_key(catalog, f"up_{cid}_{rid}"), disabled=index == 0) else 0
                    if right.button("↓ 下移", key=_key(catalog, f"down_{cid}_{rid}"), disabled=index == len(members) - 1):
                        direction = 1
                    if direction:
                        order = [m["run_id"] for m in members]
                        order[index], order[index + direction] = order[index + direction], order[index]
                        store.reorder(cid, order, expected_hash=expected_hash)
                        _clear_edit_hashes(st, catalog, cid)
                        st.rerun()
                    if remove.button("移出合集", key=_key(catalog, f"remove_{cid}_{rid}"), help="仅移除关联，数据及文章、校样仍保留在资料库。"):
                        store.remove(cid, rid, expected_hash=expected_hash)
                        _clear_edit_hashes(st, catalog, cid)
                        st.rerun()
        if pages > 1:
            st.pagination(pages, key=page_key)
    except (ValueError, OSError, KeyError) as exc:
        st.error(f"合集操作未完成：{exc}")
        if collection_id and st.button("重新加载合集"):
            _reload_collection_state(st, catalog, collection_id)
            st.rerun()


def _clear_edit_hashes(st, catalog, cid):
    for key in list(st.session_state):
        if str(key).startswith(_key(catalog, "")) and "hash_" in str(key) and cid in str(key):
            st.session_state.pop(key, None)


def _reload_collection_state(st, catalog, cid):
    for key in list(st.session_state):
        if str(key).startswith(_key(catalog, "")) and cid in str(key):
            st.session_state.pop(key, None)


def render_memberships(st, catalog, run, context):
    """Always visible, including the article and proof workspaces."""
    store = CollectionStore(catalog.root)
    try:
        st.markdown(STYLES, unsafe_allow_html=True)
        memberships = store.memberships(run["run_id"])
        links = "".join(f"<a href='{_esc(browse_url(context, collection=c['collection_id']))}' target='_self'>{_esc(c['title'])}</a>" for c in memberships)
        with st.container(key="rd_memberships"):
            labels, action = st.columns([5, 1])
            labels.markdown(f"<div class='rd-collection-links'><span>所属合集</span>{links or '<span>尚未加入合集</span>'}</div>", unsafe_allow_html=True)
            with action.popover("加入合集", use_container_width=True):
                joined = {c["collection_id"] for c in memberships}
                choices = [c for c in store.list() if c["collection_id"] not in joined]
                if choices:
                    by_id = {c["collection_id"]: c for c in choices}
                    for c in choices:
                        st.session_state.setdefault(_key(catalog, f"join_hash_{run['run_id']}_{c['collection_id']}"), c["hash"])
                    if st.button("刷新可选合集", key=_key(catalog, f"refresh_join_{run['run_id']}")):
                        for c in choices:
                            _clear_edit_hashes(st, catalog, c["collection_id"])
                        st.rerun()
                    with st.form(_key(catalog, f"join_{run['run_id']}")):
                        cid = st.selectbox("选择合集", list(by_id), format_func=lambda c: by_id[c]["title"])
                        role = st.text_input("数据角色")
                        note = st.text_area("关联说明")
                        if st.form_submit_button("确认加入"):
                            store.add(cid, run["run_id"], role=role, note=note,
                                      expected_hash=st.session_state[_key(catalog, f"join_hash_{run['run_id']}_{cid}")])
                            _clear_edit_hashes(st, catalog, cid)
                            st.rerun()
                else:
                    st.caption("暂无其他可选合集。新建合集时，当前数据会自动加入。")
                with st.expander("＋ 新建合集并加入"):
                    _create(st, catalog, store, run["run_id"])
    except (ValueError, OSError, KeyError) as exc:
        st.error(f"无法读取或更新所属合集：{exc}")
