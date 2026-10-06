"""Small, dependency-free HTML building blocks for the ResearchData browser.

The Streamlit controller owns layout and interaction.  This module only turns
already-loaded catalog records into escaped HTML and stable same-page links.
"""
from __future__ import annotations

import base64
import html
import json
from collections.abc import Iterable, Mapping
from urllib.parse import urlencode


def _esc(value: object) -> str:
    return html.escape("" if value is None else str(value), quote=True)


def _text(value: object, fallback: str = "") -> str:
    if value is None or value == "":
        return fallback
    return str(value)


def _count(value: object) -> str:
    try:
        return f"{int(value):,}"
    except (TypeError, ValueError):
        return "0"


def _file_count(run: Mapping[str, object]) -> int:
    parameters = run.get("parameters")
    if isinstance(parameters, Mapping) and "file_count" in parameters:
        try:
            return int(parameters.get("file_count"))
        except (TypeError, ValueError):
            pass
    artifacts = run.get("artifacts")
    return len(artifacts) if isinstance(artifacts, (list, tuple)) else 0


_KIND_LABELS = {
    "simulation": "模拟",
    "experiment": "实验",
    "analysis": "分析",
}
_STATUS_LABELS = {
    "running": "运行中",
    "completed": "已完成",
    "failed": "失败",
    "imported": "已导入",
}
_COVER_LABELS = {
    "model": "模型示意",
    "data": "数据预览",
    "fingerprint": "参数预览",
}


def _label(value: object, labels: Mapping[str, str], fallback: str) -> str:
    raw = _text(value, fallback)
    return labels.get(raw.lower(), raw)


def _href(value: object) -> str:
    """Escape a URL for an HTML attribute, without trusting its contents."""
    return _esc(value or "./")


def _cover_src(cover: object) -> str:
    if cover is None:
        return ""
    if isinstance(cover, str):
        # A controller may already have a local data URL.  It is still escaped
        # at the point of insertion; arbitrary strings are rendered as a blank
        # fallback rather than becoming a navigable resource.
        return cover if cover.startswith("data:image/") else ""
    if isinstance(cover, (bytes, bytearray, memoryview)):
        payload = base64.b64encode(bytes(cover)).decode("ascii")
        return f"data:image/png;base64,{payload}"
    return ""


def _query_value(context: Mapping[str, object], key: str) -> object:
    value = context.get(key)
    if isinstance(value, (list, tuple)):
        return value[0] if value else None
    return value


def browse_url(context: Mapping[str, object] | None = None, **changes: object) -> str:
    """Build a same-page browse link while retaining only browse context.

    ``catalog`` and ``project_dir`` come from the current context.  The three
    navigation keys (``pick``, ``up``, and ``fav``) are explicitly supplied by
    callers; ``None`` removes a key.  Other query parameters are discarded so
    widget state never leaks into card links.
    """
    source = context if isinstance(context, Mapping) else {}
    query: dict[str, str] = {}
    for key in ("catalog", "project_dir"):
        value = _query_value(source, key)
        if value not in (None, ""):
            query[key] = str(value)
    for key in ("pick", "up", "fav"):
        if key in changes and changes[key] not in (None, ""):
            value = changes[key]
            if isinstance(value, (list, tuple)):
                value = value[0] if value else ""
            query[key] = str(value)
    return "./?" + urlencode(query) if query else "./"


def header_html(home_url: str, fav_url: str, active: str = "home") -> str:
    """Return brand and navigation only; search/settings stay native widgets."""
    active = active if active in {"home", "favorites"} else "home"
    home_class = " rd-nav-active" if active == "home" else ""
    fav_class = " rd-nav-active" if active == "favorites" else ""
    return (
        "<header class='rd-header'>"
        f"<a class='rd-brand' href='{_href(home_url)}' target='_self' aria-label='研究数据首页'>"
        "<span class='rd-brand-mark' aria-hidden='true'>研</span><span>研究数据</span></a>"
        "<nav class='rd-nav' aria-label='主导航'>"
        f"<a class='rd-nav-link{home_class}' href='{_href(home_url)}' target='_self'>首页</a>"
        f"<a class='rd-nav-link{fav_class}' href='{_href(fav_url)}' target='_self'>收藏</a>"
        "</nav></header>"
    )


