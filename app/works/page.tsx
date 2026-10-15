import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getWorks, getFeaturedWorks, workGroups, type WorkContent } from "@/lib/works";
import { withBasePath } from "@/lib/site";
import { ArchiveHeader } from "@/components/ArchiveHeader";
import { ArchiveAnchors } from "@/components/works/ArchiveAnchors";
import { WorkResources } from "@/components/works/WorkResources";
import { WorkPublications } from "@/components/works/WorkPublications";
import styles from "./page.module.css";
export const metadata: Metadata = { title: "Works", description: "赵旭阳的研究、开源与工程实践：YOLO-CMFM、MVSDA、AirMOS，以及论文、专利和项目档案。" };
function Authors({ text }: { text: string }) {
  return <>{text.split(/(赵旭阳|Xuyang Zhao|X\. Zhao)/).map((part, index) => /^(赵旭阳|Xuyang Zhao|X\. Zhao)$/.test(part) ? <strong key={index}>{part}</strong> : part)}</>;
}
function ArchiveEntry({ item }: { item: WorkContent }) {
  return <li id={item.slug} className={styles.entry}>
    <span className={styles.year}>{item.year ?? "—"}</span>
    <div className={styles.entryContent}>
      <h3>{item.fullTitle ?? item.title}</h3>
      {item.authors && <p className={styles.authors}><Authors text={item.authors} /></p>}
      {item.venue && <p className={styles.meta}>{item.venue}</p>}
      {item.applicationNumber && <p className={styles.meta}>申请号 · {item.applicationNumber}</p>}
      {item.description && <p className={styles.meta}>{item.description}</p>}
      {item.role && <p className={styles.meta}>{item.role}</p>}
      {item.award && <p className={styles.meta}>{item.award}</p>}
      {item.citation && <p className={styles.citation}><Authors text={item.citation} /></p>}
      {item.detailLink ? <div className={styles.resources}><Link href={`/works/${item.slug}`}>详情介绍 <ArrowUpRight size={13} aria-hidden="true" /></Link></div> : <WorkResources item={item} />}
      <WorkPublications item={item} />
    </div>
    <span className={styles.entryLabel}>{item.kind === "engineering" ? (item.projectType ?? "PROJECT") : item.featured ? "SELECTED" : item.level ?? item.activityType ?? (item.kind === "paper" ? "PAPER" : item.kind === "patent" ? "PATENT" : item.kind === "competition" ? "COMPETITION" : "PROJECT")}</span>
  </li>;
}
export default function WorksPage() {
  const items = getWorks();
  return <>
    <ArchiveHeader title="Works" statement="收集那些我认真做过的事物。"
      english="Things I build. Problems I explore. Work I keep refining."
      description="A living archive of projects, research, experiments, and practice."
      background="/images/headers/works.png" />
    <div className={styles.page}><ArchiveAnchors /><div className={`container ${styles.inner}`}>
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className={styles.sectionHeading}><h2 id="featured-title">Featured Works</h2></div>
      <div className={styles.featuredGrid}>{getFeaturedWorks().map((item, index) => <article key={item.slug} className={styles.featuredCard}>
        <Link href={`/works/${item.slug}`} className={styles.coverLink} aria-label={`了解 ${item.title}`}>
          {item.cover && <Image src={withBasePath(item.cover)} alt={item.coverAlt ?? item.title} width={800} height={450} sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw" priority={index === 0} />}
          {item.coverNote && <span className={styles.coverNote}>{item.coverNote}</span>}
          <span className={styles.coverArrow}><ArrowUpRight size={19} aria-hidden="true" /></span>
        </Link>
        <div className={styles.featureMeta}><span>{String(index + 1).padStart(2, "0")}</span><span>{item.subtitle}</span></div>
        <h3><Link href={`/works/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p>
        <div className={styles.featureFooter}><WorkResources item={item} /><Link className={styles.archiveLink} href={`/works/${item.slug}`}>了解详情 <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      </article>)}</div>
    </section>
    <section id="archive" className={styles.archive} aria-labelledby="archive-title">
      <div className={styles.sectionHeading}><h2 id="archive-title">Complete Archive</h2></div>
      {workGroups.map((group, index) => {
        const entries = items.filter((item) => item.kind === group.kind);
        return <details key={group.id} id={group.id} data-work-archive className={styles.group} open={index === 0}>
          <summary><span className={styles.groupIndex}>{String(index + 1).padStart(2, "0")}</span><span className={styles.groupCopy}><span className={styles.groupTitle}>{group.title}<span lang="en">{group.english}</span></span><span className={styles.groupDescription}>{group.description}</span></span><span className={styles.count}>{entries.length ? `${entries.length} 项` : "待补充"}</span><Plus size={20} className={styles.toggle} aria-hidden="true" /></summary>
          {entries.length ? <ul className={styles.entries}>{entries.map((item) => <ArchiveEntry key={item.slug} item={item} />)}</ul> : <p className={styles.empty}>竞赛经历整理中，后续补充具体赛事与获奖记录。</p>}
        </details>;
      })}
    </section>
    <div className={styles.endnote}><span>持续探索，持续记录。</span><span>RESEARCH / BUILD / EXPLORE</span></div>
  </div></div></>;
}
