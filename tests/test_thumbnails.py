import numpy as np
import pytest
import xarray as xr
from PIL import Image
import io

from research_data.thumbnails import cover_for_dataset, draw_sparkline, pick_series


def test_sparkline_png_shape_and_determinism():
    png = draw_sparkline([np.sin(np.linspace(0, 12, 200))])
    img = Image.open(io.BytesIO(png))
    assert img.format == "PNG" and img.size == (320, 180)
    assert png == draw_sparkline([np.sin(np.linspace(0, 12, 200))])


def test_cover_pick_prefers_numeric_1d_and_handles_complex():
    ds = xr.Dataset({"amp": ("t", np.linspace(0, 1, 50) * np.exp(1j * np.linspace(0, 6, 50))),
                     "label": ("t", ["a"] * 50)})
    series = pick_series(ds)
    assert [name for name, _ in series] == ["amp"]
    assert np.allclose(series[0][1], np.abs(ds.amp.values))
    png = cover_for_dataset(ds)
    assert png is not None and png[:4] == b"\x89PNG"


def test_cover_returns_none_for_nonnumeric():
    ds = xr.Dataset({"text": ("t", [f"v{i}" for i in range(10)])})
    assert pick_series(ds) == []
    assert cover_for_dataset(ds) is None


def test_cover_two_series_and_downsampling():
    rng = np.random.default_rng(7)
    long = rng.normal(size=5000).cumsum()
    png = draw_sparkline([long, np.linspace(-1, 1, 5000)])
    assert Image.open(io.BytesIO(png)).size == (320, 180)


def test_object_column_of_numeric_lists_becomes_series():
    # TOML rows 形态：每行 real = [576 个复数/浮点] → 对象列
    arr = np.empty(2, dtype=object)
    arr[0] = [0.1, 0.2, 0.3, 0.4, 0.5]
    arr[1] = [0.5, 0.4, 0.3, 0.2, 0.1]
    ds = xr.Dataset({"real": ("t", arr)})
    series = pick_series(ds)
    assert series and series[0][0] == "real" and series[0][1].size == 10
    assert cover_for_dataset(ds) is not None


def test_series_for_artifact_big_csv_head_and_fingerprint():
    import numpy as np
    from research_data.thumbnails import fingerprint_series, series_for_artifact
    big = tmp_path_factory_skip = None
    import tempfile, os
    from pathlib import Path
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "big.csv"
        rows = "\n".join(f"{i},{np.sin(i/50):.6f}" for i in range(200000))  # ~2MB+
        p.write_text("t,v\n" + rows, encoding="utf-8")
        series = series_for_artifact(p)
        assert series is not None and series[0].size >= 2
        fp = fingerprint_series({"file_count": 12, "total_bytes": 3400, "note": "x"})
        assert fp is not None and fp.size == 2
        assert fingerprint_series({"note": "x"}) is None
