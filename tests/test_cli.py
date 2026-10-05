import json
import os
import subprocess
import sys
from pathlib import Path

from research_data.catalog import Catalog
from research_data.cli import main


def test_wrapper_registers_data_logs_source_and_failure(tmp_path, capsys):
    script = tmp_path / "generate.py"
    script.write_text("import os\nfrom pathlib import Path\np=Path(os.environ['RESEARCH_DATA_OUTPUT'])/'curve.csv'\np.write_text('bias,current\\n2,4\\n1,3\\n')\n", encoding="utf-8")
    root = tmp_path / "catalog"
    args = ["--root", str(root), "run", "--title", "synthetic transport", "--repo", str(tmp_path), "--source", "generate.py", "--entrypoint", "generate.py", "--profile", '{"x":"bias","units":{"bias":"V","current":"A"}}', "--", sys.executable, str(script)]
    assert main(args) == 0
    run = json.loads(capsys.readouterr().out)
    assert run["execution_status"] == "completed"
    assert run["validation"]["status"] == "not_checked"
    assert run["provenance"]["snapshot"]["files"][0]["path"] == "generate.py"
    cat = Catalog(root)
    ds = cat.load_dataset(run["run_id"])
    assert list(ds.bias.values) == [2, 1]
    assert ds.current.attrs["units"] == "A"
    assert len(run["artifacts"]) == 3
    script.write_text("raise SystemExit(7)\n", encoding="utf-8")
    assert main(args) == 7
    failed = json.loads(capsys.readouterr().out)
    assert failed["execution_status"] == "failed"
    assert failed["validation"]["status"] == "not_checked"


def test_import_profile_and_plot_lineage(tmp_path, capsys):
    root = tmp_path / "catalog"
    cat = Catalog(root)
    cat.save_recipe("import-transport", {"x": "bias", "units": {"bias": "V", "current": "A"}})
    p = tmp_path / "data.csv"
    p.write_text("bias,current\n1,2\n0,3\n", encoding="utf-8")
    assert main(["--root", str(root), "import", str(p), "--title", "Historical measurement", "--profile", "transport"]) == 0
    imported = json.loads(capsys.readouterr().out)
    rid = imported["run_id"]
    assert imported["provenance"]["status"] == "unknown"
    assert imported["provenance"]["git_commit"] is None
    output = tmp_path / "figure.html"
    assert main(["--root", str(root), "plot", rid, "--recipe", '{"kind":"line","x":"bias","y":"current","theme":"midnight"}', "--output", str(output)]) == 0
    rendered = json.loads(capsys.readouterr().out)
    analysis = cat.get(rendered["analysis_run_id"])
    assert analysis["parent_run_ids"] == [rid]
    assert analysis["parameters"]["inputs"][0]["sha256"] == imported["artifacts"][0]["sha256"]
    assert {a["role"] for a in analysis["artifacts"]} == {"recipe", "figure"}
    assert output.is_file()
    assert main(["--root", str(root), "check"]) == 0
    assert json.loads(capsys.readouterr().out)["ok"]
    assert main(["--root", str(root), "validation", rid, "passed"]) == 2
    assert "requires" in capsys.readouterr().err


def test_install_agent_cli_and_launcher(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("RESEARCH_DATA_CONFIG", str(tmp_path / "settings.json"))
    root = tmp_path / "shared"
    target = tmp_path / "skills"
    assert main(["install-agent", "--target", str(target), "--catalog", str(root)]) == 0
    result = json.loads(capsys.readouterr().out)
    skill = Path(result["skill"])
    assert (skill / "SKILL.md").is_file()
    env = dict(os.environ)
    env.pop("RESEARCH_DATA_CATALOG", None)
    launched = subprocess.run([sys.executable, str(skill / "scripts" / "research_data.py"), "init"], env=env, text=True, capture_output=True)
    assert launched.returncode == 0, launched.stderr
    assert json.loads(launched.stdout)["root"] == str(root.resolve())
    assert (root / "catalog.sqlite3").is_file()


def test_missing_executable_is_recorded_failed(tmp_path, capsys):
    p = tmp_path / "script.py"
    p.write_text("# synthetic\n", encoding="utf-8")
    root = tmp_path / "catalog"
    assert main(["--root", str(root), "run", "--title", "missing", "--repo", str(tmp_path), "--source", "script.py", "--", "research-data-nonexistent-command-4321"]) == 2
    capsys.readouterr()
    runs = Catalog(root).list_runs()
    assert len(runs) == 1 and runs[0]["execution_status"] == "failed"
