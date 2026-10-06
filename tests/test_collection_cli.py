import json
import sys

from research_data.cli import main


def _runs(tmp_path, capsys):
    root = tmp_path / "catalog"
    script = tmp_path / "generate.py"
    script.write_text("import os\nfrom pathlib import Path\nPath(os.environ['RESEARCH_DATA_OUTPUT'], 'generated.txt').write_text('ok')\n", encoding="utf-8")
    runs = []
    for index in range(3):
        assert main(["--root", str(root), "run", "--title", f"run {index}", "--repo", str(tmp_path),
                     "--source", script.name, "--", sys.executable, str(script)]) == 0
        runs.append(json.loads(capsys.readouterr().out)["run_id"])
    return runs, root


def _call(capsys, root, *args):
    assert main(["--root", str(root), "collection", *args]) == 0
    return json.loads(capsys.readouterr().out)


def test_collection_cli_lifecycle_and_discovery(tmp_path, capsys):
    runs, root = _runs(tmp_path, capsys)
    created = _call(capsys, root, "create", "--title", "Sweep set", "--description", "reference",
                    "--tag", "scan", "--run", runs[0], "--run", runs[1])
    cid = created["collection_id"]
    assert created["schema_version"] == 1
    assert [member["run_id"] for member in created["members"]] == runs[:2]

    output = tmp_path / "collection.json"
    shown = _call(capsys, root, "show", "--id", cid, "--output", str(output))
    assert json.loads(output.read_text(encoding="utf-8"))["hash"] == shown["hash"]
    edited = _call(capsys, root, "edit", "--id", cid, "--title", "Updated", "--clear-tags",
                   "--expected-hash", shown["hash"])
    added = _call(capsys, root, "add", "--id", cid, "--run-id", runs[2], "--role", "comparison",
                  "--note", "same campaign", "--expected-hash", edited["hash"])
    assert added["members"][-1]["role"] == "comparison"
    reordered = _call(capsys, root, "reorder", "--id", cid, "--run", runs[2], "--run", runs[1], "--run", runs[0],
                      "--expected-hash", added["hash"])
    assert [member["run_id"] for member in reordered["members"]] == [runs[2], runs[1], runs[0]]
    listed = _call(capsys, root, "list", "--query", "comparison")
    assert listed[0]["collection_id"] == cid
    memberships = _call(capsys, root, "memberships", "--run-id", runs[2])
    assert memberships[0]["collection_id"] == cid
    removed = _call(capsys, root, "remove", "--id", cid, "--run-id", runs[1], "--expected-hash", reordered["hash"])
    archived = _call(capsys, root, "archive", "--id", cid, "--expected-hash", removed["hash"])
    assert _call(capsys, root, "list") == []
    restored = _call(capsys, root, "restore", "--id", cid, "--expected-hash", archived["hash"])
    assert restored["archived"] is False

    result = main(["--root", str(root), "collection", "edit", "--id", cid, "--title", "stale", "--expected-hash", "0" * 64])
    assert result == 2
    assert '"type": "ValueError"' in capsys.readouterr().err


def test_collection_cli_help_and_missing_inputs_are_machine_discoverable(tmp_path, capsys):
    assert main(["help", "collection", "--json"]) == 0
    help_payload = json.loads(capsys.readouterr().out)
    options = help_payload["commands"]["collection"]["options"]
    assert any("--role" in item.get("flags", []) for item in options)
    assert any("--note" in item.get("flags", []) for item in options)
    assert main(["guide", "collection", "--json"]) == 0
    guide_payload = json.loads(capsys.readouterr().out)
    assert guide_payload["workflows"]["collection"]["steps"]

    assert main(["--root", str(tmp_path / "catalog"), "collection", "show"]) == 2
    assert '"type": "ValueError"' in capsys.readouterr().err
