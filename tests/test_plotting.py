import numpy as np
import pytest
import xarray as xr

from research_data.plotting import THEMES, export_plot, render_plot, validate_recipe


@pytest.fixture
def dataset():
    return xr.Dataset(
        {"signal": (("time", "bias"), np.arange(12, dtype=float).reshape(3, 4)),
         "current": (("time",), np.array([1 + 2j, 2 + 0j, 3 - 1j]))},
        coords={"time": [10, 20, 30], "bias": [-1, 0, 1, 2]},
    )


def test_line_preserves_acquisition_order(dataset):
    fig = render_plot([dataset], {"kind": "line", "x": "time", "y": "current", "component": "imag"})
    assert list(fig.data[0].x) == [10, 20, 30]
    assert list(fig.data[0].y) == [2.0, 0.0, -1.0]


def test_complex_components_and_indexed_slice(dataset):
    for component, expected in [("real", [0, 4, 8]), ("imag", [0, 0, 0]), ("abs", [0, 4, 8])]:
        fig = render_plot([dataset], {"kind": "line", "x": "time", "y": "signal", "component": component, "slices": {"bias": 0}})
        assert list(fig.data[0].y) == expected
    heat = render_plot([dataset], {"kind": "heatmap", "x": "bias", "z": "signal", "component": "real"})
    assert np.asarray(heat.data[0].z).shape == (3, 4)
    assert list(heat.data[0].z[1]) == [4, 5, 6, 7]


def test_abs_is_magnitude_and_declared_units_must_match(dataset):
    ds = dataset.copy()
    ds["current"].attrs["units"] = "A"
    magnitude = render_plot([ds], {"kind": "line", "x": "time", "y": "current", "component": "abs"})
    assert np.allclose(magnitude.data[0].y, [np.sqrt(5), 2, np.sqrt(10)])
    other = dataset.copy()
    other["current"].attrs["units"] = "mA"
    with pytest.raises(ValueError, match="Incompatible units"):
        render_plot([ds, other], {"kind": "compare", "x": "time", "y": "current"})


def test_theme_swap_keeps_values(dataset):
    a = render_plot([dataset], {"kind": "line", "x": "time", "y": "current", "theme": "paper"})
    b = render_plot([dataset], {"kind": "line", "x": "time", "y": "current", "theme": "midnight"})
    assert list(a.data[0].y) == list(b.data[0].y)
    assert len(THEMES) >= 8 and a.layout.template != b.layout.template


def test_recipe_errors_are_actionable(dataset):
    with pytest.raises(ValueError, match="one dimensional"):
        render_plot([dataset], {"kind": "line", "x": "time", "y": "signal"})
    with pytest.raises(ValueError, match="positive"):
        render_plot([dataset], {"kind": "line", "x": "bias", "y": "signal", "slices": {"time": 0}, "log_x": True})


def test_html_export(tmp_path, dataset):
    fig = render_plot([dataset], {"kind": "line", "x": "time", "y": "current"})
    output = export_plot(fig, tmp_path / "figure.html")
    assert output.exists() and "plotly" in output.read_text(encoding="utf-8").lower()


def test_static_runtime_error_is_actionable(tmp_path, dataset, monkeypatch):
    import kaleido
    def fail(*args, **kwargs):
        raise RuntimeError("browser unavailable")
    monkeypatch.setattr(kaleido, "calc_fig_sync", fail)
    fig = render_plot([dataset], {"kind": "line", "x": "time", "y": "current"})
    with pytest.raises(RuntimeError, match="configure --browser"):
        export_plot(fig, tmp_path / "figure.png")


def test_style_changes_appearance_without_changing_values(dataset):
    recipe = {"kind": "line", "x": "time", "y": "current", "component": "imag",
              "style": {"font_family": "DejaVu Sans", "line_width": 4, "marker_size": 10,
                        "show_grid": False, "legend_position": "right", "colors": ["#abc123"]}}
    fig = render_plot([dataset], recipe)
    assert list(fig.data[0].y) == [2.0, 0.0, -1.0]
    assert fig.data[0].line.width == 4
    assert fig.data[0].line.color == "#abc123"
    assert fig.layout.font.family == "DejaVu Sans" and fig.layout.xaxis.showgrid is False
    with pytest.raises(ValueError, match="Unknown style key"):
        render_plot([dataset], {"x": "time", "y": "current", "style": {"bogus": 1}})
    with pytest.raises(ValueError, match="finite"):
        render_plot([dataset], {"x": "time", "y": "current", "style": {"line_width": np.nan}})
    with pytest.raises(ValueError, match="scientific axis"):
        render_plot([dataset], {"x": "time", "y": "current", "layout": {"xaxis": {"range": [0, 1]}}})