def hero_html(total: object, projects: object) -> str:
    if isinstance(projects, Mapping):
        project_count = len(projects)
    elif isinstance(projects, (str, bytes, bytearray)):
        project_count = 1 if projects else 0
    else:
        try:
            project_count = len(projects)  # type: ignore[arg-type]
        except TypeError:
            try:
                project_count = int(projects or 0)
            except (TypeError, ValueError):
                project_count = 0
    return (
        "<section class='rd-hero' aria-labelledby='rd-hero-title'>"
        "<div><p class='rd-kicker'>RESEARCH DATA CATALOG</p>"
        "<h1 id='rd-hero-title'>把每一次运行，整理成可复用的证据</h1>"
        "<p class='rd-hero-note'>本地数据目录 · 来源、参数与图形保持在同一条记录中</p></div>"
        "<div class='rd-hero-stats' aria-label='目录统计'>"
        f"<div><strong>{_count(total)}</strong><span>次运行</span></div>"
        f"<div><strong>{_count(project_count)}</strong><span>个项目</span></div>"
        "</div></section>"
    )


def section_html(title: str, subtitle: str = "") -> str:
    sub = f"<p class='rd-section-subtitle'>{_esc(subtitle)}</p>" if subtitle else ""
    return f"<div class='rd-section-heading'><h2>{_esc(title)}</h2>{sub}</div>"


def card_html(
    run: Mapping[str, object],
    cover: object,
    href: str,
    up_href: str,
    state: Mapping[str, object] | None = None,
    badge: str = "",
    mode: str = "none",
) -> str:
    title = _text(run.get("title"), "未命名运行")
    project = _text(run.get("project"), "未分类项目")
    description = _text(run.get("description"), "暂无说明")
    kind = _label(run.get("kind"), _KIND_LABELS, "运行")
    status = _label(run.get("execution_status"), _STATUS_LABELS, "未知状态")
    src = _cover_src(cover)
    image = (
        f"<img src='{_esc(src)}' alt='{_esc(title)}' loading='lazy'>"
        if src
        else "<div class='rd-cover-fallback' aria-hidden='true'><span>RD</span></div>"
    )
    state = state or {}
    favorite = bool(state.get("favorite"))
    favorite_label = "已收藏" if favorite else "未收藏"
    favorite_mark = "★" if favorite else "☆"
    action = ""
    if state:
        # Favorite state is displayed here; the controller owns the actual
        # state-changing widget, so this marker never creates a dead action.
        action = f"<span class='rd-card-favorite' aria-label='{favorite_label}' title='{favorite_label}'>{favorite_mark}</span>"
    count = _file_count(run)
    cover_label = _COVER_LABELS.get(str(mode).lower(), "") or badge
    badge_html = f"<span class='rd-badge'>{_esc(cover_label)}</span>" if cover_label else ""
    created = _text(run.get("created_at"), "")
    date = created[:10] if created else ""
    date_html = f"<span>{_esc(date)}</span>" if date else ""
    return (
        "<article class='rd-card'>"
        f"<div class='rd-cover'><a class='rd-cover-link' href='{_href(href)}' target='_self' aria-label='{_esc(title)}'>{image}{badge_html}</a></div>"
        "<div class='rd-card-body'>"
        f"<a class='rd-card-title-link' href='{_href(href)}' target='_self' aria-label='{_esc(title)}'><h3 class='rd-card-title'>{_esc(title)}</h3></a>"
        f"<p class='rd-card-description'>{_esc(description)}</p>"
        f"<div class='rd-card-meta'><span>{_esc(project)}</span><span>{_esc(kind)}</span></div>"
        "</div>"
        f"<div class='rd-card-foot'><a class='rd-project-link' href='{_href(up_href)}' target='_self' title='查看项目'>{_esc(project)}</a><span>{_esc(status)}</span>{date_html}<span>{_count(count)} 个文件</span></div>"
        f"{action}</article>"
    )


