# Works 内容维护

## Featured Works：独立卡片与详情页

仅使用 `content/works/featured-works-01.mdx`、`featured-works-02.mdx`、`featured-works-03.mdx`。

- 分别维护 YOLO-CMFM、MVSDA / AirMOS、启元实验室实习。
- 元数据用于卡片，正文用于自己的详情页 `/works/featured-works-01/` 等。
- `featuredOrder: 1` 控制卡片顺序；`archive: false` 表示不进入 Complete Archive。
- `featured-works-` 文件名也会被档案列表排除，避免误删 archive 字段后重复展示。
- 不再使用 `content/featured/`、`archiveSlug` 或 `archiveAnchor`，也不读取 01 论文档案作为卡片内容。
- `cover` 填写 public 下图片对应的网址，如 `/images/works/airmos.png`。
- `resources` 支持多个独立按钮，字段为 label、href、type（paper / code / dataset / link）。Paper、Code 等原有字段仍可使用。

```yaml
resources:
  - label: "Model Code"
    href: "https://github.com/bshr000/YOLO-CMFM"
    type: "code"
```

论文条目的 `description` 会显示在档案列表中，不受 authors 字段影响；留空时不输出空段落。

## Complete Archive：成果档案

编辑 `content/works/*.mdx`。保留左侧年份、右侧成果说明及原有排序逻辑。

- `kind`：paper / patent / engineering / innovation / competition。
- `archive: false`：从首页档案列表隐藏，但保留原详情 URL 和资源，可用作组合档案的子项。
- `members`：组合档案的子项 slug 列表。组合档案显示为一项，其内部单独展示各篇论文、作者、年份和链接。
- `draft: true`：不发布，也不生成详情页。
- MVSDA、AirMOS 原始文件继续维护论文内容；`airport-multimodal-datasets.mdx` 维护合并工作的名称、介绍和成员顺序。

## 竞赛经历

22 项经历分别位于 `competition-*.mdx`，每项维护 title、description、year、role、award、level、tags。

`competition-1.mdx` 是用户原始汇总，作为草稿保留。后续请修改独立文件，避免再次重复录入。

体育使用 `activityType: "体育"`，不作为级别。未提供级别的记录留空。2021 MCM/ICM 的 Successful Participant 是参赛结果，不额外解释为获奖等级。简短说明仅基于原记录的赛事、角色、奖项整理。

## 专利资源

- `patent`：已核实的具体专利详情 URL，按钮显示 Patent。
- `patentSearch`：检索入口。只有检索入口时按钮显示 Patent · 检索，并提供复制专利名称（成功提示“已复制”在 2 秒后自动消失）。
- `applicationNumber`：保留完整申请号。
- 跨视角地理定位专利已通过申请号 202510999673.0 核对，使用 https://patents.google.com/patent/CN120510529A/zh 。
- 另两项尚未取得可核实的详情直链，使用用户提供的 https://www.patentstar.com.cn/Search/Index 。后续填入 patent 字段即可自动切换为详情按钮。

普通资源：paper → Paper；github → Code；dataset → Dataset；demo → Demo。列表与详情共用组件，避免遗漏。
