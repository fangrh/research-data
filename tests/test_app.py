from pathlib import Path


def test_app_import_is_lazy_and_plotting_is_available():
    import research_data.app as app

    assert callable(app.main)
    assert callable(app.cli)


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
    assert {Path(item["path"]).name for item in params["source_snapshot"]} == {"app.py", "plotting.py"}
    assert analysis[0]["provenance"]["status"] == "captured"
    from research_data.provenance import inspect_snapshot
    assert inspect_snapshot(analysis[0]["provenance"], catalog.root / "runs" / analysis[0]["run_id"])["ok"]


def test_recipe_compare_frozen_registration_and_selection_reset(tmp_path, monkeypatch):
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
        return next(item for item in collection if item.label == label)
    selector = widget(app.multiselect, "选择运行（可多选比较）")
    selector.set_value(selector.options).run()
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
    widget(app.button, "登记分析图").click().run()
    analysis = cat.list_runs(filters={"kind": "analysis"})[0]
    assert analysis["parameters"]["recipe"]["theme"] == "midnight"
    assert analysis["parent_run_ids"] == [r.run_id for r in runs]
    selector = widget(app.multiselect, "选择运行（可多选比较）")
    selector.set_value(selector.options[:1]).run()
    assert "figure" not in app.session_state
    assert not app.exception
