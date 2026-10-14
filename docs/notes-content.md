# Notes 内容规范

在 content/notes 中新增 MDX 文件。文件名为稳定 slug；改标题无需修改文件名。

必填：title、description、date（YYYY-MM-DD）、category（Learning/Exploring/Thinking）、type（Moment/Log/Article）、tags 数组。draft 默认为 false；true 时不展示。cover 可选，有图时必须填写 coverAlt。updated 为可选更新日期，不改变排序。

记录类型和分类互相独立。标签随文章填写产生，不需要标签库；读取时去除首尾空格和 #，忽略大小写去重。跨文章标签同名合并。按发布日期倒序，同日按 slug 稳定排序。

列表只接收摘要数据，不发送完整 MDX 正文。首页、列表和详情共用 lib/notes.ts。搜索匹配标题、摘要、分类与标签，空格分词，所有词均需匹配；分类、标签与搜索取交集。标签单选，再点取消。无结果可清除筛选。

三篇 2026-10-10 新笔记为按用户题目生成的可编辑初稿；英语内容为练习计划而非已完成记录。缩略图为自制 SVG 主题插画，不是个人经历照片。原有 myfirst-note 正文保留，两篇 example 模板设置为草稿。
