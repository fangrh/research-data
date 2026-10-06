"""Chinese Streamlit browser; launch with ``streamlit run app.py -- ROOT``."""
from __future__ import annotations
import argparse, base64, copy, hashlib, json, os, re, tempfile, zipfile
from urllib.parse import quote
from pathlib import Path
from typing import Any
from research_data.plotting import THEMES, export_plot, render_plot
from research_data.social import Interactions
from research_data.thumbnails import human_count

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

def _run_card(st, run):
    st.subheader(run.get("title", "Untitled"))
    st.write(run.get("description") or "此运行尚未填写说明。")
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

def _data_artifact(run):
    artifacts = run.get("artifacts", []) or []
    return next((a for a in artifacts if a.get("role") not in {"log", "stdout", "stderr"} and a.get("format") not in {"log", "txt"}), artifacts[0] if artifacts else None)

def main(root: str | None = None) -> None:
    import streamlit as st
    st.set_page_config(page_title="研究数据浏览器", page_icon="📈", layout="wide")
    from research_data.agent import default_catalog
    root = root or st.session_state.get("catalog_root") or default_catalog()
    st.title("研究数据浏览器")
    st.caption("实验 / Experiment → 样品 / Sample → 运行 / Run；点击运行即可查看数据与来源。")
    with st.sidebar:
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
        catalog = _catalog(root); runs = catalog.list_runs_summary()
    except Exception as exc:
        st.error(f"无法打开 catalog：{exc}"); return
    social = Interactions(root)
    # 封面直点：URL ?pick=<run_id> 选中运行；?up=<名> 进入 UP（脚本/项目）筛选
    if hasattr(st, "query_params"):
        pick = st.query_params.get("pick")
        if pick and re.fullmatch(r"[A-Za-z0-9_\-]+", pick):
            st.session_state["card_pick"] = pick
        up_param = st.query_params.get("up")
        if up_param and re.fullmatch(r"[A-Za-z0-9_.\-]+", up_param):
            generators = {str(r["categories"]["generator"]) for r in runs
                          if isinstance(r.get("categories"), dict) and r["categories"].get("generator")}
            field = "generator" if up_param in generators else "project"
            st.session_state["up_filter"] = {"field": field, "value": up_param}

    @st.cache_data(show_spinner=False, max_entries=600)
    def _cover_png(catalog_root: str, run_id: str, badge: str = "", fp_key: str = ""):
        """数据封面缩略图（缓存）。逐个尝试 run 内小文件（大 CSV 只读头部 256 行）；
        都不可绘制时用参数指纹（蓝色）兜底；仍无则 None 走占位卡。"""
        try:
            from research_data.catalog import Catalog, _inside
            from research_data.thumbnails import draw_sparkline, fingerprint_series, series_for_artifact
            cat = Catalog(catalog_root)
            manifest = cat.get(run_id)
            run_dir = cat.root / "runs" / run_id
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
    if not runs: st.info("Catalog 为空，请先使用上面的导入表单。"); return
    with st.sidebar:
        def choices(field): return ["全部", *sorted({str(r.get(field)) for r in runs if r.get(field) not in (None, "")})]
        sample = st.selectbox("样品", choices("sample"))
        kind, status = st.selectbox("类型", choices("kind")), st.selectbox("状态", choices("execution_status"))
        # 按分类键逐个筛选（视频网站式 facet），最多 8 个键
        cat_keys: dict[str, set] = {}
        for r in runs:
            c = r.get("categories")
            if isinstance(c, dict):
                for k, v in c.items():
                    cat_keys.setdefault(k, set()).add(str(v))
        facet_keys = sorted(cat_keys, key=lambda k: -len(cat_keys[k]))[:8]
        facet_values = {}
        for key in facet_keys:
            facet_values[key] = st.selectbox(f"分类 · {key}", ["全部", *sorted(cat_keys[key])], key=f"facet_{key}")
        only_favorites = st.checkbox("⭐ 只看收藏", value=False, key="only_favorites")
    scalar = {k: v for k, v in {"sample": sample, "kind": kind, "execution_status": status}.items() if v != "全部"}
    def _facet_ok(r):
        for key, chosen in facet_values.items():
            if chosen == "全部": continue
            c = r.get("categories")
            if not (isinstance(c, dict) and str(c.get(key)) == chosen): return False
        return True
    # ── 顶栏：搜索（Bilibili 式居中）+ 排序 + 视图切换 ──
    top_a, top_b = st.columns([3, 2])
    with top_a:
        query = st.text_input("搜索标题 / 描述 / 标签", placeholder="搜索 run / 脚本 / 目录…")
    with top_b:
        sort_view = st.columns(2)
        with sort_view[0]:
            order = st.selectbox("排序", ["最新优先", "最早优先", "文件最多"], label_visibility="collapsed")
        with sort_view[1]:
            view = st.radio("视图", ["卡片", "表格"], horizontal=True, label_visibility="collapsed")
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
    up_filter = st.session_state.get("up_filter")  # {"field": "generator"|"project", "value": str}
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
            if all(r.get(k) == v for k, v in scalar.items())
            and _facet_ok(r)
            and (not channel or r.get("project") == channel)
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
    reverse = order != "最早优先"
    if order == "文件最多":
        filtered.sort(key=lambda r: ((r.get("parameters") or {}).get("file_count") or 0, r.get("created_at") or ""), reverse=True)
    else:
        filtered.sort(key=lambda r: r.get("created_at") or "", reverse=reverse)
    st.write(f"找到 **{len(filtered)}** 个数据运行")
    if not filtered: st.info("调整筛选条件即可浏览数据。"); return

    picked = []
    if view == "卡片":
        # ── Bilibili 式布局：左侧卡片墙，右侧排行榜/我的收藏 ──
        wall_col, rank_col = st.columns([4, 1.05])
        with wall_col:
            PAGE = 12
            num_pages = max(1, -(-len(filtered) // PAGE))
            page = st.pagination(num_pages, key="cards_page", max_visible_pages=7)
            page_runs = filtered[(page - 1) * PAGE: page * PAGE]
            card_rows = [st.columns(4) for _ in range(-(-len(page_runs) // 4))]
        for idx, r in enumerate(page_runs):
            with card_rows[idx // 4][idx % 4]:
                fc = (r.get("parameters") or {}).get("file_count")
                badge = (f"{human_count(fc)}文件" if fc is not None else
                         (f"{human_count((r.get('parameters') or {}).get('total_bytes', 0) / 1e6)}MB"
                          if (r.get("parameters") or {}).get("total_bytes") else ""))
                png, mode = _cover_png(str(root), r["run_id"], badge,
                                       fp_key=json.dumps(r.get("parameters") or {}, sort_keys=True, default=str))
                href = f"?pick={r['run_id']}" + (f"&up={quote(up_filter['value'], safe='')}" if up_filter else "")
                title_html = (r.get("title") or r["run_id"]).replace("&", "&amp;").replace("<", "&lt;")
                if png:
                    img = (f"data:image/png;base64,{base64.b64encode(png).decode('ascii')}")
                    st.markdown(f"<a href='{href}' style='text-decoration:none'>"
                                f"<img src='{img}' style='width:100%;border-radius:8px;display:block' "
                                f"title='{title_html}'/></a>", unsafe_allow_html=True)
                else:
                    fmt = str((r.get("kind") or "run"))[:6]
                    chip = (f"<span style='background:#333;border-radius:4px;padding:1px 6px;font-size:12px;'>{badge or fmt}</span>"
                            if badge else fmt)
                    st.markdown(f"<a href='{href}' style='text-decoration:none'>"
                                f"<div style='height:{int(180*0.56)}px;border-radius:8px;background:#17171f;"
                                f"display:flex;align-items:center;justify-content:center;gap:8px;color:#666;"
                                f"font-size:22px;'>📊 {chip}</div></a>", unsafe_allow_html=True)
                if mode == "fingerprint":
                    st.caption("¶ 参数指纹封面")
                cats = r.get("categories") if isinstance(r.get("categories"), dict) else {}
                up = cats.get("generator") or cats.get("site") or r.get("project") or ""
                stats = []
                if fc is not None:
                    stats.append(f"▶ {human_count(fc)}")
                n_comments = social.state(r["run_id"])["comments"]
                if n_comments:
                    stats.append(f"💬 {n_comments}")
                if social.state(r["run_id"])["liked"]:
                    stats.append("👍")
                meta = " · ".join([*stats, (r.get("created_at") or "")[:10]])
                if social.is_favorite(r["run_id"]):
                    meta = "⭐ " + meta
                st.caption(meta)
                st.markdown(f"<a href='{href}' style='color:inherit;font-weight:600;font-size:14px;"
                            f"text-decoration:none'>{title_html[:44]}</a>", unsafe_allow_html=True)
                up_value = str(cats.get("generator") or r.get("project") or "")
                if up_value:
                    up_html = up_value.replace("&", "&amp;").replace("<", "&lt;")[:26]
                    st.markdown(f"<a href='?up={quote(up_value, safe= '')}' "
                                f"style='color:#99a2aa;font-size:12px;text-decoration:none'>UP · {up_html}</a>",
                                unsafe_allow_html=True)
        with rank_col:
            # ── 排行榜（Bilibili 右侧栏）：热播=文件最多 TOP10；下方我的收藏 ──
            def _link(r, i):
                mark = "🔥" if i <= 3 else f"{i}."
                t = (r.get("title") or r["run_id"]).replace("&", "&amp;").replace("<", "&lt;")
                fc = (r.get("parameters") or {}).get("file_count")
                return (f"<div style='margin-bottom:6px'><a href='?pick={r['run_id']}' "
                        f"style='color:inherit;text-decoration:none;font-size:13px'>"
                        f"{mark} {t[:20]}</a>"
                        + (f"<div style='color:#99a2aa;font-size:11px'>▶ {human_count(fc)}</div>" if fc is not None else "")
                        + "</div>")
            st.markdown("**🔥 排行榜 · 热播（文件最多）**")
            hot = sorted(filtered, key=lambda r: ((r.get("parameters") or {}).get("file_count") or 0,
                                                  r.get("created_at") or ""), reverse=True)[:10]
            st.markdown("".join(_link(r, i) for i, r in enumerate(hot, 1)), unsafe_allow_html=True)
            fav_ids = [rid for rid in social.favorites()
                       if any(r["run_id"] == rid for r in filtered)]
            if fav_ids:
                st.markdown("**⭐ 我的收藏**")
                by_id = {r["run_id"]: r for r in filtered}
                st.markdown("".join(_link(by_id[rid], i) for i, rid in enumerate(fav_ids[:10], 1)),
                            unsafe_allow_html=True)
            st.caption("点击条目直接进入")
    else:
        # 表格视图（点列头可排序，点行选中）
        def _row(r):
            row = {"时间": (r.get("created_at") or "")[:19].replace("T", " "), "项目": r.get("project") or "",
                   "标题": r.get("title") or r.get("run_id"), "类型": r.get("kind") or "",
                   "状态": r.get("execution_status") or "",
                   "标签": " · ".join(r.get("tags") or [])}
            file_count = (r.get("parameters") or {}).get("file_count")
            if file_count is not None: row["文件数"] = file_count
            return row
        table_rows = [_row(r) for r in filtered]
        try:
            table = st.dataframe(table_rows, selection_mode="single-row", on_select="rerun",
                                 key="runs_table", hide_index=True, use_container_width=True, height=420)
            picked = list(getattr(getattr(table, "selection", None), "rows", []) or [])
        except TypeError:
            picked = []
    if len(filtered) <= 300:
        options = {f"{r.get('title', r.get('run_id'))} · {r.get('run_id')}": r for r in filtered}
        selected = st.multiselect("选择运行（可多选比较）", list(options), default=list(options)[:1])
        if not selected: st.info("请选择至少一个运行。"); return
        chosen_summaries = [options[x] for x in selected]
    else:
        card_pick = st.session_state.get("card_pick")
        current = next((r for r in filtered if r["run_id"] == card_pick), None) or \
                  (filtered[picked[0]] if picked else filtered[0])
        compare_ids = list(st.session_state.get("compare_ids") or [])
        col_cur, col_add = st.columns([5, 1])
        col_cur.caption(f"当前运行：{current.get('title')} · {current.get('run_id')}")
        if col_add.button("加入对比") and current["run_id"] not in compare_ids and len(compare_ids) < 6:
            compare_ids.append(current["run_id"]); st.session_state["compare_ids"] = compare_ids; st.rerun()
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
    run = selected_runs[0]

    # ── 视频页布局：左侧数据卡+互动+评论，右侧相关推荐（Bilibili 式）──
    page_l, page_r = st.columns([4, 1.3])
    with page_l:
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
        if st.button("发布评论", key=f"comment_post_{run['run_id']}") and new_comment.strip():
            social.add_comment(run["run_id"], new_comment); st.rerun()
    with page_r:
        related_pool = [r for r in filtered if r.get("project") == run.get("project")
                        and r["run_id"] != run["run_id"]][:6]
        if related_pool:
            st.markdown("**🔗 相关推荐**")
            for r in related_pool:
                rr_a, rr_b = st.columns([4, 1])
                rr_a.caption((r.get("title") or r["run_id"])[:30] + "\n\n" +
                             ((r.get("created_at") or "")[:10]))
                if rr_b.button("▶", key=f"rel_{r['run_id']}", help="换这个"):
                    st.session_state["card_pick"] = r["run_id"]; st.rerun()
            st.caption("同项目 · 最新在前")
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
    artifacts = run.get("artifacts", []) or []
    artifact_names = {f"{a.get('original_name', a.get('path', 'artifact'))} · {a.get('artifact_id', '')}": a for a in artifacts}
    artifact_key = st.selectbox("主数据文件", list(artifact_names) or ["无 artifact"])
    if artifact_names:
        chosen_artifact = artifact_names[artifact_key]
        from research_data.catalog import _inside
        artifact_path = _inside(catalog.root / "runs" / run["run_id"], chosen_artifact["path"])
        st.caption(chosen_artifact.get("description") or "未填写文件说明")
        if artifact_path.is_file():
            st.download_button("下载原始文件", artifact_path.read_bytes(), file_name=chosen_artifact["original_name"], key="download_artifact")
        if chosen_artifact.get("role") in {"figure", "recipe"}:
            if chosen_artifact.get("format") in {"png", "jpg", "jpeg", "webp"}:
                st.image(str(artifact_path))
            st.info("此文件是已登记的图或配方；上方数据记录包含其输入来源，点击下载即可查看。")
            return
    if st.button("加载所选运行") and artifact_names:
        try:
            datasets, ids = [], []
            for item in selected_runs:
                art = catalog.select_artifact(item["run_id"]) if item["run_id"] != run["run_id"] else artifact_names[artifact_key]
                art = catalog.select_artifact(item["run_id"], artifact_id=art.get("artifact_id"))
                datasets.append(catalog.load_dataset(item["run_id"], artifact_id=art.get("artifact_id")))
                ids.append({"run_id": item["run_id"], "artifact_id": art.get("artifact_id"), "sha256": art.get("sha256")})
            st.session_state.update(datasets=datasets, dataset_ids=ids)
        except Exception as exc:
            for key in ("datasets", "dataset_ids", "figure", "figure_inputs", "static_download"):
                st.session_state.pop(key, None)
            st.error(f"无法加载数据：{exc}")
    datasets = st.session_state.get("datasets")
    if not datasets: st.info("点击“加载所选运行”开始预览和绘图。"); return
    ds = datasets[0]
    with st.expander("变量与预览", expanded=True):
        st.dataframe({n: {"维度": str(v.dims), "形状": str(v.shape), "单位": v.attrs.get("units", "未声明"), "类型": str(v.dtype)} for n, v in ds.data_vars.items()})
        try: st.dataframe(ds.to_dataframe().reset_index().head(100), use_container_width=True)
        except Exception as exc: st.warning(f"表格预览不可用：{exc}")
    st.subheader("绘图"); names, axes = list(ds.data_vars), list(ds.coords) or list(ds.variables)
    axes = list(dict.fromkeys([*axes, *[name for name, value in ds.data_vars.items() if value.ndim == 1]]))
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
                st.session_state["loaded_recipe"] = _validate_recipe_for_data(incoming, datasets, [r.get("title", r["run_id"]) for r in selected_runs])
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
                st.session_state["loaded_recipe"] = _validate_recipe_for_data(incoming, datasets, [r.get("title", r["run_id"]) for r in selected_runs])
                st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
                st.rerun()
            except Exception as exc:
                st.error(f"高级配方无效：{exc}；请提供 JSON 对象，并确保 panels 是非空列表。")
    if st.button("生成图表", type="primary"):
        try:
            from research_data.provenance import capture_provenance
            with tempfile.TemporaryDirectory() as td:
                provenance = capture_provenance(Path(__file__).parent, td, entrypoint="app.py", source_paths=["app.py", "plotting.py", "project.py"])
                source_archive = (Path(td) / provenance["snapshot"]["path"]).read_bytes()
            source_snapshot = provenance["snapshot"]["files"]
            origin = _project_origin(recipe) or _project_origin(loaded)
            if origin:
                recipe["_project_template"] = origin
            fig = render_plot(datasets, recipe, labels=[r.get("title", r["run_id"]) for r in selected_runs])
            st.session_state.update(figure=fig, figure_recipe=copy.deepcopy(recipe), figure_inputs=list(st.session_state.get("dataset_ids", [])), figure_source_snapshot=source_snapshot, figure_provenance=provenance, figure_archive=source_archive, figure_generated=True)
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
            fig = render_plot(datasets, live_recipe, labels=[r.get("title", r["run_id"]) for r in selected_runs])
            st.session_state["figure"] = fig
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
