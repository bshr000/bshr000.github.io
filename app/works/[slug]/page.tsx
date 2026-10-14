import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllContent, getContent } from "@/lib/content";
import { withBasePath } from "@/lib/site";
import type { WorkContent } from "@/lib/works";
import { ContentRenderer } from "@/components/ContentRenderer";
import { Tag } from "@/components/ui";
export function generateStaticParams() { return getAllContent("works").map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getContent("works", (await params).slug);
  return { title: item?.title, description: item?.description, alternates: { canonical: `/works/${item?.slug}` } };
}
export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const item = getContent("works", (await params).slug) as WorkContent | undefined;
  if (!item) notFound();
  const resources = [{ label: "Code", href: item.github }, { label: "Paper", href: item.paper }, { label: "Dataset", href: item.dataset }, { label: "Demo", href: item.demo }].filter(({ href }) => href && /^https?:\/\//.test(href));
  return <div className="container detail-page">
    <Link href="/works" className="back"><ArrowLeft size={15} /> Back to works</Link>
    <header><span className="eyebrow">{[item.category, item.year].filter(Boolean).join(" · ")}</span><h1>{item.title}</h1><p>{item.description}</p>
      <div className="tag-row">{item.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      <div className="detail-links">{resources.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={14} /></a>)}</div>
    </header>
    {item.cover && <figure style={{ margin: "32px 0" }}><Image src={withBasePath(item.cover)} alt={item.coverAlt ?? item.title} width={1000} height={560} style={{ width: "100%", height: "auto", maxHeight: 560, objectFit: "contain" }} />{item.coverNote && <figcaption style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 8 }}>{item.coverNote}</figcaption>}</figure>}
    <ContentRenderer source={item.body} />
  </div>;
}