def ranking_html(
    runs: Iterable[Mapping[str, object]],
    hrefs: Mapping[str, str] | Iterable[str],
    title: str = "文件排行",
    subtitle: str = "按登记文件数排列",
) -> str:
    items = list(runs)
    links = hrefs if isinstance(hrefs, Mapping) else list(hrefs)
    rows: list[str] = []
    for index, run in enumerate(items, 1):
        rid = str(run.get("run_id", ""))
        href = links.get(rid, "./") if isinstance(links, Mapping) else (links[index - 1] if index - 1 < len(links) else "./")
        label = _text(run.get("title"), "未命名运行")
        project = _text(run.get("project"), "未分类项目")
        rows.append(
            f"<li><span class='rd-rank'>{index:02d}</span>"
            f"<a href='{_href(href)}' target='_self' title='{_esc(label)}'><strong>{_esc(label)}</strong>"
            f"<small>{_esc(project)} · {_count(_file_count(run))} 个文件</small></a></li>"
        )
    empty = "<li class='rd-ranking-empty'>暂无可排行的运行</li>" if not rows else ""
    return (
        "<section class='rd-ranking' aria-label='文件排行'>"
        f"<div class='rd-ranking-heading'><h2>{_esc(title)}</h2><p>{_esc(subtitle)}</p></div>"
        f"<ol>{''.join(rows)}{empty}</ol></section>"
    )


def detail_html(run: Mapping[str, object]) -> str:
    title = _text(run.get("title"), "未命名运行")
    description = _text(run.get("description"), "暂无说明")
    validation = run.get("validation")
    validation_status = validation.get("status", "未检查") if isinstance(validation, Mapping) else "未检查"
    parameters = run.get("parameters")
    if isinstance(parameters, Mapping):
        preview = json.dumps(parameters, ensure_ascii=False, indent=2, default=str)
    else:
        preview = "暂无参数"
    tags = run.get("tags")
    tags_text = " · ".join(str(tag) for tag in tags) if isinstance(tags, (list, tuple)) else _text(tags, "无标签")
    return (
        "<article class='rd-detail'>"
        f"<p class='rd-kicker'>{_esc(run.get('kind', '运行'))} · {_esc(run.get('run_id', ''))}</p>"
        f"<h1>{_esc(title)}</h1><p class='rd-detail-description'>{_esc(description)}</p>"
        "<dl class='rd-detail-facts'>"
        f"<div><dt>项目</dt><dd>{_esc(run.get('project', '未分类项目'))}</dd></div>"
        f"<div><dt>执行状态</dt><dd>{_esc(run.get('execution_status', '未知'))}</dd></div>"
        f"<div><dt>验证状态</dt><dd>{_esc(validation_status)}</dd></div>"
        f"<div><dt>文件数</dt><dd>{_count(_file_count(run))}</dd></div>"
        f"<div><dt>标签</dt><dd>{_esc(tags_text)}</dd></div>"
        "</dl>"
        "<details class='rd-parameters'><summary>参数预览</summary>"
        f"<pre>{_esc(preview)}</pre></details></article>"
    )


