"""Bilibili-style cover thumbnails drawn from run data.

A cover is a small PNG sparkline of the run's primary artifact: dark card
background, accent polyline with soft area fill and faint grid lines. No new
runtime dependencies beyond Pillow (already required by Streamlit).
"""
from __future__ import annotations

import io
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 320, 180
BG = (23, 23, 31)
LINE = (251, 114, 192)          # bilibili pink
LINE_DARK = (112, 158, 255)     # alternate accent for second series
FILL = (251, 114, 192, 46)
GRID = (255, 255, 255, 14)
MAX_POINTS = 720


def _numeric_1d(values: Any) -> np.ndarray | None:
    arr = np.asarray(values)
    if arr.dtype == object:
        # 对象列里装的是等长数值序列（如 TOML rows 的 real/imag 数组）→ 拼接为一维
        sample = next((v for v in arr if v is not None), None)
        if isinstance(sample, (list, tuple, np.ndarray)):
            try:
                rows = [np.atleast_1d(np.asarray(v, dtype=complex if np.iscomplexobj(v) else float))
                        for v in arr if v is not None]
                arr = np.concatenate(rows)
            except (TypeError, ValueError):
                return None
        else:
            try:
                arr = arr.astype(float)
            except (TypeError, ValueError):
                return None
    if np.iscomplexobj(arr):
        arr = np.abs(arr)
    if arr.ndim != 1 or arr.size < 2:
        return None
    if not np.issubdtype(arr.dtype, np.number):
        return None
    finite = arr[np.isfinite(arr)]
    if finite.size < 2:
        return None
    return arr


def pick_series(ds) -> list[tuple[str, np.ndarray]]:
    """Pick up to two drawable 1-D series from an xarray dataset."""
    out: list[tuple[str, np.ndarray]] = []
    for name, var in ds.data_vars.items():
        series = _numeric_1d(var.values)
        if series is not None:
            out.append((str(name), series))
            if len(out) == 2:
                break
    return out


def _to_path(arr: np.ndarray) -> list[tuple[float, float]]:
    if arr.size > MAX_POINTS:
        idx = np.linspace(0, arr.size - 1, MAX_POINTS).astype(int)
        arr = arr[idx]
    lo, hi = float(np.min(arr)), float(np.max(arr))
    if hi == lo:
        hi = lo + 1.0
    n = arr.size
    pad_x, pad_y = 10.0, 14.0
    w, h = WIDTH - 2 * pad_x, HEIGHT - 2 * pad_y
    return [(pad_x + i * w / (n - 1), pad_y + (1.0 - (v - lo) / (hi - lo)) * h)
            for i, v in enumerate(arr.tolist())]


def draw_sparkline(series: list[np.ndarray], badge: str | None = None,
                   accent: tuple = LINE) -> bytes:
    """Render one or two normalized series onto a dark cover PNG.

    badge (Bilibili 时长徽章式) is drawn bottom-right over a dark chip.
    accent overrides the primary line color (参数指纹用蓝色区分).
    """
    base = Image.new("RGBA", (WIDTH, HEIGHT), BG + (255,))
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in (HEIGHT // 4, HEIGHT // 2, 3 * HEIGHT // 4):
        draw.line([(8, y), (WIDTH - 8, y)], fill=GRID, width=1)
    for k, arr in enumerate(series[:2]):
        pts = _to_path(arr)
        color = accent if k == 0 else LINE_DARK
        if len(pts) == 1:
            x, y = pts[0]
            draw.ellipse([x - 4, y - 4, x + 4, y + 4], fill=color)
        fill = tuple(color) + (40,) if k == 0 else None
        if fill is not None:
            polygon = [pts[0], *pts, pts[-1], (pts[-1][0], HEIGHT - 8), (pts[0][0], HEIGHT - 8)]
            draw.polygon(polygon, fill=fill)
        draw.line(pts, fill=color, width=3, joint="curve")
    if badge:
        font = ImageFont.load_default(size=16)
        tw = draw.textlength(badge, font=font)
        chip_h = 24
        x1, y1 = WIDTH - tw - 18, HEIGHT - chip_h - 8
        draw.rounded_rectangle([x1, y1, WIDTH - 8, y1 + chip_h], radius=5, fill=(0, 0, 0, 170))
        draw.text((x1 + 7, y1 + 4), badge, fill=(255, 255, 255, 235), font=font)
    out = Image.alpha_composite(base, overlay).convert("RGB")
    buf = io.BytesIO()
    out.save(buf, format="PNG")
    return buf.getvalue()


def human_count(n) -> str:
    """Bilibili 式计数：999+ / 1.2万。"""
    try:
        n = int(n)
    except (TypeError, ValueError):
        return ""
    if n >= 10000:
        return f"{n / 10000:.1f}万"
    return str(n)


def cover_for_dataset(ds) -> bytes | None:
    """Cover PNG for a dataset, or None when nothing numeric is drawable."""
    series = pick_series(ds)
    if not series:
        return None
    return draw_sparkline([arr for _, arr in series])


def series_for_artifact(path) -> list[np.ndarray] | None:
    """Drawable series for one artifact file; big CSV/TSV read head-only."""
    p = Path(path)
    fmt = p.suffix.lower().lstrip(".")
    if fmt in {"csv", "tsv"}:
        import pandas as pd
        from research_data.adapters import _dataset_from_frame
        try:
            frame = pd.read_csv(p, sep="\t" if fmt == "tsv" else ",", nrows=256)
            picked = pick_series(_dataset_from_frame(frame, {}))
            return [arr for _, arr in picked] if picked else None
        except Exception:
            return None
    try:
        if p.stat().st_size > 2_000_000:
            return None
        from research_data.adapters import load_file
        picked = pick_series(load_file(p))
        return [arr for _, arr in picked] if picked else None
    except Exception:
        return None


def fingerprint_series(parameters: dict) -> np.ndarray | None:
    """Normalized numeric-parameter values as a last-resort cover series."""
    values: list[float] = []

    def walk(node):
        if isinstance(node, bool):
            return
        if isinstance(node, (int, float)):
            values.append(float(node))
        elif isinstance(node, dict):
            for v in node.values():
                walk(v)
        elif isinstance(node, (list, tuple)):
            for v in node:
                walk(v)

    walk(parameters or {})
    finite = [v for v in values if np.isfinite(v)]
    if len(finite) < 2:
        return None
    return np.asarray(finite, dtype=float)
