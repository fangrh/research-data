from research_data.social import Interactions


def test_like_favorite_toggle_and_persistence(tmp_path):
    it = Interactions(tmp_path / "catalog")
    rid = "run-1"
    assert it.state(rid) == {"liked": False, "favorite": False, "comments": 0}
    it.like(rid); it.favorite(rid)
    fresh = Interactions(tmp_path / "catalog")  # 重新打开,验证持久化
    assert fresh.state(rid) == {"liked": True, "favorite": True, "comments": 0}
    assert fresh.favorites() == [rid]
    fresh.favorite(rid, on=False)
    assert Interactions(tmp_path / "catalog").favorites() == []


def test_comments_add_list_and_validation(tmp_path):
    it = Interactions(tmp_path)
    c1 = it.add_comment("r9", "P3 与实验一致 ✓")
    c2 = it.add_comment("r9", "建议补 M=8 对照")
    comments = it.comments("r9")
    assert [c["text"] for c in comments] == [c1["text"], c2["text"]]
    assert all(set(c) >= {"ts", "author", "text"} for c in comments)
    try:
        it.add_comment("r9", "   ")
    except ValueError:
        pass
    else:
        raise AssertionError("empty comment accepted")
