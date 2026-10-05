import subprocess
import zipfile

import pytest

from research_data.provenance import capture_provenance, inspect_snapshot


def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def test_commit_branch_and_actual_dirty_untracked_bytes(tmp_path):
    repo = tmp_path / "repo"
    repo.mkdir()
    git(repo, "init", "-b", "trial")
    git(repo, "config", "user.email", "fixture@example.invalid")
    git(repo, "config", "user.name", "Fixture")
    script = repo / "run.py"
    script.write_text("value = 1\n")
    git(repo, "add", "run.py")
    git(repo, "commit", "-m", "base")
    expected = git(repo, "rev-parse", "HEAD")
    script.write_text("value = 2\n")
    helper = repo / "helper.jl"
    helper.write_text("value = 3\n")
    expected_script = script.read_bytes()
    expected_helper = helper.read_bytes()
    run_dir = tmp_path / "run"
    p = capture_provenance(repo, run_dir, "run.py", ["python", "run.py"], ["run.py", "helper.jl"])
    assert p["git_commit"] == expected
    assert p["git_branch"] == "trial"
    assert p["git_dirty"] is True
    with zipfile.ZipFile(run_dir / p["snapshot"]["path"]) as z:
        assert z.read("run.py") == expected_script
        assert z.read("helper.jl") == expected_helper
    script.write_text("value = 9\n")
    checked = inspect_snapshot(p, run_dir)
    assert checked["ok"]
    assert checked["source_changed_since_capture"] == ["run.py"]
    git(repo, "checkout", "--detach", expected)
    detached = capture_provenance(repo, tmp_path / "detached", source_paths=["run.py"])
    assert detached["git_branch"] is None
    assert detached["git_commit"] == expected


def test_unknown_import_does_not_assign_current_git(tmp_path):
    p = capture_provenance(None, tmp_path / "run")
    assert p["status"] == "unknown"
    assert p["git_commit"] is None
    assert p["snapshot"] is None


def test_source_traversal_is_rejected(tmp_path):
    root = tmp_path / "repo"
    root.mkdir()
    outside = tmp_path / "outside.py"
    outside.write_text("x=1")
    with pytest.raises(ValueError, match="within"):
        capture_provenance(root, tmp_path / "run", source_paths=["../outside.py"])


def test_snapshot_corruption_is_detected(tmp_path):
    repo = tmp_path / "repo"
    repo.mkdir()
    (repo / "run.py").write_text("x=1")
    run = tmp_path / "run"
    p = capture_provenance(repo, run, source_paths=["run.py"])
    (run / p["snapshot"]["path"]).write_bytes(b"corrupt")
    assert inspect_snapshot(p, run)["ok"] is False
