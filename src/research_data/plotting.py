"""Explicit, recipe driven Plotly rendering for catalog datasets.

The renderer deliberately performs only the transforms named by a recipe:
selection by integer index and complex component extraction.  In particular,
it never sorts, interpolates, normalizes, or silently changes units.
"""
from __future__ import annotations

from pathlib import Path
import os
import json
from typing import Any, Mapping, Sequence

import numpy as np
import xarray as xr
import plotly.graph_objects as go

RENDER_VERSION = "1"
THEMES: dict[str, dict[str, Any]] = {
    "paper": {"description": "White paper with navy traces", "template": "plotly_white", "colors": ["#12304A", "#D97745", "#2F7D7A", "#8A5A9F"]},
    "midnight": {"description": "Dark navy lab notebook", "template": "plotly_dark", "colors": ["#67E8F9", "#FBBF24", "#F472B6", "#A7F3D0"]},
    "ocean": {"description": "Cool blue sequential palette", "template": "plotly_white", "colors": ["#0B4F6C", "#01BAEF", "#20BF55", "#FBFF12"]},
    "ember": {"description": "Warm orange and red palette", "template": "plotly_white", "colors": ["#7F1D1D", "#DC2626", "#F97316", "#FACC15"]},
    "forest": {"description": "Accessible green field palette", "template": "plotly_white", "colors": ["#14532D", "#16A34A", "#65A30D", "#CA8A04"]},
    "mono": {"description": "Print friendly grayscale", "template": "simple_white", "colors": ["#111827", "#4B5563", "#9CA3AF", "#D1D5DB"]},
    "neon": {"description": "High contrast presentation palette", "template": "plotly_dark", "colors": ["#00F5D4", "#F15BB5", "#FEE440", "#9B5DE5"]},
    "paper_dashed": {"description": "Publication palette with dashed alternates", "template": "plotly_white", "colors": ["#003049", "#D62828", "#F77F00", "#FCBF49"]},
    "pastel": {"description": "Soft pastel exploratory palette", "template": "plotly_white", "colors": ["#7C3AED", "#DB2777", "#0891B2", "#65A30D"]},
}


def _theme(recipe: Mapping[str, Any]) -> dict[str, Any]:
    name = str(recipe.get("theme", "paper"))
    if name not in THEMES:
        raise ValueError(f"Unknown theme {name!r}; choose one of {', '.join(THEMES)}")
    return THEMES[name]


def _component(value: Any, component: str) -> np.ndarray:
    array = np.asarray(value)
    if np.iscomplexobj(array):
        if component in {"real", "imag", "abs", "phase"}:
            return {"real": array.real, "imag": array.imag, "abs": np.abs(array), "phase": np.angle(array)}[component]
        raise ValueError(f"Unknown complex component {component!r}")
    if component == "real":
        return array
    if component == "abs":
        return np.abs(array)
    if component == "imag":
        return np.zeros_like(array, dtype=float)
    if component == "phase":
        return np.angle(array)
    raise ValueError(f"Unknown complex component {component!r}")


def _select(da: xr.DataArray, slices: Mapping[str, Any]) -> xr.DataArray:
    for dim, index in slices.items():
        if dim not in da.dims:
            raise ValueError(f"Slice dimension {dim!r} is not present in {da.name!r}")
        if not isinstance(index, (int, np.integer)):
            raise TypeError(f"Slice for {dim!r} must be an integer index")
        if index < 0 or index >= da.sizes[dim]:
            raise IndexError(f"Slice index {index} outside {dim!r} (size {da.sizes[dim]})")
        da = da.isel({dim: int(index)})
    return da


def _values(ds: xr.Dataset, name: str, recipe: Mapping[str, Any]) -> tuple[xr.DataArray, np.ndarray]:
    if name not in ds:
        raise ValueError(f"Variable {name!r} is not present in dataset")
    da = _select(ds[name], recipe.get("slices", {}))
    return da, _component(da.values, str(recipe.get("component", "real")))


def _axis(ds: xr.Dataset, name: str, n: int) -> np.ndarray:
    if name in ds.coords:
        values = np.asarray(ds.coords[name].values)
    elif name in ds:
        values = np.asarray(ds[name].values)
    else:
        raise ValueError(f"Axis variable {name!r} is not present in dataset")
    if values.ndim != 1 or len(values) != n:
        raise ValueError(f"Axis {name!r} must be one dimensional with length {n}")
    return values


def _positive(values: np.ndarray, label: str) -> None:
    if np.any(~np.isfinite(values)) or np.any(values <= 0):
        raise ValueError(f"log axis {label} requires finite positive values")


def _units(ds: xr.Dataset, name: str) -> str | None:
    if name in ds.coords:
        return ds.coords[name].attrs.get("units")
    if name in ds:
        return ds[name].attrs.get("units")
    return None


def _check_compatible(datasets: Sequence[xr.Dataset], xname: str, ynames: Sequence[str]) -> None:
    """Reject an explicitly incompatible cross-run unit comparison.

    Missing unit metadata remains unknown and is allowed; declared units must
    agree exactly because no conversion is performed by this renderer.
    """
    for name in [xname, *ynames]:
        declared = [_units(ds, str(name)) for ds in datasets]
        known = {unit for unit in declared if unit}
        if len(known) > 1:
            raise ValueError(f"Incompatible units for {name!r}: {sorted(known)}; provide converted datasets explicitly")


