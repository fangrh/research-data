# 定位校样与处理意见

ResearchData 0.5.3 在统一工作区的“校样审阅”中增加定位和意见处理。左侧阅读冻结的文稿与图形，右侧保留同一版本的讨论。选择原文、点击段落或图中位置即可开始评论；编号、高亮和“审阅线程”连接对应意见。

- **文字位置**：锚点为标题、摘要、正文或图注，保存 Unicode 字符范围及原文引用。后端核对冻结文稿，拒绝错位引用。跨段落选取会提示改为单段选择。
- **图中位置**：保存图形上的相对 x/y 坐标，缩放窗口后标记仍对应同一张图。图形元素也可按名字和稳定 ID 选择；元素意见不推断底图的数据点或几何边界。
- **处理状态**：以讨论线程为单位显示未处理或已解决。解决、重新打开和回复保留作者、时间与状态记录；向已解决线程回复会重开它。
- **版本边界**：所有意见绑定精确 revision。评论和状态写入独立侧文件，旧 PDF、HTML、图片、manifest 和输入哈希保持冻结。旧评论缺少状态时按未处理读取，单纯阅读不重写旧文件；意见不会自动迁移到新版。

选中意见后，点击“定位”回到原文；“回复”沿用原线程位置。右侧“评论位置”仍支持针对整份校样或整个图的意见，已有宽范围评论不会伪装成精确点标记。上方“全部 / 未处理 / 已解决”筛选同时作用于阅读区标记和讨论。

完整命令与 locator JSON 示例见 [PROOFS.md](PROOFS.md)。Agent 先运行 `research-data help proof --json` 和 `research-data guide proof --json`，再使用 `proof comments --status` 或 `proof comment-status`；处理状态仅代表编辑意见的状态。

## 设计来源

2026-10-06 查阅了 [Overleaf 官方评论说明](https://docs.overleaf.com/collaborating/commenting)，其中描述选取文本、回复、解决和重新打开讨论；[W3C Web Annotation Data Model](https://www.w3.org/TR/annotation-model/#text-position-selector)描述文本引用和 Unicode 字符范围。我们将这些原则用于本地冻结校样的定位审阅。本软件的简化 locator 没有声明完整 W3C JSON 格式兼容，也不依赖 Overleaf 服务。

## 验证

测试覆盖定位引用、Unicode/换行范围、非法定位拒绝、旧评论读取、线程继承、解决/重开、跨版本隔离与冻结字节保持。浏览器验证仅使用合成示例，安装包验证使用隔离环境；实际结果见 [VALIDATION.md](VALIDATION.md)。

![定位校样与意见](proof-anchored-review.png)
