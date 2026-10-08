# Xuyang Zhao · Personal Digital Garden

一个基于 Next.js、TypeScript 与 MDX 构建的个人数字花园，用于展示研究项目、技术笔记、生活记录与个人经历。

项目采用内容驱动架构。新增文章时只需创建 MDX 文件，列表页、详情页、首页预览、站点地图和静态路由会在构建阶段自动生成，无需手动修改页面组件。

[个人主页](https://bshr000.github.io/) · [GitHub 仓库](https://github.com/bshr000/bshr000.github.io) · [内容规范](content/README.md) · [设计说明](DESIGN.md)

## 项目特性

- **内容驱动**：Works、Notes、Life 与 Journey 均由本地 MDX 内容生成。
- **完整个人主页**：包含首页、关于、作品、笔记、生活收藏和经历时间线。
- **Journey 扩展内容**：同一条经历可按需关联独立图集与长篇 Story。
- **静态站点导出**：构建结果输出至 `out/`，适合 GitHub Pages 等静态托管平台。
- **响应式设计**：兼顾桌面端与移动端阅读体验。
- **明暗主题**：自动跟随系统主题，并支持手动切换。
- **本地字体**：使用 Geist、Geist Mono 与 Noto Sans SC，避免依赖远程字体服务。
- **交互细节**：包含音乐播放器、页面背景效果、动画宠物与点击反馈。
- **基础 SEO**：自动生成 Metadata、Open Graph、`sitemap.xml` 与 `robots.txt`。
- **子路径兼容**：支持 GitHub Pages 仓库站点所需的 `basePath` 与资源前缀。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Next.js 16、React 19 |
| 语言 | TypeScript 5 |
| 内容 | MDX、gray-matter、next-mdx-remote |
| 样式 | CSS Modules、Tailwind CSS 4、CSS Design Tokens |
| 图标 | Lucide React、React Icons |
| 质量检查 | ESLint、TypeScript、jsx-a11y |
| 部署 | GitHub Actions、GitHub Pages |

## 页面结构

| 路由 | 内容 |
| --- | --- |
| `/` | 首页与精选内容预览 |
| `/about/` | 个人介绍、教育经历与技能 |
| `/works/` | 研究和项目作品 |
| `/notes/` | 技术笔记与研究记录 |
| `/life/` | 生活主题收藏 |
| `/journey/` | 经历时间线、图集和长篇故事 |

## 快速开始

### 环境要求

- Node.js `>= 20.9.0`
- pnpm 11

### 安装与运行

```bash
git clone https://github.com/bshr000/bshr000.github.io.git
cd bshr000.github.io
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看本地站点。

如果终端提示已有 Next.js 开发服务器正在运行，请先关闭提示中的 PID，再重新执行 `pnpm dev`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 执行生产构建并静态导出到 `out/` |
| `pnpm lint` | 运行 ESLint 代码检查 |

项目配置了 `output: "export"`，因此生产交付物是 `out/` 中的静态文件，不使用 `next start` 提供服务。

## 内容发布

文件名会成为内容的 URL slug。例如：

```text
content/notes/multimodal-detection.mdx
                ↓
/notes/multimodal-detection/
```

将 MDX 文件添加到对应目录：

```text
content/
├── works/       # 研究与项目
├── notes/       # 技术笔记
├── life/        # 生活收藏
└── journey/     # 经历时间线
```

### 基本 Frontmatter 示例

```mdx
---
title: Multimodal Object Detection
description: 项目或文章的简短描述。
date: "2026-08-21"
category: Research
tags: [Computer Vision, Multimodal]
draft: false
featured: true
---

## Overview

在这里编写正文内容。
```

- `draft: true` 的内容不会进入页面和静态路由。
- `featured: true` 可用于首页或列表页的精选展示。
- 未显式设置 `order` 时，内容通常按照日期或年份倒序排列。
- 各内容类型支持的完整字段请查看 [content/README.md](content/README.md)。

### Journey 内容模型

Journey 的时间线记录、图集和长篇故事使用同一个 slug 关联：

```text
content/journey/2025-hongkong.mdx
content/journey/galleries/2025-hongkong.json
content/journey/stories/2025-hongkong.mdx
public/images/journey/2025-hongkong/
```

只有时间线 MDX 是必需的，Gallery 与 Story 可以按需添加。详细格式参见 [Journey 内容指南](content/journey/README.txt)。

## 项目目录

```text
.
├── app/                 # App Router 页面、全局样式与字体
├── components/          # 导航、页脚、内容渲染和交互组件
├── content/             # Works、Notes、Life、Journey 内容
├── lib/                 # 内容读取、排序和站点配置
├── public/              # 图片、音乐、简历和动画资源
├── types/               # 内容数据类型
├── .github/workflows/   # GitHub Pages 自动部署
├── next.config.ts       # 静态导出和子路径配置
└── DESIGN.md            # 视觉系统与设计规范
```

## 站点配置

在 [lib/site.ts](lib/site.ts) 中修改站点名称、描述、邮箱和 GitHub 地址：

```ts
export const siteConfig = {
  name: "Xuyang Zhao",
  title: "Xuyang Zhao | Personal Portfolio",
  description: "站点描述",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bshr000.github.io",
  email: "your-email@example.com",
  github: "https://github.com/username",
};
```

可选环境变量：

| 变量 | 用途 | 示例 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 站点完整公开地址，用于 Metadata 与 Sitemap | `https://bshr000.github.io` |
| `NEXT_PUBLIC_BASE_PATH` | 子路径部署时的路径前缀 | 空字符串（个人主页） |

本地开发通常不需要设置 `NEXT_PUBLIC_BASE_PATH`。

## 静态资源

- 个人图片与页面图片：`public/images/`
- Journey 图片：`public/images/journey/<slug>/`
- 音乐文件：`public/music/`
- 简历文件：`public/resume/`
- 网站图标：`public/favicon.svg`

静态资源在内容和组件中使用以 `/` 开头的公开路径。项目会通过 `withBasePath()` 和部署环境配置处理 GitHub Pages 子路径。

## 部署到 GitHub Pages

仓库已经包含 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)。推送到 `main` 分支后，GitHub Actions 会自动：

