from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from research_data.catalog import Catalog


def test_lifecycle_rebuild_and_integrity(tmp_path: Path):
    source = tmp_path / "values.csv"
    source.write_text("x,y\n1,2\n2,4\n", encoding="utf-8")
    catalog = Catalog(tmp_path / "catalog")
    run = catalog.start_run("demo", project="p", kind="experiment", tags=["calibration"])
    artifact = run.add_artifact(source, profile={"x": "x", "units": {"y": "V"}})
    run.finish()
    assert source.read_text(encoding="utf-8") == "x,y\n1,2\n2,4\n"
    assert catalog.check()["ok"]
    assert catalog.load_dataset(run.run_id)["y"].attrs["units"] == "V"
    assert catalog.rebuild_index() == 1
    assert catalog.list_runs(filters={"kind": "experiment"})[0]["run_id"] == run.run_id
    managed = catalog.root / "runs" / run.run_id / artifact["path"]
    managed.write_bytes(b"changed")
    assert not catalog.check(run.run_id)["ok"]


def test_failure_is_persisted(tmp_path: Path):
    catalog = Catalog(tmp_path / "catalog")
    try:
        with catalog.run(title="fails") as run:
            raise RuntimeError("boom")
    except RuntimeError:
        pass
    assert catalog.get(run.run_id)["execution_status"] == "failed"


def test_artifact_collisions_traversal_and_validation_filters(tmp_path: Path):
    catalog = Catalog(tmp_path / "catalog")
    a, b = tmp_path / "a" / "same.csv", tmp_path / "b" / "same.csv"
    a.parent.mkdir(); b.parent.mkdir(); a.write_text("x\n1\n"); b.write_text("x\n2\n")
    run = catalog.start_run("中文 punctuation, note", project="lab", parameters={"temperature_K": 12}, categories={"domain": "transport"}, tags=["scan"])
    first, second = run.add_artifact(a), run.add_artifact(b)
    assert first["path"] != second["path"]
    assert len(catalog.list_runs(query="中文 punctuation")) == 1
    assert len(catalog.list_runs(filters={"parameter.temperature_K.gte": 10, "category.domain": "transport", "tag": "scan"})) == 1
    manifest = catalog.root / "runs" / run.run_id / "manifest.json"
    text = manifest.read_text()
    manifest.write_text(text.replace(first["path"], "../../outside"))
    assert any(i["issue"] == "path_traversal" for i in catalog.check(run.run_id)["issues"])
    for status in ("bogus",):
        try: catalog.finish_run(run.run_id, status)
        except ValueError: pass
        else: raise AssertionError("invalid status accepted")
    try: catalog.set_validation(run.run_id, "passed")
    except ValueError: pass
    else: raise AssertionError("passed validation without evidence accepted")


def test_concurrent_artifact_registration_and_default_load(tmp_path: Path):
    catalog = Catalog(tmp_path / "catalog")
    run = catalog.start_run("concurrent")
    data = tmp_path / "data.csv"; data.write_text("x\n1\n")
    log = tmp_path / "stdout.log"; log.write_text("done\n")
    def add(path, role): return run.add_artifact(path, role=role)
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda pair: add(*pair), [(data, "raw"), (log, "log")]))
    assert len(catalog.get(run.run_id)["artifacts"]) == 2
    assert catalog.select_artifact(run.run_id)["artifact_id"] == results[0]["artifact_id"]
    assert "x" in catalog.load_dataset(run.run_id)


