"""Dataset articles: readable explanations and explicit documented submission."""
from __future__ import annotations

import base64
import copy
import hashlib
import html
import io
import json
import re

from .catalog import _inside


def managed_image(catalog, run, artifact_id):
    from PIL import Image
    artifact = next((a for a in run['artifacts'] if a['artifact_id'] == artifact_id), None)
    if artifact is None:
        raise ValueError('插图必须引用当前数据中已登记的文件。')
    path = _inside(catalog.root / 'runs' / run['run_id'], artifact['path'])
    data = path.read_bytes()
    if hashlib.sha256(data).hexdigest() != artifact['sha256']:
        raise ValueError('插图字节与登记哈希不一致。')
    with Image.open(io.BytesIO(data)) as image:
        if image.format not in {'PNG', 'JPEG'}:
            raise ValueError('文章插图使用 PNG 或 JPEG；请先导出并登记图片。')
        mime = 'image/png' if image.format == 'PNG' else 'image/jpeg'
        image.verify()
    return artifact, f'data:{mime};base64,' + base64.b64encode(data).decode('ascii')


def _paragraphs(text):
    return ''.join('<p>' + html.escape(part).replace('\n', '<br>') + '</p>'
                   for part in re.split(r'\n\s*\n', text) if part.strip())


def article_html(catalog, run, article, *, font='Georgia', size=17, layout='single'):
    """Self-contained HTML; text is escaped and images come from managed bytes."""
    from .math_render import render_equation
    fonts = {'Georgia', 'Times New Roman', 'Arial'}
    if font not in fonts or not 12 <= size <= 24 or layout not in {'single', 'double'}:
        raise ValueError('invalid article reading style')
    sections = []
    for field, label in [('summary', '摘要'), ('methods', '方法与参数'), ('results', '结果与讨论'), ('limitations', '限制与验证范围')]:
        sections.append(f'<section><h2>{label}</h2>{_paragraphs(article.get(field, ""))}</section>')
    equations = []
    for i, eq in enumerate(article.get('equations', []), 1):
        rendered = render_equation(eq['latex'], fontsize=size * .75)
        width_px = rendered.width * 96 / rendered.dpi
        equations.append(f'<figure class="equation"><img style="width:{width_px:.1f}px" src="{rendered.png_data_url}" alt="{html.escape(eq["latex"], quote=True)}"><figcaption>式 {i} · {html.escape(eq["description"])}</figcaption></figure>')
    if not equations:
        equations.append(_paragraphs(article.get('equation_note', '')))
    sections.insert(2, '<section><h2>数学公式</h2>' + ''.join(equations) + '</section>')
    figures = []
    for i, item in enumerate(article.get('figures', []), 1):
        artifact, image = managed_image(catalog, run, item['artifact_id'])
        figures.append(f'<figure><img src="{image}" alt="{html.escape(item["caption"], quote=True)}"><figcaption>图 {i} · {html.escape(item["caption"])}<br><small>{html.escape(artifact["original_name"])} · SHA-256 {artifact["sha256"]}</small></figcaption></figure>')
    if not figures:
        figures.append(_paragraphs(article.get('figure_note', '')))
    sections.insert(4, '<section><h2>插图</h2>' + ''.join(figures) + '</section>')
    by_id = {a['artifact_id']: a for a in run['artifacts']}
    datasets = []
    for item in article.get('datasets', []):
        artifact = by_id.get(item['artifact_id'], {})
        datasets.append(f'<section><h3>{html.escape(artifact.get("original_name", item["artifact_id"]))}</h3>{_paragraphs(item["description"])}<p class="variables">{html.escape(item["variables"])}</p><small>Artifact {html.escape(item["artifact_id"])} · SHA-256 {html.escape(artifact.get("sha256", "未登记"))}</small></section>')
    sections.append('<section><h2>数据文件与变量</h2>' + ''.join(datasets) + '</section>')
    if article.get('references'):
        sections.append('<section><h2>参考资料</h2>' + ''.join(_paragraphs(value) for value in article['references']) + '</section>')
    provenance = run.get('provenance') or {}
    provenance_text = f"Run {run['run_id']} · Git {provenance.get('git_commit') or 'unknown'} · branch {provenance.get('git_branch') or 'unknown'}"
    if provenance.get('git_dirty'):
        provenance_text += ' · 含未提交改动，以登记源码快照为准'
    parameters = html.escape(json.dumps(run.get('parameters', {}), ensure_ascii=False, indent=2))
    author = html.escape('; '.join(article.get('authors', [])))
    title = html.escape(article.get('title') or run['title'])
    return f'''<!doctype html><html lang="zh"><meta charset="utf-8"><style>
    .rd-article-reader{{color:#1e2730;font-family:"{font}",serif;font-size:{size}px;line-height:1.65;max-width:940px;margin:18px auto;padding:38px;background:white;border:1px solid #dce3e9;border-radius:8px}}
    .rd-article-reader h1{{font:inherit;font-size:1.8em;line-height:1.3;font-weight:bold;margin:0 0 12px}}
    .rd-article-reader h2{{font:inherit;font-weight:bold;font-size:1.15em;margin:26px 0 10px}}.rd-article-reader h3{{font:inherit;font-weight:bold}}
    .rd-article-reader p{{font:inherit;margin:0 0 14px}}
    .rd-article-reader header p,.rd-article-reader figcaption,.rd-article-reader small,.rd-article-reader .article-provenance{{color:#65737f;font-size:.8em}}
    .rd-article-reader img{{display:block;max-width:100%;height:auto;margin:auto}}
    .rd-article-reader figure{{margin:20px 0;break-inside:avoid}}
    .rd-article-reader .equation img{{max-height:130px}}.rd-article-reader figcaption{{margin-top:10px}}.rd-article-reader section{{overflow-wrap:anywhere}}
    .rd-article-reader.double .prose{{column-count:2;column-gap:30px}}.rd-article-reader .prose section{{break-inside:auto}}
    .rd-article-reader pre{{white-space:pre-wrap;font-size:.8em}}
    .rd-article-reader .article-provenance{{border-top:1px solid #dce3e9;margin-top:24px;padding-top:14px}}
    @media(max-width:650px){{.rd-article-reader{{margin:0;padding:20px}}.rd-article-reader.double .prose{{column-count:1}}}}
    </style><article class="rd-article-reader {layout}"><header><h1>{title}</h1><p>{author}</p><p>{html.escape(provenance_text)}</p></header><div class="prose">{''.join(sections)}</div><div class="article-provenance"><b>登记参数</b><pre>{parameters}</pre>{html.escape(provenance_text)}<br>原始数据、执行状态与科学验证状态在来源面板中查看。</div></article></html>'''


