import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getNotes, getNote } from "@/lib/notes";
import { ContentRenderer } from "@/components/ContentRenderer";
import { Tag } from "@/components/ui";
export function generateStaticParams() { return getNotes().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getNote((await params).slug); return { title: item?.title, description: item?.description, alternates: { canonical: `/notes/${item?.slug}` } }; }
export default async function NoteDetail({ params }: { params: Promise<{ slug: string }> }) { const item = getNote((await params).slug); if (!item) notFound(); return <div className="container detail-page article-detail"><Link href="/notes" className="back"><ArrowLeft size={15} /> Back to notes</Link><header><span className="eyebrow">{item.type} · {item.category} · {item.date}</span><h1>{item.title}</h1><p>{item.description}</p><div className="tag-row">{item.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div></header><ContentRenderer source={item.body} /></div>; }
