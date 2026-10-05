# 0.1.1 启动与帮助验证

2026-10-05，Windows / Python 3.13.12。

| 验证 | 结果 |
|---|---|
| 完整回归测试 | 41 passed；已有 NetCDF/NumPy ABI warning 保留，值/坐标断言通过 |
| 本地服务 | 真正启动、就绪校验、同目录复用、端口占用回退、停止、错误认证拒绝 |
| 并发启动 | 两个目录的三次同时 open 得到两个不同服务；同目录两次请求复用一个进程 |
| 服务身份 | 校验本次启动独有的 UI 标识；错误标识不算就绪；随机 token 以短横线开头也能启动 |
| Windows 入口 | 从另一工作目录执行 CMD；Start-ResearchData.cmd 自动打开默认浏览器；桌面快捷方式已创建并核查目标 |
| 帮助 | 25 个命令；分组 help、逐命令参数/例子、5 类 workflow、JSON 必填参数/默认值/choices；错误 topic 返回 2，帮助不创建 catalog |
| 独立 wheel | 从独立 site-packages 导入 0.1.1；CLI/已安装 skill discovery、owned UI readiness、启动/复用/停止通过 |
| 实际页面 | 默认 Catalog 与侧栏 Help 已在浏览器打开；截图见 launch-help.png |

Windows 双击入口随 Git checkout/source archive 提供；wheel 提供跨平台
`research-data open` console 命令。全局和项目内的 agent skill 已刷新。
当前本机共享目录为空，未放入示例数据；原有示例服务保留。
以上均是软件行为验证。GitHub Actions 的 Windows/Linux 结果以线上记录为准。

![Local browser help](launch-help.png)

# 0.1.0 软件验证

2026-10-05，Windows / Python 3.13.12。使用合成数据，验证范围是软件行为。

| 验证 | 结果 |
|---|---|
| 完整测试集 | 29 passed；本机已有 NetCDF 扩展产生一项 NumPy ABI warning，值/坐标断言通过 |
| 最终绘图布局及 Streamlit 交互 | 10 passed；比较两份数据、载入配方、冻结图的输入/风格、切换运行清空旧图、登记源码快照 |
| 格式 | CSV、TSV、JSON/JSONL、HDF5 二维/复数/标量、NetCDF、Parquet、真实 QCoDeS |
| 来源 | 完整 commit/branch、dirty/untracked 文件真实字节、detached HEAD、历史 unknown、完整性检查 |
| 目录 | 并发登记、参数/类别/中文检索、重复文件名、非法路径、状态/验证证据 |
| 独立 agent 使用 | 按已安装 skill 生成两份 CSV，验证源码 SHA 和 Git，按温度/分类检索，复用配方生成 paper/midnight 两图 |
| Julia 接口 | 实际执行 examples/generate.jl；completed，CSV、单位、源码快照与日志均登记 |
| 静态图 | PNG/SVG/PDF 实际导出；Chromium 1228。Edge 在本机启动失败，已采用可配置 Chromium 路径 |
| 网页实际操作 | 本机 8765，选择并加载 CSV/TSV/QCoDeS，生成比较图和静态导出下载入口 |
| 发布包 | 构建 wheel/sdist；wheel 包含 agent skill/launcher，不含 pyc；独立环境从 wheel 安装并完成目录烟雾检查 |

原始测试、agent 和导出日志保留在本机 `.artifacts/`，测试数据与虚拟环境不提交。CI 配置覆盖 Windows/Linux；线上 CI 状态以 GitHub Actions 为准。

这是本地个人/同机的数据管理应用。科学验证由用户提供证据；软件通过不证明模型、实验或收敛正确。首次导入未知 schema 需声明并检查轴/单位；超内存文件、远程身份权限、外部依赖完整封装属于当前明确边界。