def apply_to_proof(catalog, run_id):
    from .articles import ArticleStore, proof_document
    from .proofs import ProofStore
    articles = ArticleStore(catalog.root)
    state = articles.status(run_id)
    if state['status'] != 'submitted':
        raise ValueError('请先提交当前数据文章，再同步到校样草稿。')
    check = articles.check(run_id)
    if not check['ok']:
        raise ValueError('文章或输入完整性检查失败：' + '; '.join(check['errors']))
    saved = articles.draft(run_id)
    proofs = ProofStore(catalog.root)
    draft = proofs.draft(run_id)
    if draft is None:
        raise ValueError('先在图形编辑中从数据图创建草稿，再同步文章。')
    run = catalog.get(run_id)
    payload = copy.deepcopy(draft)
    document = proof_document(saved['article'])
    document['layout'] = draft['document'].get('layout', 'single')
    document['caption'] = draft['document'].get('caption', '')
    document.pop('figures', None)
    document['illustrations'] = []
    inputs = {(item['run_id'], item['artifact_id']): item for item in payload['inputs']}
    for item in saved['article']['datasets']:
        artifact = next(a for a in run['artifacts'] if a['artifact_id'] == item['artifact_id'])
        document['body'] = document['body'].replace('- ' + artifact['artifact_id'] + ':',
            '- ' + artifact['original_name'] + ' [' + artifact['artifact_id'][:8] + ']:')
        inputs[run_id, artifact['artifact_id']] = {'run_id': run_id, 'artifact_id': artifact['artifact_id'], 'sha256': artifact['sha256']}
    for item in saved['article']['figures']:
        artifact, image = managed_image(catalog, run, item['artifact_id'])
        elements = list(payload['scene']['elements'].values())
        source_image = elements[0].get('properties', {}).get('src') if len(elements) == 1 and elements[0].get('type') == 'image' else None
        # An unchanged single-image scene already presents the article figure.
        if source_image == image or payload.get('assets', {}).get(source_image) == image:
            document['caption'] = item['caption']
        else:
            document['illustrations'].append({'image': image, 'caption': item['caption'], 'artifact_id': artifact['artifact_id'], 'run_id': run_id, 'sha256': artifact['sha256']})
        inputs[run_id, artifact['artifact_id']] = {'run_id': run_id, 'artifact_id': artifact['artifact_id'], 'sha256': artifact['sha256']}
    document['article_provenance'] = {'revision_id': state['revision_id'], 'draft_sha256': saved['sha256']}
    payload['document'] = document
    payload['inputs'] = list(inputs.values())
    return proofs.save_draft(run_id, payload, expected_hash=draft['hash'])


