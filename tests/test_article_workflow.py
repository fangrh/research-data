import base64
import hashlib
import io
import json
import sys
from pathlib import Path

import pytest

from PIL import Image

from research_data.articles import ArticleStore
from research_data.article_ui import apply_to_proof, article_html
from research_data.catalog import Catalog
from research_data.cli import main
from research_data.figure_editor import initial_payload
from research_data.proofs import ProofStore


def prepared(tmp_path):
    catalog = Catalog(tmp_path / 'catalog')
    source = tmp_path / 'trace.csv'
    source.write_text('voltage,current\n0,0\n1,1\n', encoding='utf-8')
    image = tmp_path / 'trace.png'
    Image.new('RGB', (120, 80), 'navy').save(image)
    with catalog.run(title='Synthetic article', description='Software fixture',
                     repo=tmp_path, source_paths=['trace.csv']) as run:
        data = run.add_artifact(source, description='Synthetic samples', profile={'x': 'voltage'})
        figure = run.add_artifact(image, role='figure')
    store = ArticleStore(catalog.root)
    article = store.template(run.run_id)
    article.update(title='A synthetic data article', summary='ArticleOnlyNeedle',
        methods='Linear synthetic samples; no experiment.', results='Two generated points.',
        limitations='Software exercise only.', equations=[{'latex': 'I=GV', 'description': 'G is synthetic conductance.'}],
        figures=[{'artifact_id': figure['artifact_id'], 'caption': 'A managed synthetic illustration.'}])
    article['datasets'][0].update(description='Synthetic current at each voltage.',
        variables='voltage (V), current (A); recorded order 0 then 1.')
    return catalog, run, data, image, store, article


def test_cli_submission_requires_article_and_freezes_receipt(tmp_path, capsys):
    catalog, run, data, _, store, article = prepared(tmp_path)
    args = ['--root', str(catalog.root)]
    assert main(args + ['submit', run.run_id]) == 2
    capsys.readouterr()
    assert catalog.get(run.run_id)['execution_status'] == 'completed'
    assert (catalog.root / 'runs' / run.run_id / data['path']).is_file()
    output = tmp_path / 'article.json'
    assert main(args + ['article', 'template', '--run-id', run.run_id, '--output', str(output)]) == 0
    capsys.readouterr()
    assert json.loads(output.read_text(encoding='utf-8'))['schema'] == 'research-data.article.v1'
    article['datasets'][0]['description'] += ' DatasetOnlyNeedle'
    output.write_text(json.dumps(article), encoding='utf-8')
    assert main(args + ['article', 'check', '--run-id', run.run_id, '--file', str(output)]) == 0
    capsys.readouterr()
    assert main(args + ['submit', run.run_id, '--article', str(output)]) == 0
    receipt = json.loads(capsys.readouterr().out)
    assert receipt['status'] == 'submitted'
    assert store.status(run.run_id)['status'] == 'submitted'
    with pytest.raises(ValueError, match='schema'):
        store.submit(run.run_id, {})
    assert not store.check(run.run_id, {})['ok']
    assert catalog.list_runs('ArticleOnlyNeedle')[0]['run_id'] == run.run_id
    assert catalog.list_runs_summary(query='ArticleOnlyNeedle')[0]['run_id'] == run.run_id
    assert catalog.list_runs_summary(query='DatasetOnlyNeedle')[0]['run_id'] == run.run_id
    folder = Path(receipt['path'])
    baseline = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()}
    article['results'] = 'Edited interpretation.'
    store.save(run.run_id, article)
    assert store.status(run.run_id)['status'] == 'stale'
    assert {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()} == baseline


def test_article_proof_handoff_preserves_frozen_revision_and_comments(tmp_path):
    catalog, run, data, image, articles, article = prepared(tmp_path)
    store = ProofStore(catalog.root)
    main_image = io.BytesIO()
    Image.new('RGB', (120, 80), 'white').save(main_image, format='PNG')
    payload = initial_payload(catalog.get(run.run_id), main_image.getvalue(),
        [{'run_id': run.run_id, 'artifact_id': data['artifact_id'], 'sha256': data['sha256']}])
    payload['figure_png'] = 'data:image/png;base64,' + base64.b64encode(main_image.getvalue()).decode()
    store.save_draft(run.run_id, payload)
    first = store.publish(run.run_id)
    old = store.get(run.run_id, first['revision_id'])
    folder = Path(old['path'])
    baseline = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()
                if p.name not in {'comments.json', 'comments.lock', '.comments.lock'}}
    store.add_comment(run.run_id, first['revision_id'], 'Old review stays attached.')
    articles.submit(run.run_id, article)
    adopted = apply_to_proof(catalog, run.run_id)
    assert adopted['scene'] == payload['scene']
    assert 'Synthetic current' in adopted['document']['body']
    second = store.publish(run.run_id)
    frozen = store.get(run.run_id, second['revision_id'])
    assert frozen['resources']['equations']
    assert frozen['resources']['illustrations']
    assert store.comments(run.run_id, first['revision_id'])[0]['text'] == 'Old review stays attached.'
    assert {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir()
            if p.name not in {'comments.json', 'comments.lock', '.comments.lock'}} == baseline
    html = article_html(catalog, catalog.get(run.run_id), article)
    assert 'data:image/png;base64,' in html and 'ArticleOnlyNeedle' in html


