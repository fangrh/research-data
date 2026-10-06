import base64
import json
import os
import subprocess
import sys
from pathlib import Path
from uuid import uuid4

from research_data.catalog import Catalog
from research_data.proofs import ProofStore


PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="


def _proof(tmp_path):
    root = tmp_path / "catalog"
    source = tmp_path / "values.csv"
    source.write_text("x,y\n1,2\n", encoding="utf-8")
    catalog = Catalog(root)
    with catalog.run(title="input", kind="simulation") as run:
        artifact = run.add_artifact(source, role="raw")
    sid, eid = str(uuid4()), str(uuid4())
    scene = {"schema": "three-interact.scene", "version": 1, "id": sid, "mode": "2d", "units": "px", "coordinates": "x-right y-down", "elements": {eid: {"id": eid, "name": "trace", "type": "rect", "visible": True, "locked": False, "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]}, "properties": {"width": 10, "height": 10}}}}
    payload = {"schema": "research-data.proof-draft.v1", "scene": scene, "assets": {}, "editor": {"bundle": {"version": "0.10.0"}}, "document": {"title": "CLI proof", "authors": "Tester", "abstract": "Abstract", "body": "温度😀\n第二行", "caption": "Caption", "layout": "single"}, "inputs": [{"run_id": run.run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}], "figure_png": f"data:image/png;base64,{PNG}"}
    revision = ProofStore(root).publish(run.run_id, payload)
    return root, run.run_id, revision["revision_id"]


def _comment(root, run_id, revision_id, encoding):
    locator = root.parent / "locator.json"
    locator.write_text(json.dumps({"kind": "text", "start": 2, "end": 3, "exact": "😀"}, ensure_ascii=False), encoding="utf-8")
    env = dict(os.environ, PYTHONPATH=str(Path(__file__).parents[1] / "src"), PYTHONIOENCODING=encoding)
    return subprocess.run([sys.executable, "-m", "research_data", "--root", str(root), "proof", "comment", "--run-id", run_id, "--revision", revision_id, "--anchor", "body", "--locator", str(locator), "--text", "检查😀"], capture_output=True, text=True, encoding=encoding, env=env)


def test_cli_comment_json_falls_back_on_gbk_and_preserves_store(tmp_path):
    root, run_id, revision_id = _proof(tmp_path)
    result = _comment(root, run_id, revision_id, "gbk")
    assert result.returncode == 0, result.stderr
    value = json.loads(result.stdout)
    assert value["locator"]["exact"] == "😀"
    assert value["text"] == "检查😀"
    assert ProofStore(root).comments(run_id, revision_id)[0]["locator"] == value["locator"]


def test_cli_comment_json_keeps_unicode_on_utf8_stdout(tmp_path):
    root, run_id, revision_id = _proof(tmp_path)
    result = _comment(root, run_id, revision_id, "utf-8")
    assert result.returncode == 0, result.stderr
    assert "😀" in result.stdout
    assert json.loads(result.stdout)["text"] == "检查😀"
