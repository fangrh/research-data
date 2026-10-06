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
import plotly.io as pio
from plotly.colors import named_colorscales, validate_colors
from plotly.subplots import make_subplots

RENDER_VERSION = "2"
STYLE_DEFAULTS: dict[str, Any] = {
    "font_family": "Arial",
    "font_size": 13,
    "title_size": 18,
    "axis_title_size": 14,
    "tick_size": 11,
    "legend_size": 11,
    "line_width": 2,
    "marker_size": 7,
    "line_dash": "solid",
    "show_grid": True,
    "show_legend": True,
    "legend_position": "bottom",
    "colors": None,
    "colorscale": "Viridis",
}
_STYLE_KEYS = frozenset(STYLE_DEFAULTS)
_LAYOUT_KEYS = frozenset({"paper_bgcolor", "plot_bgcolor", "font", "margin", "title", "legend", "annotations", "shapes", "width", "height"})
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


def _finite_number(value: Any, name: str, minimum: float = 0) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float, np.integer, np.floating)):
        raise TypeError(f"style {name!r} must be a finite number >= {minimum}")
    value = float(value)
    if not np.isfinite(value) or value < minimum:
        raise ValueError(f"style {name!r} must be a finite number >= {minimum}")
    return value


def _style(recipe: Mapping[str, Any], theme: Mapping[str, Any]) -> dict[str, Any]:
    supplied = recipe.get("style", {})
    if supplied is None:
        supplied = {}
    if not isinstance(supplied, Mapping):
        raise TypeError("style must be a mapping, for example {'line_width': 2, 'font_size': 14}; choose a top-level theme from: " + ", ".join(sorted(THEMES)))
    unknown = sorted(set(supplied) - _STYLE_KEYS)
    if unknown:
        raise ValueError(f"Unknown style key(s): {', '.join(map(repr, unknown))}; choose from {', '.join(sorted(_STYLE_KEYS))}")
    style = dict(STYLE_DEFAULTS)
    style.update(supplied)
    style["colors"] = list(theme["colors"] if style["colors"] is None else style["colors"])
    if not isinstance(style["font_family"], str) or not style["font_family"].strip():
        raise TypeError("style 'font_family' must be a non-empty string")
    for key in ("font_size", "title_size", "axis_title_size", "tick_size", "legend_size", "line_width", "marker_size"):
        style[key] = _finite_number(style[key], key, 0.000001)
    if not isinstance(style["line_dash"], str) or not style["line_dash"]:
        raise TypeError("style 'line_dash' must be a non-empty string")
    for key in ("show_grid", "show_legend"):
        if not isinstance(style[key], (bool, np.bool_)):
            raise TypeError(f"style {key!r} must be a boolean")
    if style["legend_position"] not in {"bottom", "right", "top"}:
        raise ValueError("style 'legend_position' must be one of: bottom, right, top")
    if not isinstance(style["colors"], (list, tuple)) or not style["colors"] or any(not isinstance(c, str) or not c for c in style["colors"]):
        raise TypeError("style 'colors' must be a non-empty list of strings")
    try:
        validate_colors(list(style["colors"]))
    except Exception as exc:
        raise ValueError("style 'colors' contains an invalid Plotly color") from exc
    if not isinstance(style["colorscale"], str) or not style["colorscale"]:
        raise TypeError("style 'colorscale' must be a non-empty string")
    if style["colorscale"].lower() not in {str(name).lower() for name in named_colorscales()}:
        raise ValueError(f"Unknown Plotly colorscale {style['colorscale']!r}")
    return style


def _layout(recipe: Mapping[str, Any]) -> dict[str, Any]:
    layout = recipe.get("layout", {})
    if layout is None:
        return {}
    if not isinstance(layout, Mapping):
        raise TypeError("layout must be a mapping")
    unknown = sorted(set(layout) - _LAYOUT_KEYS)
    if unknown:
        raise ValueError(f"Unsupported layout key(s): {', '.join(map(repr, unknown))}; scientific axis/data transforms are not allowed")
    go.Layout(**dict(layout))
    return dict(layout)


