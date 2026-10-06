import io
import pytest
from PIL import Image

from research_data.schematics import ARCHETYPES, draw_archetype


def test_all_archetypes_render_png_with_labels():
    for name in ARCHETYPES:
        png = draw_archetype(name, title=f"MODEL {name}", params="B=10T q=259")
        assert png[:4] == b"\x89PNG"
        img = Image.open(io.BytesIO(png))
        assert img.size == (480, 270)


def test_unknown_archetype_raises():
    with pytest.raises(ValueError):
        draw_archetype("nope")
