import { ArrowUpRight, FileText, Github, Database, ExternalLink } from "lucide-react";
import type { WorkContent } from "@/lib/works";
import styles from "@/app/works/page.module.css";
export function WorkResources({ item }: { item: WorkContent }) {
  const links = [
    { href: item.paper, label: "Paper", Icon: FileText },
    { href: item.github, label: "Code", Icon: Github },
    { href: item.dataset, label: "Dataset", Icon: Database },
    { href: item.demo, label: "Demo", Icon: ExternalLink },
  ].filter((link) => link.href && /^https?:\/\//.test(link.href));
  if (!links.length) return null;
  return <div className={styles.resources}>{links.map(({ href, label, Icon }) =>
    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} ${label}（新窗口）`}>
      <Icon size={14} aria-hidden="true" />{label}<ArrowUpRight size={13} aria-hidden="true" />
    </a>,
  )}</div>;
}