def _materialize_theme(fig: go.Figure, theme: Mapping[str, Any], layout: Mapping[str, Any]) -> None:
    """Freeze template colors so embedded hosts do not replace implicit defaults."""
    defaults = pio.templates[theme["template"]].layout
    font = layout.get("font", {})
    color = (font.get("color") if isinstance(font, Mapping) else None) or defaults.font.color or "#111827"
    fig.update_layout(paper_bgcolor=defaults.paper_bgcolor or "white",
                      plot_bgcolor=defaults.plot_bgcolor or "white", font_color=color,
                      title_font_color=color, legend_font_color=color)
    for axes, source in ((fig.select_xaxes(), defaults.xaxis), (fig.select_yaxes(), defaults.yaxis)):
        for axis in axes:
            for name in ("gridcolor", "zerolinecolor", "linecolor"):
                if getattr(axis, name) is None:
                    setattr(axis, name, getattr(source, name) or "#d1d5db")
            if axis.tickfont.color is None:
                axis.tickfont.color = color
            if axis.title.font.color is None:
                axis.title.font.color = color


def _legend(position: str) -> dict[str, Any]:
    if position == "right":
        return {"orientation": "v", "x": 1.02, "y": 1}
    if position == "top":
        return {"orientation": "h", "x": 0, "y": 1.12}
    return {"orientation": "h", "x": 0, "y": -0.22}


