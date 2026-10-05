import numpy as np

from research_data.catalog import Catalog
from research_data.demo import build_demo
from research_data.plotting import render_plot


def test_cross_format_demo_real_qcodes_and_heatmap(tmp_path):
    cat = Catalog(tmp_path)
    demo = build_demo(cat, with_qcodes=True)
    runs = [cat.get(rid) for rid in demo["run_ids"]]
    curves = [r for r in runs if "复数" not in r["title"] and "二维" not in r["title"]]
    datasets = [cat.load_dataset(r["run_id"]) for r in curves]
    reference = datasets[0]
    assert len(datasets) >= 6
    for dataset in datasets:
        assert dataset.current.attrs["units"] == "A"
        assert np.array_equal(dataset.voltage.values, reference.voltage.values) or np.allclose(dataset.voltage.values, reference.voltage.values)
    fig = render_plot(datasets, cat.load_recipe("实验与模拟比较"))
    assert len(fig.data) == len(datasets)
    scan = next(r for r in runs if "二维" in r["title"])
    heatmap = render_plot([cat.load_dataset(scan["run_id"])], cat.load_recipe("二维扫描"))
    assert np.asarray(heatmap.data[0].z).shape == (4, 81)
    assert list(heatmap.data[0].y) == [2, 3, 4, 5]
    assert cat.check()["ok"]
