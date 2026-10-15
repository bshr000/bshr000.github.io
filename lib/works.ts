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
  archive?: boolean;
  members?: string[];
  activityType?: string;
  projectType?: string;
  detailLink?: boolean;
  patent?: string;
  patentSearch?: string;
  certificate?: string;
  resources?: { label: string; href: string; type?: "paper" | "code" | "dataset" | "link" }[];
}
export const workGroups: { id: string; kind: WorkKind; title: string; english: string; description: string }[] = [
  { id: "papers", kind: "paper", title: "论文发表", english: "Publications", description: "多模态遥感 · 视觉理解 · 交叉研究" },
  { id: "patents", kind: "patent", title: "发明专利", english: "Patents", description: "跨视角地理定位 · 多模态遥感目标检测" },
  { id: "engineering", kind: "engineering", title: "工程项目", english: "Engineering", description: "视觉语言模型 · 多模态目标检测 · 大模型评测 · AI 辅助开发与网页设计" },
  { id: "innovation", kind: "innovation", title: "实习与实践", english: "Experience & Practice", description: "实习经历 · 创新项目 · 校园实践" },
  { id: "competitions", kind: "competition", title: "竞赛经历", english: "Competitions", description: "在挑战中探索与实践" },
];
export function getWorks() {
  return getAllContent("works").filter((item) => !item.slug.startsWith("featured-works-") && (item as WorkContent).archive !== false && workGroups.some((group) => group.kind === (item as WorkContent).kind)) as WorkContent[];
}
export function getWorkMembers(item: WorkContent): WorkContent[] {
  const all = getAllContent("works") as WorkContent[];
  return (item.members ?? []).map(slug => {
    const member = all.find(entry => entry.slug === slug);
    if (!member || member.members?.length || member.slug === item.slug) throw new Error(`Invalid member ${slug} in ${item.slug}`);
    return member;
  });
}
export function getFeaturedWorks(): WorkContent[] {
  return (getAllContent("works") as WorkContent[])
    .filter(item => item.slug.startsWith("featured-works-"))
    .map(item => {
      if (!item.title || !item.description || !item.cover || !Number.isFinite(item.featuredOrder)) {
        throw new Error(`content/works/${item.slug}: title, description, cover and featuredOrder are required.`);
      }
      return item;
    })
    .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
}
