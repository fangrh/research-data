# 登记字段清单（agent 逐项询问规范）

AI agent 存入数据时，按本清单**逐项询问填写或选择**；无法确定的字段保持空缺
（unknown stays unknown），不得猜测。界面分区（频道）/facet 与本清单一一对应。

## Run 级字段（start_run / import）

| 字段 | 界面对应 | 填写要求 |
|---|---|---|
| title | 卡片标题 | 一句人类可读的实验/计算名 |
| project | **分区（频道）** | 既有项目优先复用；新项目给稳定短名 |
| kind | 类型 facet | simulation / experiment / analysis |
| description | 数据卡 | 目的、方法边界、已知限制 |
| sample | 样品 | 物理样品 ID；计算数据留空 |
| tags | 卡片标签 | 小写、可复用（如 sweep, certified） |
| categories.collection | 收藏夹分区 | data / results / proofs / logs / campaign … |
| categories.generator | 卡片"UP 主" | 生成脚本文件名（entrypoint） |
| categories.site | 场地 facet | triton-cluster / local / 其他集群名 |
| categories.backend | 后端 facet | cuda / cpu / gpu |
| categories.language | 语言 facet | julia / python |
| categories.accelerator | 加速器 facet | A100-80G / H200-141G / cpu-epyc-7713 …（来自分区表达） |
| parameters.compute_gpu | 显式 GPU 型号 | 数据文件内嵌 gpu_name 原文，如 Tesla V100-SXM2-16GB |
| parameters.compute_command | 完整命令行 | exact_command/argv 原文（≤400 字符） |
| parameters.file_count / total_bytes | 卡片"播放量/徽章" | 整数 |
| parameters.origin_path | 数据卡 | 相对仓库的来源路径 |
| task_id | 任务关联 | Backlog 原生任务 ID |

## 生成时溯源（新数据必须，历史导入必须留 unknown）

repo（源码根）、entrypoint、command、source_paths —— 由 `run` 包装器在执行前自动捕获，
agent 不要手填；`import` 历史数据一律 provenance=unknown，不冒用当前 Git 身份。

## 询问脚本要点

1. 逐字段发问，给出候选值（来自 catalog 已有 facet 值）优先让 agent 选择而非自由文本。
2. 数据文件若内嵌 `exact_command` / `gpu_name` / `backend` 等字段，直接采用原文并标注
   `compute_provenance=file-field`；只有推断才标 `post-hoc-inference`。
3. 登记后立即 `finish_run(..., "imported")`（历史）或正常 completed（生成），并回读校验。
