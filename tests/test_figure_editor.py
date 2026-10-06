import base64
import io
import json
from pathlib import Path

import pytest
from PIL import Image

from research_data.catalog import Catalog
from research_data.cli import main
from research_data.figure_editor import RESOURCES, initial_payload, vendor_metadata
from research_data.proofs import ProofStore


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
