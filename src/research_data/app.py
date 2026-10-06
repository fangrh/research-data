"""Chinese Streamlit browser; launch with ``streamlit run app.py -- ROOT``."""
from __future__ import annotations
import argparse, base64, copy, hashlib, json, os, re, tempfile, zipfile
from urllib.parse import quote
from pathlib import Path
from typing import Any
from research_data.plotting import THEMES, export_plot, render_plot
from research_data.social import Interactions
from research_data.thumbnails import human_count
from research_data.ui import (STYLES, browse_url, card_html, detail_html,
                              header_html, hero_html, ranking_html, section_html)

def _catalog(root: str):
    from research_data.catalog import Catalog
    return Catalog(Path(root))

def _project_api():
    try:
        from research_data.project import CONFIG_NAME, ProjectTemplates
        return CONFIG_NAME, ProjectTemplates
    except Exception:
        return "research-data.project.json", None

def _style_defaults(theme: str = "paper"):
    return {"font_family": "Arial", "font_size": 14, "title_size": 20,
            "axis_title_size": 15, "tick_size": 12, "legend_size": 12,
            "line_width": 2, "marker_size": 7, "line_dash": "solid",
            "show_grid": True, "show_legend": True, "legend_position": "bottom",
            "colors": list(THEMES.get(theme, THEMES["paper"]).get("colors", [])),
            "colorscale": "Viridis"}

def _project_origin(recipe):
    origin = recipe.get("_project_template") if isinstance(recipe, dict) else None
    return copy.deepcopy(origin) if isinstance(origin, dict) else None

def _validate_template_recipe(recipe):
    if not isinstance(recipe, dict):
        raise ValueError("模板配方必须是 JSON 对象")
    kind = str(recipe.get("kind", "line")).lower()
    if kind not in {"line", "scatter", "compare", "heatmap", "complex", "panels"}:
        raise ValueError(f"模板图形类型 {kind!r} 不受支持")
    if kind == "panels" and (not isinstance(recipe.get("panels"), list) or not recipe["panels"]):
        raise ValueError("多面板模板必须包含非空 panels 列表")
    if "style" in recipe and not isinstance(recipe["style"], dict):
        raise ValueError("模板 style 必须是 JSON 对象")
    if "layout" in recipe and not isinstance(recipe["layout"], dict):
        raise ValueError("模板 layout 必须是 JSON 对象")
    return recipe

def _font_preset(family):
    if family == "Times New Roman":
        return "衬线"
    if family == "Courier New":
        return "等宽"
    if family == "Arial":
        return "无衬线"
    return "自定义"

def _set_font_preset(st, select_key, widget_key):
    preset = st.session_state.get(select_key)
    values = {"无衬线": "Arial", "衬线": "Times New Roman", "等宽": "Courier New"}
    if preset in values:
        st.session_state[widget_key] = values[preset]

def _validate_recipe_for_data(recipe, datasets, labels):
    recipe = _validate_template_recipe(recipe)
    if datasets:
        render_plot(datasets, recipe, labels=labels)
    return recipe

def _template_label(name, project):
    return f"project:{name}" if project else str(name)

def _categories(runs):
    values = {"全部"}
    for r in runs:
        c = r.get("categories", []) or []
        if isinstance(c, dict):
            values.update(f"{k}={v}" for k, v in c.items())
        else:
            values.update(map(str, c))
    return ["全部", *sorted(values - {"全部"})]

def _category_match(run, selected):
    if selected == "全部": return True
    c = run.get("categories", []) or []
    return selected in ({f"{k}={v}" for k, v in c.items()} if isinstance(c, dict) else set(map(str, c)))

def _reset_on_run_change(st, identity):
    if st.session_state.get("selected_identity") != identity:
        st.session_state["selected_identity"] = identity
        st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
        for key in ("datasets", "dataset_ids", "figure", "figure_recipe", "figure_inputs", "figure_source_snapshot", "figure_provenance", "figure_archive", "static_download", "loaded_recipe", "figure_generated", "project_recipe_names", "plot_x", "plot_y", "plot_kind", "plot_z", "plot_y_axis", "plot_component", "plot_theme"):
            st.session_state.pop(key, None)

def _reset_file_state(st, identity):
    """File selection is part of data identity, independently of the run basket."""
    if st.session_state.get("data_identity") != identity:
        st.session_state["data_identity"] = identity
        st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
        for key in ("datasets", "dataset_ids", "figure", "figure_recipe", "figure_inputs",
                    "figure_source_snapshot", "figure_provenance", "figure_archive",
                    "static_download", "loaded_recipe", "figure_generated", "viewer_identity", "viewer_recipe", "player"):
            st.session_state.pop(key, None)

def _load_selected_data(st, catalog, run, selected_runs, artifact, reload=False):
    inputs = []
    for item in selected_runs:
        art = artifact if item["run_id"] == run["run_id"] else catalog.select_artifact(item["run_id"])
        inputs.append({"run_id": item["run_id"], "artifact_id": art["artifact_id"], "sha256": art.get("sha256")})
    identity = (str(catalog.root), tuple((i["run_id"], i["artifact_id"], i["sha256"]) for i in inputs))
    _reset_file_state(st, identity)
    if reload or "datasets" not in st.session_state:
        # Verify selected bytes before loading. Never pre-load the file inventory.
        datasets = [catalog.load_dataset(i["run_id"], artifact_id=i["artifact_id"]) for i in inputs]
        st.session_state.update(datasets=datasets, dataset_ids=inputs)
    primary = next(i for i, item in enumerate(inputs) if item["run_id"] == run["run_id"])
    st.session_state["primary_dataset_index"] = primary
    return st.session_state["datasets"][primary]

def _plot_selection(st, datasets, recipe, selected_runs):
    """The heatmap renderer consumes one dataset: use the currently open run."""
    indices = [st.session_state.get("primary_dataset_index", 0)] if recipe.get("kind") == "heatmap" else list(range(len(datasets)))
    inputs = st.session_state.get("dataset_ids", [])
    return ([datasets[i] for i in indices],
            [selected_runs[i].get("title", selected_runs[i]["run_id"]) for i in indices],
            [inputs[i] for i in indices])

def _run_card(st, run):
    st.caption(f"Run: {run['run_id']} · 项目: {run.get('project')} · 样品: {run.get('sample') or '未声明'} · {run.get('kind')} / {run.get('execution_status')}")
    classifications = run.get("categories", {})
    st.caption("分类：" + (" · ".join(f"{k}={v}" for k, v in classifications.items()) if isinstance(classifications, dict) else str(classifications)))
    st.caption("标签：" + " · ".join(run.get("tags", [])))
    if run.get("parameters"):
        with st.expander("运行参数"):
            st.json(run["parameters"])
    with st.expander("完整数据记录（含环境和文件哈希）"):
        st.json(run)
    v = run.get("validation") or {}
    st.caption(f"验证状态：{v.get('status', 'not_checked')}；证据：{v.get('evidence', []) or '未提供'}")
    p = run.get("provenance") or {}
    st.caption(f"Git：{p.get('commit') or p.get('git_commit') or '未知'} / 分支：{p.get('git_branch') or p.get('branch') or '未知'}")