1. 安装 pnpm 与项目依赖。
2. 使用主页根路径与正式地址 `https://bshr000.github.io`，并运行 ESLint 检查。
3. 构建静态站点。
4. 上传 `out/` 并部署到 GitHub Pages。

首次部署时，在 GitHub 仓库中打开：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

部署前建议确认：

- `lib/site.ts` 中的站点信息正确。
- 导航、页脚、邮箱和 GitHub 链接已更新。
- 示例内容已替换或删除。
- 图片、音乐、简历和 favicon 均使用正式资源。
- `pnpm lint` 与 `pnpm build` 均能通过。

## 内容维护建议

1. 为新增内容选择稳定、简短的英文 slug。
2. 图片按内容 slug 独立建目录，避免文件名冲突。
3. 提交前运行 `pnpm lint` 和 `pnpm build`。
4. 不要手动修改 `out/`，它会在每次构建时重新生成。
5. Journey 的排序优先使用 `sortDate: YYYY-MM-DD`。

---

Built with Next.js, TypeScript and MDX.

## 正式主页维护

正式地址为 https://bshr000.github.io/，部署路径保持为空。日常修改在本地预览后运行 `pnpm lint` 和 `pnpm build`，提交并推送到 `main` 即会自动上线。较大改动建议先在独立分支完成，合并到 `main` 后发布。

在 GitHub Actions 中确认 Deploy GitHub Pages 成功，再检查首页、文章直达链接、图片与简历下载。不要手动修改 `out/`；它是构建生成的产物。若发布后需要回退，使用 `git revert <提交哈希>` 并推送，保留历史并触发重新部署。
