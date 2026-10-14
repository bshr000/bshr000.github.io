"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight, X } from "lucide-react";
import { noteCategories, type NoteCategory, type NoteSummary } from "@/types/notes";
import { withBasePath } from "@/lib/site";
import styles from "./NotesArchive.module.css";

export function NotesArchive({ notes }: { notes: NoteSummary[] }) {
  const [category, setCategory] = useState<NoteCategory | "All">("All");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const counts = new Map<string, { label: string; count: number }>();
  notes.forEach((note) => note.tags.forEach((label) => {
    const key = label.toLocaleLowerCase();
    counts.set(key, { label: counts.get(key)?.label ?? label, count: (counts.get(key)?.count ?? 0) + 1 });
  }));
  const tags = [...counts].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0], "zh-CN"));
  const visibleTags = showAllTags ? tags : tags.filter(([key], index) => index < 8 || key === tag);
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = notes.filter((note) => {
    const text = [note.title, note.description, note.category, ...note.tags].join(" ").toLocaleLowerCase();
    return (category === "All" || note.category === category) && (!tag || note.tags.some((label) => label.toLocaleLowerCase() === tag)) && words.every((word) => text.includes(word));
  });
  const active = category !== "All" || !!tag || !!query;
  const reset = () => { setCategory("All"); setTag(""); setQuery(""); };
  const toggleTag = (key: string) => setTag(tag === key ? "" : key);
  return <section className={styles.archive} aria-labelledby="notes-list-title"><div className={`container ${styles.inner}`}>
    <div className={styles.search}><Search size={17} aria-hidden="true" /><input type="search" aria-label="搜索笔记" placeholder="搜索标题、摘要、标签或分类…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery("")}><X size={16} /></button>}</div>
    <div className={styles.categories} role="group" aria-label="笔记分类">{(["All", ...noteCategories] as const).map((value) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
    {!!tags.length && <div className={styles.tagFilters} role="group" aria-label="笔记标签">{visibleTags.map(([key, value]) => <button type="button" key={key} aria-pressed={tag === key} onClick={() => toggleTag(key)}>#{value.label}<span>{value.count}</span></button>)}{tags.length > 8 && <button type="button" aria-expanded={showAllTags} onClick={() => setShowAllTags(!showAllTags)}>{showAllTags ? "收起标签" : "更多标签"}</button>}</div>}
    <div className={styles.heading}><h2 id="notes-list-title">Recent Notes</h2><div><span role="status" aria-live="polite">{filtered.length} 条记录</span>{active && <button type="button" onClick={reset}>清除筛选</button>}</div></div>
    {filtered.length ? <ul className={styles.list}>{filtered.map((note) => <li key={note.slug} className={`${styles.row} ${!note.cover ? styles.textOnly : ""}`}>
      {note.cover && <Link className={styles.thumbnail} href={`/notes/${note.slug}`} aria-label={`阅读：${note.title}`}><Image src={withBasePath(note.cover)} alt={note.coverAlt ?? ""} width={360} height={224} sizes="(max-width: 639px) 96px, 180px" /></Link>}
      <div className={styles.content}><div className={styles.meta}><span className={styles.type} data-type={note.type}>{note.type}</span><time dateTime={note.date}>{note.date.replaceAll("-", ".")}</time><span className={styles.category}>{note.category}</span></div>
        <h3><Link href={`/notes/${note.slug}`}>{note.title}</Link></h3><p className={styles.description}>{note.description}</p>
        <div className={styles.rowTags}>{note.tags.map((label) => <button type="button" key={label} aria-pressed={tag === label.toLocaleLowerCase()} onClick={() => toggleTag(label.toLocaleLowerCase())}>#{label}</button>)}</div>
      </div><Link className={styles.arrow} href={`/notes/${note.slug}`} aria-label={`阅读：${note.title}`}><ArrowUpRight size={17} aria-hidden="true" /></Link>
    </li>)}</ul> : <div className={styles.empty}><h3>{notes.length ? "没有找到匹配的笔记" : "笔记会在这里慢慢积累"}</h3><p>{notes.length ? "换一个关键词，或清除筛选再看看。" : "学习、探索与思考，都值得留下记录。"}</p>{active && <button type="button" onClick={reset}>查看全部笔记</button>}</div>}
  </div></section>;
}