def test_article_editor_saves_incomplete_draft_then_submits(tmp_path, monkeypatch):
    from streamlit.testing.v1 import AppTest
    monkeypatch.setattr(sys, 'argv', ['streamlit'])
    catalog, run, _, _, store, article = prepared(tmp_path)
    monkeypatch.setenv('RESEARCH_DATA_CATALOG', str(catalog.root))
    app = AppTest.from_file(Path(__file__).parents[1] / 'src/research_data/app.py', default_timeout=30)
    app.query_params.update(pick=run.run_id, view='article')
    app.run()
    assert not app.exception
    next(x for x in app.button if x.label == '保存数据文章草稿').click().run()
    assert not app.exception and store.draft(run.run_id)
    next(x for x in app.button if x.label == '提交数据与文章').click().run()
    assert not app.exception and store.status(run.run_id)['status'] == 'draft'
    assert any('methods is required' in x.value for x in app.error)
    # Load a complete draft and exercise the same actual form submit handler.
    store.save(run.run_id, article)
    app.run()
    next(x for x in app.button if x.label == '提交数据与文章').click().run()
    assert not app.exception and store.status(run.run_id)['status'] == 'submitted'
    next(x for x in app.selectbox if x.label == '文章字体').set_value('Arial').run()
    next(x for x in app.number_input if x.label == '文章字号').set_value(20).run()
    assert not app.exception


def test_proof_selected_equation_survives_form_submit_and_reply(tmp_path, monkeypatch):
    from streamlit.testing.v1 import AppTest
    monkeypatch.setattr(sys, 'argv', ['streamlit'])
    catalog, run, data, image, _, _ = prepared(tmp_path)
    monkeypatch.setenv('RESEARCH_DATA_CATALOG', str(catalog.root))
    store = ProofStore(catalog.root)
    payload = initial_payload(catalog.get(run.run_id), image.read_bytes(),
        [{'run_id': run.run_id, 'artifact_id': data['artifact_id'], 'sha256': data['sha256']}])
    payload['figure_png'] = 'data:image/png;base64,' + base64.b64encode(image.read_bytes()).decode()
    payload['document']['equations'] = [{'latex': 'I=GV', 'description': 'Synthetic conductance.'}]
    store.save_draft(run.run_id, payload)
    proof = store.publish(run.run_id)
    monkeypatch.setattr('research_data.proof_review.reader', lambda *a, **k: {
        'revision_id': proof['revision_id'], 'event_id': 'select-test-equation',
        'action': 'select', 'anchor': 'equation:0', 'locator': None})
    app = AppTest.from_file(Path(__file__).parents[1] / 'src/research_data/app.py', default_timeout=30)
    app.query_params.update(pick=run.run_id, view='proof')
    app.run()
    assert not app.exception
    next(x for x in app.text_area if x.label == '校样评论').set_value('Check this equation.')
    next(x for x in app.button if x.label == '提交校样评论').click().run()
    assert not app.exception
    comments = store.comments(run.run_id, proof['revision_id'])
    assert comments[0]['anchor'] == 'equation:0'
    assert '公式 1' in next(x for x in app.selectbox if x.label == '评论位置').options
    next(x for x in app.button if x.label == '解决').click().run()
    next(x for x in app.button if x.label == '回复').click().run()
    next(x for x in app.text_area if x.label == '校样评论').set_value('Symbols checked.')
    next(x for x in app.button if x.label == '提交校样评论').click().run()
    assert not app.exception
    comments = store.comments(run.run_id, proof['revision_id'])
    assert comments[-1]['parent_id'] == comments[0]['id']
    assert comments[-1]['anchor'] == 'equation:0' and comments[0]['status'] == 'open'
