import base64
import hashlib
import io
from pathlib import Path
from uuid import uuid4

import pytest
from PIL import Image

from research_data.catalog import Catalog
from research_data.articles import ArticleStore
from research_data.figure_editor import initial_payload
from research_data.math_render import render_equation
from research_data.proofs import ProofStore


def _png(color="white"):
    stream = io.BytesIO()
    Image.new("RGB", (24, 16), color).save(stream, format="PNG")
    return stream.getvalue()


def test_mathtext_api_renders_png_and_svg_and_rejects_unsupported():
    result = render_equation(r"E=mc^2")
    assert result.png.startswith(b"\x89PNG") and result.svg.startswith(b"<?xml")
    assert result.png_data_url.startswith("data:image/png;base64,")
    assert result.svg_data_url.startswith("data:image/svg+xml;base64,")
    with pytest.raises(ValueError, match="unsupported MathText|raw MathText"):
        render_equation(r"\thiscommanddoesnotexist{x}")


def test_publish_freezes_equation_and_verified_illustration_resources(tmp_path):
    root = tmp_path / "catalog"
    catalog = Catalog(root)
    source_bytes = _png("navy")
    source = tmp_path / "source.png"
    source.write_bytes(source_bytes)
    with catalog.run(title="article source") as run:
        artifact = run.add_artifact(source, role="figure")
    payload = initial_payload(catalog.get(run.run_id), _png())
    payload["figure_png"] = "data:image/png;base64," + base64.b64encode(_png()).decode("ascii")
    payload["inputs"] = [{"run_id": run.run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}]
    encoded = base64.b64encode(source_bytes).decode("ascii")
    payload["document"]["equations"] = [{"latex": r"\frac{a}{b}", "description": "Ratio"}]
    payload["document"]["illustrations"] = [{"image": "data:image/png;base64," + encoded,
        "caption": "Managed source", "artifact_id": artifact["artifact_id"],
        "run_id": run.run_id, "sha256": hashlib.sha256(source_bytes).hexdigest()}]
    published = ProofStore(root).publish(run.run_id, payload)
    store = ProofStore(root)
    revision = store.get(run.run_id, published["revision_id"])
    folder = root / "proofs" / run.run_id / published["revision_id"]
    assert (folder / "equation-0.png").is_file() and (folder / "equation-0.svg").is_file()
    assert (folder / "illustration-0.png").read_bytes() == source_bytes
    html = (folder / "report.html").read_text(encoding="utf-8")
    assert "Ratio" in html and "Supplementary" in html
    assert (folder / "report.pdf").read_bytes().count(b"/Subtype /Image") >= 3
    payload_view = __import__("research_data.proof_review", fromlist=["review_payload"]).review_payload(revision)
    assert payload_view["document"]["equations"][0]["png_data_url"].startswith("data:image/png")
    (folder / "equation-0.png").write_bytes(b"tampered")
    with pytest.raises(ValueError, match="tampered"):
        store.get(run.run_id, published["revision_id"])


def test_illustration_must_match_verified_input(tmp_path):
    root = tmp_path / "catalog"
    catalog = Catalog(root)
    with catalog.run(title="article source") as run:
        pass
    payload = initial_payload(catalog.get(run.run_id), _png())
    payload["figure_png"] = "data:image/png;base64," + base64.b64encode(_png()).decode("ascii")
    payload["document"]["illustrations"] = [{"image": "data:image/png;base64," + base64.b64encode(_png("red")).decode(),
        "caption": "unverified", "artifact_id": "missing", "run_id": run.run_id, "sha256": "0" * 64}]
    with pytest.raises(ValueError, match="verified payload input"):
        ProofStore(root).publish(run.run_id, payload)


def test_equation_and_illustration_comment_anchors_are_frozen(tmp_path):
    root = tmp_path / "catalog"; catalog = Catalog(root); source_bytes = _png("navy"); source = tmp_path / "source.png"; source.write_bytes(source_bytes)
    with catalog.run(title="anchors") as run: artifact = run.add_artifact(source, role="figure")
    payload = initial_payload(catalog.get(run.run_id), _png()); payload["figure_png"] = "data:image/png;base64," + base64.b64encode(_png()).decode(); payload["inputs"] = [{"run_id": run.run_id, "artifact_id": artifact["artifact_id"], "sha256": artifact["sha256"]}]
    encoded = base64.b64encode(source_bytes).decode(); payload["document"]["equations"] = [{"latex": "E=mc^2", "description": "Energy relation"}]; payload["document"]["illustrations"] = [{"image": "data:image/png;base64," + encoded, "caption": "Managed source", "artifact_id": artifact["artifact_id"], "run_id": run.run_id, "sha256": hashlib.sha256(source_bytes).hexdigest()}]
    store = ProofStore(root); revision = store.publish(run.run_id, payload); rid = revision["revision_id"]
    assert store.comment_target(run.run_id, rid, "equation:0")["anchor"] == "equation:0"
    assert store.comment_target(run.run_id, rid, "equation:0", {"kind": "text", "start": 0, "end": 6, "exact": "Energy"})["locator"]["exact"] == "Energy"
    assert store.comment_target(run.run_id, rid, "illustration:0", {"kind": "point", "x": .25, "y": .75})["locator"]["x"] == .25
    assert store.comment_target(run.run_id, rid, "illustration-caption:0", {"kind": "text", "start": 0, "end": 7, "exact": "Managed"})["anchor"] == "illustration-caption:0"
    with pytest.raises(ValueError, match="index"):
        store.comment_target(run.run_id, rid, "equation:1")
    with pytest.raises(ValueError, match="frozen document"):
        store.comment_target(run.run_id, rid, "equation:0", {"kind": "text", "start": 0, "end": 6, "exact": "Changed"})


def test_article_provenance_is_frozen_and_verified(tmp_path):
    root = tmp_path / "catalog"; catalog = Catalog(root); image = _png(); source = tmp_path / "source.png"; source.write_bytes(image)
    with catalog.run(title="article source") as run: artifact = run.add_artifact(source, role="figure")
    articles = ArticleStore(root); article = articles.template(run.run_id); article.update(summary="Summary", methods="Methods", results="Results", limitations="Limits", equation_note="None", figure_note="None")
    receipt = articles.submit(run.run_id, article); payload = initial_payload(catalog.get(run.run_id), image, []); payload["figure_png"] = "data:image/png;base64," + base64.b64encode(image).decode(); payload["document"]["article_provenance"] = {"revision_id": receipt["revision_id"], "draft_sha256": receipt["receipt"]["sha256"]}
    proof = ProofStore(root); published = proof.publish(run.run_id, payload); folder = Path(published["manifest"]).parent; assert published["article_submission"]["revision_id"] == receipt["revision_id"]; proof.get(run.run_id, published["revision_id"])
    (folder / "article-source.json").write_bytes(b"tampered")
    with pytest.raises(ValueError, match="article submission"):
        proof.get(run.run_id, published["revision_id"])
    payload["document"]["article_provenance"]["revision_id"] = "0" * 32
    with pytest.raises(ValueError, match="provenance"):
        proof.publish(run.run_id, payload)
