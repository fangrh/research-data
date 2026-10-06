"""Offline Matplotlib MathText rendering for immutable proof resources."""
from __future__ import annotations

import base64
import io
from dataclasses import dataclass


@dataclass(frozen=True)
class EquationRender:
    latex: str
    png: bytes
    svg: bytes
    width: int
    height: int
    dpi: int
    fontsize: float

    @property
    def png_data_url(self) -> str:
        return "data:image/png;base64," + base64.b64encode(self.png).decode("ascii")

    @property
    def svg_data_url(self) -> str:
        return "data:image/svg+xml;base64," + base64.b64encode(self.svg).decode("ascii")


def render_equation(latex: str, *, dpi: int = 180, fontsize: float = 16.0) -> EquationRender:
    """Render one raw MathText expression without invoking TeX.

    ``latex`` is the expression inside the math delimiters; callers must not
    provide ``$$`` or a surrounding ``$`` pair.  Matplotlib's parser is used
    once before rendering so unsupported commands fail with a stable error.
    """
    if not isinstance(latex, str) or not latex.strip():
        raise ValueError("equation.latex must be non-empty text")
    if "$" in latex:
        raise ValueError("equation.latex must be raw MathText without $ delimiters")
    if isinstance(dpi, bool) or not isinstance(dpi, int) or not 72 <= dpi <= 600:
        raise ValueError("equation dpi must be an integer from 72 to 600")
    if isinstance(fontsize, bool) or not isinstance(fontsize, (int, float)) or not 6 <= float(fontsize) <= 96:
        raise ValueError("equation fontsize must be between 6 and 96 points")
    expression = f"${latex}$"
    try:
        import matplotlib
        matplotlib.use("Agg", force=True)
        from matplotlib import rc_context
        from matplotlib.font_manager import FontProperties
        from matplotlib.mathtext import MathTextParser
        import matplotlib.pyplot as plt
        parser = MathTextParser("agg")
        parser.parse(expression, dpi=dpi, prop=FontProperties(size=float(fontsize)))
        with rc_context({"text.usetex": False, "mathtext.fontset": "stix"}):
            fig = plt.figure(figsize=(1, 1), dpi=dpi)
            fig.patch.set_alpha(0)
            fig.text(0, 0, expression, fontsize=float(fontsize), color="black")
            png_stream = io.BytesIO()
            svg_stream = io.BytesIO()
            fig.savefig(png_stream, format="png", dpi=dpi, transparent=True,
                        bbox_inches="tight", pad_inches=0.08, metadata={"Software": "research-data"})
            fig.savefig(svg_stream, format="svg", dpi=dpi, transparent=True,
                        bbox_inches="tight", pad_inches=0.08, metadata={"Date": None})
            plt.close(fig)
        from PIL import Image
        with Image.open(io.BytesIO(png_stream.getvalue())) as image:
            width, height = image.size
        return EquationRender(latex, png_stream.getvalue(), svg_stream.getvalue(), width, height, dpi, float(fontsize))
    except ValueError as exc:
        raise ValueError(f"unsupported MathText expression: {latex!r}: {exc}") from exc
    except Exception as exc:
        raise ValueError(f"unsupported MathText expression: {latex!r}: {exc}") from exc
