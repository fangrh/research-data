import base64
import io
import json
from pathlib import Path

import pytest
from PIL import Image

from research_data.catalog import Catalog
from research_data.cli import main
from research_data.figure_editor import RESOURCES, initial_payload, vendor_metadata, plotly_seed, upgrade_request
from research_data.proofs import ProofStore
from research_data.proof_ui import reconstruct_upgrade


def png():
    output = io.BytesIO()
    Image.new('RGB', (120, 80), 'white').save(output, format='PNG')
    return output.getvalue()


def test_bundled_editor_matches_manifest_and_no_external_host():
    import hashlib
    meta = vendor_metadata()
    assert meta['version'] == '0.10.0'
    for name, digest in meta['files'].items():
        assert hashlib.sha256((RESOURCES / name).read_bytes()).hexdigest() == digest
    host = (RESOURCES / 'host.ts').read_text(encoding='utf-8')
    assert 'fetch(' not in host
    assert 'streamlit:setComponentValue' in host


def test_scene_payload_and_cli_revision_comments(tmp_path, capsys):
    cat = Catalog(tmp_path / 'catalog')
    data = tmp_path / 'curve.csv'
    data.write_text('x,y\n0,2\n1,3\n', encoding='utf-8')
    with cat.run(title='Synthetic proof', project='test') as run:
        art = run.add_artifact(data, profile={'x': 'x'})
    inputs = [dict(run_id=run.run_id, artifact_id=art['artifact_id'], sha256=art['sha256'])]
    payload = initial_payload(cat.get(run.run_id), png(), inputs)
    payload['figure_png'] = 'data:image/png;base64,' + base64.b64encode(png()).decode()
    draft = tmp_path / 'draft.json'
    draft.write_text(json.dumps(payload), encoding='utf-8')
    base = ['--root', str(cat.root), 'proof']
    tail = ['--run-id', run.run_id]
    assert main(base + ['save', *tail, '--draft', str(draft)]) == 0
    saved = json.loads(capsys.readouterr().out)
    assert main(base + ['publish', *tail]) == 0
    revision = json.loads(capsys.readouterr().out)
    rev = ['--revision', revision['revision_id']]
    assert Path(revision['pdf']).read_bytes().startswith(b'%PDF')
    assert main(base + ['comment', *tail, *rev, '--anchor', 'caption', '--text', 'Explain the synthetic curve.']) == 0
    comment = json.loads(capsys.readouterr().out)
    assert main(base + ['comments', *tail, *rev]) == 0
    assert json.loads(capsys.readouterr().out)[0]['id'] == comment['id']
    assert main(base + ['check', *tail, *rev]) == 0
    assert json.loads(capsys.readouterr().out)['ok']
    assert main(base + ['save', *tail, '--draft', str(draft), '--expected-hash', 'old']) == 2
    assert 'reload' in capsys.readouterr().err


def test_plot_seed_uses_existing_browser_without_static_export(tmp_path):
    import plotly.graph_objects as go
    import xarray as xr
    from research_data.proof_ui import _seed
    class App:
        session_state = {'datasets': [xr.Dataset({'y': ('x', [2, 3])}, coords={'x': [0, 1]})],
                         'dataset_ids': [dict(run_id='run', artifact_id='id', sha256='a' * 64)],
                         'viewer_recipe': {'kind': 'line', 'x': 'x', 'y': ['y']}}
    payload = _seed(App, Catalog(tmp_path), dict(run_id='run', title='Synthetic'))
    assert 'seed_plotly' in payload['editor']
    assert payload['inputs'][0]['artifact_id'] == 'id'
    assert not payload['scene']['elements']
    assert payload['editor']['seed_plotly_request']['source']['recipe'] == App.session_state['viewer_recipe']
    assert payload['editor']['seed_plotly_request']['token']


