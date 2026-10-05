"""Synthetic UI fixture; no physical model or experimental measurement.

research-data run --title "Synthetic template demo" --profile project:transport \
    --project-dir examples --source examples/project_workflow.py -- python examples/project_workflow.py
"""
import cmath
import csv
import os
from pathlib import Path

output = Path(os.environ["RESEARCH_DATA_OUTPUT"])
with (output / "synthetic_response.csv").open("w", newline="", encoding="utf-8") as stream:
    writer = csv.writer(stream)
    writer.writerow(["bias", "raw_current"])
    for i in range(61):
        bias = -3 + i / 10
        value = cmath.exp(1j * bias) / (1 + bias * bias)
        writer.writerow([bias, str(value)])
