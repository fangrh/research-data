# ResearchData 使用与命令指南

这是本地 Web 应用。Windows 双击 `Start-ResearchData.cmd`，或在项目目录的
CMD 中运行 `research-data.cmd open`。已安装包时用 `research-data open`。
启动成功后自动打开浏览器，关掉终端也可继续查看；关闭网页会保留后台服务。
用 `status` 查看它，用 `stop` 停止它，数据会保留。`open` 重用同一目录的
服务，端口被占用时自动选择附近空闲端口。需要终端持续显示日志时用 `serve`。

| 你想做什么 | 先看哪个指南 | 核心命令 |
| --- | --- | --- |
| 查看、筛选和分类数据 | `guide browse` | `open`、`search`、`show` |
| 生成计算或实验数据 | `guide generate` | `run` 或 Python `Catalog.run` |
| 导入已经存在的文件 | `guide import` | `profile`、`import` |
| 复用绘图风格和配方 | `guide plot` | `themes`、`plot` |
| 让 agent 决定工作流程 | `guide agent --json` | `help --json`、`guide --json` |

所有命令可用 `COMMAND --help` 查看参数，也可用 `help COMMAND` 获得参数和
例子。`help COMMAND --json` 含必填项、默认值和可选值，来自当前版本的真实
命令解析器。下面的 `TITLE`、`RUN_ID`、路径等大写名称都需要替换成你的值。

ResearchData exposes the same catalog through a console command, the Python
module launcher, and the installed agent skill. Run `research-data help` for
the local parser's current options. Use `research-data help COMMAND --json`
when a script or coding agent needs machine-readable flags and required
arguments.

## Choose a workflow

`research-data guide` prints the human decision map. The machine form is
`research-data guide WORKFLOW --json`, where `WORKFLOW` is `generate`,
`import`, `plot`, `browse`, or `agent`.

- `generate`: use `run` around an existing Python, Julia, or other command;
  write generated files to `RESEARCH_DATA_OUTPUT`.
- `import`: use `profile` for known mappings, then `import` historical files;
  keep unsupported provenance unknown.
- `plot`: use `search`/`show`, then `plot` with a saved recipe such as
  `recipe.json`.
- `browse`: use `open` for the managed background service, `status` to inspect
  it, and `stop` to stop it. `serve` stays in the foreground for Ctrl+C.
- `agent`: begin with `help agent --json` and `guide --json`; this includes
  parser-derived required flags, workflow steps, exit codes, and wrapper
  environment variables.

Examples use placeholders and avoid inline JSON quoting differences in Windows CMD:

```text
research-data run --title TITLE --repo SOURCE_ROOT --source SCRIPT -- python SCRIPT
research-data import DATA_FILE --title TITLE --project PROJECT --profile recipe.json
research-data plot RUN_ID --recipe recipe.json --output figure.html
research-data.cmd open
research-data help run --json
research-data guide agent --json
```

From an installed package use `research-data open`; from a Windows checkout use
`research-data.cmd open`. `Start-ResearchData.cmd` performs first-time `.venv`
setup before opening the managed service. To create a desktop shortcut, run
`powershell -NoProfile -ExecutionPolicy Bypass -File scripts\desktop-shortcut.ps1`.
The Windows double-click launchers are included in the Git checkout and source
archive. A wheel installation provides the cross-platform `research-data`
console command; use `research-data open` from that installation.

The wrapper provides `RESEARCH_DATA_RUN_ID`, `RESEARCH_DATA_RUN_DIR`,
`RESEARCH_DATA_OUTPUT`, and `RESEARCH_DATA_CATALOG`. Exit code `0` means
success, `1` reports an integrity check failure, and `2` reports invalid input
or a runtime error. `run` propagates the wrapped program's exit code; `serve`
returns `130` when interrupted. A successful process or completed run does not establish
scientific validation; record evidence separately with `validation`.
