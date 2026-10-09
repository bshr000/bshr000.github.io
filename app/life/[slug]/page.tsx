import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentRenderer } from "@/components/ContentRenderer";
import PlacesPage from "@/components/life/travel-map/PlacesPage";
import { getAllContent, getContent } from "@/lib/content";
import { withBasePath } from "@/lib/site";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContent("life").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getContent("life", slug);

  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/life/${item.slug}` },
  };
}

export default async function LifeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContent("life", slug);

  if (!item) notFound();

  if (item.slug === "places") return <PlacesPage />;

  return (
    <div className={`container ${styles.page}`}>
      <nav className={styles.pageNav} aria-label="Life pages">
        <Link href="/life" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          Life
        </Link>
      </nav>

      <header className={styles.header}>
        <p className={styles.kicker}>Life Collection</p>
        <h1>{item.title}</h1>
        {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
        <p className={styles.description}>{item.description}</p>
      </header>

      {item.cover && (
        <figure className={styles.cover}>
          <Image
            src={withBasePath(item.cover)}
            alt={item.coverAlt ?? `${item.title} 主题馆封面`}
            fill
            priority
            sizes="(max-width: 768px) calc(100vw - 40px), 80rem"
          />
        </figure>
      )}

      <div className={styles.content}>
        <ContentRenderer source={item.body} />
      </div>
    </div>
  );
}