STYLES = """<style>
:root { --rd-blue:#00a1d6; --rd-pink:#fb7299; --rd-ink:#18191c; --rd-muted:#61666d; --rd-line:#e5e7eb; --rd-surface:#fff; --rd-bg:#f6f7f8; }
.stApp { background:var(--rd-bg); color:var(--rd-ink); }
.stApp header[data-testid="stHeader"], .stApp [data-testid="stDecoration"], .stApp [data-testid="stToolbar"], .stApp [data-testid="stDeployButton"], .stApp footer { display:none !important; }
[data-testid="stSidebar"] { display:none !important; }
[data-testid="stMainBlockContainer"] { margin:0 auto; max-width:1600px; padding:1rem 2rem 3rem !important; }
[class*="st-key-rd_header"], [class*="st-key-rd_toolbar"], [class*="st-key-rd_wall"], [class*="st-key-rd_sidebar"], [class*="st-key-rd_detail"] { min-width:0; }
.stApp .st-key-rd_workspaces { position:sticky; top:0; z-index:20; background:var(--rd-bg); padding:6px 0; border-bottom:1px solid var(--rd-line); }
.rd-proof-context { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:4px 2px; }
.stApp .rd-proof-context h1 { font-size:23px !important; line-height:1.3 !important; padding:0 !important; margin:4px 0 !important; color:var(--rd-ink); }
.rd-proof-project { font-size:12px; color:var(--rd-blue); }
.rd-proof-context p,.rd-proof-origin { font-size:13px; color:var(--rd-muted); margin:4px 0; }
.rd-proof-state { display:flex; flex-wrap:wrap; gap:6px; justify-content:flex-end; font-size:12px; color:var(--rd-muted); }
.rd-proof-state span { background:#fff; border:1px solid var(--rd-line); border-radius:20px; padding:5px 10px; white-space:nowrap; }
.stApp .st-key-rd_proof_workspace { background:var(--rd-surface); border:1px solid var(--rd-line); border-radius:14px; padding:12px; min-width:0; }
.st-key-rd_proof_workspace [role="tablist"] { gap:6px; }
.st-key-rd_proof_workspace [role="tab"] { color:var(--rd-muted); padding:8px 14px; }
.st-key-rd_proof_workspace [role="tab"][aria-selected="true"] { color:var(--rd-blue); background:#edf9fd; border-radius:8px 8px 0 0; }
.st-key-rd_proof_workspace .react-aria-SelectionIndicator { background:var(--rd-blue) !important; }
.st-key-rd_proof_workspace button[kind="primary"], .st-key-rd_proof_workspace button[kind="primaryFormSubmit"] { background:var(--rd-blue); border-color:var(--rd-blue); }
.st-key-rd_proof_workspace iframe { border:1px solid var(--rd-line); border-radius:8px; background:#fff; }
@media(max-width:650px) { .rd-proof-context { align-items:flex-start; flex-direction:column; gap:6px; }.rd-proof-state { justify-content:flex-start; }.stApp .st-key-rd_proof_workspace { padding:8px; }.st-key-rd_proof_workspace [role="tab"] { padding:7px 10px; } }
.rd-shell { color:var(--rd-ink); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif; overflow-wrap:anywhere; }
.stApp .rd-shell h1,.stApp .rd-shell h2,.stApp .rd-shell h3,.stApp .rd-shell p { margin-block-start:0 !important; }
.stApp .rd-shell h1,.stApp .rd-shell h2,.stApp .rd-shell h3 { color:var(--rd-ink) !important; font-family:inherit !important; font-weight:700 !important; padding:0 !important; }
.stApp .rd-shell a { text-decoration:none !important; }
.stApp [class*="st-key-rd_header"] input, .stApp [class*="st-key-rd_toolbar"] input, .stApp [class*="st-key-rd_header"] textarea, .stApp [class*="st-key-rd_toolbar"] textarea, .stApp [class*="st-key-rd_header"] [data-baseweb="select"] > div, .stApp [class*="st-key-rd_toolbar"] [data-baseweb="select"] > div { border-color:var(--rd-line); border-radius:8px; }
.stApp [class*="st-key-rd_header"] input:focus, .stApp [class*="st-key-rd_toolbar"] input:focus, .stApp [class*="st-key-rd_header"] textarea:focus, .stApp [class*="st-key-rd_toolbar"] textarea:focus, .stApp [class*="st-key-rd_header"] [data-baseweb="select"] > div:focus-within, .stApp [class*="st-key-rd_toolbar"] [data-baseweb="select"] > div:focus-within { border-color:var(--rd-blue); box-shadow:0 0 0 2px rgba(0,161,214,.16); }
.stApp [class*="st-key-rd_header"] button, .stApp [class*="st-key-rd_toolbar"] button { border-radius:8px; transition:background-color .18s ease,border-color .18s ease,color .18s ease; }
.stApp [class*="st-key-rd_header"] button[kind="primary"], .stApp [class*="st-key-rd_toolbar"] button[kind="primary"] { background:var(--rd-blue); border-color:var(--rd-blue); }
.stApp [class*="st-key-rd_header"] button[kind="primary"]:hover, .stApp [class*="st-key-rd_header"] button[kind="primary"]:focus-visible, .stApp [class*="st-key-rd_toolbar"] button[kind="primary"]:hover, .stApp [class*="st-key-rd_toolbar"] button[kind="primary"]:focus-visible { background:#008dbd; border-color:#008dbd; }
.stApp [class*="st-key-rd_header"] button:focus-visible, .stApp [class*="st-key-rd_toolbar"] button:focus-visible, .stApp .rd-shell a:focus-visible { outline:3px solid rgba(0,161,214,.28); outline-offset:2px; }
.stApp [data-testid="stPills"] button[aria-checked="true"], .stApp [data-testid="stPills"] button[aria-pressed="true"], .stApp [data-testid="stPills"] button[data-selected="true"] { background:var(--rd-pink) !important; border-color:var(--rd-pink) !important; color:#fff !important; }
.rd-header { align-items:center; display:flex; gap:28px; justify-content:space-between; min-height:52px; }
.stApp .rd-brand,.stApp .rd-nav-link,.stApp .rd-card-link,.stApp .rd-card-favorite,.stApp .rd-ranking a { color:inherit !important; text-decoration:none !important; }
.rd-brand { align-items:center; display:flex; font-size:18px; font-weight:750; gap:9px; letter-spacing:.01em; }
.rd-brand-mark { align-items:center; background:linear-gradient(145deg,var(--rd-pink),#ff9abb); border-radius:9px; color:#fff; display:inline-flex; height:31px; justify-content:center; width:31px; }
.rd-nav { display:flex; gap:20px; margin-left:auto; }
.rd-nav-link { color:var(--rd-muted); font-size:14px; padding:17px 2px 13px; }
.rd-nav-link:hover,.rd-nav-link:focus-visible,.rd-nav-active { color:var(--rd-blue); }
.rd-nav-active { border-bottom:2px solid var(--rd-blue); }
.rd-hero { align-items:center; background:linear-gradient(110deg,#e9f8fc 0%,#fff 55%,#fff0f5 100%); border:1px solid #d9eef4; border-radius:16px; display:flex; justify-content:space-between; margin:10px 0 22px; min-height:102px; overflow:hidden; padding:20px 26px; position:relative; }
.rd-hero:after { background:var(--rd-pink); border-radius:50%; content:""; height:170px; opacity:.08; position:absolute; right:-38px; top:-66px; width:170px; }
.rd-kicker { color:var(--rd-blue); font-size:11px; font-weight:800; letter-spacing:.12em; margin:0 0 6px; }
.stApp .rd-hero h1 { color:var(--rd-ink) !important; font-size:22px !important; letter-spacing:-.02em; line-height:1.25 !important; margin:0 !important; max-width:42rem; padding:0 !important; }
.rd-hero-note,.rd-section-subtitle { color:var(--rd-muted); font-size:12px; margin:7px 0 0; }
.rd-hero-stats { display:flex; gap:30px; padding-right:4px; position:relative; z-index:1; }
.rd-hero-stats div { display:flex; flex-direction:column; text-align:right; }
.rd-hero-stats strong { color:var(--rd-blue); font-size:24px; line-height:1.1; }
.rd-hero-stats span { color:var(--rd-muted); font-size:12px; margin-top:4px; }
.rd-section-heading { align-items:baseline; display:flex; gap:14px; margin:14px 0 12px; }
.stApp .rd-section-heading h2,.stApp .rd-ranking-heading h2 { color:var(--rd-ink) !important; font-size:18px !important; line-height:1.35 !important; margin:0 !important; padding:0 !important; }
.rd-section-heading .rd-section-subtitle { margin:0; }
.stApp .st-key-rd_detail .rd-section-heading h2 { flex-shrink:0; white-space:nowrap; }
.stApp .st-key-rd_data_nav { background:#f7f9fa; border:1px solid var(--rd-line); border-radius:10px; padding:12px; }
.stApp .st-key-rd_data_nav [data-testid="stRadio"] label { align-items:flex-start; border-radius:7px; padding:8px 4px; }
.stApp .st-key-rd_data_nav [data-testid="stRadio"] label:hover { background:#e7f5fa; }
.stApp .st-key-rd_data_nav [data-testid="stRadio"] p { font-size:13px; overflow-wrap:anywhere; }
.stApp .st-key-rd_data_nav [data-testid="stCaptionContainer"] p { font-size:11px; }
.stApp .st-key-rd_data_view { min-width:0; }
.stApp .st-key-rd_data_view [data-testid="stTabs"] button { font-size:12px; }
.stApp .st-key-rd_data_view [data-testid="stCaptionContainer"] p { overflow-wrap:anywhere; }
.rd-card-grid { display:grid; gap:18px; grid-template-columns:repeat(4,minmax(0,1fr)); }
.rd-card { background:var(--rd-surface); border:1px solid var(--rd-line); border-radius:12px; box-shadow:0 2px 10px rgba(24,25,28,.035); min-width:0; overflow:hidden; position:relative; transition:box-shadow .18s ease,transform .18s ease; }
.rd-card:hover,.rd-card:focus-within { box-shadow:0 8px 24px rgba(24,25,28,.11); transform:translateY(-2px); }
.rd-cover { aspect-ratio:16/9; background:#edf1f3; overflow:hidden; position:relative; }
.stApp .rd-cover-link { display:block; height:100%; }
.rd-cover img { display:block; height:100%; object-fit:cover; width:100%; }
.rd-cover-fallback { align-items:center; background:linear-gradient(135deg,#dff5fb,#ffdfe9); color:#fff; display:flex; font-size:32px; font-weight:800; height:100%; justify-content:center; letter-spacing:.08em; }
.rd-cover-fallback span { opacity:.8; text-shadow:0 2px 8px rgba(24,25,28,.15); }
.rd-badge { background:rgba(24,25,28,.74); border-radius:5px; bottom:8px; color:#fff; font-size:11px; left:8px; padding:3px 7px; position:absolute; }
.rd-card-body { padding:11px 12px 12px; }
.stApp .rd-card-grid .rd-card-title { color:var(--rd-ink) !important; display:-webkit-box; font-size:15px !important; font-weight:650 !important; line-height:1.4 !important; margin:0 0 5px !important; min-height:42px; overflow:hidden; padding:0 !important; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.stApp .rd-card-grid .rd-card-description { color:var(--rd-muted) !important; display:-webkit-box; font-size:12px !important; line-height:1.45 !important; margin:0 0 9px !important; min-height:35px; overflow:hidden; padding:0 !important; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.rd-card-meta,.rd-card-foot { align-items:center; color:var(--rd-muted); display:flex; font-size:11px; gap:8px; justify-content:space-between; overflow:hidden; }
.rd-card-meta span:first-child,.rd-card-meta a { color:var(--rd-blue); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.stApp .rd-card-meta a:hover,.stApp .rd-card-meta a:focus-visible { color:#008dbd; text-decoration:underline !important; }
.rd-card-foot { border-top:1px solid #f0f1f2; margin-top:8px; padding-top:8px; }
.stApp .rd-card-foot .rd-project-link { color:var(--rd-blue) !important; flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.stApp .rd-card-foot .rd-project-link:hover,.stApp .rd-card-foot .rd-project-link:focus-visible { color:#008dbd !important; text-decoration:underline !important; }
.rd-card-favorite { color:var(--rd-pink); font-size:21px; line-height:1; padding:9px; position:absolute; right:2px; top:2px; }
.rd-card-favorite:hover,.rd-card-favorite:focus-visible { color:#e94f7c; }
.rd-ranking { background:var(--rd-surface); border:1px solid var(--rd-line); border-radius:12px; padding:16px; }
.rd-ranking-heading { border-bottom:1px solid #f0f1f2; padding-bottom:12px; }
.rd-ranking-heading p { color:var(--rd-muted); font-size:12px; margin:4px 0 0; }
.rd-ranking ol { list-style:none; margin:7px 0 0; padding:0; }
.rd-ranking li { align-items:center; display:flex; gap:11px; padding:9px 0; }
.rd-rank { color:#aeb3b9; font-size:12px; font-variant-numeric:tabular-nums; width:20px; }
.rd-ranking li:nth-child(-n+3) .rd-rank { color:var(--rd-pink); font-weight:800; }
.rd-ranking li a { display:flex; flex:1; flex-direction:column; min-width:0; }
.rd-ranking strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rd-ranking small { color:var(--rd-muted); font-size:11px; margin-top:3px; }
.rd-ranking a:hover strong,.rd-ranking a:focus-visible strong { color:var(--rd-blue); }
.rd-ranking-empty { color:var(--rd-muted); font-size:12px; padding:12px 0; }
.rd-detail { background:var(--rd-surface); border:1px solid var(--rd-line); border-radius:14px; padding:24px; }
.stApp .rd-detail h1 { color:var(--rd-ink) !important; font-size:26px !important; letter-spacing:-.025em; line-height:1.3 !important; margin:0 0 8px !important; padding:0 !important; }
.stApp .rd-back { align-items:center; color:var(--rd-blue) !important; display:inline-flex; font-size:13px; gap:5px; margin:0 0 12px; padding:4px 0; }
.stApp .rd-back:hover,.stApp .rd-back:focus-visible { color:#008dbd !important; text-decoration:underline !important; }
.stApp .rd-detail .rd-kicker { font-size:11px !important; margin:0 0 8px !important; overflow-wrap:anywhere; }
.stApp .rd-detail-description { color:var(--rd-muted); font-size:14px !important; line-height:1.6; margin:0; max-width:72ch; }
.rd-detail-facts { display:grid; gap:10px 20px; grid-template-columns:repeat(5,minmax(0,1fr)); margin:16px 0; }
.rd-detail-facts div { border-top:1px solid var(--rd-line); padding-top:9px; }
.rd-detail-facts dt { color:var(--rd-muted); font-size:11px; }
.rd-detail-facts dd { font-size:13px; margin:3px 0 0; overflow-wrap:anywhere; }
.rd-parameters { border-top:1px solid var(--rd-line); padding-top:12px; }
.rd-parameters summary { color:var(--rd-blue); cursor:pointer; font-size:13px; }
.rd-parameters pre { background:#f7f8f9; border-radius:8px; font-size:11px; max-height:280px; overflow:auto; padding:12px; white-space:pre-wrap; }
@media (max-width:1100px) { .rd-card-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } .rd-detail-facts { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media (max-width:760px) { [data-testid="stMainBlockContainer"] { padding:1rem 1rem 2rem !important; } [class*="st-key-rd_header"] [data-testid="stHorizontalBlock"], [class*="st-key-rd_toolbar"] [data-testid="stHorizontalBlock"] { flex-wrap:wrap; } [class*="st-key-rd_header"] [data-testid="stColumn"], [class*="st-key-rd_toolbar"] [data-testid="stColumn"] { flex:1 1 100% !important; min-width:0 !important; } .rd-card-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .rd-hero { align-items:flex-start; flex-direction:column; gap:16px; } .rd-hero-stats { gap:22px; } .rd-hero-stats div { text-align:left; } }
@media (max-width:470px) { .rd-card-grid { grid-template-columns:1fr; } .rd-header { gap:12px; } .rd-nav { gap:12px; } .rd-hero { padding:18px; } .rd-hero h1 { font-size:19px; } .rd-detail-facts { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto !important; transition-duration:.01ms !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; } }
</style>"""

