"""Focused checks for the bundled proof-editor package resources."""

import hashlib
import json
from importlib.resources import files


def test_bundled_editor_resources_match_vendor_manifest():
    root = files("research_data").joinpath("resources", "three_interact")
    vendor = json.loads(root.joinpath("vendor.json").read_text(encoding="utf-8"))
    assert vendor["schema"] == "research-data.three-interact-vendor.v1"
    assert vendor["version"]
    # The receipt covers the local bridge source and generated assets.
    for name, expected in vendor["files"].items():
        resource = root.joinpath(name)
        assert resource.is_file(), f"missing bundled proof resource: {name}"
        digest = hashlib.sha256(resource.read_bytes()).hexdigest()
        assert digest == expected, f"bundled proof resource changed: {name}"
    assert len(root.joinpath("editor.js").read_bytes()) > 100_000
    assert len(root.joinpath("plotly.min.js").read_bytes()) > 1_000_000
