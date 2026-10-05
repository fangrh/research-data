import numpy as np
import pytest
import xarray as xr

from research_data.plotting import THEMES, export_plot, render_plot


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
