# 编辑与校样

数据详情页的“工作区 编辑与校样”把当前数据图交给内置的 Three Interact 编辑器。点击“从当前数据图创建草稿”，然后在编辑器中移动或添加标签、形状、图片、组件和 3D 视口。编辑器随软件打包，运行时不需要 VS Code、Node 或单独的 Three Interact 服务。

绘图工作区先决定数据轴、字体、字号、图例和面板布局，再把图送入校样编辑器。原始图的像素是底图；矢量叠加层和组件可编辑，可导出 SVG 和期刊校样 HTML/PDF。底图中的原始曲线点和数据值不在校样编辑器中直接改写，编辑叠加层不会改写输入文件或绘图 recipe。

在“文章内容与排版”中填写标题、作者、摘要、正文和图注，选择 `single` 或 `double`。点击“保存并生成校样”时，浏览器会把当前场景、资源、编辑历史、组件版本和对应 PNG 一起提交。保存的草稿位于 catalog 的 `proofs/<run-id>/draft.json`；一次发布产生一个新的不可变 revision。

每个 revision 包含 `report.html`、`report.pdf`、`scene.json`、`document.json`、`assets.json`、`recipe.json`、`figure.png` 和 manifest，并可包含 Three Interact vendor 快照。输入运行、artifact SHA-256、生成源码和编辑器身份都冻结在 revision 中。单栏和双栏是通用的期刊校样版式。

评论必须带精确锚点：`document`、`title`、`abstract`、`body`、`caption`、`figure` 或 `element:UUID`。回复使用同一个 revision 和父评论 ID。评论只记录本地编辑意见，不改变数据完整性或科学验证状态，也不会自动发送消息或调度 agent。

![双栏校样示例](proof-example.png)

可直接下载这个合成数据示例的 [PDF](proof-example.pdf) 或打开 [HTML](proof-example.html)。被底图遮住的标注可选中后点击“置于顶层”；保存和重新载入会保留图层顺序。

开发时可在安装了 Plotly 的包环境中执行 `node scripts/vendor-three-interact.mjs ../three-interact`，从兄弟项目重新构建编辑器，并记录上游 Git 版本、资产哈希和许可证。可用 `RESEARCH_DATA_PYTHON` 指定维护用 Python 路径。普通用户使用已打包资产即可。

## Agent CLI

先让实际安装的 parser 给出当前选项：

```powershell
research-data help proof --json
research-data guide proof --json
```

读取草稿并保存到文件，结果中记录 `hash`：

```powershell
research-data proof show --run-id RUN_ID --output draft.json
research-data proof save --run-id RUN_ID --draft draft.json --expected-hash DRAFT_HASH
```

`save` 使用乐观哈希，避免覆盖另一个编辑者刚保存的草稿。发布时必须提供与当前场景对应的 PNG；如果草稿没有当前图，`--figure` 是必需的：

```powershell
research-data proof publish --run-id RUN_ID --draft draft.json --figure matching.png
```

查看 revision、评论和完整性：

```powershell
research-data proof list --run-id RUN_ID
research-data proof comments --run-id RUN_ID --revision REVISION_ID
research-data proof check --run-id RUN_ID --revision REVISION_ID
```

添加图注评论、元素评论和回复：

```powershell
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor caption --text "请说明误差条来源。"
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor element:UUID --text "保持该标签与结点对齐。"
research-data proof comment --run-id RUN_ID --revision REVISION_ID --anchor figure --text "已复核校样。" --reply-to COMMENT_ID
```

校样功能由 `ui` extra 提供 ReportLab PDF；Plotly 导入和 Three Interact 已随浏览器界面打包，不需要额外的 Chrome、VS Code 或 Node 服务。校样版式直接生成 HTML/PDF，不要求 LaTeX。发布会在本地建立新的 analysis run，保留源运行、输入 artifact SHA-256、编辑器和源码快照。它不会把数据或校样发布到 GitHub；原始运行和旧 revision 保持不变。