def validate_recipe(recipe: Mapping[str, Any]) -> dict[str, Any]:
    """Validate recipe structure without opening datasets and return a copy.

    This checks presentation fields and required variable references while
    leaving value shape, units, and log-axis positivity to ``render_plot``.
    """
    if not isinstance(recipe, Mapping):
        raise TypeError("Recipe must be a mapping")
    result = dict(recipe)
    kind = str(result.get("kind", "line")).lower()
    if kind == "panels":
        panels = result.get("panels")
        if not isinstance(panels, (list, tuple)) or not panels:
            raise ValueError("Panels recipe requires a non-empty panels list")
        if len(panels) > 12:
            raise ValueError("Panels recipes support at most 12 panels")
        columns = result.get("columns", 1)
        if isinstance(columns, bool) or not isinstance(columns, (int, np.integer)) or not 1 <= int(columns) <= 4:
            raise ValueError("Panels 'columns' must be an integer from 1 to 4")
        indices = result.get("dataset_indices")
        if indices is not None and (not isinstance(indices, (list, tuple)) or len(indices) != len(panels)):
            raise ValueError("Panels 'dataset_indices' must have one list per panel")
        for pi, panel in enumerate(panels):
            if not isinstance(panel, Mapping):
                raise TypeError(f"Panel {pi} must be a mapping")
            if str(panel.get("kind", "line")).lower() == "panels":
                raise ValueError("Nested panels recipes are not allowed")
            panel_indices = panel.get("dataset_indices")
            if panel_indices is not None:
                if (not isinstance(panel_indices, (list, tuple)) or len(set(panel_indices)) != len(panel_indices)
                        or any(isinstance(i, bool) or not isinstance(i, (int, np.integer)) or int(i) < 0 for i in panel_indices)):
                    raise ValueError(f"Panel {pi} dataset_indices must contain unique non-negative integers")
            if "component" in panel and not isinstance(panel["component"], str):
                raise TypeError(f"Panel {pi} component must be a string")
            if "slices" in panel and not isinstance(panel["slices"], Mapping):
                raise TypeError(f"Panel {pi} slices must be a mapping")
            child_layout = panel.get("layout", {}) or {}
            if any(key in child_layout for key in ("annotations", "shapes")):
                raise ValueError(f"Panel {pi} layout annotations/shapes are unsupported; put them on the outer layout")
            validate_recipe(panel)
        _theme(result); _style(result, _theme(result)); _layout(result)
        return result
    if kind not in {"line", "scatter", "compare", "complex", "heatmap"}:
        raise ValueError(f"Unknown plot kind {kind!r}")
    if not result.get("x"):
        raise ValueError("Recipe requires x")
    ys = result.get("y")
    if isinstance(ys, str):
        ys = [ys]
    if kind == "heatmap":
        if not result.get("z") and not ys:
            raise ValueError("Heatmap recipe requires z")
    elif not ys:
        raise ValueError("Recipe requires y")
    if "component" in result and not isinstance(result["component"], str):
        raise TypeError("component must be a string")
    if "slices" in result and not isinstance(result["slices"], Mapping):
        raise TypeError("slices must be a mapping")
    theme = _theme(result)
    _style(result, theme)
    _layout(result)
    return result


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
    """Render one or more datasets from an explicit recipe.

    ``style`` is a validated presentation mapping.  ``layout`` accepts only
    local appearance fields (backgrounds, font, margin, title, legend,
    annotations, shapes, width, and height); data and scientific axis
    transforms such as ranges, type, and autorange are deliberately rejected.
    Style is applied after layout and therefore has final priority for style
    fields.  ``kind='panels'`` composes ordinary recipes into independent
    subplots; panels cannot be nested and no interpolation or sorting occurs.
    """
    if not datasets:
        raise ValueError("At least one dataset is required")
    kind = str(recipe.get("kind", "line")).lower()
    if kind == "panels":
        panels = recipe.get("panels")
        if not isinstance(panels, (list, tuple)) or not panels:
            raise ValueError("Panels recipe requires a non-empty panels list")
        columns = recipe.get("columns", 1)
        if isinstance(columns, bool) or not isinstance(columns, (int, np.integer)) or not 1 <= int(columns) <= 4:
            raise ValueError("Panels 'columns' must be an integer from 1 to 4")
        indices = recipe.get("dataset_indices")
        if indices is not None:
            if not isinstance(indices, (list, tuple)) or len(indices) != len(panels):
                raise ValueError("Panels 'dataset_indices' must have one list per panel")
        outer_style = recipe.get("style", {}) or {}
        outer_layout = recipe.get("layout", {}) or {}
        if not isinstance(outer_style, Mapping) or not isinstance(outer_layout, Mapping):
            raise TypeError("Panels style and layout must be mappings")
        rows = (len(panels) + int(columns) - 1) // int(columns)
        child_figures = []
        for pi, panel in enumerate(panels):
            if not isinstance(panel, Mapping):
                raise TypeError(f"Panel {pi} must be a mapping")
            if str(panel.get("kind", "line")).lower() == "panels":
                raise ValueError("Nested panels recipes are not allowed")
            child = dict(panel)
            for key in ("theme", "height", "width", "title"):
                if key in recipe and key not in child:
                    child[key] = recipe[key]
            merged_style = dict(outer_style)
            merged_style.update(child.get("style", {}) or {})
            child["style"] = merged_style
            merged_layout = dict(outer_layout)
            merged_layout.update(child.get("layout", {}) or {})
            child["layout"] = merged_layout
            selected = datasets
            selected_labels = labels
            raw = panel.get("dataset_indices")
            if raw is None and indices is not None:
                raw = indices[pi]
            if raw is not None:
                if not isinstance(raw, (list, tuple)):
                    raise TypeError(f"Panel {pi} dataset_indices must be a list of integers")
                if len(set(raw)) != len(raw) or any(isinstance(i, bool) or not isinstance(i, (int, np.integer)) or int(i) < 0 or int(i) >= len(datasets) for i in raw):
                    raise IndexError(f"Panel {pi} dataset_indices contains an invalid dataset index")
                selected = [datasets[int(i)] for i in raw]
                selected_labels = [labels[int(i)] for i in raw] if labels is not None else None
            child_figures.append(render_plot(selected, child, selected_labels))
        fig = make_subplots(rows=rows, cols=int(columns), subplot_titles=[str(p.get("title", "")) for p in panels])
        for pi, child_fig in enumerate(child_figures):
            row, col = divmod(pi, int(columns)); row += 1; col += 1
            for trace in child_fig.data:
                fig.add_trace(trace, row=row, col=col)
            child_x = child_fig.layout.xaxis
            child_y = child_fig.layout.yaxis
            fig.update_xaxes(title_text=child_x.title.text if child_x.title else None, type=child_x.type, showgrid=child_x.showgrid, gridcolor=child_x.gridcolor, zerolinecolor=child_x.zerolinecolor, linecolor=child_x.linecolor, tickfont=child_x.tickfont, title_font=child_x.title.font if child_x.title else None, row=row, col=col)
            fig.update_yaxes(title_text=child_y.title.text if child_y.title else None, type=child_y.type, showgrid=child_y.showgrid, gridcolor=child_y.gridcolor, zerolinecolor=child_y.zerolinecolor, linecolor=child_y.linecolor, tickfont=child_y.tickfont, title_font=child_y.title.font if child_y.title else None, row=row, col=col)
            for trace in fig.select_traces(row=row, col=col):
                if isinstance(trace, go.Heatmap):
                    suffix = "" if pi == 0 else str(pi + 1)
                    x_domain = getattr(fig.layout, "xaxis" + suffix).domain
                    y_domain = getattr(fig.layout, "yaxis" + suffix).domain
                    trace.colorbar.update(x=x_domain[1] + 0.012, y=sum(y_domain) / 2,
                                          len=(y_domain[1] - y_domain[0]) * 0.9,
                                          thickness=12, xanchor="left", yanchor="middle")
                    trace.colorbar.title = str(trace.name)
        outer_theme = _theme(recipe)
        outer_style = _style(recipe, outer_theme)
        fig.update_layout(template=outer_theme["template"], height=recipe.get("height", 500), width=recipe.get("width"), title=recipe.get("title"), showlegend=outer_style["show_legend"], legend=_legend(outer_style["legend_position"]), meta={"recipe": dict(recipe), "render_version": RENDER_VERSION, "theme": str(recipe.get("theme", "paper"))}, font={"family": outer_style["font_family"], "size": outer_style["font_size"]}, title_font={"size": outer_style["title_size"]})
        outer_layout = _layout(recipe)
        _materialize_theme(fig, outer_theme, outer_layout)
        if outer_layout:
            fig.update_layout(**outer_layout)
        fig.update_layout(font={"family": outer_style["font_family"], "size": outer_style["font_size"]}, title_font={"size": outer_style["title_size"]}, legend_font={"size": outer_style["legend_size"]})
        return fig
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
        if bool(recipe.get("log_x")):
            _positive(np.asarray(x), "x")
        if bool(recipe.get("log_y")):
            _positive(np.asarray(y), "y")
        z_unit = "rad" if recipe.get("component") == "phase" else _units(ds, str(zname))
        heat_name = str(zname) + (f" ({z_unit})" if z_unit else "")
        fig.add_trace(go.Heatmap(x=x, y=y, z=z, colorscale=_style(recipe, theme)["colorscale"], name=heat_name, colorbar={"title": heat_name}))
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
    elif kind == "heatmap":
        yname = str(recipe.get("y_axis") or list(_values(datasets[0], str(recipe.get("z") or ys[0]), recipe)[0].dims)[0])
        y_unit = _units(datasets[0], yname)
        y_title = yname + (f" ({y_unit})" if y_unit else "")
    style = _style(recipe, theme)
    style_dash_explicit = isinstance(recipe.get("style"), Mapping) and "line_dash" in recipe["style"]
    fig.update_layout(template=theme["template"], title=recipe.get("title"), width=recipe.get("width"), height=recipe.get("height", 500), xaxis_title=recipe.get("x_label") or x_title, yaxis_title=recipe.get("y_label") or y_title, showlegend=True, legend=_legend("bottom"), margin={"l": 65, "r": 20, "t": 70, "b": 80})
    layout = _layout(recipe)
    _materialize_theme(fig, theme, layout)
    if layout:
        fig.update_layout(**layout)
    colors = style["colors"]
    for ti, trace in enumerate(fig.data):
        trace.showlegend = style["show_legend"]
        if hasattr(trace, "line"):
            trace.line.width = style["line_width"]
            if style_dash_explicit:
                trace.line.dash = style["line_dash"]
            trace.line.color = colors[ti % len(colors)]
        if hasattr(trace, "marker"):
            trace.marker.size = style["marker_size"]
            trace.marker.color = colors[ti % len(colors)]
    fig.update_layout(font={"family": style["font_family"], "size": style["font_size"]}, showlegend=style["show_legend"], legend=_legend(style["legend_position"]))
    fig.update_layout(title_font={"size": style["title_size"]}, xaxis_title_font={"family": style["font_family"], "size": style["axis_title_size"]}, yaxis_title_font={"family": style["font_family"], "size": style["axis_title_size"]}, legend_font={"family": style["font_family"], "size": style["legend_size"]})
    fig.update_xaxes(tickfont={"family": style["font_family"], "size": style["tick_size"]}, showgrid=style["show_grid"])
    fig.update_yaxes(tickfont={"family": style["font_family"], "size": style["tick_size"]}, showgrid=style["show_grid"])
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
