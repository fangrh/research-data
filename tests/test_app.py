from pathlib import Path


def test_app_import_is_lazy_and_plotting_is_available():
    import research_data.app as app

    assert callable(app.main)
    assert callable(app.cli)


def test_recommendations_balance_projects_without_mutating_runs():
    from research_data.app import _browse_order
    runs = [{"run_id": str(i), "project": project, "created_at": str(i)}
            for i, project in enumerate(["B", "A", "A", "A"])]
    original = list(runs)
    assert [r["run_id"] for r in _browse_order(runs, "推荐")] == ["3", "0", "2", "1"]
    assert runs == original
    assert [r["run_id"] for r in _browse_order(runs, "最新优先")] == ["3", "2", "1", "0"]


def test_browse_context_unicode_channels_primary_detail_and_search(tmp_path, monkeypatch):
    import json
    import sys
    from research_data.catalog import Catalog
    from streamlit.testing.v1 import AppTest
    from research_data.project import ProjectTemplates
    monkeypatch.setattr(sys, "argv", ["streamlit"])
    default = Catalog(tmp_path / "default")
    chosen = Catalog(tmp_path / "chosen")
    project = tmp_path / "templates"
    ProjectTemplates.initialize(project)
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(default.root))
    source = tmp_path / "curve.csv"
    source.write_text("x,y\n1,2\n2,4\n", encoding="utf-8")
    runs = []
    for name in ["Earlier", "Primary"]:
        with chosen.run(title=name, project="中文 项目") as run:
            run.add_artifact(source, profile={"x": "x"})
        runs.append(run)
    app = AppTest.from_file(Path(__file__).parents[1] / "src/research_data/app.py", default_timeout=30)
    app.query_params.update(catalog=str(chosen.root), project_dir=str(project))
    app.run()
    assert not app.exception
    assert app.session_state["catalog_root"] == str(chosen.root)
    assert app.session_state["project_templates"].path == project / "research-data.project.json"
    assert any("rd-card-grid" in item.value and "project_dir=" in item.value for item in app.markdown)
    app.query_params["up"] = "中文 项目"
    app.run()
    assert app.session_state["up_filter"]["value"] == "中文 项目"
    app.query_params.pop("up")
    app.run()
    assert "up_filter" not in app.session_state
    app.session_state["compare_ids"] = [runs[0].run_id]
    app.query_params["pick"] = runs[1].run_id
    app.run()
    detail = next(item.value for item in app.markdown if "<article class='rd-detail'>" in item.value)
    assert "Primary" in detail and "Earlier" not in detail
    next(item for item in app.text_input if item.label == "搜索标题 / 描述 / 标签").set_value("Primary").run()
    assert "pick" not in app.query_params
    assert any("搜索结果" in item.value for item in app.markdown)
    assert not app.exception


def test_streamlit_app_loads_catalog_and_renders_plot(tmp_path, monkeypatch):
    import sys
    monkeypatch.setattr(sys, "argv", ["streamlit"])
    import pandas as pd
    from research_data.catalog import Catalog
    from streamlit.testing.v1 import AppTest

    source = tmp_path / "values.csv"
    pd.DataFrame({"x": [0, 1, 2], "y": [2, 4, 8]}).to_csv(source, index=False)
    catalog = Catalog(tmp_path / "catalog")
    run = catalog.start_run("AppTest run", project="demo")
    run.add_artifact(source, profile={"x": "x"})
    run.finish()
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(tmp_path / "catalog"))

    app = AppTest.from_file(Path(__file__).parents[1] / "src" / "research_data" / "app.py").run()
    next(item for item in app.text_input if item.key == "catalog_root").set_value(str(tmp_path / "catalog"))
    app.run()
    app.query_params["pick"] = run.run_id
    app.run()
    next(button for button in app.button if button.label == "加载所选运行").click()
    app.run()
    assert not list(app.exception)
    next(button for button in app.button if button.label == "生成图表").click()
    app.run()
    assert not list(app.exception)
    next(button for button in app.button if button.label == "登记分析图").click()
    app.run()
    analysis = [item for item in Catalog(tmp_path / "catalog").list_runs() if item.get("kind") == "analysis"]
    assert len(analysis) == 1
    params = analysis[0]["parameters"]
    assert params["inputs"][0]["run_id"] == run.run_id
    assert params["recipe"]["x"] == "x"
    assert {Path(item["path"]).name for item in params["source_snapshot"]} >= {"app.py", "plotting.py", "project.py"}
    assert analysis[0]["provenance"]["status"] == "captured"
    from research_data.provenance import inspect_snapshot
    assert inspect_snapshot(analysis[0]["provenance"], catalog.root / "runs" / analysis[0]["run_id"])["ok"]


