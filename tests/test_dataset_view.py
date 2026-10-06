import numpy as np
import pandas as pd
import xarray as xr
from research_data.plotting import render_plot

from research_data.dataset_view import artifact_inventory, bounded_preview, dataset_variables, default_recipe


def test_artifact_inventory_is_metadata_only_query_and_copy_safe(tmp_path):
    missing = tmp_path / "missing.csv"
    manifest = {"artifacts": [
        {"artifact_id": "a", "original_name": "trace.csv", "format": "bin", "role": "raw",
         "description": "transport trace", "size_bytes": 12, "variables": [{"name": "I"}],
         "profile": {"format": "CSV"}},
        {"artifact_id": "f", "original_name": "plot.png", "format": "png", "role": "figure",
         "description": "plot", "size_bytes": 3, "variables": []},
        {"artifact_id": "x", "original_name": "unknown.xyz", "format": "xyz", "role": "raw",
         "description": "other", "size_bytes": 1, "variables": []},
    ]}
    result = artifact_inventory(manifest, "transport")
    assert result[0]["format"] == "csv" and result[0]["loadable"]
    result[0]["variables"][0]["name"] = "changed"
    assert manifest["artifacts"][0]["variables"][0]["name"] == "I"
    all_items = artifact_inventory(manifest)
    assert not all_items[1]["loadable"] and not all_items[2]["loadable"]
    assert not missing.exists()


def test_dataset_variables_preserve_mixed_axes_and_metadata():
    ds = xr.Dataset(
        {"a": (("x",), [1, 2], {"units": "A", "description": "current"}),
         "b": (("y", "x"), np.ones((3, 2)), {"units": "V"})},
        coords={"x": ("x", [10, 20]), "y": ("y", [1, 2, 3])},
    )
    found = dataset_variables(ds)
    assert found[0]["dims"] == ["x"] and found[1]["dims"] == ["y", "x"]
    assert found[0]["coordinates"] == ["x"]
    assert found[1]["coordinates"] == ["y", "x"]
    assert found[0]["unit"] == "A" and found[0]["numeric"]


def test_default_recipe_and_bounded_preview_keep_acquired_order():
    ds = xr.Dataset({"signal": (("y", "x"), np.array([[1 + 2j, 3 + 4j], [5 + 6j, 7 + 8j]]))},
                    coords={"x": ("x", [10, 20]), "y": ("y", [100, 200])})
    recipe = default_recipe(ds, "signal")
    assert recipe == {"kind": "heatmap", "x": "x", "y": ["signal"], "z": "signal", "y_axis": "y"}
    assert len(render_plot([ds], recipe).data) == 1
    preview = bounded_preview(ds, "signal", limit=3)
    assert isinstance(preview, pd.DataFrame)
    assert list(preview["signal"]) == [1 + 2j, 3 + 4j, 5 + 6j]
    assert list(preview["x"]) == [10, 20, 10] and list(preview["y"]) == [100, 100, 200]


def test_default_recipe_fallback_axes_and_unsupported_cases():
    ds = xr.Dataset({"axis": (("q",), [0.1, 0.2]), "signal": (("q",), [1, 2])})
    assert default_recipe(ds, "signal") == {"kind": "line", "x": "axis", "y": "signal"}
    assert default_recipe(xr.Dataset({"text": (("q",), ["a"])}), "text") is None
    assert default_recipe(xr.Dataset({"scalar": ((), 2.0)}), "scalar") is None
    assert default_recipe(xr.Dataset({"signal": (("q",), [1, 2])}), "signal") is None
    ambiguous = xr.Dataset({"a": (("q",), [0, 1]), "b": (("q",), [2, 3]), "signal": (("q",), [4, 5])})
    assert default_recipe(ambiguous, "signal") is None
    empty = xr.Dataset({"signal": (("q",), np.array([], dtype=float))}, coords={"q": []})
    assert bounded_preview(empty, "signal").empty
    assert list(bounded_preview(xr.Dataset({"scalar": ((), 4)}), "scalar")["scalar"]) == [4]


def test_bounded_preview_does_not_stack(monkeypatch):
    ds = xr.Dataset({"signal": (("x", "y"), np.arange(100).reshape(10, 10))})
    monkeypatch.setattr(xr.DataArray, "stack", lambda *args, **kwargs: (_ for _ in ()).throw(AssertionError("stack called")))
    preview = bounded_preview(ds, "signal", limit=3)
    assert list(preview["signal"]) == [0, 1, 2]


def test_high_dimensional_recipe_only_requires_display_axes():
    ds = xr.Dataset({"signal": (("scan", "y", "x"), np.ones((2, 3, 4)))},
                    coords={"y": ("y", [1, 2, 3]), "x": ("x", [4, 5, 6, 7])})
    recipe = default_recipe(ds, "signal")
    assert recipe["slices"] == {"scan": 0}
    assert len(render_plot([ds], recipe).data) == 1
