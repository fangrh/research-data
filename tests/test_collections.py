import hashlib
import json
from concurrent.futures import ThreadPoolExecutor

import pytest

from research_data.catalog import Catalog
from research_data.collections import CollectionStore


def _store(tmp_path):
    catalog = Catalog(tmp_path / "catalog")
    runs = [catalog.start_run(f"run {i}").finish().run_id for i in range(3)]
    return catalog, CollectionStore(catalog.root), runs


def test_create_persists_hash_externally_and_supports_many_to_many(tmp_path):
    _, store, runs = _store(tmp_path)
    created = store.create("Sweep", description="parameter sweep", tags=["scan"], run_ids=runs[:2])
    path = store.folder / f"{created['collection_id']}.json"
    raw = json.loads(path.read_text(encoding="utf-8"))
    assert raw["schema_version"] == 1
    assert "hash" not in raw
    assert created["hash"] == hashlib.sha256(path.read_bytes()).hexdigest()
    assert store.get(created["collection_id"])["members"][0]["run_id"] == runs[0]
    other = store.create("Shared", run_ids=[runs[0], runs[2]])
    assert {x["collection_id"] for x in store.memberships(runs[0])} == {created["collection_id"], other["collection_id"]}


def test_mutations_reorder_archive_search_and_stale_hash(tmp_path):
    _, store, runs = _store(tmp_path)
    value = store.create("Alpha", tags=["Important"], run_ids=runs[:2])
    value = store.add(value["collection_id"], runs[0], role="baseline", note="kept", expected_hash=value["hash"])
    value = store.reorder(value["collection_id"], list(reversed(runs[:2])), expected_hash=value["hash"])
    assert [x["run_id"] for x in value["members"]] == [runs[1], runs[0]]
    with pytest.raises(ValueError, match="changed"):
        store.update(value["collection_id"], title="stale", expected_hash="0" * 64)
    value = store.archive(value["collection_id"], expected_hash=value["hash"])
    assert store.list() == []
    assert store.list("baseline", include_archived=True)[0]["collection_id"] == value["collection_id"]
    store.remove(value["collection_id"], "missing-historical-run", expected_hash=value["hash"])


def test_malformed_json_and_reorder_shape_are_errors(tmp_path):
    _, store, runs = _store(tmp_path)
    value = store.create("Bad", run_ids=runs[:2])
    path = store.folder / f"{value['collection_id']}.json"
    path.write_text("{", encoding="utf-8")
    with pytest.raises(ValueError, match="malformed"):
        store.get(value["collection_id"])
    value = store.create("Shape", run_ids=runs[:2])
    with pytest.raises(ValueError, match="permutation"):
        store.reorder(value["collection_id"], [runs[0]])
    with pytest.raises(ValueError):
        store.get("../escape")


def test_collection_mutations_preserve_run_bytes_and_concurrent_adds(tmp_path):
    catalog, store, runs = _store(tmp_path)
    run_files = {}
    for rid in runs:
        folder = catalog.root / "runs" / rid
        run_files[rid] = {p.relative_to(folder): hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.rglob("*") if p.is_file()}
    value = store.create("Concurrent", run_ids=[runs[0]])
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda rid: store.add(value["collection_id"], rid), runs[1:]))
    # map preserves input order, while either writer can acquire the lock last.
    # Reopen after joining both writers to test durable state, and verify that
    # each writer's own snapshot includes the membership it added.
    persisted = CollectionStore(catalog.root).get(value["collection_id"])
    assert {item["run_id"] for item in persisted["members"]} == set(runs)
    for rid, result in zip(runs[1:], results):
        assert {runs[0], rid} <= {item["run_id"] for item in result["members"]}
    for rid, before in run_files.items():
        folder = catalog.root / "runs" / rid
        after = {p.relative_to(folder): hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.rglob("*") if p.is_file()}
        assert after == before


def test_missing_historical_member_is_retained_and_removable(tmp_path):
    _, store, runs = _store(tmp_path)
    value = store.create("History", run_ids=[runs[0]])
    path = store.folder / f"{value['collection_id']}.json"
    raw = json.loads(path.read_text(encoding="utf-8"))
    raw["members"].append({"run_id": "historical-missing", "role": "old", "note": "retained", "added_at": raw["created_at"]})
    path.write_text(json.dumps(raw), encoding="utf-8")
    loaded = store.get(value["collection_id"])
    assert "historical-missing" in [item["run_id"] for item in loaded["members"]]
    removed = store.remove(value["collection_id"], "historical-missing", expected_hash=loaded["hash"])
    assert "historical-missing" not in [item["run_id"] for item in removed["members"]]


def test_collection_directory_symlink_cannot_escape_root(tmp_path):
    root = tmp_path / "catalog"
    outside = tmp_path / "outside"
    outside.mkdir()
    root.mkdir()
    (root / "runs").mkdir()
    try:
        (root / "collections").symlink_to(outside, target_is_directory=True)
    except (OSError, NotImplementedError):
        pytest.skip("symlink creation unavailable")
    with pytest.raises(ValueError, match="escapes"):
        CollectionStore(root)
