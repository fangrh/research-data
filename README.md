# ResearchData

直接在界面选择九种风格、字体/字号、线宽、网格和图例，并保存可复用配方。
在科学项目中运行 `research-data project init`，将数据映射与多面板绘图结构保存为
`research-data.project.json`。`research-data open --project-dir PATH` 打开对应模板。
用户和 agent 使用同一套配置，模板和输入数据分别保留源码/Git 来源。
详见 [项目模板与可视化编辑](docs/PROJECT_TEMPLATES.md)。

实验与计算共用的本地科研数据管理软件：**数据 → 描述与分类 → 生成时的源码/Git → 可复用绘图 → 图的输入与配方**。

这是**本地 Web 应用**，浏览器负责查看与绘图，数据保存在你的电脑。Windows
双击 `Start-ResearchData.cmd` 即可安装并打开；环境准备好后，CMD 一行
`research-data.cmd open` 即可打开，重复执行会复用同一数据目录的后台服务。

ResearchData 借鉴 QCoDeS 的实验/run、参数、数据集与来源记录方式，并使用 QCoDeS 官方接口读取真实数据集。它是独立实现的目录和绘图层；仪器采集仍可交给 QCoDeS，计算仍使用你已有的 Python、Julia 或其他程序。

![ResearchData browser](docs/bilibili-home.png)

首页采用蓝粉配色、分区标签和封面卡片；点击卡片进入独立详情页，直接看数据预览、
运行说明和源码来源。搜索框固定在顶部，目录管理和导入收进“管理 / 导入”。
“推荐”按项目均衡展示，也可切换最新、最早和文件数排序。详见 [浏览界面](docs/BROWSING.md)。

## 功能

- 图形编辑：曲线、每个位点、坐标刻度、文字、图例和热图单元格可独立选取、修改、撤销与保存；保留原始数据及绘图配方。[说明与旧草稿升级](docs/editable-plots.md)。
- 每次运行保存详细说明、project、sample、kind、tags、键值分类、参数、所属任务和父数据集。
- 卡片浏览：项目分区、全文搜索、收藏、分页与文件排行；大目录（>300 运行）使用“加入对比”篮。
  SQLite 提供可重建索引；可选 Rust 扩展未安装时回退纯 Python。
- 文件级详情：可搜索、分页的文件列表，选中文件后自动显示。输出变量列出坐标、单位、说明和形状；可切换图表、最多 100 个值的数据表、文件详情及动画。二维数值默认绘制热图，高维数据提供切片控件。
- 预览可选择风格和字号，并将配方带入完整绘图编辑器。切换文件或变量会清除旧图，登记分析图记录实际输入文件的哈希。相关运行可直接访问，日志、图片和配方可下载。
- 在生成前记录完整 Git commit、当时的 branch、dirty 状态、入口和命令；保存实际工作区源码快照，包括声明的未提交/未跟踪文件。界面可以直接查看和下载源码。
- 原始文件复制到托管目录并记录 SHA-256；SQLite 数据库使用一致性备份。独立 JSON manifest 和数据卡持久保存，SQLite 索引可以重建。
- 中文/全文检索、类别/标签/Git 筛选、参数范围检索。
- CSV、TSV、JSON/JSONL、HDF5、NetCDF、Parquet、QCoDeS 数据集统一适配成 xarray，保留值、坐标和已声明单位；导入 profile 可复用。
- 折线、散点、多数据比较、二维热图、复数分量、高维整数切片；9 种风格，可保存绘图 recipe，导出 HTML/PNG/SVG/PDF。
- 分析图另建 run，保存输入 run/artifact ID、文件哈希、配方、软件版本与绘图源码。
- 自动匹配的 Codex skill；agent 使用同一套 API/CLI，Julia 等程序只需将输出写入指定文件夹。
- 数据详情页支持本地编辑与 journal-style 校样：内置 Three Interact 可添加矢量内容、组件和 3D 视口，冻结带输入哈希的 HTML/PDF/场景 revision，并在图注或稳定元素 ID 上添加评论。详见 [编辑与校样](docs/PROOFS.md)。
- 0.5.1 根据两个独立 agent 的实际使用改进入口、版本导航、保存进度、运行版本和命令指南；反馈与验证见 [使用评审](docs/AGENT-REVIEW.md)。
- 0.5.2 将图形编辑、文章排版与校样审阅整合为同一个工作区，统一浅色外观与工具栏；参考网站、使用说明与截图见 [统一工作区](docs/UNIFIED_WORKSPACE.md)。
- 0.5.3 增加校样文字定位、图中编号和线程的解决/重开操作，旧校样保持冻结；见 [定位校样与意见处理](docs/PROOF_REVIEW.md)。
- 0.6 增加数据文章模板、完整性检查和带 receipt/revision 的正式提交；公式使用离线 MathText，受管 PNG/JPEG 图和文章可带入新校样；见 [数据文章与正式提交](docs/ARTICLES.md)。
- Collections provide explicit, reference-only many-to-many organization for related runs while preserving source/Git, article and proof records; see [Collections](docs/COLLECTIONS.md).

