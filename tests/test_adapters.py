from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr

from research_data.adapters import inspect_file, load_file


def test_tabular_and_json_preserve_values(tmp_path: Path):
    csv = tmp_path / "v.csv"
    csv.write_text("time,signal\n2,1+2j\n1,3+4j\n", encoding="utf-8")
    ds = load_file(csv, {"x": "time"})
    assert ds.signal.dims == ("time",)
    assert list(ds.time.values) == [2, 1]
    assert np.allclose(ds.signal.values, [1 + 2j, 3 + 4j])
    assert inspect_file(csv, {"x": "time"})["variables"]


def test_hdf_and_netcdf(tmp_path: Path):
    h5 = tmp_path / "v.h5"
    import h5py
    with h5py.File(h5, "w") as f:
        f["signal"] = np.array([1.0, 2.0])
    assert np.allclose(load_file(h5)["signal"].values, [1, 2])
    nc = tmp_path / "v.nc"
    xr.Dataset({"signal": ("time", [2, 3])}, coords={"time": [5, 4]}).to_netcdf(nc)
    ds = load_file(nc)
    assert list(ds.time.values) == [5, 4]


def test_hdf5_named_axes_and_attributes(tmp_path: Path):
    import h5py
    h5 = tmp_path / "named.h5"
    with h5py.File(h5, "w") as f:
        d = f.create_dataset("J", data=np.arange(4).reshape(2, 2))
        d.dims[0].label = "temperature"
        d.dims[1].label = "field"
        d.attrs["units"] = "A"
    ds = load_file(h5, {"variables": ["J"], "coordinates": {"J": ["temperature", "field"]}})
    assert ds["J"].dims == ("temperature", "field")
    assert ds["J"].attrs["units"] == "A"


def test_hdf5_heatmap_coordinates_scalar_and_duplicate_paths(tmp_path: Path):
    import h5py, json
    h5 = tmp_path / "heatmap.h5"
    with h5py.File(h5, "w") as f:
        t = f.create_dataset("temperature", data=[10.0, 20.0]); t.attrs["units"] = "K"
        v = f.create_dataset("voltage", data=[1.0, 2.0]); v.attrs["units"] = "V"
        j = f.create_dataset("J", data=np.arange(4).reshape(2, 2)); j.attrs["dimensions"] = json.dumps(["temperature", "voltage"]); j.attrs["units"] = "A"
        f.create_dataset("a/value", data=[1]); f.create_dataset("b/value", data=[2])
        f["a/value"].attrs["dimensions"] = json.dumps(["record"]); f["b/value"].attrs["dimensions"] = json.dumps(["record"])
        f.create_dataset("scalar", data=3.0)
    ds = load_file(h5, {"variables": ["J", "temperature", "voltage", "scalar"]})
    assert list(ds.coords["temperature"].values) == [10.0, 20.0]
    assert ds.coords["temperature"].attrs["units"] == "K"
    assert ds["J"].dims == ("temperature", "voltage")
    assert ds["scalar"].dims == ()
    try: load_file(h5)
    except ValueError as exc: assert "duplicate" in str(exc)
    else: raise AssertionError("duplicate nested basenames were accepted")


def test_parquet(tmp_path: Path):
    import pytest
    pytest.importorskip("pyarrow")
    path = tmp_path / "v.parquet"
    pd.DataFrame({"x": [2, 1], "y": [4, 3]}).to_parquet(path)
    ds = load_file(path, {"x": "x"})
    assert list(ds.x.values) == [2, 1]


def test_real_qcodes_dataset(tmp_path: Path):
    import os
    from qcodes.parameters import ManualParameter
    from qcodes.dataset import Measurement, initialise_or_create_database_at, new_experiment
    db = tmp_path / "qcodes.db"
    initialise_or_create_database_at(str(db))
    exp = new_experiment("adapter", "sample")
    x, y = ManualParameter("x"), ManualParameter("y")
    measurement = Measurement(exp)
    measurement.register_parameter(x)
    measurement.register_parameter(y, setpoints=(x,))
    with measurement.run() as datasaver:
        datasaver.add_result((x, 1), (y, 2))
        run_id = datasaver.run_id
    # Close the writer-side QCoDeS connection before testing Windows rename.
    for owner in (datasaver, getattr(datasaver, "dataset", None), exp):
        conn = getattr(owner, "conn", None)
        if conn is not None:
            try: conn.close()
            except Exception: pass
    ds = load_file(db, {"format": "qcodes", "qcodes_run_id": run_id})
    assert "y" in ds
    assert float(ds["y"].values.ravel()[0]) == 2.0
    renamed = tmp_path / "renamed.db"
    os.replace(db, renamed)
    assert renamed.exists()