def test_recipe_compare_live_style_registration_and_selection_reset(tmp_path, monkeypatch):
    import sys
    monkeypatch.setattr(sys, "argv", ["streamlit"])
    from research_data.catalog import Catalog
    from streamlit.testing.v1 import AppTest

    cat = Catalog(tmp_path / "catalog")
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(cat.root))
    runs = []
    for i in (1, 2):
        source = tmp_path / f"values{i}.csv"
        source.write_text(f"x,y\n2,{i * 2}\n1,{i}\n", encoding="utf-8")
        with cat.run(title=f"Curve {i}", project="test", categories={"domain": "transport"}) as run:
            run.add_artifact(source, profile={"x": "x", "units": {"y": "A"}})
        runs.append(run)
    cat.save_recipe("compare", {"kind": "compare", "x": "x", "y": "y", "theme": "midnight", "title": "Frozen comparison"})
    app = AppTest.from_file(Path(__file__).parents[1] / "src" / "research_data" / "app.py", default_timeout=20).run()
    def widget(collection, label):
        return next(item for item in collection if item.label == label or getattr(item, "key", None) == label)
    app.query_params["pick"] = runs[0].run_id
    app.run()
    widget(app.button, "加入对比").click().run()
    app.query_params["pick"] = runs[1].run_id
    app.run()
    widget(app.button, "加载所选运行").click().run()
    widget(app.selectbox, "已保存配方").set_value("compare").run()
    widget(app.button, "载入配方").click().run()
    assert widget(app.selectbox, "图形").value == "compare"
    assert widget(app.selectbox, "风格").value == "midnight"
    assert widget(app.text_input, "标题").value == "Frozen comparison"
    widget(app.button, "生成图表").click().run()
    assert len(app.session_state["figure"].data) == 2
    assert list(app.session_state["figure"].data[0].x) == [2, 1]
    widget(app.selectbox, "风格").set_value("paper").run()
    widget(app.number_input, "线宽").set_value(4.0).run()
    widget(app.button, "登记分析图").click().run()
    analysis = cat.list_runs(filters={"kind": "analysis"})[0]
    assert analysis["parameters"]["recipe"]["theme"] == "paper"
    assert analysis["parameters"]["recipe"]["style"]["line_width"] == 4.0
    assert analysis["parent_run_ids"] == [r.run_id for r in runs]
    app.query_params["pick"] = runs[0].run_id  # 切到另一 run,选择集变化,figure 应被重置
    app.run()
    assert "figure" not in app.session_state
    assert not app.exception


def test_project_templates_panels_profile_save_origin_and_live_style(tmp_path, monkeypatch):
    import json
    import pandas as pd
    from research_data.catalog import Catalog
    from research_data.project import ProjectTemplates
    from streamlit.testing.v1 import AppTest

    cat = Catalog(tmp_path / "catalog")
    source = tmp_path / "values.csv"
    pd.DataFrame({"x": [1, 2, 3], "y": [2, 4, 8]}).to_csv(source, index=False)
    with cat.run(title="Project template run", project="run-label") as run:
        run.add_artifact(source, profile={"x": "x"})
    project = tmp_path / "project"
    ProjectTemplates.initialize(project)
    config_path = project / "research-data.project.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))
    config["profiles"]["custom"] = {"x": "x", "rename": {"y": "signal"}}
    config["plots"]["panel-template"] = {
        "kind": "panels", "columns": 2, "theme": "midnight", "x": "x", "y": ["y"],
        "log_x": True, "x_label": "frequency", "layout": {"plot_bgcolor": "#ffffff"},
        "style": {"font_family": "Courier New", "font_size": 16, "title_size": 26,
                   "axis_title_size": 15, "tick_size": 12, "legend_size": 12,
                   "line_width": 2, "marker_size": 7, "line_dash": "solid",
                   "show_grid": True, "show_legend": True, "legend_position": "bottom",
                   "colors": ["#123456"], "colorscale": "Viridis"},
        "panels": [
            {"kind": "line", "x": "x", "y": "y", "title": "A"},
            {"kind": "line", "x": "x", "y": "y", "title": "B"},
        ],
    }
    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(cat.root))
    app = AppTest.from_file(Path(__file__).parents[1] / "src" / "research_data" / "app.py", default_timeout=30).run()

    def widget(collection, label):
        return next(item for item in collection if item.label == label or getattr(item, "key", None) == label)

    widget(app.text_input, "catalog_root").set_value(str(cat.root))
    widget(app.text_input, "project_dir").set_value(str(project)).run()
    widget(app.selectbox, "项目 profile").set_value("custom").run()
    widget(app.button, "应用 profile").click().run()
    assert '"x": "x"' in widget(app.text_area, "mapping JSON").value
    app.query_params["pick"] = run.run_id
    app.run()
    widget(app.button, "加载所选运行").click().run()
    widget(app.selectbox, "已保存配方").set_value("project:panel-template").run()
    widget(app.button, "应用模板").click().run()
    assert widget(app.selectbox, "图形").value == "panels"
    assert widget(app.number_input, "标题字号").value == 26
    assert app.session_state["loaded_recipe"]["log_x"] is True
    assert app.session_state["loaded_recipe"]["layout"]["plot_bgcolor"] == "#ffffff"
    widget(app.selectbox, "字体预设").set_value("衬线").run()
    assert widget(app.text_input, "字体").value == "Times New Roman"
    widget(app.text_input, "配方名称").set_value("new-project-plot")
    widget(app.button, "保存到项目").click().run()
    reloaded = ProjectTemplates(project)
    assert "new-project-plot" in reloaded.config["plots"]
    widget(app.button, "生成图表").click().run()
    assert not list(app.exception)
    widget(app.number_input, "标题字号").set_value(31).run()
    assert app.session_state["figure"].layout.title.font.size == 31
    widget(app.button, "登记分析图").click().run()
    analysis = cat.list_runs(filters={"kind": "analysis"})[0]
    frozen = analysis["parameters"]["recipe"]
    assert frozen["kind"] == "panels"
    assert frozen["style"]["title_size"] == 31
    assert frozen["_project_template"]["name"] == "panel-template"
    assert analysis["parameters"]["project_template"]["sha256"] == frozen["_project_template"]["sha256"]