## 安装并打开

需要 Python 3.11+。Git 用于记录版本；未安装 Git 或来源不是 Git 项目时仍保存源码，Git 字段为空。

```powershell
git clone https://github.com/fangrh/research-data.git
cd research-data
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[ui,formats,export]"
.venv/Scripts/python -m research_data --root demo-catalog demo --with-qcodes
.venv/Scripts/python -m research_data --root demo-catalog open
```

Windows 也可运行 `./scripts/setup.ps1 -Agent -Catalog D:/research-data-library`，然后双击 `Start-ResearchData.cmd`。默认优先使用 **http://127.0.0.1:8765/**，被占用时自动选择附近空闲端口；以启动输出的 `url` 为准。示例均为标明的合成数据。

普通包安装：`python -m pip install "research-data[ui,formats,export] @ git+https://github.com/fangrh/research-data.git"`。

`ui` 安装网页界面和校样 PDF（ReportLab），`formats` 安装 Parquet/QCoDeS，`export` 安装 CLI 静态图导出。普通 CLI 静态 PNG/SVG/PDF 仍按 Kaleido 配置浏览器；缺少时显示具体错误。校样编辑器使用浏览器内置的 Plotly 导入和打包的 Three Interact，不需要额外的 Chrome、VS Code 或 Node 服务。

已有 Chromium 时用 `research-data configure --browser PATH/TO/chrome.exe` 指定；也可用 `python -c "import kaleido; kaleido.get_chrome_sync()"` 安装 Kaleido 的 Chrome。配置保存在用户目录，不写入软件仓库。

### 命令发现与一键启动

安装后可用 `research-data help` 查看当前命令。`research-data help COMMAND --json`
输出由实际 argparse parser 生成的选项、必填参数、默认值和示例，适合脚本与
coding agent；`research-data guide WORKFLOW --json` 输出 `generate`、`import`、
`plot`、`article`、`browse` 或 `agent` 的工作流决策图。人类可省略 `--json`
获得可读说明。

```text
research-data.cmd open
research-data status
research-data help run --json
research-data guide generate
research-data help collection --json
research-data guide collection --json
```

`open` 启动托管的本机服务并打开浏览器；`serve` 在前台运行并支持 Ctrl+C，
`browse` 保留为兼容别名。Windows 可直接运行 `Start-ResearchData.cmd`（首次
运行会准备环境），或在源码 checkout 中运行 `research-data.cmd open`；安装后的
console entrypoint 仍是 `research-data open`。需要桌面快捷方式时可运行
`powershell -NoProfile -ExecutionPolicy Bypass -File scripts\desktop-shortcut.ps1`。
详见 [docs/USAGE.md](docs/USAGE.md)。

### 运行合集

合集只保存用户明确提供的运行引用、关系角色和说明，不会自动推断因果关系或自动把运行归档到一起。一个合集可以包含多个运行，一个运行也可以属于多个合集；原始源码/Git 来源、数据文章和校样保持在各自运行中。

```powershell
research-data --root D:/research-data-library collection create --title "Cooldown comparison" --description "Reference-only grouping" --tag transport --run RUN_ID_1 --run RUN_ID_2
research-data --root D:/research-data-library collection add --id COLLECTION_ID --run-id RUN_ID_3 --role comparison --note "same campaign" --expected-hash HASH
research-data --root D:/research-data-library collection memberships --run-id RUN_ID_1
research-data --root D:/research-data-library collection archive --id COLLECTION_ID --expected-hash HASH
```