def test_raw_loadable_artifact_precedes_registered_png(tmp_path, monkeypatch):
    import plotly.graph_objects as go
    import research_data.dataset_view as dv
    import research_data.plotting as plotting
    from research_data.proof_ui import _seed

    raw = {'run_id': 'r', 'artifact_id': 'raw', 'sha256': 'a' * 64}
    monkeypatch.setattr(dv, 'artifact_inventory', lambda run: [{**raw, 'loadable': True}])
    monkeypatch.setattr(plotting, 'render_plot', lambda *args, **kwargs: go.Figure(go.Scatter(x=[0], y=[1])))
    class CatalogStub:
        def select_artifact(self, run_id, artifact_id): return raw
        def load_dataset(self, run_id, artifact_id=None):
            import xarray as xr
            return xr.Dataset({'y': ('x', [1])}, coords={'x': [0]})
    class App: session_state = {}
    run = {'run_id': 'r', 'title': 'raw first', 'artifacts': [{'format': 'png', 'artifact_id': 'png'}]}
    payload = _seed(App, CatalogStub(), run)
    assert payload['inputs'][0]['artifact_id'] == 'raw'
    assert 'seed_plotly' in payload['editor']
    assert not payload['scene']['elements']


def test_upgrade_request_freezes_sources_and_preserves_scene():
    draft = initial_payload({'title': 'legacy'}, png(), [{'run_id': 'r', 'artifact_id': 'a', 'sha256': 'b' * 64}], {'kind': 'line', 'x': 'x', 'y': ['y']})
    draft['hash'] = 'draft-hash'
    draft['scene']['elements']['annotation'] = {'id': 'annotation', 'type': 'text'}
    req = upgrade_request(draft, next(iter(draft['scene']['elements'])))
    assert req['expected_draft_hash'] == 'draft-hash'
    assert req['source']['recipe'] == draft['recipe']
    assert req['source']['inputs'] == draft['inputs']
    assert req['inputs_sha256'] and req['recipe_sha256']
    assert 'annotation' in draft['scene']['elements']


def test_reconstruct_upgrade_verifies_hash_preserves_annotations_and_request(tmp_path):
    import plotly.graph_objects as go
    source = [dict(run_id='r', artifact_id='a', sha256='b' * 64)]
    draft = initial_payload({'title': 'legacy'}, png(), source, {'kind': 'line', 'x': 'x', 'y': ['y']})
    draft['hash'] = 'draft-hash'
    draft['scene']['elements']['annotation'] = {'id': 'annotation', 'name': 'keep', 'type': 'text'}
    draft['editor']['seed_plotly'] = json.loads(go.Figure(go.Scatter(x=[0], y=[1])).to_json())

    class CatalogStub:
        def select_artifact(self, run_id, artifact_id): return {'run_id': run_id, 'artifact_id': artifact_id, 'sha256': 'b' * 64}
        def load_dataset(self, run_id, artifact_id=None):
            import xarray as xr
            return xr.Dataset({'y': ('x', [1])}, coords={'x': [0]})
        def get(self, run_id): return {'title': 'source title'}
    upgraded = reconstruct_upgrade(CatalogStub(), draft, next(iter(draft['scene']['elements'])), 3)
    request = upgraded['editor']['seed_plotly_request']
    assert request['expected_draft_hash'] == 'draft-hash'
    assert request['reset_token'] == 3
    assert request['replace_element_id']
    assert upgraded['scene']['elements']['annotation']['name'] == 'keep'
    assert upgraded['editor']['upgrade_source_verified'] is True

    class Changed(CatalogStub):
        def select_artifact(self, run_id, artifact_id): return {'sha256': 'c' * 64}
    with pytest.raises(ValueError, match='已变化'):
        reconstruct_upgrade(Changed(), draft, 'missing', 4)


def test_proof_workspace_creates_seed_without_headless_browser(tmp_path, monkeypatch):
    import sys
    from streamlit.testing.v1 import AppTest
    monkeypatch.setattr(sys, 'argv', ['streamlit'])
    cat = Catalog(tmp_path / 'catalog')
    monkeypatch.setenv('RESEARCH_DATA_CATALOG', str(cat.root))
    data = tmp_path / 'curve.csv'; data.write_text('x,y\n0,2\n1,3\n', encoding='utf-8')
    with cat.run(title='Synthetic proof') as run:
        art = run.add_artifact(data, profile={'x': 'x'})
    app = AppTest.from_file(Path(__file__).parents[1] / 'src/research_data/app.py', default_timeout=30)
    app.query_params.update(pick=run.run_id, view='proof')
    app.run()
    next(b for b in app.button if b.label == '从当前数据图创建草稿').click().run()
    assert not app.exception
    draft = ProofStore(cat.root).draft(run.run_id)
    assert 'seed_plotly' in draft['editor']
    assert draft['inputs'][0]['artifact_id'] == art['artifact_id']
