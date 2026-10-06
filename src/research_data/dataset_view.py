"""Small, metadata-first helpers for browsing registered datasets.

The helpers in this module deliberately do not load artifact files.  Loading
belongs to the caller after an artifact has been selected from its manifest.
"""
from __future__ import annotations

from copy import deepcopy
from collections.abc import Mapping
from typing import Any

import numpy as np
import pandas as pd
import xarray as xr


_NON_DATA_ROLES = {"figure", "plot", "recipe", "cover", "log", "stdout", "stderr"}
_SUPPORTED_FORMATS = {
    "csv", "tsv", "json", "jsonl", "toml", "parquet", "pq",
    "h5", "hdf5", "nc", "netcdf", "db", "sqlite", "sqlite3", "qcodes",
}


def _manifest(run: Any) -> Mapping[str, Any]:
    if isinstance(run, Mapping):
        return run
    manifest = getattr(run, "manifest", None)
    if isinstance(manifest, Mapping):
        return manifest
    raise TypeError("run must be a manifest mapping or a Run object")


def _format(artifact: Mapping[str, Any]) -> str:
    profile = artifact.get("profile")
    if isinstance(profile, Mapping) and profile.get("format"):
        return str(profile["format"]).lower().lstrip(".")
    return str(artifact.get("format") or "").lower().lstrip(".")


def artifact_inventory(run: Any, query: str = "") -> list[dict[str, Any]]:
    """Return a copy-safe, index/manifest-only artifact inventory.

    ``query`` is a case-insensitive substring over the displayed metadata;
    no artifact path is opened while constructing the result.
    """
    artifacts = _manifest(run).get("artifacts", [])
    if not isinstance(artifacts, list):
        return []
    needle = str(query or "").casefold()
    result: list[dict[str, Any]] = []
    for source in artifacts:
        if not isinstance(source, Mapping):
            continue
        fmt = _format(source)
        role = str(source.get("role") or "")
        item = {
            "artifact_id": source.get("artifact_id"),
            "name": source.get("original_name") or source.get("name") or source.get("path"),
            "format": fmt,
            "role": role,
            "description": source.get("description") or "",
            "size_bytes": source.get("size_bytes"),
            "variables": deepcopy(source.get("variables") or []),
        }
        if needle and needle not in str(item).casefold():
            continue
        item["loadable"] = role.casefold() not in _NON_DATA_ROLES and fmt in _SUPPORTED_FORMATS
        result.append(item)
    return result


def _coordinate(ds: xr.Dataset, dim: str) -> xr.DataArray | None:
    if dim not in ds.coords:
        return None
    coord = ds.coords[dim]
    if coord.ndim != 1 or coord.dims != (dim,):
        return None
    return coord


def dataset_variables(ds: xr.Dataset) -> list[dict[str, Any]]:
    """Describe data variables, retaining each variable's own axes."""
    result = []
    for name, variable in ds.data_vars.items():
        coordinates = []
        for dim in variable.dims:
            if _coordinate(ds, dim) is not None:
                coordinates.append(dim)
        result.append({
            "name": str(name),
            "dims": list(variable.dims),
            "shape": list(variable.shape),
            "unit": variable.attrs.get("units", variable.attrs.get("unit")),
            "description": variable.attrs.get("description", ""),
            "coordinates": coordinates,
            "numeric": bool(np.issubdtype(variable.dtype, np.number)),
        })
    return result


def _axis_for(ds: xr.Dataset, dim: str, target: str) -> str | None:
    if _coordinate(ds, dim) is not None:
        return dim
    candidates = []
    for name, variable in ds.data_vars.items():
        if name == target or variable.dims != (dim,) or not np.issubdtype(variable.dtype, np.number):
            continue
        candidates.append(str(name))
    return candidates[0] if len(candidates) == 1 else None


def default_recipe(ds: xr.Dataset, name: str) -> dict[str, Any] | None:
    """Build a recipe only when every displayed axis has explicit evidence."""
    if name not in ds.data_vars:
        return None
    variable = ds[name]
    if not np.issubdtype(variable.dtype, np.number) or variable.ndim < 1:
        return None
    dims = list(variable.dims)
    if variable.ndim == 1:
        axes = [_axis_for(ds, dims[0], name)]
        if axes[0] is None:
            return None
        return {"kind": "line", "x": axes[0], "y": name}
    if variable.ndim == 2:
        axes = [_axis_for(ds, dim, name) for dim in dims]
        if any(axis is None for axis in axes):
            return None
        return {"kind": "heatmap", "x": axes[1], "y": [name], "z": name, "y_axis": axes[0]}
    axes = [_axis_for(ds, dim, name) for dim in dims[-2:]]
    if any(axis is None for axis in axes):
        return None
    slices = {dim: 0 for dim in dims[:-2]}
    return {"kind": "heatmap", "x": axes[1], "y": [name], "z": name, "y_axis": axes[0], "slices": slices}


def bounded_preview(ds: xr.Dataset, name: str, limit: int = 100) -> pd.DataFrame:
    """Return at most ``limit`` values without using Dataset.to_dataframe."""
    if isinstance(limit, bool) or not isinstance(limit, (int, np.integer)) or int(limit) < 0:
        raise ValueError("limit must be a non-negative integer")
    if name not in ds.data_vars:
        raise KeyError(name)
    da = ds[name]
    n = min(int(limit), int(da.size))
    columns: dict[str, Any] = {}
    if da.ndim == 0:
        columns[name] = [da.item()] if n else []
        return pd.DataFrame(columns)
    indices = np.unravel_index(np.arange(n), da.shape, order="C") if n else tuple(np.array([], dtype=int) for _ in da.dims)
    # Vectorized indexing selects only the requested flat values; stack would
    # first construct a potentially enormous Cartesian MultiIndex.
    indexers = {
        dim: xr.DataArray(indices[axis], dims="_dataset_view_preview")
        for axis, dim in enumerate(da.dims)
    }
    values = np.asarray(da.isel(indexers).values)
    for axis, dim in enumerate(da.dims):
        coord = _coordinate(ds, dim)
        label = dim if coord is not None else f"{dim}_index"
        columns[label] = (np.asarray(coord.isel({dim: indices[axis]}).values) if coord is not None else indices[axis]).tolist()
    columns[name] = values.tolist()
    return pd.DataFrame(columns)
