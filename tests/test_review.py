import json

from research_data.catalog import Catalog
from research_data.review import complete_review, list_pending, request_review
from research_data.social import Interactions


def test_review_dispatch_lifecycle(tmp_path):
    cat = Catalog(tmp_path / "catalog")
    src = tmp_path / "v.csv"; src.write_text("x,y\n1,2\n2,4\n", encoding="utf-8")
    with cat.run(title="review me", project="p") as run:
        run.add_artifact(src, profile={"x": "x"})
    rid = run.run_id
    Interactions(tmp_path / "catalog").add_comment(rid, "用户评价：曲线应该单调，请检查。")

    req = request_review(tmp_path / "catalog", rid, instruction="核对单调性")
    pending = list_pending(tmp_path / "catalog")
    assert len(pending) == 1 and pending[0]["run_id"] == rid
    assert pending[0]["comments_snapshot"][0]["text"].startswith("用户评价")

    result = complete_review(tmp_path / "catalog", pending[0]["request_id"],
                             reply="已核对：y 随 x 单调递增，用户评论成立。",
                             validation="partial", validation_notes="用户评论核对通过")
    assert result["actions"] == ["comment", "validation"]
    assert list_pending(tmp_path / "catalog") == []
    comments = Interactions(tmp_path / "catalog").comments(rid)
    assert comments[-1]["author"] == "AI agent" and comments[-1]["text"].startswith("已核对")
    manifest = cat.get(rid)
    assert manifest["validation"]["status"] == "partial"
    assert "用户评论核对通过" in manifest["validation"]["notes"]
    done = json.loads((tmp_path / "catalog" / "reviews" / "done" /
                       (pending[0]["request_id"] + ".json")).read_text(encoding="utf-8"))
    assert done["reply"].startswith("已核对")


def test_review_validation_requires_evidence_for_passed(tmp_path):
    cat = Catalog(tmp_path / "catalog")
    with cat.run(title="r2", project="p") as run:
        pass
    req = request_review(tmp_path / "catalog", run.run_id)
    try:
        complete_review(tmp_path / "catalog", req.stem, reply="ok",
                        validation="passed")
    except ValueError:
        pass
    else:
        raise AssertionError("passed without evidence accepted")
    # 不带 validation 的完成路径
    result = complete_review(tmp_path / "catalog", req.stem, reply="仅回复")
    assert result["actions"] == ["comment"]
