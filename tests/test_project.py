import hashlib
import json
from pathlib import Path
import subprocess
import sys

import pytest

from research_data.catalog import Catalog
from research_data.cli import main
from research_data.project import CONFIG_NAME, ProjectTemplates, default_config
from research_data.plotting import render_plot


def test_project_initialization_is_local_inert_and_preserves_existing(tmp_path, monkeypatch, capsys):
    catalog = tmp_path / "uncreated-catalog"
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(catalog))
    assert main(["project", "init", "--project-dir", str(tmp_path)]) == 0
    assert json.loads(capsys.readouterr().out)["project_file"] == str(tmp_path / CONFIG_NAME)
    original = (tmp_path / CONFIG_NAME).read_bytes()
    assert main(["project", "init", "--project-dir", str(tmp_path)]) == 2
    capsys.readouterr()
    assert (tmp_path / CONFIG_NAME).read_bytes() == original
    assert main(["project", "check", "--project-dir", str(tmp_path)]) == 0
    assert json.loads(capsys.readouterr().out)["ok"]
    assert not catalog.exists()
    (tmp_path / "dangerous.py").write_text("raise RuntimeError('must never execute')", encoding="utf-8")
    assert ProjectTemplates(tmp_path).recipe("line")["x"] == "x"


def test_template_origin_retains_bytes_git_and_detached_copy(tmp_path):
    for args in (["init"], ["config", "user.name", "Test"], ["config", "user.email", "test@example.invalid"]):
        subprocess.run(["git", "-C", str(tmp_path), *args], check=True, capture_output=True)
    ProjectTemplates.initialize(tmp_path)
    subprocess.run(["git", "-C", str(tmp_path), "add", CONFIG_NAME], check=True)
    subprocess.run(["git", "-C", str(tmp_path), "commit", "-m", "Test configuration"], check=True, capture_output=True)
    # A BOM is retained in the frozen source as well as in the byte hash.
    path = tmp_path / CONFIG_NAME
    path.write_bytes(b"\xef\xbb\xbf" + path.read_bytes())
    templates = ProjectTemplates(tmp_path)
    recipe = templates.recipe("line")
    origin = recipe["_project_template"]
    assert origin["git_commit"] and origin["git_branch"] and origin["git_dirty"]
    assert hashlib.sha256(origin["source"].encode("utf-8")).hexdigest() == origin["sha256"]
    recipe["style"]["font_size"] = 30
    assert templates.recipe("line")["style"]["font_size"] == 14
    old = templates.recipe("line")
    templates.save_plot("line", recipe, overwrite=True)
    assert old["style"]["font_size"] == 14
    assert old["_project_template"]["sha256"] != templates.recipe("line")["_project_template"]["sha256"]


def test_project_saving_rejects_conflicts_and_invalid_schema(tmp_path):
    path = ProjectTemplates.initialize(tmp_path)
    templates = ProjectTemplates(tmp_path)
    with pytest.raises(ValueError, match="exists"):
        templates.save_plot("line", templates.recipe("line"))
    with pytest.raises(ValueError, match="separators"):
        templates.save_plot("../outside", {})
    path.write_text(json.dumps(default_config()) + "\n", encoding="utf-8")
    with pytest.raises(ValueError, match="changed"):
        templates.save_plot("new", {"x": "x", "y": "y"})
    path.write_text('{"schema":"unknown"}', encoding="utf-8")
    with pytest.raises(ValueError, match="schema"):
        ProjectTemplates(tmp_path)
    config = default_config()
    config["profiles"]["bad"] = {"coordinates": {"y": "time"}}
    path.write_text(json.dumps(config), encoding="utf-8")
    with pytest.raises(ValueError, match="lists"):
        ProjectTemplates(tmp_path)


