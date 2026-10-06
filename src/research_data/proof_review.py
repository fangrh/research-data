"""Interactive review of verified, immutable proof content."""
from __future__ import annotations

import base64
import json
from pathlib import Path


RESOURCES = Path(__file__).parent / "resources" / "proof_review"


def review_payload(revision):
    """Use after ProofStore.get has verified the frozen revision bytes."""
    folder = Path(revision["path"])
    scene = json.loads((folder / "scene.json").read_text(encoding="utf-8"))
    document = json.loads((folder / "document.json").read_text(encoding="utf-8"))
    for item in document.get("equations", []):
        resource = item.get("resource", {})
        if resource.get("png"):
            item["png_data_url"] = "data:image/png;base64," + base64.b64encode((folder / resource["png"]).read_bytes()).decode("ascii")
        if resource.get("svg"):
            item["svg_data_url"] = "data:image/svg+xml;base64," + base64.b64encode((folder / resource["svg"]).read_bytes()).decode("ascii")
    for item in document.get("illustrations", []):
        resource = item.get("resource", {})
        if resource.get("path"):
            mime = "image/jpeg" if resource["path"].endswith(".jpg") else "image/png"
            item["image_data_url"] = "data:" + mime + ";base64," + base64.b64encode((folder / resource["path"]).read_bytes()).decode("ascii")
    return {
        "revision_id": revision["revision_id"], "run_id": revision["run_id"],
        "document": document,
        "figure": "data:image/png;base64," + base64.b64encode((folder / "figure.png").read_bytes()).decode("ascii"),
        "elements": [{"id": key, "name": value.get("name", key), "type": value["type"]}
                     for key, value in scene["elements"].items()],
        "payload_hash": revision["payload_hash"],
    }


def review_threads(comments):
    groups = {}
    for comment in comments:
        root = comment.get("thread_id", comment["id"])
        groups.setdefault(root, []).append(comment)
    return [{"id": key, "number": i + 1,
             "root": next((c for c in values if c["id"] == key), values[0]),
             "comments": values}
            for i, (key, values) in enumerate(groups.items())]


def review_event(store, run_id, revision_id, event, comments):
    """Reject stale frame events before they can change the current review target."""
    if not isinstance(event, dict) or event.get("revision_id") != revision_id:
        return None
    event_id = event.get("event_id")
    if not isinstance(event_id, str) or not event_id or len(event_id) > 120:
        raise ValueError("invalid review event identity")
    action = event.get("action")
    if action == "select":
        target = store.comment_target(run_id, revision_id, event.get("anchor"), event.get("locator"))
        return {"action": action, "event_id": event_id, **target}
    if action == "focus":
        comment = next((c for c in comments if c["id"] == event.get("comment_id")), None)
        if comment is None:
            raise ValueError("review comment does not belong to this revision")
        return {"action": action, "event_id": event_id, "thread_id": comment.get("thread_id", comment["id"])}
    raise ValueError("unknown review event")


def reader(payload, threads, selection=None, focus=None, focus_token=0, key=None):
    import streamlit.components.v1 as components
    component = components.declare_component("research_data_proof_review", path=str(RESOURCES))
    return component(proof=payload, threads=threads, selection=selection,
                     focus=focus, focus_token=focus_token, key=key, default=None)
