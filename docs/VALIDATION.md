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
