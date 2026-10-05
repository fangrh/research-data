import json
import hashlib
from concurrent.futures import ThreadPoolExecutor
import os
from pathlib import Path
import socket
import subprocess
import sys
import urllib.error
import urllib.request

import pytest

from research_data import server
from research_data.cli import main


def test_managed_service_lifecycle_and_occupied_port(tmp_path, monkeypatch):
    monkeypatch.setenv("RESEARCH_DATA_CONFIG", str(tmp_path / "settings.json"))
    root = tmp_path / "catalog with spaces"
    browser_urls = []
    original_token = server.secrets.token_urlsafe
    monkeypatch.setattr(server.secrets, "token_urlsafe", lambda size: "-" + original_token(size))
    monkeypatch.setattr(server.webbrowser, "open", lambda url: browser_urls.append(url) or True)
    with socket.socket() as occupied:
        occupied.bind(("127.0.0.1", 0))
        occupied.listen()
        preferred = occupied.getsockname()[1]
        assert server.status(root)["running"] is False
        try:
            opened = server.open_catalog(root, preferred, timeout=35)
            assert opened["running"] and opened["browser_opened"] and not opened["reused"]
            assert opened["port"] != preferred
            assert browser_urls == [opened["url"]]
            with urllib.request.urlopen(opened["url"] + "_stcore/health", timeout=3) as response:
                assert response.read() == b"ok"
            reused = server.open_catalog(root, preferred, no_open=True)
            assert reused["reused"] and reused["pid"] == opened["pid"]
            assert browser_urls == [opened["url"]]
            state = server._read(server._paths(root)[0])
            owner = hashlib.sha256(state["token"].encode()).hexdigest()
            assert server._healthy(opened["port"], owner)
            assert not server._healthy(opened["port"], "unrelated-service")
            invalid = urllib.request.Request(f"http://127.0.0.1:{state['control_port']}/stop", data=b"", headers={"Authorization": "Bearer wrong-session"})
            with pytest.raises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(invalid, timeout=3)
            assert error.value.code == 403
            assert server.status(root)["running"]
            # A different catalog cannot reuse or stop the running service.
            assert not server.status(tmp_path / "other")["running"]
            assert not server.stop(tmp_path / "other")["stopped"]
            assert server.stop(root)["stopped"]
            assert not server.status(root)["running"]
            assert not server._paths(root)[0].exists()
            assert not server.stop(root)["stopped"]
        finally:
            server.stop(root)


def test_corrupt_or_stale_registry_does_not_claim_a_service(tmp_path, monkeypatch):
    monkeypatch.setenv("RESEARCH_DATA_CONFIG", str(tmp_path / "settings.json"))
    path, _ = server._paths(tmp_path / "catalog")
    path.parent.mkdir(parents=True)
    for text in ('{"root": "wrong", "pid": 123}', '[1,2]', '{broken'):
        path.write_text(text, encoding="utf-8")
        assert not server.status(tmp_path / "catalog")["running"]
        assert not server.stop(tmp_path / "catalog")["stopped"]


def test_status_does_not_create_catalog(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("RESEARCH_DATA_CONFIG", str(tmp_path / "settings.json"))
    root = tmp_path / "absent catalog"
    assert main(["status", "--root", str(root)]) == 0
    assert json.loads(capsys.readouterr().out)["running"] is False
    assert not root.exists()


def test_concurrent_catalogs_get_owned_services_and_same_root_reuses(tmp_path, monkeypatch):
    monkeypatch.setenv("RESEARCH_DATA_CONFIG", str(tmp_path / "settings.json"))
    roots = [tmp_path / "first", tmp_path / "first", tmp_path / "second"]
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        preferred = probe.getsockname()[1]
    try:
        with ThreadPoolExecutor(max_workers=3) as executor:
            results = list(executor.map(lambda root: server.open_catalog(root, preferred, no_open=True, timeout=35), roots))
        assert results[0]["pid"] == results[1]["pid"]
        assert sorted([results[0]["reused"], results[1]["reused"]]) == [False, True]
        assert results[0]["port"] != results[2]["port"]
        for root, result in zip(roots, results):
            state = server._read(server._paths(root)[0])
            assert state["root"] == server._identity(root)
            assert server._healthy(result["port"], hashlib.sha256(state["token"].encode()).hexdigest())
    finally:
        for root in set(roots):
            server.stop(root)


def test_missing_ui_has_actionable_error(monkeypatch):
    monkeypatch.setattr(server.importlib.util, "find_spec", lambda name: None)
    with pytest.raises(RuntimeError, match="Browser UI is not installed"):
        server.open_catalog("unused")


@pytest.mark.skipif(os.name != "nt", reason="Windows CMD launcher")
def test_cmd_launcher_from_another_directory(tmp_path):
    root = Path(__file__).resolve().parents[1]
    if not (root / ".venv" / "Scripts" / "python.exe").exists():
        pytest.skip("Source-checkout launcher requires the setup runtime")
    result = subprocess.run(["cmd.exe", "/d", "/c", str(root / "research-data.cmd"), "--version"], cwd=tmp_path, capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    from research_data import __version__
    assert result.stdout.strip() == __version__
