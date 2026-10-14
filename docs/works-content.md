# Works 内容维护

“实习与实践”沿用 `innovation` 分类与锚点；实习可用 `level: 实习` 和 `role` 标注。

Works 首页读取 `content/works/*.mdx`。`kind` 可取 paper、patent、engineering、innovation、competition。`draft: true` 不展示、不生成路由。每项成果只有一份内容，精选和档案共用。

- 精选：`featured: true`，使用 `featuredOrder` 排序；站点总首页也读取同一精选列表。
- 论文：`title` 简称、`fullTitle` 全称、`authors`、`venue`、`year`、`paper`。
- 专利：`applicationNumber` 申请号。未提供授权状态，不将申请号解释为授权。
- 资源：`github`、`dataset`、`demo`，只对实际填写的 HTTP(S) 链接显示按钮。
- 展示：`cover`、`coverAlt`、`coverNote`。替换 AirMOS 真实封面时同步更新示意标签。
- 经历：`level`、`role`、`award`。未知年份不编造。
- 无日期论文用 `year` 排序，同年有明确 `date` 时按日期排序；上线日期单独记录为 `publishedOnline`。

折叠档案使用原生 details，论文默认展开，各组独立开合。支持 #papers、#patents、#engineering、#innovation、#competitions 及成果 slug 锚点。JavaScript 负责锚点自动展开，不参与基础折叠。

## 核对来源

核对日期：2026-10-10。

- YOLO-CMFM: https://www.mdpi.com/2072-4292/18/1/136/notes 。正式引用 2026, 18(1):136；在线发表 2025-12-31。
- 代码与方法图：https://github.com/bshr000/YOLO-CMFM ，图源 `PaperImages/architecture.png`。
- MVSDA：https://github.com/bshr000/MVSDA1.0 ，图源 `pic/data_example.png`。
- MVSDA 论文：https://doi.org/10.11922/11-6035.csd.2025.0031.zh 。期刊原文 https://www.sciengine.com/doi/pdfView/86FF099F277747208B2A94765AB9E81F 。
- AirMOS 论文与数据 DOI 来自 YOLO-CMFM 官方仓库 README 数据准备表：10.1109/CAIT70489.2026.11553880、10.57760/sciencedb.33830。目标页面未能在检索工具中直接读取。作者和年份由用户提供；封面为自制矢量主题示意，非实验结果或数据样例。
- 综述：https://hkxb.buaa.edu.cn/CN/10.7527/S1000-6893.2025.32103 ，当前正式卷期 2026, 47(10):632103。
- 大学物理：https://dxwl.bnu.edu.cn/CN/Y2022/V41/I2/71 。
- 专利、工程、大创来自用户提供的材料。竞赛细节尚未提供。
