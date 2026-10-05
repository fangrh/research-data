"""Managed localhost browser service, with authenticated ownership and reuse.

The small supervisor owns its Streamlit child. Stop requests never kill a PID
from a file: they go to the live supervisor that proves its session identity.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import secrets
import signal
import socket
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import urllib.error
import urllib.request
import webbrowser

from .agent import config_path


def _identity(root):
    return os.path.normcase(str(Path(root).resolve()))


def _paths(root):
    directory = config_path().parent / "servers"
    key = hashlib.sha256(_identity(root).encode()).hexdigest()[:24]
    return directory / f"{key}.json", directory / f"{key}.log"


def _read(path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else None
    except (OSError, ValueError):
        return None


def _request(state, action="status"):
    request = urllib.request.Request(
        f"http://127.0.0.1:{int(state['control_port'])}/{action}",
        headers={"Authorization": "Bearer " + state["token"]},
        data=b"" if action == "stop" else None,
    )
    # Explicitly bypass proxy settings for this strictly local control protocol.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open(request, timeout=2) as response:
        result = json.load(response)
    if result.get("session_id") != state["token"] or result.get("root") != state["root"]:
        raise ValueError("Service identity mismatch")
    return result


def _public(state, **extra):
    return {key: state[key] for key in ("root", "url", "port", "pid", "child_pid", "started_at") if key in state} | extra


def status(root):
    path, _ = _paths(root)
    state = _read(path)
    if state and state.get("root") == _identity(root):
        try:
            result = _request(state)
            if result.get("running"):
                return _public(state, running=True)
        except (OSError, ValueError, KeyError, TypeError, urllib.error.URLError):
            pass
    return {"root": _identity(root), "running": False}


def stop(root, timeout=15):
    path, _ = _paths(root)
    state = _read(path)
    if not status(root)["running"]:
        return {"root": _identity(root), "stopped": False, "reason": "No managed service is running"}
    _request(state, "stop")
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        current = _read(path)
        if not current or current.get("token") != state["token"]:
            return _public(state, stopped=True)
        time.sleep(0.1)
    raise RuntimeError("Service shutdown timed out; run status to inspect it")


def _command(root, port, script=None):
    command = [sys.executable, "-m", "streamlit", "run", str(script or Path(__file__).with_name("app.py")),
            "--server.address", "127.0.0.1", "--server.port", str(port), "--server.headless", "true",
            "--browser.gatherUsageStats", "false", "--", _identity(root)]
    if script:
        command[command.index("--"):command.index("--")] = ["--server.enableStaticServing", "true"]
    return command


def _runtime_check():
    if importlib.util.find_spec("streamlit") is None:
        raise RuntimeError('Browser UI is not installed. Run: python -m pip install "research-data[ui] @ git+https://github.com/fangrh/research-data.git"; then research-data open')


def _free_port(preferred):
    if not 1 <= preferred <= 65535:
        raise ValueError("Port must be between 1 and 65535")
    for port in range(preferred, min(preferred + 20, 65536)):
        with socket.socket() as probe:
            try:
                probe.bind(("127.0.0.1", port))
                return port
            except OSError:
                pass
    raise RuntimeError("No free localhost port nearby; pass a different --port")


def _healthy(port, owner=None):
    try:
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        with opener.open(f"http://127.0.0.1:{port}/_stcore/health", timeout=1) as response:
            if response.status != 200 or response.read() != b"ok":
                return False
        if owner:
            with opener.open(f"http://127.0.0.1:{port}/app/static/identity.txt", timeout=1) as response:
                return response.read().decode() == owner
        return True
    except (OSError, urllib.error.URLError):
        return False


@contextmanager
def _launch_lock(lock, timeout):
    deadline = time.monotonic() + timeout
    # Serialize concurrent launch requests. Crash leftovers expire after the
    # maximum supervisor startup budget (timeout capped below).
    while True:
        try:
            lock_file = lock.open("x")
            lock_file.close()
            break
        except FileExistsError:
            try:
                stale = time.time() - lock.stat().st_mtime > 130
            except FileNotFoundError:
                continue
            if stale:
                lock.unlink(missing_ok=True)
                continue
            if time.monotonic() > deadline:
                raise RuntimeError("Another launch is still starting; retry open or inspect status")
            time.sleep(0.1)
    try:
        yield
    finally:
        lock.unlink(missing_ok=True)


def _launch(root, port, timeout, path, log):
    port = _free_port(port)
    token = secrets.token_urlsafe(32)
    startup_timeout = min(timeout, 120)
    command = [sys.executable, "-m", "research_data.server", "--root", root, "--port", str(port),
               f"--token={token}", "--timeout", str(startup_timeout)]
    kwargs = {"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == "nt" else {"start_new_session": True}
    with log.open("ab") as output:
        process = subprocess.Popen(command, stdin=subprocess.DEVNULL, stdout=output, stderr=output, **kwargs)
    deadline = time.monotonic() + startup_timeout + 5
    while time.monotonic() < deadline:
        state = _read(path)
        if state and state.get("token") == token:
            current = status(root)
            if current["running"]:
                return current
        if process.poll() is not None:
            detail = log.read_bytes()[-3000:].decode("utf-8", errors="replace")
            raise RuntimeError(f"Browser service could not start. Log: {log}\n{detail}")
        time.sleep(0.1)
    raise RuntimeError(f"Browser service startup timed out. Inspect: {log}")


def open_catalog(root, port=8765, no_open=False, timeout=45):
    _runtime_check()
    if timeout < 1:
        raise ValueError("Timeout must be at least one second")
    root = _identity(root)
    path, log = _paths(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    with _launch_lock(path.with_suffix(".lock"), timeout):
        current = status(root)
        reused = current["running"]
        if not reused:
            # Different catalogs share an allocation lock until their owned
            # endpoint is ready, so concurrent opens cannot claim one port.
            with _launch_lock(path.parent / "allocation.lock", timeout):
                current = _launch(root, port, timeout, path, log)
        result = current | {"reused": reused, "log": str(log), "browser_opened": False}
        if not no_open:
            try:
                result["browser_opened"] = bool(webbrowser.open(result["url"]))
            except webbrowser.Error:
                pass
            if not result["browser_opened"]:
                result["hint"] = "The service is ready. Open the URL in your browser."
        return result


def serve(root, port=8765, no_open=False):
    _runtime_check()
    if not 1 <= port <= 65535:
        raise ValueError("Port must be between 1 and 65535")
    command = _command(root, port)
    command[command.index("--server.headless") + 1] = "true" if no_open else "false"
    try:
        return subprocess.call(command)
    except KeyboardInterrupt:
        return 130


def _supervise(root, port, token, timeout):
    path, _ = _paths(root)
    root = _identity(root)
    owner = hashlib.sha256(token.encode()).hexdigest()
    runner = path.parent / (path.stem + "-" + owner[:12])
    static = runner / "static"
    static.mkdir(parents=True, exist_ok=True)
    (static / "identity.txt").write_text(owner, encoding="utf-8")
    script = runner / "app.py"
    script.write_text(f"from research_data.app import main\nmain(root={root!r})\n", encoding="utf-8")
    stopping = threading.Event()
    kwargs = {"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == "nt" else {}
    state = {"root": root, "url": f"http://127.0.0.1:{port}/", "port": port, "token": token,
             "pid": os.getpid(), "started_at": time.time()}

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_GET(self):
            self._reply("status")

        def do_POST(self):
            self._reply("stop")

        def _reply(self, action):
            if self.path != "/" + action or self.headers.get("Authorization") != "Bearer " + token:
                self.send_error(403)
                return
            payload = json.dumps({"session_id": token, "root": root, "running": child.poll() is None}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            if action == "stop":
                stopping.set()

    control = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    # An OS-assigned ephemeral control port can equal the requested UI port.
    # Allocate a different endpoint before starting the Streamlit child.
    while control.server_port == port:
        control.server_close()
        control = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    control.timeout = 0.25
    state["control_port"] = control.server_port
    child = subprocess.Popen(_command(root, port, script), stdin=subprocess.DEVNULL, **kwargs)
    state["child_pid"] = child.pid
    def on_signal(*args):
        stopping.set()
    signal.signal(signal.SIGTERM, on_signal)
    signal.signal(signal.SIGINT, on_signal)
    try:
        deadline = time.monotonic() + timeout
        while not stopping.is_set() and child.poll() is None and time.monotonic() < deadline:
            if _healthy(port, owner) and child.poll() is None:
                break
            time.sleep(0.1)
        else:
            raise RuntimeError("Streamlit did not become ready before the startup deadline")
        temporary = path.with_suffix(".tmp")
        temporary.write_text(json.dumps(state), encoding="utf-8")
        temporary.replace(path)
        while not stopping.is_set() and child.poll() is None:
            control.handle_request()
    finally:
        control.server_close()
        if child.poll() is None:
            child.terminate()
            try:
                child.wait(timeout=10)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()
        current = _read(path)
        if current and current.get("token") == token:
            path.unlink(missing_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Internal ResearchData service supervisor")
    parser.add_argument("--root", required=True)
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("--timeout", type=float, default=45)
    args = parser.parse_args()
    _supervise(args.root, args.port, args.token, args.timeout)