使用 `collection show --id COLLECTION_ID` 读取 `hash` 和成员顺序；编辑时传入 `--expected-hash` 可防止并发覆盖，`reorder` 必须提供完整且无重复的成员排列。历史或缺失运行仍在成员列表中可见，`restore` 可恢复已归档合集。网页中可从“合集”入口浏览，并在运行详情的“所属合集”查看关系。完整命令见 [docs/COLLECTIONS.md](docs/COLLECTIONS.md)。

## 让 agent 默认使用

```powershell
.venv/Scripts/python -m research_data install-agent --catalog D:/research-data-library
```

安装 `~/.codex/skills/research-data` 并记录当前 Python 和共享目录，附带选择正确 Python 的 launcher。新会话读取新的 skill 清单；也可以明确说“使用 research-data 生成并登记数据”。这是 agent 工作指引，自动执行取决于宿主的 skill 选择。

目录优先级：`--root` → `RESEARCH_DATA_CATALOG` → 安装时的共享目录 → `~/ResearchData`。更换 Python 环境后重新运行 `install-agent`。

## 生成数据时登记

```python
from research_data import Catalog

catalog = Catalog("D:/research-data-library")
with catalog.run(
    title="样品 S17：2 K 电流扫描", project="transport", kind="experiment",
    sample="S17", description="说明目的、仪器、处理方法和已知限制。",
    parameters={"temperature_K": 2.0, "field_T": 0},
    categories={"domain": "transport", "system": "NbSe2", "stage": "raw"},
    tags=["IV", "cooldown-03"], task_id="TASK-123",
    repo="D:/my-project", entrypoint="measure.py",
    source_paths=["measure.py", "src", "requirements.txt"],
) as run:
    # 使用已有采集/计算程序生成文件。
    run.add_artifact("results/curve.csv", description="原始 I-V；按采集顺序保存。",
                     profile={"x": "voltage", "units": {"voltage": "V", "current": "A"},
                              "descriptions": {"current": "Measured current"}})
print(run.run_id)
```

`completed` 表示执行结束。科学验证单独记录：

```python
catalog.set_validation(run.run_id, "partial", evidence=["validation-report.md"],
                       notes="已比较一个参考样品；其他温度尚未检查。")
```

`passed` 要求提供证据，软件不会判断科学结论正确与否。

正式提交还需要数据文章。`run`/`finish` 会保留执行输出，但不构成提交；使用 `article template --run-id RUN_ID --output article.json`，编辑后依次运行 `article save --run-id RUN_ID --file article.json`、`article check --run-id RUN_ID` 和 `submit RUN_ID --article article.json`。交付给 agent 或其他正式消费者时，返回成功 receipt 中的 `run_id`、`revision_id` 和外层返回值中的 receipt 路径；缺少文章、完整性检查或 receipt 时不要称为已提交。`article status` 是便宜的草稿/manifest 元数据检查（`integrity_checked` 为 false），原始文件字节修改要用 `article check` 或 `submit` 重新验哈希。完整字段、公式/图的非适用说明和陈旧草稿规则见 [docs/ARTICLES.md](docs/ARTICLES.md)。

## 包装 Python / Julia / 其他程序

程序将输出写入 `RESEARCH_DATA_OUTPUT`；wrapper 在执行前捕获来源，执行后登记输出和 stdout/stderr。失败会留下 failed run 并返回原退出码。

```powershell
research-data --root D:/research-data-library run --title "Synthetic Python example" --description "软件示例，非物理结果" --repo . --source examples/generate.py --entrypoint examples/generate.py --profile examples/transport-profile.json -- python examples/generate.py
research-data --root D:/research-data-library run --title "Synthetic Julia example" --repo . --source examples/generate.jl --entrypoint examples/generate.jl --profile examples/transport-profile.json -- julia examples/generate.jl
```

还有 `RESEARCH_DATA_RUN_ID`、`RESEARCH_DATA_RUN_DIR`、`RESEARCH_DATA_CATALOG`。输出目录中的文件自动登记；外部输出用 `register` 显式登记。

## 历史数据与格式映射

```powershell
research-data profile transport examples/transport-profile.json
research-data import old.csv --title "历史电流扫描" --kind experiment --project transport --sample S17 --description "原测量脚本未保存" --tag IV --category domain=transport --parameter temperature_K=2 --profile transport
```

历史文件默认来源 `unknown`，不会套用当前 Git 版本。确有依据时才显式提供 `--repo`、`--entrypoint` 和 `--source`。

