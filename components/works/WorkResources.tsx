import { ArrowUpRight, FileText, Github, Database, ExternalLink } from "lucide-react";
import type { WorkContent } from "@/lib/works";
import styles from "@/app/works/page.module.css";
import { CopyPatentTitle } from "./CopyPatentTitle";
import { withBasePath } from "@/lib/site";
export function WorkResources({ item }: { item: WorkContent }) {
  const links = [
    { href: item.paper, label: "Paper", Icon: FileText },
    { href: item.patent ?? item.patentSearch, label: item.patent ? "Patent" : "Patent · 检索", Icon: FileText },
    { href: item.certificate, label: "Certificate", Icon: FileText },
    { href: item.github, label: "Code", Icon: Github },
    { href: item.dataset, label: "Dataset", Icon: Database },
    { href: item.demo, label: "Demo", Icon: ExternalLink },
    ...(item.resources ?? []).map(resource => ({
      href: resource.href,
      label: resource.label,
      Icon: resource.type === "code" ? Github : resource.type === "paper" ? FileText : resource.type === "dataset" ? Database : ExternalLink,
    })),
  ].filter(
  (link): link is typeof link & { href: string } =>
    typeof link.href === "string" &&
    (/^https?:\/\//.test(link.href) || /^\/(?!\/)/.test(link.href))
);
  if (!links.length) return null;
  return <div className={styles.resources}>{links.map(({ href, label, Icon }) =>
    <a key={`${label}-${href}`} href={href.startsWith("/") ? withBasePath(href) : href} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} ${label}（新窗口）`}>
      <Icon size={14} aria-hidden="true" />{label}<ArrowUpRight size={13} aria-hidden="true" />
    </a>,
  )}{!item.patent && item.patentSearch && <CopyPatentTitle title={item.fullTitle ?? item.title} />}</div>;
}
