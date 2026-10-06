"""Integrity boundaries for interactive review events and frozen reader content."""
import base64
import io

import pytest
from PIL import Image

from research_data.catalog import Catalog
from research_data.figure_editor import initial_payload
from research_data.proof_review import review_event, review_payload, review_threads
from research_data.proofs import ProofStore


@pytest.fixture
def proof(tmp_path):
    catalog = Catalog(tmp_path / 'catalog')
    with catalog.run(title='Synthetic reader test') as run:
        pass
    png = io.BytesIO()
    Image.new('RGB', (100, 60), 'white').save(png, format='PNG')
    payload = initial_payload(catalog.get(run.run_id), png.getvalue())
    payload['figure_png'] = 'data:image/png;base64,' + base64.b64encode(png.getvalue()).decode()
    payload['document']['body'] = 'First 🧪 paragraph.\n\n第二段。'
    store = ProofStore(catalog.root)
    store.save_draft(run.run_id, payload)
    revision = store.publish(run.run_id)
    return store, run.run_id, revision


def test_reader_uses_frozen_document_after_draft_changes(proof):
    store, rid, revision = proof
    draft = store.draft(rid)
    draft['document']['body'] = 'A later draft changes the text.'
    store.save_draft(rid, draft, expected_hash=draft['hash'])
    payload = review_payload(store.get(rid, revision['revision_id']))
    assert payload['document']['body'] == 'First 🧪 paragraph.\n\n第二段。'
    assert payload['revision_id'] == revision['revision_id']
    assert payload['elements'][0]['id'] in draft['scene']['elements']


def test_reader_rejects_stale_or_foreign_selection_events(proof):
    store, rid, revision = proof
    rev = revision['revision_id']
    event = dict(event_id='selection-1', revision_id='old-version', action='select', anchor='body',
                 locator=dict(kind='text', start=0, end=7, exact='First 🧪'))
    assert review_event(store, rid, rev, event, []) is None
    event['revision_id'] = rev
    selected = review_event(store, rid, rev, event, [])
    assert selected['locator']['exact'] == 'First 🧪'
    event['locator']['exact'] = 'Altered quote'
    with pytest.raises(ValueError):
        review_event(store, rid, rev, event, [])
    with pytest.raises(ValueError, match='belong'):
        review_event(store, rid, rev, dict(event_id='focus-1', revision_id=rev, action='focus', comment_id='foreign'), [])
    assert store.comments(rid, rev) == []


def test_reply_marker_focuses_its_root_thread(proof):
    store, rid, revision = proof
    rev = revision['revision_id']
    root = store.add_comment(rid, rev, 'Discuss this point', anchor='figure', locator=dict(kind='point', x=.2, y=.6))
    reply = store.add_comment(rid, rev, 'Reply on this point', parent_id=root['id'])
    comments = store.comments(rid, rev)
    threads = review_threads(comments)
    assert len(threads) == 1 and [c['id'] for c in threads[0]['comments']] == [root['id'], reply['id']]
    event = review_event(store, rid, rev, dict(event_id='focus-2', revision_id=rev, action='focus', comment_id=reply['id']), comments)
    assert event['thread_id'] == root['id']
