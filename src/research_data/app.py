"""Chinese Streamlit browser; launch with ``streamlit run app.py -- ROOT``."""
from __future__ import annotations
import argparse, hashlib, json, tempfile, zipfile
from pathlib import Path
from typing import Any
from research_data.plotting import THEMES, export_plot, render_plot

def _catalog(root: str):
    from research_data.catalog import Catalog
    return Catalog(Path(root))

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
        for key in ("datasets", "dataset_ids", "figure", "figure_recipe", "figure_inputs", "figure_source_snapshot", "figure_provenance", "figure_archive", "static_download", "loaded_recipe", "plot_x", "plot_y", "plot_kind", "plot_z", "plot_y_axis", "plot_component", "plot_theme"):
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
        catalog = _catalog(root); runs = catalog.list_runs()
    except Exception as exc:
        st.error(f"无法打开 catalog：{exc}"); return
    with st.expander("首次导入 / Import profile", expanded=not bool(runs)):
        st.caption("填写文件路径和 JSON mapping；配置会作为 artifact profile 保存。")
        path = st.text_input("数据文件路径", key="import_path")
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
        project, sample = st.selectbox("项目", choices("project")), st.selectbox("样品", choices("sample"))
        kind, status = st.selectbox("类型", choices("kind")), st.selectbox("状态", choices("execution_status"))
        category, query = st.selectbox("类别", _categories(runs)), st.text_input("搜索标题 / 描述 / 标签")
    filters = {k: v for k, v in {"project": project, "sample": sample, "kind": kind, "execution_status": status}.items() if v != "全部"}
    try: filtered = catalog.list_runs(query=query, filters=filters)
    except TypeError: filtered = catalog.list_runs(query=query)
    filtered = [r for r in filtered if _category_match(r, category)]
    st.write(f"找到 **{len(filtered)}** 个数据运行")
    if not filtered: st.info("调整筛选条件即可浏览数据。"); return
    options = {f"{r.get('title', r.get('run_id'))} · {r.get('run_id')}": r for r in filtered}
    selected = st.multiselect("选择运行（可多选比较）", list(options), default=list(options)[:1])
    if not selected: st.info("请选择至少一个运行。"); return
    selected_runs = [options[x] for x in selected]; identity = tuple(r["run_id"] for r in selected_runs); _reset_on_run_change(st, identity)
    run = selected_runs[0]; _run_card(st, run)
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
    loaded = st.session_state.get("loaded_recipe", {})
    x_default = loaded.get("x") if loaded.get("x") in axes else axes[0]
    y_default = [v for v in (loaded.get("y") if isinstance(loaded.get("y"), list) else [loaded.get("y")]) if v in names] or names[:1]
    rev = int(st.session_state.get("widget_rev", 0))
    x, y = st.selectbox("X 变量", axes, index=axes.index(x_default), key=f"plot_x_{rev}"), st.multiselect("Y 变量", names, default=y_default, key=f"plot_y_{rev}")
    kinds = ["line", "scatter", "compare", "heatmap", "complex"]
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
    recipe = {"kind": kind, "x": x, "y": y, "z": z, "y_axis": y_axis, "component": component, "theme": theme, "slices": slices, "title": st.text_input("标题", value=recipe_title, key=f"plot_title_{rev}")}
    try: recipe_names = catalog.list_recipes()
    except Exception: recipe_names = []
    with st.expander("保存 / 载入配方"):
        chosen = st.selectbox("已保存配方", ["（当前配方）", *recipe_names]); c1, c2 = st.columns(2)
        if c1.button("载入配方") and chosen != "（当前配方）":
            incoming = catalog.load_recipe(chosen)
            st.session_state["loaded_recipe"] = incoming
            st.session_state["widget_rev"] = int(st.session_state.get("widget_rev", 0)) + 1
            st.rerun()
        name = c2.text_input("配方名称", value="我的配方")
        if c2.button("保存当前配方"): catalog.save_recipe(name, recipe); st.success("配方已保存。")
    if st.button("生成图表", type="primary"):
        try:
            from research_data.provenance import capture_provenance
            with tempfile.TemporaryDirectory() as td:
                provenance = capture_provenance(Path(__file__).parent, td, entrypoint="app.py", source_paths=["app.py", "plotting.py"])
                source_archive = (Path(td) / provenance["snapshot"]["path"]).read_bytes()
            source_snapshot = provenance["snapshot"]["files"]
            fig = render_plot(datasets, recipe, labels=[r.get("title", r["run_id"]) for r in selected_runs])
            st.session_state.update(figure=fig, figure_recipe=dict(recipe), figure_inputs=list(st.session_state.get("dataset_ids", [])), figure_source_snapshot=source_snapshot, figure_provenance=provenance, figure_archive=source_archive)
            st.session_state.pop("static_download", None)
        except Exception as exc:
            for key in ("figure", "figure_inputs", "figure_recipe", "static_download"):
                st.session_state.pop(key, None)
            st.error(f"绘图失败：{exc}")
    fig = st.session_state.get("figure")
    if fig is not None:
        frozen = st.session_state.get("figure_recipe", {}); st.plotly_chart(fig, use_container_width=True, theme=None)
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
                    analysis = catalog.start_run("分析图：" + str(frozen.get("title") or run.get("title", "")), project=run.get("project", "default"), kind="analysis", parent_run_ids=[i["run_id"] for i in inputs], parameters=parameters)
                    catalog.attach_provenance(analysis.run_id, st.session_state["figure_provenance"], st.session_state["figure_archive"])
                    analysis.add_artifact(path, role="figure", metadata=parameters); analysis.add_artifact(recipe_path, role="recipe", metadata={"recipe": frozen}); analysis.finish(); reg.success("分析图已登记并关联输入运行。")
            except Exception as exc: reg.error(f"登记失败：{exc}")

def cli() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("root", nargs="?", default=None)
    args, _unknown = parser.parse_known_args()
    main(args.root)

if __name__ == "__main__": cli()