def test_project_dir_query_parameter_selects_template_project(tmp_path, monkeypatch):
    from research_data.catalog import Catalog
    from research_data.project import ProjectTemplates
    from streamlit.testing.v1 import AppTest

    catalog = Catalog(tmp_path / "catalog")
    project = tmp_path / "project"
    ProjectTemplates.initialize(project)
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(catalog.root))
    app = AppTest.from_file(Path(__file__).parents[1] / "src" / "research_data" / "app.py")
    app.query_params["project_dir"] = str(project)
    app.run()
    assert next(item for item in app.text_input if item.key == "project_dir").value == str(project)
import sys
from pathlib import Path

APP = Path(__file__).parents[1] / "src" / "research_data" / "app.py"


def test_browse_counts_use_registered_files_and_preserve_stored_parameters(tmp_path):
    from research_data.app import _browse_file_counts, _browse_order
    from research_data.catalog import Catalog

    cat = Catalog(tmp_path / "catalog")
    source = tmp_path / "data.csv"
    source.write_text("x,y\n0,1\n1,2\n", encoding="utf-8")
    with cat.run(title="One file", parameters={"temperature": 2}) as one:
        one.add_artifact(source)
    with cat.run(title="Two files") as two:
        two.add_artifact(source)
        two.add_artifact(source, role="reference")
    original = cat.list_runs_summary()
    enriched = _browse_file_counts(cat, original)
    assert _browse_order(enriched, "文件最多")[0]["run_id"] == two.run_id
    assert {r["run_id"]: r["parameters"]["file_count"] for r in enriched} == {one.run_id: 1, two.run_id: 2}
    assert all("file_count" not in r["parameters"] for r in original)
    assert cat.get(one.run_id)["parameters"] == {"temperature": 2}


def test_big_catalog_browse_basket_flow(tmp_path, monkeypatch):
    monkeypatch.setattr(sys, "argv", ["streamlit"])
    from research_data.catalog import Catalog
    from streamlit.testing.v1 import AppTest

    cat = Catalog(tmp_path / "catalog")
    source = tmp_path / "v.csv"
    source.write_text("x,y\n1,2\n2,4\n", encoding="utf-8")
    # 301 runs -> 触发 >300 的"总列表 + 对比篮"路径
    for i in range(301):
        with cat.run(title=f"sweep {i:03d}", project="big", kind="simulation",
                     parameters={"file_count": 1}) as run:
            run.add_artifact(source, profile={"x": "x", "units": {"y": "A"}})
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(cat.root))
    app = AppTest.from_file(APP, default_timeout=120).run()

    def widget(collection, label):
        return next(item for item in collection
                    if item.label == label or getattr(item, "key", None) == label)

    # Bilibili 化:首页只有卡片墙;互动在视频页
    assert not app.multiselect
    newest = sorted(cat.list_runs_summary(), key=lambda r: r["created_at"])[-1]
    app.query_params["pick"] = newest["run_id"]
    app.run()
    assert widget(app.button, "加入对比")
    assert widget(app.button, "加载所选运行")
    # 默认自动选中最新一条；加入对比把当前 run 放进篮子（chip 出现）；
    # 输入集合仍为该 run 自身（与自身去重），数据可加载
    widget(app.button, "加入对比").click().run()
    assert any(k.startswith("drop_") for k in app.session_state)
    widget(app.button, "加载所选运行").click().run()
    assert not list(app.exception)
    assert "datasets" in app.session_state and len(app.session_state["datasets"]) == 1
    widget(app.button, "生成图表").click().run()
    assert not list(app.exception)
    assert "figure" in app.session_state
    # 点赞/收藏/评论可用且持久化到 interactions.json
    current_id = app.session_state["selected_identity"][0]
    widget(app.button, "⭐ 收藏").click().run()
    widget(app.button, "👍 点赞").click().run()
    widget(app.text_area, "写评论").set_value("封面缩略图不错").run()
    widget(app.button, "发布评论").click().run()
    assert not list(app.exception)
    from research_data.social import Interactions
    state = Interactions(cat.root).state(current_id)
    assert state == {"liked": True, "favorite": True, "comments": 1}
    # 搜索过滤走索引路径且不炸
    widget(app.text_input, "搜索标题 / 描述 / 标签").set_value("sweep 29").run()
    assert not list(app.exception)
