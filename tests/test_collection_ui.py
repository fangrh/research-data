import hashlib
import sys
from pathlib import Path

from research_data.catalog import Catalog
from research_data.collections import CollectionStore
from research_data.collection_ui import collection_card_html, member_links_html
from research_data.ui import browse_url, header_html

APP = Path(__file__).parents[1] / "src/research_data/app.py"


def test_collection_html_escapes_metadata_and_preserves_navigation_context(tmp_path):
    store = CollectionStore(tmp_path)
    item = store.create('<script>"bad"</script>', description='<img src=x>', tags=['<b>tag</b>'])
    rendered = collection_card_html(item, './?collection=x&catalog=a')
    assert '<script>' not in rendered and '<img src=x>' not in rendered
    assert '&lt;script&gt;' in rendered and '&amp;catalog=' in rendered
    context = {'catalog': 'C:/catalog', 'project_dir': 'D:/project', 'junk': 'discard'}
    links = member_links_html(context, item['collection_id'], 'run-1')
    assert links.count("target='_self'") == 3 and 'view=proof' in links and 'view=data' in links
    assert 'from_collection=' in links and 'collection=x' not in links and 'junk=' not in links
    assert '合集</a>' in header_html('./', './?fav=1', 'collections', './?collections=1')
    assert browse_url(context, collections='1').endswith('&collections=1')


def prepared(tmp_path, monkeypatch, *, empty=False):
    from streamlit.testing.v1 import AppTest
    monkeypatch.setattr(sys, 'argv', ['streamlit'])
    catalog = Catalog(tmp_path / 'catalog')
    runs = [] if empty else [catalog.start_run(f'Synthetic {i}', project='demo').finish().run_id for i in range(2)]
    monkeypatch.setenv('RESEARCH_DATA_CATALOG', str(catalog.root))
    app = AppTest.from_file(APP, default_timeout=30)
    app.query_params['collections'] = '1'
    return catalog, runs, CollectionStore(catalog.root), app


def test_create_empty_catalog_collection_then_add_edit_reorder_remove(tmp_path, monkeypatch):
    catalog, runs, store, app = prepared(tmp_path, monkeypatch)
    before = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in (catalog.root / 'runs').rglob('*') if p.is_file()}
    app.run()
    assert not app.exception
    next(x for x in app.text_input if x.label == '合集标题').set_value('Experiment and model')
    next(x for x in app.text_area if x.label == '合集简介').set_value('Related synthetic results')
    next(x for x in app.button if x.label == '创建合集').click().run()
    assert not app.exception
    cid = store.list()[0]['collection_id']
    assert app.query_params['collection'] == cid
    next(x for x in app.selectbox if x.label == '选择数据').set_value(runs[0])
    next(x for x in app.text_input if x.label == '数据角色').set_value('实验结果')
    next(x for x in app.text_area if x.label == '关联说明').set_value('Same sample baseline')
    next(x for x in app.button if x.label == '加入合集').click().run()
    assert not app.exception and store.get(cid)['members'][0]['note'] == 'Same sample baseline'
    next(x for x in app.button if x.label == '加入合集').click().run()
    assert not app.exception and len(store.get(cid)['members']) == 2
    next(x for x in app.button if x.label == '↓ 下移').click().run()
    assert not app.exception and store.get(cid)['members'][1]['run_id'] == runs[0]
    next(x for x in app.button if x.label == '移出合集').click().run()
    assert not app.exception and len(store.get(cid)['members']) == 1
    after = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in (catalog.root / 'runs').rglob('*') if p.is_file()}
    assert before == after


def test_empty_catalog_collections_and_stale_browser_edit(tmp_path, monkeypatch):
    _, _, store, app = prepared(tmp_path, monkeypatch, empty=True)
    app.run()
    assert not app.exception and any('还没有匹配' in x.value for x in app.info)
    item = store.create('Original')
    cid = item['collection_id']
    app.query_params.clear()
    app.query_params['collection'] = cid
    app.run()
    assert not app.exception
    store.update(cid, title='External update')
    next(x for x in app.text_input if x.label == '合集标题').set_value('Stale edit')
    next(x for x in app.button if x.label == '保存合集信息').click().run()
    assert not app.exception and store.get(cid)['title'] == 'External update'
    assert any('changed' in x.value for x in app.error)


def test_dataset_membership_join_and_data_workspace_link(tmp_path, monkeypatch):
    _, runs, store, app = prepared(tmp_path, monkeypatch)
    item = store.create('Shared series')
    cid = item['collection_id']
    app.query_params.clear()
    app.query_params.update(pick=runs[0], view='data', from_collection=cid)
    app.run()
    assert not app.exception
    next(x for x in app.text_input if x.label == '数据角色').set_value('reference')
    next(x for x in app.button if x.label == '确认加入').click().run()
    assert not app.exception and store.memberships(runs[0])[0]['collection_id'] == cid
    assert any('返回合集' in x.value for x in app.markdown)
    assert next(x for x in app.segmented_control if x.label == '工作区').value == '数据与绘图'
