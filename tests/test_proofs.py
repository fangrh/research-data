import base64
import hashlib
import json
import shutil
from uuid import uuid4

import pytest

from research_data.catalog import Catalog
from research_data.proofs import ProofStore

pytest.importorskip("reportlab", reason="reportlab is an optional PDF dependency")

PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="


def _scene():
    sid, eid = str(uuid4()), str(uuid4())
    return {
        "schema": "three-interact.scene", "version": 1, "id": sid,
        "mode": "2d", "units": "px", "coordinates": "x-right y-down; logical pixels; rotation radians about z",
        "elements": {eid: {"id": eid, "name": "trace", "type": "rect", "visible": True, "locked": False,
                             "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]},
                             "properties": {"width": 120, "height": 80, "fill": "#336699"}}},
    }, eid


def _input(tmp_path):
    source = tmp_path / "values.csv"
    source.write_text("x,y\n1,2\n2,4\n", encoding="utf-8")
    catalog = Catalog(tmp_path / "catalog")
    with catalog.run(title="input", kind="simulation") as run:
        artifact = run.add_artifact(source, role="raw")
    return catalog.root, run.run_id, artifact


def _payload(run_id, artifact, scene, eid, caption="first"):
    return {"schema": "research-data.proof-draft.v1", "scene": scene, "assets": {},
            "editor": {"history": [{"sequence": 1}], "orders": [], "selection": [eid], "upstream_commit": "abc", "bundle": {"version": "0.10.0"}},
            "document": {"title": "Proof", "authors": "A. Researcher", "abstract": "Abstract", "body": "Body text", "caption": caption, "layout": "single"},
            "inputs": [{"run_id": run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}], "figure_png": f"data:image/png;base64,{PNG}"}


def test_publish_revisions_are_immutable_and_comments_are_anchored(tmp_path):
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    first = store.publish(run_id, _payload(run_id, artifact, scene, eid))
    second_payload = _payload(run_id, artifact, scene, eid, "second")
    second = store.publish(run_id, second_payload)
    assert first["revision_id"] != second["revision_id"]
    assert store.get(run_id, first["revision_id"])["payload_hash"] != store.get(run_id, second["revision_id"])["payload_hash"]
    first_scene = (tmp_path / "catalog" / "proofs" / run_id / first["revision_id"] / "scene.json").read_bytes()
    assert first_scene.startswith(b'{') and (tmp_path / "catalog" / "proofs" / first["run_id"] / first["revision_id"] / "report.pdf").read_bytes().startswith(b"%PDF")
    comment = store.add_comment(run_id, first["revision_id"], "Keep this label aligned.", f"element:{eid}")
    reply = store.add_comment(run_id, first["revision_id"], "Accepted.", "figure", parent_id=comment["id"])
    assert store.comments(run_id, first["revision_id"]) == [comment, reply]
    with pytest.raises(ValueError, match="unknown"):
        store.add_comment(run_id, first["revision_id"], "Nope", "element:missing")
    report = tmp_path / "catalog" / "proofs" / run_id / first["revision_id"] / "report.html"
    report.write_text("tampered", encoding="utf-8")
    with pytest.raises(ValueError, match="tampered"):
        store.get(run_id, first["revision_id"])
    assert (tmp_path / "catalog" / "runs" / first["analysis_run_id"] / "manifest.json").exists()


def test_draft_conflict_tamper_and_path_rejection(tmp_path):
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    payload = _payload(run_id, artifact, scene, eid)
    saved = store.save_draft(run_id, payload)
    with pytest.raises(ValueError, match="changed"):
        store.save_draft(run_id, payload, expected_hash="0" * 64)
    managed = root / "runs" / run_id / artifact["path"]
    managed.write_text("tampered\n", encoding="utf-8")
    with pytest.raises(ValueError, match="tampered"):
        store.publish(run_id, payload)
    with pytest.raises(ValueError, match="invalid run id"):
        store.draft("../escape")
    assert saved["hash"] == store.draft(run_id)["hash"]


def test_owner_run_is_parent_when_inputs_are_empty(tmp_path):
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    payload = _payload(run_id, artifact, scene, eid)
    payload["inputs"] = []
    published = store.publish(run_id, payload)
    assert run_id in published["source_runs"]


def test_proof_freezes_recipe_and_source_before_render_and_survives_move(tmp_path, monkeypatch):
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    payload = _payload(run_id, artifact, scene, eid)
    payload['recipe'] = {'kind': 'line', 'x': 'x', 'y': ['y']}
    render = store._render_pdf
    def checked_render(*args):
        analyses = [r for r in store.catalog.list_runs() if r['kind'] == 'analysis']
        assert len(analyses) == 1
        assert (root / 'runs' / analyses[0]['run_id'] / 'source' / 'snapshot.zip').is_file()
        return render(*args)
    monkeypatch.setattr(store, '_render_pdf', checked_render)
    published = store.publish(run_id, payload)
    moved = tmp_path / 'moved'
    shutil.copytree(root, moved)
    revision = ProofStore(moved).get(run_id, published['revision_id'])
    recipe = moved / 'proofs' / run_id / revision['revision_id'] / revision['files']['recipe']
    assert json.loads(recipe.read_text()) == payload['recipe']
    recipe.write_text('{}')
    with pytest.raises(ValueError, match='tampered: recipe'):
        ProofStore(moved).get(run_id, published['revision_id'])


def test_malformed_png_bytes_are_rejected_before_publication(tmp_path):
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    with pytest.raises(ValueError, match='readable image'):
        store.publish(run_id, _payload(run_id, artifact, scene, eid), b'\x89PNG\r\n\x1a\ninvalid')
    assert store.revisions(run_id) == []


def test_scene_layer_order_survives_draft_and_revision(tmp_path):
    import copy
    root, run_id, artifact = _input(tmp_path)
    scene, eid = _scene(); store = ProofStore(root)
    top_id = str(uuid4()); top = copy.deepcopy(scene['elements'][eid]); top['id'] = top_id
    scene['elements'] = dict(sorted({eid: scene['elements'][eid], top_id: top}.items(), reverse=True))
    payload = _payload(run_id, artifact, scene, eid)
    saved = store.save_draft(run_id, payload)
    assert list(store.draft(run_id)['scene']['elements']) == list(scene['elements'])
    published = store.publish(run_id)
    frozen = json.loads((root / 'proofs' / run_id / published['revision_id'] / 'scene.json').read_text())
    assert list(frozen['elements']) == list(scene['elements'])
    payload['scene']['elements'] = dict(reversed(list(scene['elements'].items())))
    assert store.save_draft(run_id, payload, expected_hash=saved['hash'])['hash'] != saved['hash']
