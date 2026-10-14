import { getAllContent } from "@/lib/content";
import type { BaseContent } from "@/types/content";
export type WorkKind = "paper" | "patent" | "engineering" | "innovation" | "competition";
export interface WorkContent extends BaseContent {
  kind: WorkKind;
  fullTitle?: string;
  featuredOrder?: number;
  authors?: string;
  venue?: string;
  citation?: string;
  applicationNumber?: string;
  dataset?: string;
  level?: string;
  role?: string;
  award?: string;
  coverNote?: string;
}
export const workGroups: { id: string; kind: WorkKind; title: string; english: string; description: string }[] = [
  { id: "papers", kind: "paper", title: "论文发表", english: "Publications", description: "多模态遥感 · 视觉理解 · 交叉研究" },
  { id: "patents", kind: "patent", title: "发明专利", english: "Patents", description: "跨视角地理定位 · 多模态遥感目标检测" },
  { id: "engineering", kind: "engineering", title: "工程项目", english: "Engineering", description: "开放词汇视觉理解系统 · 大模型评测平台" },
  { id: "innovation", kind: "innovation", title: "实习与实践", english: "Experience & Practice", description: "实习经历 · 创新项目 · 校园实践" },
  { id: "competitions", kind: "competition", title: "竞赛经历", english: "Competitions", description: "在挑战中探索与实践" },
];
export function getWorks() {
  return getAllContent("works").filter((item) => workGroups.some((group) => group.kind === (item as WorkContent).kind)) as WorkContent[];
}
export function getFeaturedWorks() {
  return getWorks().filter((item) => item.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}
