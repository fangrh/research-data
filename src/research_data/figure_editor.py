"""Bundled Three Interact host and initial scientific figure scenes."""
from __future__ import annotations

import base64
import copy
import hashlib
import io
import json
from pathlib import Path
from uuid import uuid4


RESOURCES = Path(__file__).parent / "resources" / "three_interact"


def vendor_metadata():
    return json.loads((RESOURCES / "vendor.json").read_text(encoding="utf-8"))


def initial_payload(run, png=None, inputs=None, recipe=None):
    """The plotted image is a panel; labels, components and annotations stay editable."""
    scene_id, panel_id = str(uuid4()), str(uuid4())
    scene = {"schema": "three-interact.scene", "version": 1, "id": scene_id,
             "mode": "2d", "units": "px", "coordinates": "x-right y-down; logical pixels; rotation radians about z", "elements": {}}
    assets = {}
    if png:
        from PIL import Image
        with Image.open(io.BytesIO(png)) as image:
            width, height = image.size
        name = "data-plot.png"
        assets[name] = "data:image/png;base64," + base64.b64encode(png).decode("ascii")
        scene["elements"][panel_id] = {"id": panel_id, "name": "Data plot · panel a", "type": "image", "visible": True, "locked": False,
            "transform": {"position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1]},
            "properties": {"src": name, "width": 800, "height": 800 * height / width, "opacity": 1}}
    return {"schema": "research-data.proof-draft.v1", "scene": scene, "assets": assets,
            "document": {"title": run.get("title") or "Research proof", "authors": "", "abstract": "",
                         "body": run.get("description") or "", "caption": "", "layout": "single"},
            "inputs": copy.deepcopy(inputs or []), "recipe": copy.deepcopy(recipe or {}),
            "editor": {"upstream": vendor_metadata(), "history": [], "orders": []}}


def editor(payload, draft_hash, identity, reset_token=0, saved_notice="", key=None):
    import streamlit.components.v1 as components
    component = components.declare_component("research_data_three_interact", path=str(RESOURCES))
    return component(payload=payload, draft_hash=draft_hash, identity=identity, reset_token=reset_token,
                     saved_notice=saved_notice, key=key, default=None)


def scene_hash(payload):
    return hashlib.sha256(json.dumps({"scene": payload["scene"], "assets": payload.get("assets", {})}, sort_keys=True).encode()).hexdigest()
