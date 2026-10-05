"""Run with research-data run -- ... python examples/generate.py."""
import csv
import os
from pathlib import Path

target = Path(os.environ["RESEARCH_DATA_OUTPUT"]) / "response.csv"
with target.open("w", newline="", encoding="utf-8") as stream:
    writer = csv.writer(stream)
    writer.writerow(["voltage", "current"])
    writer.writerows([(0.0, 0.0), (0.1, 1e-6), (0.2, 2e-6)])
