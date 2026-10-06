import base64
import io
import json
from pathlib import Path

import pytest
from PIL import Image

from research_data.catalog import Catalog
from research_data.figure_editor import initial_payload
from research_data.proofs import ProofStore
from research_data.proof_ui import proof_context


def test_generated_proof_opens_owner_history_and_exact_revision(tmp_path, monkeypatch):
    import sys
    from streamlit.testing.v1 import AppTest
    monkeypatch.setattr(sys, 'argv', ['streamlit'])
    catalog = Catalog(tmp_path / 'catalog')
    monkeypatch.setenv('RESEARCH_DATA_CATALOG', str(catalog.root))
    data = tmp_path / 'trace.csv'
    data.write_text('x,y\n0,2\n1,3\n', encoding='utf-8')
    with catalog.run(title='Synthetic original') as run:
        artifact = run.add_artifact(data, profile={'x': 'x'})
    image = io.BytesIO()
    Image.new('RGB', (120, 80), 'white').save(image, format='PNG')
    payload = initial_payload(catalog.get(run.run_id), image.getvalue(),
                              [{'run_id': run.run_id, 'artifact_id': artifact['artifact_id'],
                                'sha256': artifact['sha256']}])
    payload['figure_png'] = 'data:image/png;base64,' + base64.b64encode(image.getvalue()).decode()
    store = ProofStore(catalog.root)
    saved = store.save_draft(run.run_id, payload)
    first = store.publish(run.run_id)
    payload['document']['caption'] = 'Second synthetic caption'
    store.save_draft(run.run_id, payload, expected_hash=saved['hash'])
    second = store.publish(run.run_id)
    opened = catalog.get(second['analysis_run_id'])
    owner, exact_revision = proof_context(catalog, opened)
    assert owner['run_id'] == run.run_id
    assert exact_revision == second['revision_id']

    app = AppTest.from_file(Path(__file__).parents[1] / 'src/research_data/app.py', default_timeout=30)
    app.query_params.update(pick=second['analysis_run_id'], view='proof')
    app.run()
    assert not app.exception
    assert [tab.label for tab in app.tabs][:3] == ['图形编辑', '文章排版', '校样审阅']
    versions = next(widget for widget in app.selectbox if widget.label == '查看校样版本')
    assert len(versions.options) == 2
    assert versions.value == second['revision_id']
    versions.set_value(first['revision_id']).run()
    assert not app.exception
    assert versions.key == f'proof_{run.run_id}_version'
    assert next(widget for widget in app.selectbox if widget.label == '查看校样版本').value == first['revision_id']
    assert store.draft(second['analysis_run_id']) is None

    comment = next(widget for widget in app.text_area if widget.label == '校样评论')
    comment.set_value('Review on the older exact revision')
    next(widget for widget in app.button if widget.label == '提交校样评论').click().run()
    assert not app.exception
    assert store.comments(run.run_id, first['revision_id'])[0]['text'] == 'Review on the older exact revision'
    assert store.comments(run.run_id, second['revision_id']) == []
    frozen_manifest = Path(store.get(run.run_id, first['revision_id'])['path']) / 'manifest.json'
    frozen_bytes = frozen_manifest.read_bytes()
    next(widget for widget in app.button if widget.label == '解决').click().run()
    assert not app.exception
    assert store.comments(run.run_id, first['revision_id'])[0]['status'] == 'resolved'
    next(widget for widget in app.button if widget.label == '重新打开').click().run()
    assert not app.exception
    assert store.comments(run.run_id, first['revision_id'])[0]['status'] == 'open'
    assert frozen_manifest.read_bytes() == frozen_bytes
    assert next(widget for widget in app.selectbox if widget.label == '查看校样版本').value == first['revision_id']

    # The article pane saves the same owner's draft without replacing its
    # scene or changing already frozen revisions/comments.
    scene_before = store.draft(run.run_id)['scene']
    next(widget for widget in app.text_area if widget.label == '图注').set_value('Unified workspace caption')
    next(widget for widget in app.button if widget.label == '保存文章内容').click().run()
    assert not app.exception
    saved_article = store.draft(run.run_id)
    assert saved_article['document']['caption'] == 'Unified workspace caption'
    assert saved_article['scene'] == scene_before
    assert next(widget for widget in app.selectbox if widget.label == '查看校样版本').value == first['revision_id']
    frozen_path = Path(store.get(run.run_id, second['revision_id'])['path']) / 'document.json'
    frozen = json.loads(frozen_path.read_text(encoding='utf-8'))
    assert frozen['caption'] == 'Second synthetic caption'

    manifest_artifact = next(a for a in opened['artifacts'] if a['role'] == 'proof-manifest')
    manifest_path = catalog.root / 'runs' / opened['run_id'] / manifest_artifact['path']
    manifest_path.write_text('{}', encoding='utf-8')
    with pytest.raises(ValueError, match='完整性'):
        proof_context(catalog, catalog.get(opened['run_id']))
