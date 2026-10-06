"""Format adapters for the research-data catalog."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import xarray as xr


def _profile(profile: dict | None) -> dict:
    return dict(profile or {})


def _unit(profile: dict, name: str, attrs: dict) -> None:
    units = profile.get("units", {})
    if name in units:
        attrs["units"] = units[name]


def _dataset_from_frame(frame: pd.DataFrame, profile: dict) -> xr.Dataset:
    rename = profile.get("rename", {})
    frame = frame.rename(columns=rename)
    x = profile.get("x")
    coords = profile.get("coordinates", {})
    data_vars: dict[str, Any] = {}
    for col in frame.columns:
        series = frame[col]
        # CSV/TSV readers leave complex literals as strings; preserve them as
        # numeric complex values without changing ordinary text columns.
        try:
            converted = series.map(lambda v: complex(v) if isinstance(v, str) and ("j" in v.lower()) else v)
            if any(isinstance(v, complex) for v in converted.tolist()):
                series = converted.astype(complex)
        except (TypeError, ValueError):
            pass
        vals = series.to_numpy()
        attrs: dict[str, Any] = {}
        _unit(profile, str(col), attrs)
        if col in profile.get("descriptions", {}):
            attrs["description"] = profile["descriptions"][col]
        data_vars[str(col)] = ((str(x),), vals, attrs) if x and x in frame.columns and col != x else (("record",), vals, attrs)
    if x and x in frame.columns:
        xv = frame[x].to_numpy()
        data_vars.pop(str(x), None)
        cattrs = {}
        _unit(profile, str(x), cattrs)
        if x in profile.get("descriptions", {}): cattrs["description"] = profile["descriptions"][x]
        return xr.Dataset(data_vars, coords={str(x): (str(x), xv, cattrs)})
    return xr.Dataset(data_vars, coords={"record": np.arange(len(frame))})


def _json_frame(path: Path, profile: dict) -> pd.DataFrame:
    if str(profile.get("format", "")).lower() == "jsonl" or path.suffix.lower() in {".jsonl", ".ndjson"}:
        records = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
        return pd.DataFrame(records)
    obj = json.loads(path.read_text(encoding="utf-8"))
    return _records_or_columns(obj, "JSON")


def _records_or_columns(obj: Any, label: str) -> pd.DataFrame:
    if isinstance(obj, dict):
        for key in ("records", "data", "rows"):
            if key in obj and isinstance(obj[key], list):
                obj = obj[key]
                break
    if isinstance(obj, list) and (not obj or isinstance(obj[0], dict)):
        return pd.DataFrame(obj)
    if isinstance(obj, dict):
        return pd.DataFrame(obj)
    raise ValueError(f"{label} must contain records or column arrays")


def _toml_frame(path: Path, profile: dict) -> pd.DataFrame:
    import tomllib
    with path.open("rb") as fh:
        obj = tomllib.load(fh)
    return _records_or_columns(obj, "TOML")


def _hdf5(path: Path, profile: dict) -> xr.Dataset:
    import h5py
    selection = profile.get("variables")
    rename = profile.get("rename", {})
    mapping = selection if isinstance(selection, dict) else rename
    selected = set(selection) if isinstance(selection, list) else None
    arrays: dict[str, tuple[np.ndarray, dict, tuple[str, ...]]] = {}
    all_objects: dict[str, tuple[np.ndarray, dict, tuple[str, ...]]] = {}
    with h5py.File(path, "r") as h5:
        def visit(name: str, obj: Any) -> None:
            if isinstance(obj, h5py.Dataset):
                key = name.rsplit("/", 1)[-1]
                attrs = {str(k): (v.decode() if isinstance(v, bytes) else v) for k,v in obj.attrs.items()}
                raw_dims = attrs.get("dimensions")
                if isinstance(raw_dims, str):
                    try: raw_dims = json.loads(raw_dims)
                    except json.JSONDecodeError: raw_dims = [raw_dims]
                dims = tuple(raw_dims) if isinstance(raw_dims, (list, tuple)) else tuple(obj.dims[i].label for i in range(obj.ndim))
                all_objects[name] = (obj[()], attrs, dims)
        h5.visititems(visit)
    referenced = set()
    for name, (value, attrs, dims) in all_objects.items():
        key = name.rsplit("/", 1)[-1]
        if selected is not None and key not in selected and name not in selected: continue
        if selected is None and mapping and key not in mapping and name not in mapping: continue
        outname = str(mapping.get(name, mapping.get(key, key))) if isinstance(mapping, dict) else key
        if outname in arrays: raise ValueError(f"duplicate HDF5 variable name {outname!r}; map full paths explicitly")
        dims = tuple(d or f"{outname}_dim_{i}" for i, d in enumerate(dims))
        arrays[outname] = (value, attrs, dims)
        referenced.update(dims)
    # Coordinate datasets are retained even when variables selects only data arrays.
    for name, payload in all_objects.items():
        key = name.rsplit("/", 1)[-1]
        if key in referenced and key not in arrays:
            arrays[key] = payload
    if not arrays:
        raise ValueError("HDF5 contains no selected datasets; provide profile variables/rename")
    return _arrays_dataset(arrays, profile)


def _arrays_dataset(arrays: dict[str, Any], profile: dict) -> xr.Dataset:
    out: dict[str, Any] = {}
    coord_map = profile.get("coordinates", {})
    coords: dict[str, Any] = {}
    for name, payload in arrays.items():
        if isinstance(payload, tuple) and len(payload) == 3:
            value, source_attrs, source_dims = payload
        else:
            value, source_attrs, source_dims = payload, {}, tuple(f"{name}_dim_{i}" for i in range(np.ndim(payload)))
        arr = np.asarray(value)
        explicit_dims = coord_map.get(name)
        dims = tuple(explicit_dims if explicit_dims is not None else source_dims)
        if arr.ndim == 0: dims = ()
        elif not dims: dims = tuple(f"{name}_dim_{i}" for i in range(arr.ndim))
        attrs: dict[str, Any] = dict(source_attrs)
        _unit(profile, name, attrs)
        if name in profile.get("descriptions", {}): attrs["description"] = profile["descriptions"][name]
        out[name] = (dims, arr, attrs)
    # A one-dimensional dataset whose name matches a data dimension is an axis.
    for name in list(out):
        dims, arr, attrs = out[name]
        if name in {d for item in out.values() for d in (item[0] if isinstance(item[0], tuple) else ())} and arr.ndim == 1 and name not in dims:
            coords[name] = (name, arr, attrs); del out[name]
    return xr.Dataset(out, coords=coords)


def _qcodes(path: Path, profile: dict) -> xr.Dataset:
    try:
        from qcodes.dataset import load_by_guid, load_by_id
        from qcodes.dataset.sqlite.database import connect
    except ImportError as exc:
        raise ImportError("QCoDeS support requires the formats extra") from exc
    if profile.get("qcodes_guid"):
        conn = connect(path, read_only=True)
        try:
            ds = load_by_guid(profile["qcodes_guid"], conn=conn)
            return ds.to_xarray_dataset()
        finally:
            conn.close()
    else:
        run_id = profile.get("qcodes_run_id")
        if run_id is None:
            raise ValueError("QCoDeS profile requires qcodes_guid or qcodes_run_id")
        else:
            conn = connect(path, read_only=True)
            try:
                ds = load_by_id(int(run_id), conn=conn)
                return ds.to_xarray_dataset()
            finally:
                conn.close()


def load_file(path: str | Path, profile: dict | None = None) -> xr.Dataset:
    p = Path(path)
    prof = _profile(profile)
    fmt = str(prof.get("format") or p.suffix.lower().lstrip("."))
    if fmt in {"csv", "tsv"}:
        frame = pd.read_csv(p, sep="\t" if fmt == "tsv" else ",")
        return _dataset_from_frame(frame, prof)
    if fmt in {"json", "jsonl"}:
        return _dataset_from_frame(_json_frame(p, prof), prof)
    if fmt == "toml":
        return _dataset_from_frame(_toml_frame(p, prof), prof)
    if fmt in {"parquet", "pq"}:
        return _dataset_from_frame(pd.read_parquet(p), prof)
    if fmt in {"h5", "hdf5"}:
        return _hdf5(p, prof)
    if fmt in {"nc", "netcdf"}:
        return xr.load_dataset(p)
    if fmt in {"db", "sqlite", "sqlite3", "qcodes"}:
        return _qcodes(p, prof)
    raise ValueError(f"Unsupported data format: {fmt}")


def inspect_file(path: str | Path, profile: dict | None = None) -> dict:
    p = Path(path)
    ds = load_file(p, profile)
    variables = []
    for name, var in ds.variables.items():
        variables.append({"name": name, "dims": list(var.dims), "shape": list(var.shape), "dtype": str(var.dtype), "unit": var.attrs.get("units"), "description": var.attrs.get("description", "")})
    return {"format": str((profile or {}).get("format") or p.suffix.lower().lstrip(".")), "variables": variables, "summary": {"dims": dict(ds.sizes), "attrs": dict(ds.attrs)}, "warnings": []}