def render(st, catalog, run, *, embedded=False):
    import pandas as pd
    from .articles import ArticleStore, data_artifacts
    store = ArticleStore(catalog.root)
    rid = run['run_id']
    prefix = f'article_{rid}_' + ('embedded_' if embedded else '')
    saved = store.draft(rid)
    article = copy.deepcopy(saved['article'] if saved else store.template(rid))
    state = store.status(rid)
    status = {'draft': '待补充文章 / 尚未提交', 'stale': '文章或输入有更新 / 需要重新提交', 'submitted': '文章已提交'}[state['status']]
    st.caption(f'数据文章 · {status}' + (f" · 版本 {state['revision_id'][:8]}" if state.get('revision_id') else ''))
    notice = st.session_state.pop(prefix + 'notice', None)
    if notice:
        st.success(notice)
    reading, editing = st.tabs(['阅读文章', '编写与提交'])
    with reading:
        if saved is None:
            st.info('此数据尚未提交文章说明。到「编写与提交」填写方法、结果和数据含义；公式与插图提供内容或适用性说明。')
        else:
            controls = st.columns(3)
            font = controls[0].selectbox('文章字体', ['Georgia', 'Times New Roman', 'Arial'], key=prefix + 'font')
            size = controls[1].number_input('文章字号', 12, 24, 17, key=prefix + 'size')
            layout = controls[2].selectbox('阅读版式', ['single', 'double'], format_func=lambda value: '单栏' if value == 'single' else '双栏', key=prefix + 'layout')
            try:
                rendered = article_html(catalog, run, article, font=font, size=size, layout=layout)
                st.html(rendered)
                st.download_button('下载文章 HTML', rendered, file_name=f'{rid}-article.html', mime='text/html', key=prefix + 'html')
            except Exception as exc:
                st.error(f'文章预览需要修正：{exc}')
            st.download_button('下载文章 JSON', json.dumps(article, ensure_ascii=False, indent=2), file_name=f'{rid}-article.json', mime='application/json', key=prefix + 'json')
            if state['status'] == 'submitted' and st.button('同步文章到校样草稿', key=prefix + 'proof'):
                try:
                    apply_to_proof(catalog, rid)
                    st.session_state[prefix + 'notice'] = '文章、公式与插图已同步；进入图形编辑生成新的校样版本。'
                    st.rerun()
                except Exception as exc:
                    st.error(str(exc))
    with editing:
        st.caption('保存草稿允许未填完；正式提交将检查每个数据文件的说明、文章必填项及输入完整性。')
        version = saved['sha256'][:12] if saved else 'new'
        key = prefix + version
        with st.form(key + '_form'):
            updated = copy.deepcopy(article)
            updated['title'] = st.text_input('数据文章标题', article.get('title') or run['title'])
            updated['authors'] = [value.strip() for value in st.text_input('文章作者（分号分隔）', '; '.join(article.get('authors', []))).split(';') if value.strip()]
            for field, label in [('summary', '研究摘要 / 数据用途'), ('methods', '方法、模型与参数含义'), ('results', '结果、观察与解释'), ('limitations', '限制、未知项与验证范围')]:
                updated[field] = st.text_area(label, article.get(field, ''), height=100)
            entries = {item['artifact_id']: item for item in article.get('datasets', [])}
            updated['datasets'] = []
            with st.expander('每个数据文件的说明', expanded=True):
                for artifact in data_artifacts(run):
                    item = entries.get(artifact['artifact_id'], {})
                    st.markdown(f"**{artifact['original_name']}** · `{artifact['artifact_id'][:8]}`")
                    description = st.text_area('数据含义与用途', item.get('description', ''), key=key + artifact['artifact_id'] + '_description')
                    variables = st.text_area('变量、单位、坐标与采集顺序', item.get('variables', ''), key=key + artifact['artifact_id'] + '_variables')
                    updated['datasets'].append({'artifact_id': artifact['artifact_id'], 'description': description, 'variables': variables})
            with st.expander('数学公式与插图', expanded=True):
                equation_table = pd.DataFrame(article.get('equations', []), columns=['latex', 'description']).astype('string')
                equations = st.data_editor(equation_table, num_rows='dynamic', key=key + '_equations', column_config={'latex': st.column_config.TextColumn('LaTeX 公式（不含 $）'), 'description': st.column_config.TextColumn('符号与公式含义')})
                updated['equations'] = _rows(equations, ['latex', 'description'])
                updated['equation_note'] = st.text_input('未使用公式时的适用性说明', article.get('equation_note', ''))
                options = {a['artifact_id']: a['original_name'] + ' · ' + a['artifact_id'][:8] for a in run['artifacts'] if a.get('role') == 'figure' or a['original_name'].lower().endswith(('.png', '.jpg', '.jpeg'))}
                rows = [{'file': options.get(item['artifact_id'], item['artifact_id']), 'caption': item['caption']} for item in article.get('figures', [])]
                figure_table = pd.DataFrame(rows, columns=['file', 'caption']).astype('string')
                figures = st.data_editor(figure_table, num_rows='dynamic', key=key + '_figures', column_config={'file': st.column_config.SelectboxColumn('已登记的 PNG/JPEG 插图', options=list(options.values())), 'caption': st.column_config.TextColumn('图注与读图说明')})
                reverse = {value: key for key, value in options.items()}
                updated['figures'] = [{'artifact_id': reverse.get(item['file'], item['file']), 'caption': item['caption']} for item in _rows(figures, ['file', 'caption'])]
                updated['figure_note'] = st.text_input('未使用插图时的适用性说明', article.get('figure_note', ''))
            updated['references'] = [value.strip() for value in st.text_area('参考资料（每行一条）', '\n'.join(article.get('references', []))).splitlines() if value.strip()]
            save = st.form_submit_button('保存数据文章草稿')
            submit = st.form_submit_button('提交数据与文章', type='primary')
            if save or submit:
                try:
                    result = store.save(rid, updated, expected_hash=saved['sha256'] if saved else None)
                    if submit:
                        receipt = store.submit(rid, expected_hash=result['sha256'])
                        st.session_state[prefix + 'notice'] = f"数据文章已正式提交 · 版本 {receipt['revision_id'][:8]}"
                    else:
                        st.session_state[prefix + 'notice'] = '数据文章草稿已保存；正式提交仍需通过完整性检查。'
                    st.rerun()
                except Exception as exc:
                    st.error(f'未提交：{exc}')
        if st.button('检查文章提交条件', key=prefix + 'check'):
            check = store.check(rid)
            if check['ok']:
                st.success('文章必填项和当前输入完整性检查通过，可以提交。')
            else:
                for error in check['errors']:
                    st.error(error)


def _rows(value, columns):
    import pandas as pd
    if hasattr(value, 'to_dict'):
        rows = value.to_dict('records')
    elif isinstance(value, dict):
        rows = [dict(zip(columns, items)) for items in zip(*(value.get(column, []) for column in columns))]
    else:
        rows = value
    clean = [{column: '' if item.get(column) is None or pd.isna(item.get(column)) else str(item[column]) for column in columns} for item in rows]
    return [item for item in clean if any(item.values())]
