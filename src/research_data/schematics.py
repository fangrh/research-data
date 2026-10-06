"""Model-schematic covers: agent-drawn physics pictures for runs.

Agents registering data must think about what the data MEANS and pick a
schematic archetype (honeycomb lattice, D6h flake, magnetic cell, Landau
levels, …) instead of shipping raw noise. All drawings are dependency-free
PIL on the same dark card as sparkline covers, with title/params text.
"""
from __future__ import annotations

import io
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 480, 270
BG = (23, 23, 31)
PINK = (251, 114, 192)
BLUE = (112, 158, 255)
GOLD = (255, 202, 98)
GRAY = (150, 155, 165)


def _canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), BG)
    return img, ImageDraw.Draw(img)


def _font(size: int):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _label(draw: ImageDraw.ImageDraw, title: str, params: str) -> None:
    if title:
        draw.text((14, 10), title[:44], fill=(240, 240, 245), font=_font(17))
    if params:
        draw.text((14, H - 26), params[:60], fill=GRAY, font=_font(14))


def honeycomb(title="", params=""):
    img, d = _canvas()
    cx, cy, a = W * 0.62, H * 0.52, 22.0
    dirs = [(1, 0), (0.5, math.sqrt(3) / 2), (-0.5, math.sqrt(3) / 2), (-1, 0), (-0.5, -math.sqrt(3) / 2), (0.5, -math.sqrt(3) / 2)]
    def neighbors(u, v):
        pts = []
        for du, dv in ((0, 0), (1, 0), (0, 1), (-1, 1), (-1, 0), (0, -1), (1, -1)):
            pts.append((u + du, v + dv))
        return pts
    seen = set()
    for u in range(-3, 4):
        for v in range(-3, 4):
            x = cx + a * (u + v / 2)
            y = cy + a * v * math.sqrt(3) / 2
            if not (20 < x < W - 130 or 16 < y < H - 16):
                continue
            key = (round(x), round(y))
            if key in seen:
                continue
            seen.add(key)
            sublattice = (u - v) % 2
            for du, dv in ((1, 0), (0, 1), (-1, 1)):
                x2 = cx + a * (u + du + (v + dv) / 2)
                y2 = cy + a * (v + dv) * math.sqrt(3) / 2
                d.line([(x, y), (x2, y2)], fill=(70, 74, 88), width=2)
            color = PINK if sublattice == 0 else BLUE
            r = 4 if sublattice == 0 else 3
            d.ellipse([x - r, y - r, x + r, y + r], fill=color)
    _label(d, title or "Honeycomb lattice", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def flake(title="", params=""):
    img, d = _canvas()
    cx, cy, R = W * 0.63, H * 0.52, 92
    for ring in (R, int(R * 0.72), int(R * 0.45)):
        pts = [(cx + ring * math.cos(math.radians(60 * k - 30)),
                cy + ring * math.sin(math.radians(60 * k - 30))) for k in range(6)]
        d.polygon(pts, outline=(70, 74, 88), width=2)
        for p in pts:
            d.ellipse([p[0] - 3, p[1] - 3, p[0] + 3, p[1] + 3], fill=PINK if ring == R else BLUE)
    d.polygon([(cx, cy - 6), (cx + 5, cy + 4), (cx - 5, cy + 4)], fill=GOLD)
    _label(d, title or "D6h nanoflake", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def magnetic_cell(title="", params=""):
    img, d = _canvas()
    x0, y0, s = W * 0.5 - 60, H * 0.5 - 60, 120
    d.rectangle([x0, y0, x0 + s, y0 + s], outline=PINK, width=3)
    step = s // 4
    for i in range(1, 4):
        d.line([(x0 + i * step, y0), (x0 + i * step, y0 + s)], fill=(60, 64, 78), width=1)
        d.line([(x0, y0 + i * step), (x0 + s, y0 + i * step)], fill=(60, 64, 78), width=1)
    for (ax, ay) in ((x0 + s // 2, y0 + s // 4), (x0 + 3 * s // 4, y0 + s // 2), (x0 + s // 2, y0 + 3 * s // 4), (x0 + s // 4, y0 + s // 2)):
        d.ellipse([ax - 5, ay - 5, ax + 5, ay + 5], outline=BLUE, width=2)
        d.line([(ax, ay), (ax, ay - 9)], fill=BLUE, width=2)
    for (bx, by, bx2, by2) in ((x0 - 26, y0, x0 + s + 26, y0), (x0 - 26, y0 + s, x0 + s + 26, y0 + s)):
        d.line([(bx, by), (bx2, by2)], fill=GRAY, width=1)
        for t in range(6):
            px = bx + (bx2 - bx) * t / 5
            d.polygon([(px, by - 4), (px + 7, by), (px, by + 4)], fill=GRAY)
    _label(d, title or "Magnetic unit cell", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def landau(title="", params=""):
    img, d = _canvas()
    x0 = W * 0.42
    y = 38
    for k in range(6):
        level = x0 + 30 + k * 26
        d.line([(level, y), (level, H - 34)], fill=(60, 64, 78), width=1)
        pts = [(level, y + (H - 34 - y) * (0.5 + 0.40 * math.exp(-20 * v * v) * math.sin((k + 1) * 9 * v)))
               for v in np.linspace(-1, 1, 60)]
        d.line(pts, fill=PINK if k % 2 == 0 else BLUE, width=2)
    d.text((x0 + 8, H // 2 - 34), "LL n", fill=GRAY, font=_font(14))
    _label(d, title or "Landau levels", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def chain(title="", params=""):
    img, d = _canvas()
    y = H // 2
    n = 9
    x0 = W * 0.34
    for i in range(n):
        x = x0 + i * 30
        d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=PINK if i in (0, n - 1) else BLUE)
        if i:
            d.line([(x - 30 + 7, y), (x - 7, y)], fill=(70, 74, 88), width=3)
    d.rectangle([x0 - 44, y - 20, x0 - 14, y + 20], outline=GOLD, width=2)
    d.text((x0 - 42, y + 26), "S", fill=GOLD, font=_font(14))
    d.rectangle([x0 + (n - 1) * 30 + 14, y - 20, x0 + (n - 1) * 30 + 44, y + 20], outline=GOLD, width=2)
    d.text((x0 + (n - 1) * 30 + 16, y + 26), "D", fill=GOLD, font=_font(14))
    _label(d, title or "Finite chain / strip", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def kernel(title="", params=""):
    img, d = _canvas()
    cx, cy = W * 0.62, H * 0.5
    for k in range(5, 0, -1):
        r = 18 * k
        shade = 60 + k * 16
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(shade, shade + 4, shade + 12), width=2)
    d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=PINK)
    _label(d, title or "Response kernel", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


def spectrum(title="", params=""):
    img, d = _canvas()
    x0, y1 = W * 0.40, H - 34
    rng = np.random.default_rng(11)
    heights = np.sort(rng.uniform(0.15, 1.0, 22))[::-1]
    for i, hgt in enumerate(heights):
        x = x0 + i * 12
        d.line([(x, y1), (x, y1 - hgt * (H - 80))], fill=PINK if hgt > 0.7 else BLUE, width=5)
    _label(d, title or "Spectrum", params)
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()


ARCHETYPES = {
    "honeycomb": honeycomb,
    "flake": flake,
    "magnetic_cell": magnetic_cell,
    "landau": landau,
    "chain": chain,
    "kernel": kernel,
    "spectrum": spectrum,
}


def draw_archetype(name: str, title: str = "", params: str = "") -> bytes:
    """Render a model-schematic cover PNG for the given archetype."""
    fn = ARCHETYPES.get(name)
    if fn is None:
        raise ValueError(f"unknown schematic archetype: {name}; known: {sorted(ARCHETYPES)}")
    return fn(title=title, params=params)