def test_style_type_error_explains_mapping_and_theme_schema(dataset):
    with pytest.raises(TypeError, match="style must be a mapping.*line_width.*theme"):
        render_plot([dataset], {"x": "time", "y": "current", "style": "default"})


def test_panels_preserve_components_units_and_source_order(dataset):
    dataset["time"].attrs["units"] = "s"
    dataset["bias"].attrs["units"] = "V"
    recipe = {"kind": "panels", "columns": 2, "theme": "midnight", "title": "Overview", "style": {"font_size": 25, "title_size": 28},
              "layout": {"paper_bgcolor": "#123456"},
              "panels": [
                  {"kind": "line", "x": "time", "y": "current", "component": "real", "title": "real", "dataset_indices": [0], "style": {"tick_size": 17}},
                  {"kind": "line", "x": "time", "y": "current", "component": "imag", "title": "imag", "dataset_indices": [0]},
                  {"kind": "heatmap", "x": "bias", "z": "signal", "title": "map", "dataset_indices": [0]},
              ]}
    fig = render_plot([dataset], recipe)
    assert list(fig.data[0].y) == [1.0, 2.0, 3.0]
    assert list(fig.data[1].y) == [2.0, 0.0, -1.0]
    assert np.asarray(fig.data[2].z).shape == (3, 4)
    assert fig.layout.xaxis.title.text == "time (s)"
    assert fig.layout.yaxis.title.text == "current"
    assert fig.layout.meta["recipe"] == recipe
    assert fig.layout.template.layout.plot_bgcolor is not None
    assert fig.layout.paper_bgcolor == "#123456"
    assert fig.layout.font.size == 25 and fig.layout.title.font.size == 28
    assert fig.layout.xaxis.tickfont.size == 17
    assert fig.layout.xaxis.tickfont.family == "Arial"
    assert fig.data[0].showlegend is True
    assert fig.data[2].colorbar.title.text == "signal"


def test_panel_legend_and_dashed_style(dataset):
    recipe = {"kind": "panels", "columns": 2, "theme": "paper_dashed", "style": {"font_family": "Courier New"},
              "panels": [{"kind": "line", "x": "time", "y": ["current", "current"], "style": {"show_legend": False}}]}
    fig = render_plot([dataset], recipe)
    assert fig.data[0].showlegend is False
    assert fig.data[0].line.dash == "solid" and fig.data[1].line.dash == "dash"
    assert fig.layout.xaxis.tickfont.family == "Courier New"


def test_validate_recipe_is_structural_only(dataset):
    assert validate_recipe({"kind": "line", "x": "time", "y": "current"})["x"] == "time"
    with pytest.raises(ValueError, match="Nested panels"):
        validate_recipe({"kind": "panels", "panels": [{"kind": "panels", "panels": [{"x": "time", "y": "current"}]}]})
    with pytest.raises(ValueError, match="columns"):
        validate_recipe({"kind": "panels", "columns": 5, "panels": [{"x": "time", "y": "current"}]})


def test_embedded_theme_colors_and_custom_layout_are_explicit(dataset):
    recipe = {"kind": "line", "x": "time", "y": "current", "theme": "midnight"}
    dark = render_plot([dataset], recipe)
    assert dark.layout.paper_bgcolor == "rgb(17,17,17)"
    assert dark.layout.plot_bgcolor == "rgb(17,17,17)"
    assert dark.layout.font.color == "#f2f5fa"
    assert dark.layout.xaxis.tickfont.color == "#f2f5fa"
    custom = render_plot([dataset], {**recipe, "layout": {"paper_bgcolor": "white", "font": {"color": "black"}}})
    assert custom.layout.paper_bgcolor == "white" and custom.layout.font.color == "black"
    assert custom.layout.xaxis.tickfont.color == "black"
    assert list(dark.data[0].y) == list(custom.data[0].y)
    panels = render_plot([dataset], {"kind": "panels", "theme": "midnight", "panels": [recipe, recipe]})
    assert panels.layout.paper_bgcolor == dark.layout.paper_bgcolor
    assert panels.layout.xaxis2.tickfont.color == "#f2f5fa"


def test_heatmap_colorbars_retain_units_and_each_panel_domain(dataset):
    dataset["signal"].attrs["units"] = "A"
    recipe = {"kind": "panels", "columns": 1, "panels": [
        {"kind": "heatmap", "x": "bias", "z": "signal"},
        {"kind": "heatmap", "x": "bias", "z": "signal", "component": "phase"},
    ]}
    fig = render_plot([dataset], recipe)
    assert fig.data[0].colorbar.title.text == "signal (A)"
    assert fig.data[1].colorbar.title.text == "signal (rad)"
    assert fig.data[0].colorbar.y > fig.data[1].colorbar.y
    assert fig.data[0].colorbar.x > fig.layout.xaxis.domain[1]
    assert list(fig.data[0].z[1]) == [4, 5, 6, 7]
