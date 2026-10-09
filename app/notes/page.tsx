import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getAllContent } from "@/lib/content";
import { EmptyState, NoteCard } from "@/components/ui";
import { ArchiveHeader } from "@/components/ArchiveHeader";
export const metadata: Metadata = { title: "Notes", description: "A growing collection of learning notes and observations." };
export default function NotesPage() {
  const items = getAllContent("notes");
  return <>
    <ArchiveHeader title="Notes" statement="记录那些促使我思考与学习的片段。"
      english="Things I read. Ideas I reflect on. Notes I keep."
      description="A living archive of reading, learning, reflection, and thought."
      background="/images/headers/notes.png" />
    <section className="container archive-section">
      <div className="search-shell"><Search size={17} /><input aria-label="搜索笔记" placeholder="Search notes, tags, or categories…" /><span>⌘ K</span></div>
      <div className="filter-bar">{["All", "AI", "Computer Vision", "Engineering", "Reading", "Other"].map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
      {items.length ? <div className="notes-grid">{items.map((item) => <NoteCard key={item.slug} item={item} />)}</div> : <EmptyState label="Notes will grow here." />}
    </section>
  </>;
}
