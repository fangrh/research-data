import hashlib
from pathlib import Path

import pytest

from research_data.articles import ArticleStore, data_artifacts, proof_document
from research_data.catalog import Catalog


def make_run(tmp_path):
    cat = Catalog(tmp_path)
    run = cat.start_run("legacy 測試", description="kept"); source = tmp_path / "trace.csv"
    source.write_text("time,current\n0,1\n", encoding="utf-8")
    artifact = run.add_artifact(source, description="current trace", variables=[{"name": "current", "unit": "A"}])
    run.finish()
    return cat, run, artifact


def complete(store, run, description="current trace"):
    article = store.template(run.run_id)
    article.update(title="Unicode 标题", summary="Summary", methods="Methods", results="Results", limitations="Limitations", equation_note="No equations", figure_note="No figures")
    article["datasets"][0].update(description=description, variables="current (A); time (unknown unit)")
    return article


def test_incomplete_and_coverage_rejected(tmp_path):
    _, run, _ = make_run(tmp_path); store = ArticleStore(tmp_path)
    article = store.template(run.run_id)
    assert not store.check(run.run_id, article)["ok"]
    article = complete(store, run); article["datasets"] = []
    assert any("omitted" in e for e in store.check(run.run_id, article)["errors"])


def test_submit_freezes_and_status_detects_new_artifact(tmp_path):
    cat, run, artifact = make_run(tmp_path); store = ArticleStore(tmp_path)
    saved = store.save(run.run_id, complete(store, run)); frozen = store.submit(run.run_id, expected_hash=saved["sha256"])
    assert frozen["status"] == "submitted" and store.status(run.run_id)["status"] == "submitted"
    frozen_bytes = Path(frozen["path"]) / "article.json"
    digest = hashlib.sha256(frozen_bytes.read_bytes()).hexdigest()
    cat.get(run.run_id)["artifacts"][0]["description"] = "mutated in memory only"
    # Existing receipt bytes remain independently verifiable.
    assert hashlib.sha256(frozen_bytes.read_bytes()).hexdigest() == digest
    extra = tmp_path / "extra.csv"; extra.write_text("x\n1\n", encoding="utf-8")
    run.add_artifact(extra, description="extra", variables=[{"name": "x"}])
    assert store.status(run.run_id)["status"] == "stale"
    assert store.revisions(run.run_id)[0]["revision_id"] == frozen["revision_id"]


def test_tampered_data_rejected_and_legacy_readable(tmp_path):
    cat, run, artifact = make_run(tmp_path); store = ArticleStore(tmp_path)
    article = complete(store, run); Path(tmp_path, "runs", run.run_id, artifact["path"]).write_text("tampered\n", encoding="utf-8")
    with pytest.raises(ValueError, match="not ready"):
        store.submit(run.run_id, article)
    assert cat.get(run.run_id)["description"] == "kept"


def test_proof_document_is_pure_and_data_helper_excludes_support_roles(tmp_path):
    _, run, _ = make_run(tmp_path); m = Catalog(tmp_path).get(run.run_id)
    m["artifacts"].append({"artifact_id": "fig", "role": "figure"})
    assert len(data_artifacts(m)) == 1
    doc = proof_document(complete(ArticleStore(tmp_path), run))
    assert doc["title"] == "Unicode 标题" and "Methods" in doc["body"]


def test_revision_registry_verifies_old_and_latest_receipts(tmp_path):
    _, run, _ = make_run(tmp_path); store = ArticleStore(tmp_path)
    first = store.submit(run.run_id, complete(store, run)); second_article = complete(store, run); second_article["results"] = "changed"
    second = store.submit(run.run_id, second_article)
    assert store.get_revision(run.run_id, first["revision_id"])["revision_id"] == first["revision_id"]
    Path(second["path"], "receipt.json").write_text("{}", encoding="utf-8")
    with pytest.raises(ValueError, match="receipt"):
        store.status(run.run_id)


def test_running_execution_cannot_submit(tmp_path):
    cat = Catalog(tmp_path); run = cat.start_run("running")
    store = ArticleStore(tmp_path); article = store.template(run.run_id)
    with pytest.raises(ValueError, match="execution status"):
        store.submit(run.run_id, article)


def test_equation_entries_require_text_and_supported_math(tmp_path):
    _, run, _ = make_run(tmp_path); store = ArticleStore(tmp_path); article = complete(store, run)
    article["equation_note"] = ""; article["equations"] = [{"latex": "", "description": ""}]
    result = store.check(run.run_id, article)
    assert not result["ok"] and any("equation" in error for error in result["errors"])
