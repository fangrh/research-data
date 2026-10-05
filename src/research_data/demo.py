"""Small, explicitly synthetic data spanning the supported file formats."""
from __future__ import annotations

import json
import tempfile
from pathlib import Path

import h5py
import numpy as np
import pandas as pd
import xarray as xr


def build_demo(catalog, with_qcodes=False):
    existing = catalog.list_runs(filters={"project": "demo"})
    if existing:
        return {"status": "existing", "run_ids": [r["run_id"] for r in existing], "root": str(catalog.root)}
    repo = Path(__file__).resolve().parents[2]
    source = str(Path(__file__).resolve().relative_to(repo))
    profile = {"x": "voltage", "units": {"voltage": "V", "current": "A"},
               "descriptions": {"voltage": "Synthetic applied voltage in acquisition order", "current": "Synthetic current; no experimental or physical validation"},
               "coordinates": {"current": ["voltage"]}}
    voltage = np.linspace(-1, 1, 81)
    current = 1e-6 * np.tanh(3 * voltage)
    ids = []
    def register(path, label, mapping=profile, kind="simulation"):
        with catalog.run(title="示例 · " + label, project="demo", kind=kind, sample="synthetic-S01",
                         description="纯合成示例，用于验证软件浏览、格式适配与绘图，不代表实际测量或物理验证。",
                         parameters={"temperature_K": 2, "points": int(len(voltage))}, tags=["demo", "synthetic", "transport"],
                         categories={"system": "synthetic", "domain": "transport", "format": path.suffix.lstrip(".")},
                         repo=str(repo), entrypoint=source, source_paths=[source]) as run:
            run.add_artifact(path, description=label, profile=mapping)
        ids.append(run.run_id)
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        frame = pd.DataFrame({"voltage": voltage, "current": current})
        p = root / "experiment.csv"
        frame.to_csv(p, index=False)
        register(p, "CSV 实验接口", kind="experiment")
        p = root / "simulation.tsv"
        frame.assign(current=current * 1.05).to_csv(p, sep="\t", index=False)
        register(p, "TSV 模拟曲线")
        p = root / "records.json"
        p.write_text(json.dumps(frame.to_dict(orient="records")), encoding="utf-8")
        register(p, "JSON 记录")
        p = root / "current.nc"
        ds = xr.Dataset({"current": ("voltage", current, {"units": "A"})}, coords={"voltage": ("voltage", voltage, {"units": "V"})})
        ds.to_netcdf(p, engine="scipy")
        register(p, "NetCDF 有名称的数组")
        try:
            p = root / "current.parquet"
            frame.to_parquet(p, index=False)
            register(p, "Parquet 列式数据")
        except ImportError:
            pass
        p = root / "scan.h5"
        temperatures = np.array([2.0, 3.0, 4.0, 5.0])
        with h5py.File(p, "w") as file:
            file.create_dataset("voltage", data=voltage).attrs["units"] = "V"
            file.create_dataset("temperature", data=temperatures).attrs["units"] = "K"
            data = file.create_dataset("current", data=np.array([current / t for t in temperatures]))
            data.attrs["units"] = "A"
            data.attrs["dimensions"] = json.dumps(["temperature", "voltage"])
        register(p, "HDF5 二维温度扫描", {"coordinates": {"current": ["temperature", "voltage"]}, "units": {"voltage": "V", "temperature": "K", "current": "A"}})
        p = root / "response.h5"
        with h5py.File(p, "w") as file:
            file.create_dataset("voltage", data=voltage).attrs["units"] = "V"
            file.create_dataset("response", data=current + 1j * current[::-1]).attrs["units"] = "A"
        register(p, "HDF5 复数响应", {"x": "voltage", "coordinates": {"response": ["voltage"]}, "units": {"voltage": "V", "response": "A"}})
        if with_qcodes:
            from qcodes.dataset import Measurement, initialise_or_create_database_at, load_or_create_experiment
            from qcodes.parameters import ManualParameter
            p = root / "measurement.db"
            initialise_or_create_database_at(p)
            experiment = load_or_create_experiment("synthetic-transport", "synthetic-S01")
            x = ManualParameter("voltage", unit="V")
            y = ManualParameter("current", unit="A")
            measurement = Measurement(exp=experiment, name="synthetic-curve")
            measurement.register_parameter(x)
            measurement.register_parameter(y, setpoints=(x,))
            with measurement.run() as saver:
                for xv, yv in zip(voltage, current):
                    saver.add_result((x, float(xv)), (y, float(yv)))
                qcodes_guid = saver.dataset.guid
            register(p, "QCoDeS 原生数据集", {"qcodes_guid": qcodes_guid}, kind="experiment")
            saver.dataset.conn.close()
            experiment.conn.close()
    catalog.save_recipe("实验与模拟比较", {"kind": "compare", "x": "voltage", "y": "current", "theme": "paper", "title": "Synthetic cross-format comparison"})
    catalog.save_recipe("二维扫描", {"kind": "heatmap", "x": "voltage", "y_axis": "temperature", "z": "current", "theme": "ocean", "title": "Synthetic temperature scan"})
    catalog.save_recipe("复数响应", {"kind": "complex", "x": "voltage", "y": "response", "component": "abs", "theme": "midnight", "title": "Synthetic complex response"})
    return {"status": "generated", "synthetic": True, "run_ids": ids, "root": str(catalog.root)}
