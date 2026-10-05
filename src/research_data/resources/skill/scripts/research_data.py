"""Portable skill launcher: use its installed runtime without shell interpolation."""
import json
import os
import subprocess
import sys
from pathlib import Path

settings = Path(__file__).resolve().parents[1] / "runtime.json"
runtime = json.loads(settings.read_text(encoding="utf-8")) if settings.is_file() else {}
python = os.environ.get("RESEARCH_DATA_PYTHON") or runtime.get("python") or sys.executable
args = sys.argv[1:]
if runtime.get("catalog") and "--root" not in args and not os.environ.get("RESEARCH_DATA_CATALOG"):
    args = ["--root", runtime["catalog"], *args]
raise SystemExit(subprocess.call([python, "-m", "research_data", *args]))