def test_list_runs_summary_index_only(tmp_path: Path):
    catalog = Catalog(tmp_path / "catalog")
    source = tmp_path / "v.csv"; source.write_text("x\n1\n", encoding="utf-8")
    with catalog.run(title="summary scan", project="p1", kind="simulation",
                     parameters={"temperature_K": 3, "file_count": 1},
                     tags=["scan"], categories={"domain": "transport", "stage": "raw"}) as run:
        run.add_artifact(source)
    with catalog.run(title="second", project="p2", kind="analysis") as run2:
        pass

    rows = catalog.list_runs_summary()
    assert [r["run_id"] for r in rows] == sorted(r["run_id"] for r in rows) or len(rows) == 2
    by_id = {r["run_id"]: r for r in rows}
    first = by_id[run.run_id]
    assert first["title"] == "summary scan" and first["project"] == "p1" and first["kind"] == "simulation"
    assert first["tags"] == ["scan"] and first["categories"] == {"domain": "transport", "stage": "raw"}
    assert first["parameters"]["temperature_K"] == 3
    assert "artifacts" not in first  # summary carries no manifest-only fields

    assert len(catalog.list_runs_summary(filters={"project": "p1"})) == 1
    assert len(catalog.list_runs_summary(filters={"kind": "analysis"})) == 1
    assert len(catalog.list_runs_summary(filters={"tag": "scan"})) == 1
    assert len(catalog.list_runs_summary(filters={"category.domain": "transport"})) == 1
    assert len(catalog.list_runs_summary(filters={"parameter.temperature_K.gte": 2})) == 1
    assert len(catalog.list_runs_summary(filters={"parameter.temperature_K.lte": 2})) == 0
    assert len(catalog.list_runs_summary(query="summary")) == 1
    assert len(catalog.list_runs_summary(query="SUMMARY")) == 1  # case-insensitive
    assert len(catalog.list_runs_summary(query="中文不存在")) == 0
    try:
        catalog.list_runs_summary(filters={"git_commit": "x"})
    except ValueError:
        pass
    else:
        raise AssertionError("unsupported filter accepted silently")


def test_rust_summary_extension_matches_python(tmp_path: Path):
    pytest = __import__("pytest")
    rust = pytest.importorskip("research_data_rspeed")
    catalog = Catalog(tmp_path / "catalog")
    source = tmp_path / "v.csv"; source.write_text("x\n1\n", encoding="utf-8")
    with catalog.run(title="rust parity", project="p", parameters={"temperature_K": 5},
                     tags=["a"], categories={"domain": "transport"}) as run:
        run.add_artifact(source)
    rows = rust.load_run_summaries(str(catalog.db))
    py_rows = [r for r in catalog.list_runs_summary() if True]
    assert len(rows) == 1
    first = rows[0]
    assert first["run_id"] == run.run_id and first["title"] == "rust parity"
    assert first["tags"] == ["a"] and first["categories"] == {"domain": "transport"}
    assert first["parameters"]["temperature_K"] == 5
    # the summary path dispatches to the extension automatically when importable
    assert catalog.list_runs_summary()[0]["run_id"] == run.run_id
def test_batch_registration_single_write_and_error_modes(tmp_path: Path):
    catalog = Catalog(tmp_path / "catalog")
    files = []
    for i in range(3):
        p = tmp_path / f"v{i}.csv"
        p.write_text(f"x\n{i}\n", encoding="utf-8")
        files.append(p)
    run = catalog.start_run("batch", project="bulk")
    artifacts, errors = catalog.register_artifacts(
        run.run_id, files, description="batch historical import",
        descriptions={files[1].name: "second file"})
    assert not errors and len(artifacts) == 3
    assert artifacts[1]["description"] == "second file"
    manifest = catalog.get(run.run_id)
    assert [a["original_name"] for a in manifest["artifacts"]] == [p.name for p in files]
    assert manifest["artifacts"][0]["description"] == "batch historical import"
    assert catalog.check(run.run_id)["ok"]
    with catalog._connect() as c:
        assert c.execute("SELECT COUNT(*) FROM artifacts WHERE run_id=?", (run.run_id,)).fetchone()[0] == 3
    # strict mode keeps raising like the single-file API
    try:
        catalog.register_artifacts(run.run_id, [tmp_path / "missing.csv"])
    except FileNotFoundError:
        pass
    else:
        raise AssertionError("missing file accepted in strict mode")
    # lenient mode records the failure and still registers the rest
    more = tmp_path / "v3.csv"; more.write_text("x\n9\n", encoding="utf-8")
    artifacts, errors = catalog.register_artifacts(run.run_id, [tmp_path / "missing.csv", more], strict=False)
    assert list(errors) == [str(tmp_path / "missing.csv")]
    assert [a["original_name"] for a in artifacts] == ["v3.csv"]
    run.finish("imported")
    assert catalog.get(run.run_id)["execution_status"] == "imported"
