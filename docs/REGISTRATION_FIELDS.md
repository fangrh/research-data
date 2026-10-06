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

## 封面（强制思考步骤）

每个 run 必须有一个能看懂的封面，登记 agent 在登记时**先想清楚数据的物理模型**再选封面：

1. **run 级封面（首选）**：用 `research_data.schematics.draw_archetype(archetype, title, params)`
   画模型示意图，然后 `catalog.register_artifact(run_id, png_path, role="cover")`。
   archetype 从模型出发选：`honeycomb`（石墨烯/布洛赫）、`flake`（D6h 六角 flake）、
   `magnetic_cell`（Hofstadter q 胞/磁场）、`landau`（朗道能级）、`chain`（有限链/条带/张量网络）、
   `kernel`（响应核/层层展开）、`spectrum`（谱/级数/证明类）。title 写模型一句话，params 写关键量。
2. **项目级示意图（次选）**：同一项目的 run 共用 `catalog/covers/<project>.png`
   （同样由 schematics 生成），适合批量/历史导入。
3. 自动 sparkline/参数指纹只是**兜底**，不允许作为 agent 登记的最终封面。

禁止：把乱序参数指纹当封面交付；选 archetype 时不看数据含义随手挑。