def test_project_profile_and_panels_replay_after_config_changes(tmp_path, capsys):
    project = tmp_path / "scientific-project"
    project.mkdir()
    path = ProjectTemplates.initialize(project)
    config = default_config()
    config["profiles"]["table"] = {"x": "bias", "rename": {"raw_signal": "signal"}, "units": {"bias": "V", "signal": "A"}, "descriptions": {"signal": "Synthetic complex current"}}
    config["plots"]["two-panel"]["panels"] = [
        {"x": "bias", "y": "signal", "component": "real", "title": "Real"},
        {"x": "bias", "y": "signal", "component": "imag", "title": "Imaginary"},
    ]
    path.write_text(json.dumps(config), encoding="utf-8")
    source = project / "synthetic.csv"
    source.write_text("bias,raw_signal\n2,1+2j\n1,3-4j\n", encoding="utf-8")
    root = tmp_path / "catalog"
    assert main(["import", str(source), "--root", str(root), "--title", "synthetic", "--profile", "project:table", "--project-dir", str(project)]) == 0
    run = json.loads(capsys.readouterr().out)
    assert run["artifacts"][0]["profile"]["_project_template"]["name"] == "table"
    output = tmp_path / "panels.html"
    assert main(["plot", run["run_id"], "--root", str(root), "--recipe", "project:two-panel", "--project-dir", str(project), "--output", str(output)]) == 0
    analysis_id = json.loads(capsys.readouterr().out)["analysis_run_id"]
    cat = Catalog(root)
    frozen = cat.get(analysis_id)["parameters"]["plot_recipe"]
    path.write_text("{}", encoding="utf-8")
    figure = render_plot([cat.load_dataset(run["run_id"])], frozen)
    assert list(figure.data[0].x) == [2, 1]
    assert list(figure.data[0].y) == [1, 3]
    assert list(figure.data[1].y) == [2, -4]
    assert "V" in figure.layout.xaxis.title.text
    assert frozen["_project_template"]["name"] == "two-panel"
    assert cat.check(analysis_id)["ok"]


def test_wrapper_freezes_project_profile_before_producer_edits_it(tmp_path, capsys):
    ProjectTemplates.initialize(tmp_path)
    script = tmp_path / "generate.py"
    script.write_text("import os\nfrom pathlib import Path\nPath('" + CONFIG_NAME + "').write_text('{}')\n(Path(os.environ['RESEARCH_DATA_OUTPUT'])/'data.csv').write_text('x,y\\n2,4\\n1,3\\n')\n", encoding="utf-8")
    # Producer edits this exact project file with an absolute path.
    script.write_text(script.read_text().replace("Path('" + CONFIG_NAME + "')", "Path(" + repr(str(tmp_path / CONFIG_NAME)) + ")"), encoding="utf-8")
    root = tmp_path / "catalog"
    assert main(["run", "--root", str(root), "--title", "Synthetic producer", "--repo", str(tmp_path), "--profile", "project:table", "--project-dir", str(tmp_path), "--", sys.executable, str(script)]) == 0
    run = json.loads(capsys.readouterr().out)
    profile = run["parameters"]["import_profile"]
    assert profile["x"] == "x" and profile["_project_template"]["name"] == "table"
    cat = Catalog(root)
    artifact = cat.select_artifact(run["run_id"])
    assert artifact["profile"] == profile
    assert list(cat.load_dataset(run["run_id"]).y.values) == [4, 3]


def test_open_selects_project_via_url_without_changing_service_identity(tmp_path, monkeypatch, capsys):
    from research_data import server
    from urllib.parse import parse_qs, urlparse
    calls = []
    def opened(root, port, no_open, timeout):
        calls.append(no_open)
        return {"url": "http://127.0.0.1:8765/", "root": root, "browser_opened": False}
    monkeypatch.setattr(server, "open_catalog", opened)
    project = tmp_path / "project with spaces"
    assert main(["open", "--project-dir", str(project), "--no-open"]) == 0
    result = json.loads(capsys.readouterr().out)
    assert parse_qs(urlparse(result["url"]).query)["project_dir"] == [str(project.resolve())]
    assert calls == [True]
    assert result["browser_opened"] is False