def render_plot(datasets: Sequence[xr.Dataset], recipe: Mapping[str, Any], labels: Sequence[str] | None = None) -> go.Figure:
    """Render one or more datasets from an explicit recipe."""
    if not datasets:
        raise ValueError("At least one dataset is required")
    kind = str(recipe.get("kind", "line")).lower()
    theme = _theme(recipe)
    xname = recipe.get("x")
    if not xname:
        raise ValueError("Recipe requires x")
    ys = recipe.get("y")
    if isinstance(ys, str):
        ys = [ys]
    if not ys and kind not in {"heatmap"}:
        raise ValueError("Recipe requires y")
    labels = list(labels or [f"run {i + 1}" for i in range(len(datasets))])
    _check_compatible(datasets, str(xname), [str(y) for y in ys or [recipe.get("z")]])
    fig = go.Figure()
    colors = theme["colors"]
    if kind == "heatmap":
        zname = recipe.get("z") or (ys[0] if ys else None)
        if not zname:
            raise ValueError("Heatmap recipe requires z")
        ds = datasets[0]
        da, z = _values(ds, zname, recipe)
        if z.ndim != 2:
            raise ValueError("Heatmap variable must be two dimensional after slicing")
        dims = list(da.dims)
        x = _axis(ds, str(xname), z.shape[1])
        yname = str(recipe.get("y_axis") or dims[0])
        y = _axis(ds, yname, z.shape[0])
        fig.add_trace(go.Heatmap(x=x, y=y, z=z, colorscale="Viridis", name=str(zname)))
    else:
        for di, ds in enumerate(datasets):
            for yi, yname in enumerate(ys):
                da, y = _values(ds, str(yname), recipe)
                if y.ndim != 1:
                    raise ValueError(f"Variable {yname!r} must be one dimensional; add integer slices")
                x = _axis(ds, str(xname), y.size)
                if bool(recipe.get("log_x")):
                    _positive(np.asarray(x), "x")
                if bool(recipe.get("log_y")):
                    _positive(np.asarray(y), "y")
                mode = "markers" if kind == "scatter" else "lines"
                if kind not in {"line", "scatter", "compare", "complex"}:
                    raise ValueError(f"Unknown plot kind {kind!r}")
                name = f"{labels[di]} · {yname}" if len(ys) > 1 or len(datasets) > 1 else str(yname)
                dash = "dash" if recipe.get("theme") == "paper_dashed" and (di + yi) % 2 else "solid"
                fig.add_trace(go.Scatter(x=x, y=y, mode=mode, name=name, line={"color": colors[(di + yi) % len(colors)], "dash": dash}, marker={"color": colors[(di + yi) % len(colors)]}))
    x_unit = _units(datasets[0], str(xname))
    x_title = str(xname) + (f" ({x_unit})" if x_unit else "")
    y_title = None
    if kind != "heatmap" and len(ys) == 1:
        y_unit = "rad" if recipe.get("component") == "phase" else _units(datasets[0], str(ys[0]))
        y_title = str(ys[0]) + (f" ({y_unit})" if y_unit else "")
    fig.update_layout(template=theme["template"], title=recipe.get("title"), width=recipe.get("width"), height=recipe.get("height", 500), xaxis_title=recipe.get("x_label") or x_title, yaxis_title=recipe.get("y_label") or y_title, showlegend=True, legend={"orientation": "h", "x": 0, "y": -0.22}, margin={"l": 65, "r": 20, "t": 70, "b": 80})
    if recipe.get("log_x"):
        fig.update_xaxes(type="log")
    if recipe.get("log_y"):
        fig.update_yaxes(type="log")
    fig.layout.meta = {"recipe": dict(recipe), "render_version": RENDER_VERSION, "theme": str(recipe.get("theme", "paper"))}
    return fig


def export_plot(fig: go.Figure, path: str | Path) -> Path:
    """Export HTML or a static image, with a clear Kaleido error."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.suffix.lower() in {".html", ".htm"}:
        fig.write_html(str(target), include_plotlyjs="cdn")
        return target
    if target.suffix.lower() not in {".png", ".svg", ".pdf"}:
        raise ValueError("Export format must be .html, .png, .svg or .pdf")
    try:
        import kaleido
        from .agent import config_path
        settings = config_path()
        configuration = json.loads(settings.read_text(encoding="utf-8")) if settings.is_file() else {}
        browser = os.environ.get("BROWSER_PATH") or configuration.get("browser_path")
        options = {"path": browser} if browser else {}
        payload = kaleido.calc_fig_sync(fig, opts={"format": target.suffix[1:].lower()}, kopts=options)
        target.write_bytes(payload)
    except Exception as exc:
        raise RuntimeError("Static export requires kaleido and a working Chrome/Chromium runtime. Set BROWSER_PATH or use research-data configure --browser PATH. To install Kaleido's Chrome runtime: python -c \"import kaleido; kaleido.get_chrome_sync()\". " + f"Cause: {type(exc).__name__}: {exc}") from exc
    return target
