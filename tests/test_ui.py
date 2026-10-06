from __future__ import annotations

from research_data.ui import (
    STYLES,
    browse_url,
    card_html,
    detail_html,
    header_html,
    hero_html,
    ranking_html,
)


def _run(**changes):
    run = {
        "run_id": "r-1",
        "title": "Model <& \"demo\"",
        "project": "project <alpha>",
        "description": "Description <script>alert(1)</script>",
        "kind": "simulation",
        "execution_status": "completed",
        "parameters": {"file_count": 12, "alpha": "<&"},
        "tags": ["tag<&"],
        "validation": {"status": "partial"},
        "created_at": "2026-10-06T12:30:00+00:00",
    }
    run.update(changes)
    return run


def test_browse_url_preserves_context_and_only_allowed_changes():
    context = {"catalog": r"D:\catalog & one", "project_dir": "D:/project", "pick": "old", "junk": "drop"}
    url = browse_url(context, pick="r<&", up=None, fav="1", ignored="x")
    assert url == "./?catalog=D%3A%5Ccatalog+%26+one&project_dir=D%3A%2Fproject&pick=r%3C%26&fav=1"
    assert browse_url(context, pick=None, up=None, fav=None) == (
        "./?catalog=D%3A%5Ccatalog+%26+one&project_dir=D%3A%2Fproject"
    )


def test_card_detail_and_navigation_escape_untrusted_text_and_urls():
    run = _run()
    card = card_html(run, b"PNG", "?pick=<&", "?up=<&", state={"favorite": True}, badge="数据<&", mode="data")
    detail = detail_html(run)
    header = header_html("?next=<&", "?fav=<&")
    for rendered in (card, detail, header):
        assert "<script>" not in rendered
        assert "&lt;" in rendered
    assert "data:image/png;base64,UE5H" in card
    assert "12 个文件" in card
    assert "数据预览" in card
    assert "2026-10-06" in card
    assert "查看项目" in card and "href='?up=&lt;&amp;'" in card
    assert "class='rd-card-favorite'" in card and "<a class='rd-card-favorite'" not in card
    assert card.count("<a ") == 3 and card.count("target='_self'") == 3
    assert "模拟" in card and "已完成" in card
    assert "参数预览" in detail
    assert "href='?pick=&lt;&amp;'" in card


def test_hero_ranking_and_styles_use_real_counts_and_responsive_classes():
    runs = [_run(run_id="a", title="A"), _run(run_id="b", title="B", parameters={"file_count": 3})]
    hero = hero_html(5307, ["alpha", "beta"])
    ranking = ranking_html(runs, {"a": "?pick=a", "b": "?pick=b"})
    assert "5,307" in hero and "2" in hero
    assert "12 个文件" in ranking and "3 个文件" in ranking
    assert "文件排行" in ranking and "按登记文件数排列" in ranking
    assert "grid-template-columns:repeat(4" in STYLES
    assert "grid-template-columns:repeat(3" in STYLES
    assert "grid-template-columns:repeat(2" in STYLES
    assert "grid-template-columns:1fr" in STYLES


def test_card_file_count_falls_back_to_artifacts_when_parameter_is_absent():
    run = _run(parameters={"alpha": 1}, artifacts=[{"path": "a"}, {"path": "b"}])
    rendered = card_html(run, None, "./", "./", mode="none")
    assert "2 个文件" in rendered