def _file_size(size):
    size = float(size or 0)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB": return f"{size:.0f} {unit}" if unit == "B" else f"{size:.1f} {unit}"
        size /= 1024

def _dataset_browser(st, catalog, run, selected_runs):
    """One visible file selection owns the preview, editor and analysis inputs."""
    from research_data.dataset_view import artifact_inventory, dataset_variables, default_recipe, bounded_preview
    from research_data.catalog import _inside, _sha
    inventory = artifact_inventory(run)
    if not inventory:
        _reset_file_state(st, (str(catalog.root), run["run_id"], None))
        st.session_state.update(viewer_artifact_id=None, viewer_loadable=False)
        st.info("此运行还没有登记文件。")
        return
    rid = run["run_id"]
    st.markdown(section_html("数据查看器", f"{len(inventory)} 个文件 · 选择文件，再选择变量"), unsafe_allow_html=True)
    nav, view = st.columns([1, 2.2])
    with nav, st.container(key="rd_data_nav"):
        query = st.text_input("搜索文件 / 变量", key=f"file_search_{rid}", placeholder="文件名、说明或变量")
        matches = artifact_inventory(run, query)
        by_id = {a["artifact_id"]: a for a in inventory}
        current_key = f"file_choice_{rid}"
        default = next((a for a in inventory if a["loadable"]), inventory[0])["artifact_id"]
        remembered_key = f"selected_file_{rid}"
        selected = st.session_state.get(current_key, st.session_state.get(remembered_key, default))
        if selected not in by_id: selected = default
        if matches:
            # Keep the list small even when one run contains thousands of outputs.
            page_key = f"file_page_{rid}"
            pages = max(1, -(-len(matches) // 20))
            if st.session_state.get(f"file_filter_{rid}") != query:
                st.session_state[page_key] = 1
                st.session_state[f"file_filter_{rid}"] = query
            page = min(st.session_state.get(page_key, 1), pages)
            visible = matches[(page - 1) * 20:page * 20]
            options = [a["artifact_id"] for a in visible]
            if selected not in options: selected = options[0]
            st.session_state[current_key] = selected
            with st.container(height=min(300, 100 * len(visible) + 46)):
                selected = st.radio("数据文件", options, key=current_key, format_func=lambda aid: by_id[aid]["name"],
                                    captions=[f"{a['format'].upper()} · {_file_size(a['size_bytes'])} · {len(a['variables'])} 变量\n{a['description'][:90]}" for a in visible])
            if pages > 1: st.pagination(pages, key=page_key, max_visible_pages=3)
        else:
            st.caption("没有匹配文件；仍显示当前选中的数据。")
        st.session_state[remembered_key] = selected
        art = next(a for a in run["artifacts"] if a["artifact_id"] == selected)
        summary = by_id[selected]
        ds = None
        reload = st.button("加载所选运行", disabled=not summary["loadable"], help="数据已自动读取。此按钮重新校验当前文件；对比运行使用各自的默认数据文件。")
        if summary["loadable"]:
            try: ds = _load_selected_data(st, catalog, run, selected_runs, art, reload=reload)
            except Exception as exc:
                _reset_file_state(st, (str(catalog.root), rid, selected, "unavailable"))
                st.error(f"无法加载所选数据：{exc}")
        else:
            _reset_file_state(st, (str(catalog.root), rid, selected, art.get("sha256")))
        st.session_state["viewer_artifact_id"] = selected
        st.session_state["viewer_loadable"] = summary["loadable"]
        variable = None
        groups = dataset_variables(ds) if ds is not None else []
        if groups:
            names = [g["name"] for g in groups]
            preferred = next((n for n in names if default_recipe(ds, n)), names[0])
            variable = st.selectbox("显示变量", names, index=names.index(preferred), key=f"viewer_variable_{rid}_{selected}")
            group = next(g for g in groups if g["name"] == variable)
            st.caption(f"{group['unit'] or '单位未声明'} · 形状 {tuple(group['shape'])}")
            st.caption("依赖坐标：" + (" → ".join(group["coordinates"]) or "未声明；表格显示索引"))
            if group["description"]: st.caption(group["description"])
        st.session_state["viewer_variable"] = variable
    with view, st.container(key="rd_data_view"):
        st.markdown("**" + summary["name"].replace("*", "\\*") + "**")
        st.caption(summary["description"] or "文件说明未填写")
        plot_tab, table_tab, info_tab, animation_tab = st.tabs(["📈 图表", "▦ 数据表", "变量 / 文件详情", "🎬 动画"], key=f"viewer_tabs_{rid}", on_change="rerun")
        if ds is not None and variable is not None:
            preview_recipe = default_recipe(ds, variable)
            viewer_identity = (selected, variable)
            if st.session_state.get("viewer_identity") != viewer_identity:
                st.session_state["viewer_identity"] = viewer_identity
                st.session_state["loaded_recipe"] = copy.deepcopy(preview_recipe or {})
                st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
                for k in ("figure", "figure_recipe", "figure_inputs", "static_download", "figure_generated", "viewer_recipe"):
                    st.session_state.pop(k, None)
            with plot_tab:
                if preview_recipe:
                    rev = f"{rid}_{selected}_{variable}"
                    theme_col, font_col = st.columns([2, 1])
                    theme = theme_col.selectbox("查看风格", list(THEMES), key=f"viewer_theme_{rid}", format_func=lambda n: f"{n} — {THEMES[n]['description']}")
                    font_size = font_col.number_input("查看字号", 6, 40, 14, key=f"viewer_font_{rid}")
                    preview_recipe.update(theme=theme, height=380, style={"font_size": font_size, "tick_size": font_size, "axis_title_size": font_size})
                    if ds[variable].dtype.kind == "c":
                        preview_recipe["component"] = st.selectbox("查看复数分量", ["real", "imag", "abs", "phase"], key=f"viewer_component_{rev}")
                    if preview_recipe.get("slices"):
                        preview_recipe["slices"] = {dim: st.number_input(f"查看切片 {dim}", 0, ds.sizes[dim] - 1, 0, key=f"viewer_slice_{dim}_{rev}") for dim in preview_recipe["slices"]}
                    try:
                        fig = render_plot([ds], preview_recipe, labels=[run.get("title", rid)])
                        st.plotly_chart(fig, use_container_width=True, theme=None, key=f"player_{rid}")
                        st.session_state["viewer_recipe"] = copy.deepcopy(preview_recipe)
                        st.session_state["player"] = "plot"
                        if st.button("在绘图编辑器中使用", key=f"viewer_apply_{rid}"):
                            st.session_state["loaded_recipe"] = copy.deepcopy(preview_recipe)
                            st.session_state["widget_rev"] += 1
                            st.rerun()
                    except Exception as exc: st.info(f"此变量暂无法自动绘图：{exc}；可查看数据表或使用下方配方。")
                else: st.info("此变量是标量、文本或缺少可绘制坐标；请查看数据表，或在下方指定绘图配方。")
            with table_tab:
                if table_tab.open:
                    frame = bounded_preview(ds, variable, limit=100)
                    # Arrow cannot encode complex numbers; retain exact values as text.
                    for col in frame:
                        if frame[col].dtype.kind == "c": frame[col] = frame[col].map(str)
                    st.dataframe(frame, hide_index=True, use_container_width=True)
                    st.caption(f"显示前 {len(frame)} / {ds[variable].size:,} 个值 · 保留登记数据顺序")
            with animation_tab:
                if animation_tab.open and ds[variable].ndim == 2 and ds[variable].dtype.kind in "biufc":
                    from research_data.thumbnails import animated_gif
                    from research_data.plotting import _component
                    component = preview_recipe.get("component", "real") if preview_recipe else "real"
                    st.caption(f"{variable}：沿 {ds[variable].dims[0]} 逐行播放 · {component} · 全局归一化")
                    try:
                        gif = animated_gif(_component(ds[variable].values, component))
                        if gif: st.image(gif, use_container_width=True)
                        else: st.caption("此矩阵没有足够的有效值生成动画。")
                    except Exception as exc: st.caption(f"动画不可用：{exc}")
                elif animation_tab.open: st.caption("此变量没有可逐行播放的二维矩阵。")
        elif not summary["loadable"]:
            with plot_tab:
                path = _inside(catalog.root / "runs" / rid, art["path"])
                if path.is_file() and _sha(path) == art.get("sha256"):
                    if summary["format"] in {"png", "jpg", "jpeg", "webp", "gif"}:
                        st.image(path.read_bytes(), caption=summary["description"])
                        st.session_state["player"] = "figures"
                    else: st.info("此文件是日志、配方、已登记图或暂不支持的格式；可在文件详情中下载。")
                else: st.error("文件缺失或校验不符。")
        with info_tab:
            if info_tab.open:
                if groups: st.dataframe(groups, hide_index=True, use_container_width=True)
                elif summary["variables"]: st.dataframe(summary["variables"], hide_index=True, use_container_width=True)
                st.caption(f"Artifact: {selected} · SHA256: {art.get('sha256', '未知')}")
                st.json({"format": summary["format"], "role": summary["role"], "profile": art.get("profile"), "metadata": art.get("metadata")})
                path = _inside(catalog.root / "runs" / rid, art["path"])
                if path.is_file() and _sha(path) == art.get("sha256"):
                    st.download_button("下载原始文件", path.read_bytes(), file_name=summary["name"], key="download_artifact")
                else: st.error("文件缺失或校验不符，无法下载。")
    return art


def _data_artifact(run):
    artifacts = run.get("artifacts", []) or []
    return next((a for a in artifacts if a.get("role") not in {"log", "stdout", "stderr"} and a.get("format") not in {"log", "txt"}), artifacts[0] if artifacts else None)


def _browse_file_counts(catalog, runs):
    """Enrich display summaries from the index without changing stored parameters."""
    if all((r.get("parameters") or {}).get("file_count") is not None for r in runs):
        return runs
    with catalog._connect() as connection:
        counts = dict(connection.execute("SELECT run_id, COUNT(*) FROM artifacts GROUP BY run_id"))
    return [{**r, "parameters": {**(r.get("parameters") or {}), "file_count": counts.get(r["run_id"], 0)}}
            if (r.get("parameters") or {}).get("file_count") is None else r for r in runs]


def _browse_order(runs, order):
    """A deterministic project-balanced feed; scientific acquisition order is untouched."""
    if order == "文件最多":
        return sorted(runs, key=lambda r: ((r.get("parameters") or {}).get("file_count") or 0,
                                          r.get("created_at") or ""), reverse=True)
    ordered = sorted(runs, key=lambda r: r.get("created_at") or "", reverse=order != "最早优先")
    if order != "推荐":
        return ordered
    from collections import deque
    groups = {}
    for run in ordered:
        groups.setdefault(run.get("project") or "", deque()).append(run)
    queues = deque(groups.values())
    result = []
    while queues:
        queue = queues.popleft()
        result.append(queue.popleft())
        if queue:
            queues.append(queue)
    return result


def _search_home(st):
    for key in ("pick", "up", "fav"):
        st.query_params.pop(key, None)
    st.session_state.pop("card_pick", None)
    st.session_state.pop("up_filter", None)

def main(root: str | None = None) -> None:
    import streamlit as st
    st.set_page_config(page_title="研究数据浏览器", page_icon="📈", layout="wide")
    from research_data.agent import default_catalog
    params = dict(st.query_params)
    query_catalog = params.get("catalog")
    if query_catalog and st.session_state.get("_last_query_catalog") != query_catalog:
        st.session_state["catalog_root"] = str(query_catalog)
    st.session_state["_last_query_catalog"] = query_catalog
    root = st.session_state.get("catalog_root") or root or default_catalog()
    context = {"catalog": str(root), "project_dir": str(st.session_state.get("project_dir") or
               params.get("project_dir") or os.environ.get("RESEARCH_DATA_PROJECT", str(Path.cwd())))}
    home_url = browse_url(context)
    st.markdown(STYLES, unsafe_allow_html=True)
    with st.container(key="rd_header"):
        head_l, head_m, head_r = st.columns([1.5, 2.2, .7], vertical_alignment="center")
        with head_l:
            st.markdown(header_html(home_url, browse_url(context, fav="1"),
                                   "favorites" if params.get("fav") == "1" else "home"), unsafe_allow_html=True)
        with head_m:
            query = st.text_input("搜索标题 / 描述 / 标签", placeholder="搜索数据、项目、标签或源代码…",
                                  label_visibility="collapsed", on_change=_search_home, args=(st,))
        with head_r:
            settings = st.popover("管理 / 导入", use_container_width=True)
    with settings:
        st.markdown("**资料库与项目设置**")
        st.text_input("Catalog 根目录", value=str(root), key="catalog_root")
        root = st.session_state.catalog_root
        query_project = st.query_params.get("project_dir") if hasattr(st, "query_params") else None
        if query_project and st.session_state.get("_last_query_project_dir") != query_project:
            st.session_state["project_dir"] = str(query_project)
        st.session_state["_last_query_project_dir"] = query_project
        project_default = str(query_project or os.environ.get("RESEARCH_DATA_PROJECT", str(Path.cwd())))
        project_dir = st.text_input("模板项目目录", value=project_default, key="project_dir")
        st.session_state["project_templates"] = None
        _config_name, _ProjectTemplates = _project_api()
        project_path = Path(project_dir).expanduser() if project_dir else None
        if _ProjectTemplates and project_path and project_path.is_dir() and (project_path / _config_name).is_file():
            try:
                st.session_state["project_templates"] = _ProjectTemplates(project_path)
            except Exception as exc:
                st.error(f"模板项目配置不可用：{exc}")
        elif project_path and project_path.is_dir() and (project_path / _config_name).exists():
            st.error(f"模板项目配置不可用：{project_path / _config_name}")
        elif project_path and (project_path / _config_name).exists():
            st.error(f"模板项目目录不是目录：{project_path}")
        if _ProjectTemplates and project_path and st.button("初始化模板项目"):
            try:
                _ProjectTemplates.initialize(project_path)
                st.success("模板项目已初始化；重新加载后可使用模板。")
            except Exception as exc:
                st.error(f"初始化模板项目失败：{exc}")
        with st.expander("使用帮助 / Help"):
            st.markdown("这是本地 Web 应用，数据保存在所选 Catalog。\n\n"
                        "**生成新数据：** 用 `run` 包装计算或实验脚本。\n\n"
                        "**导入旧数据：** 用 `import` 和可复用的 `profile`。\n\n"
                        "**定位与绘图：** 用 `search` / `show` 查来源，用 `plot` 套用配方；也可直接操作此界面。")
            st.code("research-data help\nresearch-data help run\nresearch-data guide plot\nresearch-data help --json", language="text")
            st.caption("Windows 可双击 Start-ResearchData.cmd 或桌面快捷方式。关闭网页后后台服务仍运行；用 research-data stop 停止。")
    if st.session_state.get("catalog_root_state") != root:
        st.session_state["catalog_root_state"] = root
        st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
        for key in ("selected_identity", "datasets", "dataset_ids", "figure", "figure_recipe", "figure_inputs", "figure_source_snapshot", "figure_provenance", "figure_archive", "static_download", "loaded_recipe"):
            st.session_state.pop(key, None)
    try:
        catalog = _catalog(root); runs = _browse_file_counts(catalog, catalog.list_runs_summary())
    except Exception as exc:
        st.error(f"无法打开 catalog：{exc}"); return
    social = Interactions(root)
    # 封面直点：URL ?pick=<run_id> 进入专属视频页（Bilibili BV 页，整页只显示该数据）
    # ?up=<名> 进入 UP（脚本/项目）筛选
    pick = None
    if hasattr(st, "query_params"):
        pick = st.query_params.get("pick")
        if pick and re.fullmatch(r"[A-Za-z0-9_\-]+", pick):
            st.session_state["card_pick"] = pick
        up_param = st.query_params.get("up")
        if up_param != st.session_state.get("_last_query_up"):
            st.session_state.pop("up_filter", None)
            generators = {str(r["categories"]["generator"]) for r in runs
                          if isinstance(r.get("categories"), dict) and r["categories"].get("generator")}
            projects = {r.get("project") for r in runs}
            if up_param and (up_param in generators or up_param in projects):
                field = "generator" if up_param in generators else "project"
                st.session_state["up_filter"] = {"field": field, "value": up_param}
        st.session_state["_last_query_up"] = up_param

    @st.cache_data(show_spinner=False, max_entries=600)
    def _cover_png(catalog_root: str, run_id: str, badge: str = "", fp_key: str = "", project: str = ""):
        """封面（缓存）。优先级：run 级 cover artifact > 项目模型示意图
        （catalog/covers/<project>.png，由 agent 生成）> 数据 sparkline >
        参数指纹（蓝色）> None 占位卡。"""
        try:
            from research_data.catalog import Catalog, _inside
            from research_data.thumbnails import draw_sparkline, fingerprint_series, series_for_artifact
            cat = Catalog(catalog_root)
            manifest = cat.get(run_id)
            run_dir = cat.root / "runs" / run_id
            # 1) run 级封面（agent 登记的 role=cover 图片）
            for art in manifest.get("artifacts", []):
                if art.get("role") == "cover" and art.get("format") in {"png", "jpg", "jpeg", "webp"}:
                    try:
                        path = _inside(run_dir, art["path"])
                        if path.is_file() and path.stat().st_size < 8_000_000:
                            return path.read_bytes(), "model"
                    except ValueError:
                        pass
            # 2) 项目模型示意图（agent 按物理模型批量生成）
            if project:
                shared = cat.root / "covers" / f"{project}.png"
                if shared.is_file() and shared.stat().st_size < 8_000_000:
                    return shared.read_bytes(), "model"
            candidates = sorted(manifest.get("artifacts", []),
                                key=lambda a: a.get("size_bytes") or 0)[:8]
            for art in candidates:
                if (art.get("size_bytes") or 0) > 20_000_000:
                    continue
                try:
                    path = _inside(run_dir, art["path"])
                except ValueError:
                    continue
                series = series_for_artifact(path)
                if series:
                    return draw_sparkline(series, badge=badge or None), "data"
            if fp_key:
                import json as _json
                try:
                    fp = fingerprint_series(_json.loads(fp_key))
                except ValueError:
                    fp = None
                if fp is not None:
                    return draw_sparkline([fp], badge=badge or None, accent=(112, 158, 255)), "fingerprint"
            return None, "none"
        except Exception:
            return None, "none"

    with settings:
        with st.expander("首次导入 / Import profile", expanded=not bool(runs)):
            st.caption("填写文件路径和 JSON mapping；配置会作为 artifact profile 保存。")
            path = st.text_input("数据文件路径", key="import_path")
            project_templates = st.session_state.get("project_templates")
            profile_names = sorted((project_templates.config.get("profiles", {}) if project_templates else {}) or {})
            profile_choice = st.selectbox("项目 profile", ["（无）", *profile_names], key="import_profile")
            if profile_choice != "（无）" and st.button("应用 profile"):
                try:
                    profile = project_templates.profile(profile_choice)
                    st.session_state["import_mapping"] = json.dumps(profile, ensure_ascii=False, indent=2)
                    st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
                    st.rerun()
                except Exception as exc:
                    st.error(f"无法应用 profile：{exc}")
            mapping_text = st.text_area("mapping JSON", value='{"x": "time"}', key="import_mapping")
            title = st.text_input("实验标题", value="首次导入", key="import_title")
            if st.button("导入并登记"):
                try:
                    profile = json.loads(mapping_text)
                    run = catalog.start_run(title, kind="experiment", parameters={"profile": profile})
                    run.add_artifact(path, role="raw", profile=profile); run.finish(); st.success("已登记；刷新筛选即可查看。"); st.rerun()
                except Exception as exc: st.error(f"导入失败：{exc}")
    if not runs:
        st.markdown(hero_html(0, 0), unsafe_allow_html=True)
        st.info("资料库还没有数据。点击右上角“管理 / 导入”添加数据，或用 research-data run 登记计算。")
        return
    dedicated = next((r for r in runs if r["run_id"] == pick), None) \
        if pick and re.fullmatch(r"[A-Za-z0-9_\-]+", pick) else None
    if pick and dedicated is None:
        st.warning(f"未找到运行 {pick}，已回到首页。")
    only_favorites = (hasattr(st, "query_params") and st.query_params.get("fav") == "1")
    up_filter = st.session_state.get("up_filter")  # {"field": "generator"|"project", "value": str}
    if dedicated is not None:
        # ── 专属视频页（Bilibili BV 页）：整页只显示这组数据 ──
        st.markdown(f"<a class='rd-back' href='{home_url.replace('&', '&amp;')}' target='_self'>← 返回首页</a>", unsafe_allow_html=True)
        related6 = sorted((r for r in runs
                           if r.get("project") == dedicated.get("project") and r["run_id"] != dedicated["run_id"]),
                          key=lambda r: r.get("created_at") or "", reverse=True)[:6]
        compare_ids = [rid for rid in (st.session_state.get("compare_ids") or []) if rid != dedicated["run_id"]]
        by_id = {r["run_id"]: r for r in runs}
        _seen, _filtered = set(), []
        for r in [dedicated, *related6, *[by_id[rid] for rid in compare_ids if rid in by_id]]:
            if r["run_id"] not in _seen:
                _seen.add(r["run_id"]); _filtered.append(r)
        filtered = _filtered
        picked, view, order = [], "卡片", "最新优先"
    else:
        # ── 排序小 tab（Bilibili 分区页样式）──
        st.markdown(hero_html(len(runs), {r.get("project") for r in runs if r.get("project")}), unsafe_allow_html=True)
        order = {"推荐": "推荐", "最新": "最新优先", "最早": "最早优先", "最多文件": "文件最多"}.get(
            st.pills("排序", ["推荐", "最新", "最早", "最多文件"], default="推荐", label_visibility="collapsed"), "推荐")
        # ── 分区导航行：项目频道（Bilibili 频道栏），按 run 数取前 15 ──
        project_counts: dict[str, int] = {}
        for r in runs:
            if r.get("project"):
                project_counts[r["project"]] = project_counts.get(r["project"], 0) + 1
        channel = None
        if len(project_counts) > 1:
            top_projects = sorted(project_counts, key=lambda p: -project_counts[p])[:15]
            channel = st.pills("分区", sorted(top_projects), default=None, label_visibility="collapsed", wrap=True)
            if len(project_counts) > 15:
                with st.expander(f"📺 全部分区（{len(project_counts)} 个）"):
                    all_channel = st.pills("全部分区", sorted(project_counts), default=None,
                                           key="channel_all", label_visibility="collapsed", wrap=True)
                    if all_channel:
                        channel = all_channel
        # UP 主筛选（点击卡片上的 UP 行进入；chip 可移除）
        if up_filter:
            chip_a, _ = st.columns([1, 3])
            if chip_a.button(f"UP · {up_filter['value']} ✕", key="up_filter_chip",
                             type="primary", use_container_width=False):
                st.session_state.pop("up_filter", None)
                try:
                    del st.query_params["up"]
                except Exception:
                    pass
                st.rerun()
        base = [r for r in runs
                if (not channel or r.get("project") == channel)
                and (not up_filter or (
                    (up_filter["field"] == "generator" and isinstance(r.get("categories"), dict)
                     and str(r["categories"].get("generator")) == up_filter["value"])
                    or (up_filter["field"] == "project" and r.get("project") == up_filter["value"])))]
        collections = sorted({str(r["categories"]["collection"]) for r in base
                              if isinstance(r.get("categories"), dict) and r.get("categories", {}).get("collection") is not None})
        if 1 < len(collections) <= 12:
            zone = st.pills("收藏夹分区", ["全部", *collections], default="全部", label_visibility="collapsed")
            if zone and zone != "全部":
                base = [r for r in base if isinstance(r.get("categories"), dict)
                        and str(r["categories"].get("collection")) == zone]
        needle = query.casefold()
        if only_favorites:
            favs = set(Interactions(root).favorites())
            base = [r for r in base if r["run_id"] in favs]
        filtered = [r for r in base
                    if (not needle or needle in json.dumps(r, ensure_ascii=False, default=str).casefold())]
        filtered = _browse_order(filtered, order)
        if not filtered:
            st.info("没有找到匹配的数据，试试其他关键词或分区。")
            return

        title = "我的收藏" if only_favorites else ("搜索结果" if query else (channel or "发现数据"))
        subtitle = f"{len(filtered):,} 条运行" + (" · 按项目均衡展示" if order == "推荐" else "")
        st.markdown(section_html(title, subtitle), unsafe_allow_html=True)
        wall_col, rank_col = st.columns([4, 1.1])
        with wall_col, st.container(key="rd_wall"):
            page_size = 12
            num_pages = max(1, -(-len(filtered) // page_size))
            filter_key = (query, channel, only_favorites, str(up_filter), order, len(filtered))
            if st.session_state.get("_feed_filter") != filter_key:
                st.session_state["cards_page"] = 1
                st.session_state["_feed_filter"] = filter_key
            page = min(max(1, st.session_state.get("cards_page", 1)), num_pages)
            page_runs = filtered[(page - 1) * page_size:page * page_size]
            cards = []
            for r in page_runs:
                if (r.get("parameters") or {}).get("file_count") is None:
                    r = {**r, "artifacts": catalog.get(r["run_id"]).get("artifacts", [])}
                fc = (r.get("parameters") or {}).get("file_count")
                badge = f"{human_count(fc)} 个文件" if fc is not None else ""
                png, mode = _cover_png(str(root), r["run_id"], badge,
                                      fp_key=json.dumps(r.get("parameters") or {}, sort_keys=True, default=str),
                                      project=str(r.get("project") or ""))
                cats = r.get("categories") if isinstance(r.get("categories"), dict) else {}
                up = str(cats.get("generator") or r.get("project") or "")
                cards.append(card_html(r, png, browse_url(context, pick=r["run_id"]),
                                       browse_url(context, up=up), social.state(r["run_id"]), badge, mode))
            st.markdown("<div class='rd-card-grid'>" + "".join(cards) + "</div>", unsafe_allow_html=True)
            st.pagination(num_pages, key="cards_page", max_visible_pages=7)
        with rank_col, st.container(key="rd_sidebar"):
            links = {r["run_id"]: browse_url(context, pick=r["run_id"]) for r in filtered}
            hot = _browse_order(filtered, "文件最多")[:8]
            st.markdown(ranking_html(hot, links), unsafe_allow_html=True)
            fav_ids = set(social.favorites())
            favorites = [r for r in filtered if r["run_id"] in fav_ids][:5]
            if favorites:
                st.markdown(ranking_html(favorites, links, "我的收藏", "已收藏的运行"), unsafe_allow_html=True)
        return
    if not filtered: st.info("调整筛选条件即可浏览数据。"); return
    card_pick = st.session_state.get("card_pick")
    current = next((r for r in filtered if r["run_id"] == card_pick), None) or \
              (filtered[picked[0]] if picked else filtered[0])
    compare_ids = list(st.session_state.get("compare_ids") or [])
    if compare_ids:
        chips = st.columns(min(len(compare_ids) + 1, 7))
        for i, rid in enumerate(compare_ids):
            title = next((r.get("title", rid) for r in filtered if r["run_id"] == rid), rid)
            if chips[min(i, 6)].button(f"✕ {str(title)[:24]}", key=f"drop_{rid[:16]}"):
                st.session_state["compare_ids"] = [x for x in compare_ids if x != rid]; st.rerun()
    chosen_summaries = [current] + [r for r in filtered if r["run_id"] in set(compare_ids) and r["run_id"] != current["run_id"]]
    chosen_summaries.sort(key=lambda r: r.get("created_at") or "")  # 输入按时间正序
    selected_runs = [catalog.get(r["run_id"]) for r in chosen_summaries]
    identity = tuple(r["run_id"] for r in selected_runs); _reset_on_run_change(st, identity)
    run = catalog.get(current["run_id"])

    # ── 视频页布局：左侧数据卡+互动+评论，右侧相关推荐（Bilibili 式）──
    page_l, page_r = st.columns([4, 1.3])
    with page_l, st.container(key="rd_detail"):
        st.markdown(detail_html(run), unsafe_allow_html=True)
        _dataset_browser(st, catalog, run, selected_runs)
        with st.expander("运行详情 / 来源与参数"):
            _run_card(st, run)
        state = social.state(run["run_id"])
        act_a, act_b, act_c = st.columns([1, 1, 3])
        if act_a.button(("👍 已赞" if state["liked"] else "👍 点赞"), key=f"like_{run['run_id']}",
                        type="primary" if state["liked"] else "secondary", use_container_width=True):
            social.like(run["run_id"], not state["liked"]); st.rerun()
        if act_b.button(("⭐ 已收藏" if state["favorite"] else "⭐ 收藏"), key=f"fav_{run['run_id']}",
                        type="primary" if state["favorite"] else "secondary", use_container_width=True):
            social.favorite(run["run_id"], not state["favorite"]); st.rerun()
        act_c.caption(f"{state['comments']} 条评论")
        st.markdown("**💬 评论**")
        for c in social.comments(run["run_id"]):
            st.markdown(f"**{c['author']}** · `{(c.get('ts') or '')[:16].replace('T', ' ')}`\n\n{c['text']}")
        new_comment = st.text_area("写评论", key=f"comment_box_{run['run_id']}", height=68)
        post_col, agent_col = st.columns(2)
        if post_col.button("发布评论", key=f"comment_post_{run['run_id']}", use_container_width=True) and new_comment.strip():
            social.add_comment(run["run_id"], new_comment); st.rerun()
        if agent_col.button("🤖 派 agent 评价", key=f"review_{run['run_id']}", use_container_width=True,
                            help="把评论框内容作为评价指令派给 AI agent（research-data review 领取）"):
            from research_data.review import request_review
            request_review(root, run["run_id"], instruction=new_comment)
            st.session_state[f"review_sent_{run['run_id']}"] = True
            st.rerun()
        if st.session_state.get(f"review_sent_{run['run_id']}"):
            st.session_state.pop(f"review_sent_{run['run_id']}", None)
            st.success("已派出评价请求：agent 用 `research-data review list` 领取并回复到这里。")
        try:
            from research_data.review import list_pending
            pending_n = sum(1 for r in list_pending(root) if r["run_id"] == run["run_id"])
            if pending_n:
                st.caption(f"🤖 {pending_n} 条评价请求待 agent 处理")
        except Exception:
            pass
    with page_r, st.container(key="rd_related"):
        if st.button("加入对比", use_container_width=True) and current["run_id"] not in compare_ids and len(compare_ids) < 6:
            compare_ids.append(current["run_id"]); st.session_state["compare_ids"] = compare_ids; st.rerun()
        related_pool = [r for r in filtered if r.get("project") == run.get("project")
                        and r["run_id"] != run["run_id"]][:6]
        if related_pool:
            links = {r["run_id"]: browse_url(context, pick=r["run_id"]) for r in related_pool}
            st.markdown(ranking_html(related_pool, links, "同项目数据", "最新登记的相关运行"), unsafe_allow_html=True)
    snapshot = (run.get("provenance") or {}).get("snapshot") or {}
    if snapshot.get("path"):
        archive = Path(root) / "runs" / run["run_id"] / snapshot["path"]
        with st.expander("来源快照（只读）"):
            if archive.is_file():
                try:
                    with zipfile.ZipFile(archive) as zf:
                        members = zf.namelist(); member = st.selectbox("来源文件", members or ["（空归档）"])
                        if member in members: st.code(zf.read(member).decode("utf-8", errors="replace"), language="text")
                except zipfile.BadZipFile: st.error("来源归档损坏，无法浏览。")
                st.download_button("下载来源快照", archive.read_bytes(), file_name="snapshot.zip", mime="application/zip")
            else: st.info("此运行没有可用来源快照。")
    datasets = st.session_state.get("datasets")
    if not datasets: return
    ds = datasets[st.session_state.get("primary_dataset_index", 0)]
    with st.expander("变量与预览", expanded=False):
        st.dataframe({n: {"维度": str(v.dims), "形状": str(v.shape), "单位": v.attrs.get("units", "未声明"), "类型": str(v.dtype)} for n, v in ds.data_vars.items()})
        st.caption("选中变量的前 100 个值在上方“数据表”中查看。")
        if len(datasets) > 1: st.json(st.session_state.get("dataset_ids", []))
    names, axes = list(ds.data_vars), list(ds.coords) or list(ds.variables)
    axes = list(dict.fromkeys([*axes, *[name for name, value in ds.data_vars.items() if value.ndim == 1]]))
    if not names or not axes: st.info("此文件没有可供配方使用的变量和坐标。"); return
    st.subheader("绘图编辑器")
    loaded_recipe = copy.deepcopy(st.session_state.get("loaded_recipe", {}))
    loaded = {**loaded_recipe, **(loaded_recipe.get("style", {}) if isinstance(loaded_recipe.get("style"), dict) else {})}
    x_default = loaded.get("x") if loaded.get("x") in axes else axes[0]
    y_default = [v for v in (loaded.get("y") if isinstance(loaded.get("y"), list) else [loaded.get("y")]) if v in names] or names[:1]
    rev = int(st.session_state.get("widget_rev", 0))
    x, y = st.selectbox("X 变量", axes, index=axes.index(x_default), key=f"plot_x_{rev}"), st.multiselect("Y 变量", names, default=y_default, key=f"plot_y_{rev}")
    kinds = ["line", "scatter", "compare", "heatmap", "complex", "panels"]
    kind = st.selectbox("图形", kinds, index=kinds.index(loaded.get("kind")) if loaded.get("kind") in kinds else 0, key=f"plot_kind_{rev}")
    z_default = loaded.get("z") if loaded.get("z") in names else (y[0] if y else names[0])
    if kind == "heatmap":
        z, y_axis = st.selectbox("热图 Z 变量", names, index=names.index(z_default), key=f"plot_z_{rev}"), st.selectbox("热图 Y 轴", axes, index=axes.index(loaded.get("y_axis")) if loaded.get("y_axis") in axes else 0, key=f"plot_y_axis_{rev}")
    else:
        z, y_axis = z_default, loaded.get("y_axis")
    components = ["real", "imag", "abs", "phase"]; themes = list(THEMES)
    component, theme = st.selectbox("复数分量", components, index=components.index(loaded.get("component")) if loaded.get("component") in components else 0, key=f"plot_component_{rev}"), st.selectbox("风格", themes, index=themes.index(loaded.get("theme")) if loaded.get("theme") in themes else 0, key=f"plot_theme_{rev}", format_func=lambda n: f"{n} — {THEMES[n]['description']}")
    slice_dims = [dim for dim in ds.sizes if dim != x and not (kind == "heatmap" and dim == y_axis)]
    slices = {dim: st.number_input(f"切片 {dim}（整数索引）", 0, max(0, ds.sizes[dim] - 1), int((loaded.get("slices") or {}).get(dim, 0)), key=f"slice_{dim}_{rev}") for dim in slice_dims}
    recipe_title = loaded.get("title") or run.get("title", "")
    recipe = copy.deepcopy(loaded_recipe)
    recipe.update({"kind": kind, "x": x, "y": y, "z": z, "y_axis": y_axis, "component": component, "theme": theme, "slices": slices, "title": st.text_input("标题", value=recipe_title, key=f"plot_title_{rev}")})
    with st.expander("字体与图表样式"):
        st.caption("字体需在浏览器或导出环境中可用，可填写逗号分隔的回退字体。预览随窗口缩放，图宽/图高用于导出尺寸。")
        presets = {"无衬线": "Arial", "衬线": "Times New Roman", "等宽": "Courier New", "自定义": "custom"}
        family_loaded = str(loaded.get("font_family", "Arial"))
        preset = st.selectbox("字体预设", list(presets), index=list(presets).index(_font_preset(family_loaded)), key=f"font_preset_{rev}", on_change=_set_font_preset, args=(st, f"font_preset_{rev}", f"font_family_{rev}"))
        font_family = st.text_input("字体", value=loaded.get("font_family", presets[preset] if presets[preset] != "custom" else "Arial"), key=f"font_family_{rev}")
        s1, s2, s3 = st.columns(3)
        recipe["font_size"] = s1.number_input("字号", 6, 72, int(loaded.get("font_size", 14)), key=f"font_size_{rev}")
        recipe["title_size"] = s2.number_input("标题字号", 6, 96, int(loaded.get("title_size", 20)), key=f"title_size_{rev}")
        recipe["axis_title_size"] = s3.number_input("坐标标题字号", 6, 72, int(loaded.get("axis_title_size", 15)), key=f"axis_title_size_{rev}")
        s1, s2, s3 = st.columns(3)
        recipe["tick_size"] = s1.number_input("刻度字号", 6, 72, int(loaded.get("tick_size", 12)), key=f"tick_size_{rev}")
        recipe["legend_size"] = s2.number_input("图例字号", 6, 72, int(loaded.get("legend_size", 12)), key=f"legend_size_{rev}")
        recipe["line_width"] = s3.number_input("线宽", 0.1, 20.0, float(loaded.get("line_width", 2)), key=f"line_width_{rev}")
        s1, s2, s3 = st.columns(3)
        recipe["marker_size"] = s1.number_input("标记大小", 1, 50, int(loaded.get("marker_size", 7)), key=f"marker_size_{rev}")
        recipe["line_dash"] = s2.selectbox("线型", ["solid", "dash", "dot", "dashdot"], index=["solid", "dash", "dot", "dashdot"].index(loaded.get("line_dash", "solid")) if loaded.get("line_dash", "solid") in {"solid", "dash", "dot", "dashdot"} else 0, key=f"line_dash_{rev}")
        recipe["legend_position"] = s3.selectbox("图例位置", ["bottom", "right", "top"], index=["bottom", "right", "top"].index(loaded.get("legend_position", "bottom")), key=f"legend_position_{rev}")
        s1, s2, s3 = st.columns(3)
        recipe["show_grid"] = s1.checkbox("显示网格", value=bool(loaded.get("show_grid", True)), key=f"show_grid_{rev}")
        recipe["show_legend"] = s2.checkbox("显示图例", value=bool(loaded.get("show_legend", True)), key=f"show_legend_{rev}")
        recipe["colorscale"] = s3.text_input("颜色刻度", value=loaded.get("colorscale", "Viridis"), key=f"colorscale_{rev}")
        recipe["width"] = st.number_input("图宽", 200, 3000, int(loaded.get("width", 0) or 900), key=f"plot_width_{rev}")
        recipe["height"] = st.number_input("图高", 200, 3000, int(loaded.get("height", 500)), key=f"plot_height_{rev}")
        recipe["font_family"] = font_family
        recipe["colors"] = list(loaded.get("colors") or THEMES.get(theme, {}).get("colors", []))
        _style_keys = ("font_family", "font_size", "title_size", "axis_title_size", "tick_size", "legend_size", "line_width", "marker_size", "line_dash", "show_grid", "show_legend", "legend_position", "colors", "colorscale")
        recipe["style"] = {key: recipe.pop(key, _style_defaults(theme)[key]) for key in _style_keys}
    if kind == "panels":
        st.caption("多面板配方使用 panels 列表，每项是普通绘图配方；columns 支持 1–4。")
        recipe["columns"] = st.number_input("面板列数", 1, 4, int(loaded.get("columns", 2)), key=f"panel_columns_{rev}")
        recipe["panels"] = loaded.get("panels") if isinstance(loaded.get("panels"), list) else []
    try: recipe_names = catalog.list_recipes()
    except Exception: recipe_names = []
    with st.expander("保存 / 载入配方"):
        project_templates = st.session_state.get("project_templates")
        project_names = sorted((project_templates.config.get("plots", {}) if project_templates else {}) or {})
        template_options = ["（当前配方）", *recipe_names, *[f"project:{n}" for n in project_names]]
        chosen = st.selectbox("已保存配方", template_options); c1, c2 = st.columns(2)
        load_clicked = c1.button("载入配方")
        apply_clicked = c1.button("应用模板")
        if (load_clicked or apply_clicked) and chosen != "（当前配方）":
            try:
                if chosen.startswith("project:") and project_templates:
                    incoming = project_templates.recipe(chosen.removeprefix("project:"))
                else:
                    incoming = catalog.load_recipe(chosen)
                plot_data, plot_labels, _ = _plot_selection(st, datasets, incoming, selected_runs)
                st.session_state["loaded_recipe"] = _validate_recipe_for_data(incoming, plot_data, plot_labels)
                st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
                st.rerun()
            except Exception as exc:
                st.error(f"无法应用配方：{exc}；请检查变量名、面板和样式字段。")
        name = c2.text_input("配方名称", value="我的配方")
        overwrite = c2.checkbox("允许覆盖项目配方", value=False)
        save_clicked = c2.button("保存当前配方")
        save_project_clicked = c2.button("保存到项目")
        if save_clicked or save_project_clicked:
            try:
                if save_project_clicked and not project_templates:
                    raise ValueError("请先选择包含 research-data.project.json 的模板项目目录")
                if save_project_clicked:
                    project_templates.save_plot(name, recipe, overwrite=overwrite)
                else:
                    catalog.save_recipe(name, recipe)
                st.success("配方已保存。")
            except Exception as exc:
                st.error(f"保存配方失败：{exc}")
    with st.expander("高级配方 JSON"):
        advanced_default = json.dumps(recipe, ensure_ascii=False, indent=2)
        advanced_text = st.text_area("JSON（支持 panels 与 layout）", value=advanced_default, key=f"advanced_recipe_{rev}")
        if st.button("应用高级配方", key=f"apply_advanced_{rev}"):
            try:
                incoming = json.loads(advanced_text)
                if not isinstance(incoming, dict): raise ValueError("配方必须是 JSON 对象")
                if incoming.get("kind") == "panels":
                    panels = incoming.get("panels")
                    if not isinstance(panels, list) or not panels: raise ValueError("panels 必须是非空列表")
                plot_data, plot_labels, _ = _plot_selection(st, datasets, incoming, selected_runs)
                st.session_state["loaded_recipe"] = _validate_recipe_for_data(incoming, plot_data, plot_labels)
                st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
                st.rerun()
            except Exception as exc:
                st.error(f"高级配方无效：{exc}；请提供 JSON 对象，并确保 panels 是非空列表。")
    if st.button("生成图表", type="primary"):
        try:
            from research_data.provenance import capture_provenance
            with tempfile.TemporaryDirectory() as td:
                provenance = capture_provenance(Path(__file__).parent, td, entrypoint="app.py", source_paths=["app.py", "plotting.py", "project.py", "ui.py", "dataset_view.py"])
                source_archive = (Path(td) / provenance["snapshot"]["path"]).read_bytes()
            source_snapshot = provenance["snapshot"]["files"]
            origin = _project_origin(recipe) or _project_origin(loaded)
            if origin:
                recipe["_project_template"] = origin
            plot_data, plot_labels, plot_inputs = _plot_selection(st, datasets, recipe, selected_runs)
            fig = render_plot(plot_data, recipe, labels=plot_labels)
            st.session_state.update(figure=fig, figure_recipe=copy.deepcopy(recipe), figure_inputs=plot_inputs, figure_source_snapshot=source_snapshot, figure_provenance=provenance, figure_archive=source_archive, figure_generated=True)
            st.session_state.pop("static_download", None)
        except Exception as exc:
            for key in ("figure", "figure_inputs", "figure_recipe", "static_download"):
                st.session_state.pop(key, None)
            st.error(f"绘图失败：{exc}")
    fig = st.session_state.get("figure")
    if fig is not None and st.session_state.get("figure_generated"):
        # Style and layout controls are live after the first explicit generation.
        live_recipe = copy.deepcopy(recipe)
        origin = _project_origin(live_recipe) or _project_origin(st.session_state.get("figure_recipe", {}))
        if origin:
            live_recipe["_project_template"] = origin
        previous_recipe = st.session_state.get("figure_recipe", {})
        try:
            plot_data, plot_labels, plot_inputs = _plot_selection(st, datasets, live_recipe, selected_runs)
            fig = render_plot(plot_data, live_recipe, labels=plot_labels)
            st.session_state["figure"] = fig
            st.session_state["figure_inputs"] = plot_inputs
            st.session_state["figure_recipe"] = copy.deepcopy(live_recipe)
            if live_recipe != previous_recipe:
                st.session_state.pop("static_download", None)
        except Exception as exc:
            st.warning(f"实时预览暂不可用：{exc}；显示上一张有效配方的图表。")
    if fig is not None:
        frozen = copy.deepcopy(st.session_state.get("figure_recipe", {})); st.plotly_chart(fig, use_container_width=True, theme=None)
        st.download_button("下载 HTML", fig.to_html(include_plotlyjs="cdn"), file_name="figure.html", mime="text/html")
        out, reg = st.columns(2); fmt = out.selectbox("导出格式", ["png", "svg", "pdf"])
        if out.button("导出静态图"):
            try:
                with tempfile.TemporaryDirectory() as td:
                    path = export_plot(fig, Path(td) / f"figure.{fmt}"); st.session_state["static_download"] = (path.name, path.read_bytes())
            except RuntimeError as exc: out.error(str(exc))
        if st.session_state.get("static_download"):
            filename, payload = st.session_state["static_download"]
            st.download_button("下载静态图", payload, file_name=filename, key="download_static")
        if reg.button("登记分析图"):
            try:
                with tempfile.TemporaryDirectory() as td:
                    path = export_plot(fig, Path(td) / "figure.html"); recipe_path = Path(td) / "recipe.json"; recipe_path.write_text(json.dumps(frozen, ensure_ascii=False, indent=2), encoding="utf-8"); inputs = st.session_state.get("figure_inputs", [])
                    import plotly, research_data
                    source_snapshot = st.session_state.get("figure_source_snapshot", [])
                    versions = {"package": getattr(research_data, "__version__", "unknown"), "plotly": plotly.__version__}
                    parameters = {"recipe": frozen, "inputs": inputs, "render_version": fig.layout.meta.get("render_version", "1"), "versions": versions, "source_snapshot": source_snapshot}
                    if frozen.get("_project_template"):
                        parameters["project_template"] = copy.deepcopy(frozen["_project_template"])
                    analysis = catalog.start_run("分析图：" + str(frozen.get("title") or run.get("title", "")), project=run.get("project", "default"), kind="analysis", parent_run_ids=[i["run_id"] for i in inputs], parameters=parameters)
                    catalog.attach_provenance(analysis.run_id, st.session_state["figure_provenance"], st.session_state["figure_archive"])
                    analysis.add_artifact(path, role="figure", metadata=parameters); analysis.add_artifact(recipe_path, role="recipe", metadata={"recipe": frozen}); analysis.finish(); reg.success("分析图已登记并关联输入运行。")
            except Exception as exc: reg.error(f"登记失败：{exc}")

def cli() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("root", nargs="?", default=None)
    args, _unknown = parser.parse_known_args()
    main(args.root)

if __name__ == "__main__": cli()
