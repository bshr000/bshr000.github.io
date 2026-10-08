export const siteConfig = {
  name: "Xuyang Zhao",
  title: "Xuyang Zhao | Personal Portfolio",
  description: "Xuyang Zhao 的个人作品集，记录多模态目标检测研究、项目、笔记与个人经历。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bshr000.github.io",
  email: "18369588966@163.com",
  github: "https://github.com/bshr000",
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBasePath = (path: string) => `${basePath}${path}`;