批量历史导入用 Python API 的 `register_artifacts(run_id, paths, strict=False)`：一次写 manifest
和索引，失败的文件记入返回的 errors 而不中断整批；完成状态建议 `finish_run(run_id, "imported")`。

| 格式 | 首次说明的映射 |
|---|---|
| CSV / TSV / JSON / JSONL / TOML / Parquet | `x`、`rename`、`units`、`descriptions`；JSON 与 TOML 为 records（含 `records`/`data`/`rows` 键）或 column arrays |
| HDF5 | `variables` 选择路径或路径→名称映射；`coordinates` 指定变量维度；也读取 `dimensions` 属性或维度标签 |
| NetCDF | 读取文件自身变量、维度和单位 |
| QCoDeS SQLite | `qcodes_guid` 或 `qcodes_run_id`，通过官方只读接口读取 |

HDF5 profile 示例：

```json
{"variables":{"axes/T":"temperature","axes/B":"field","response/J":"current"},"coordinates":{"current":["temperature","field"]},"units":{"temperature":"K","field":"T","current":"A"}}
```

原始文件的列名/维度没有通用含义，首次映射需要检查；profile 保存这些含义，之后相同 schema 直接复用。输入文件中的代码不会执行，不使用 pickle。

## 搜索、绘图与来源

```powershell
research-data search "电流" --filter project=transport --filter category.domain=transport --filter parameter.temperature_K.gte=1 --filter parameter.temperature_K.lte=5
research-data search --filter tag=IV --filter git_branch=main
research-data show RUN_ID
research-data plot RUN_ID_1 RUN_ID_2 --recipe examples/compare-recipe.json --output comparison.html
research-data check
research-data rebuild
```

网页中点击卡片 → 从文件列表选数据 → 选择变量 → 查看图表或数据表 → 在绘图编辑器中调整切片/图形/风格 → 保存配方或登记分析图。可用“加入对比”比较相关运行。切换数据会清空旧图，登记时关联实际绘图时冻结的输入和配方。

坐标、单位和说明来自登记信息或文件本身；缺少明确轴映射时可先查看表格。读取器会完整加载选中文件，目前不提供分块读取。变量与坐标的分组参考 QCoDeS 的 [Accessing data in a DataSet](https://microsoft.github.io/Qcodes/examples/DataSet/Accessing-data-in-DataSet.html)。

保留采集顺序，没有自动排序、插值、归一化或单位换算；比较时已声明单位必须一致。复数可选 real/imag/abs/phase，phase 单位为弧度；对数轴要求有限正值。

```text
catalog/
  catalog.sqlite3        # 可重建索引
  recipes/*.json         # 导入 profile / 绘图 recipe
  runs/<run-id>/
    manifest.json        # 持久化记录
    README.md            # 数据卡
    artifacts/           # 托管文件、日志、图、配方
    source/snapshot.zip  # 当时的实际源码
    source/manifest.json # 来源/环境/文件哈希
```

备份整个 catalog 文件夹。数据留在本地，上传本软件仓库不会上传数据。默认只监听本机，当前面向个人/同机工作流，没有账户系统或远程实验室权限管理。选定文件加载入内存；超内存数据需另设分块存储/计算层。

来源快照覆盖列出的源码，外部依赖仅记录版本。默认捕获 Git 列出的源码/配置，额外运行资源需声明 `source_paths`。单文件限 32 MiB，总源码限 256 MiB；超限要求缩小范围。共享目录不要放在不支持文件锁的网络文件系统。

## 开发与验证

```powershell
python -m pip install -e ".[test]"
python -m pytest -q
python -m build
```

验证包括真实 QCoDeS、跨格式合成值/坐标/单位、dirty/untracked 源码、并发登记、检索/完整性、CLI 失败记录、绘图 lineage 与 Streamlit AppTest 交互。CI 配置为 Windows/Linux。软件测试不构成物理验证。

QCoDeS 参考：[数据集 API](https://microsoft.github.io/Qcodes/api/dataset/)、[测量示例](https://microsoft.github.io/Qcodes/examples/DataSet/Performing-measurements-using-qcodes-parameters-and-dataset.html)。许可：MIT；第三方依赖保留各自许可。

Native editor overlay check (requires the sibling `D:\three-interact` checkout, or pass its path as the first argument):

```powershell
node --experimental-strip-types tests/native_style_overlay.mjs
```
