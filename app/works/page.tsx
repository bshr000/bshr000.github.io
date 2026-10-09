import type { Metadata } from "next";
import { getAllContent } from "@/lib/content";
import { EmptyState, ProjectCard } from "@/components/ui";
import { ArchiveHeader } from "@/components/ArchiveHeader";
export const metadata: Metadata = { title: "Works", description: "Research, engineering, experiments, and selected projects." };
export default function WorksPage() {
  const items = getAllContent("works");
  const categories = ["All", ...new Set(items.map((i) => i.category ?? "Other"))];
  return <>
    <ArchiveHeader title="Works" statement="收集那些我认真做过的事物。"
      english="Things I build. Problems I explore. Work I keep refining."
      description="A living archive of projects, research, experiments, and practice."
      background="/images/headers/works.png" />
    <section className="container archive-section">
      <div className="filter-bar">{categories.map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
      {items.length ? <div className="project-grid">{items.map((item, i) => <ProjectCard key={item.slug} item={item} index={i + 1} />)}</div> : <EmptyState label="More projects coming soon." />}
    </section>
  </>;
}
