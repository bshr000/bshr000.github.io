import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllContent } from "@/lib/content";
import { withBasePath } from "@/lib/site";
import type { BaseContent } from "@/types/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Life",
  description: "收藏那些塑造我的事物。关于山、摄影、行走、地方与家人的私人主题馆。",
  alternates: { canonical: "/life" },
};

type LifeCollection = BaseContent & { cover: string };
const collectionOrder = ["places", "mountains", "walking", "photography", "family"];
const collectionRank = (slug: string) => {
  const index = collectionOrder.indexOf(slug);
  return index < 0 ? collectionOrder.length : index;
};

export default function LifePage() {
  const collections = getAllContent("life")
    .filter((item): item is LifeCollection => Boolean(item.cover))
    .sort((a, b) => collectionRank(a.slug) - collectionRank(b.slug));
  const mountains = collections.find((item) => item.slug === "mountains");

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hero}>
          {mountains && (
            <div className={styles.heroLandscape} aria-hidden="true">
              <Image src={withBasePath(mountains.cover)} alt="" fill
                sizes="(max-width: 767px) 100vw, 65vw" />
            </div>
          )}
          <div className={styles.introduction}>
            <h1>Life.</h1>
            <p className={styles.statement}>收藏那些塑造我的事物。</p>
            <p className={styles.english} lang="en">
              Things I love. Places I remember. Moments I keep.
            </p>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.archiveNote} lang="en">
              A living archive of mountains, light, walking, places, and family.
            </p>
          </div>
        </header>

        <section className={styles.collections} aria-labelledby="life-collections-title">
          <h2 id="life-collections-title" className={styles.srOnly}>Life collections · 生活主题馆</h2>
          {collections.length ? (
            <div className={styles.collectionGrid}>
              {collections.map((item, index) => (
                <article className={styles.collection} data-collection={item.slug} key={item.slug}>
                  <Link href={`/life/${item.slug}`} className={styles.collectionLink}
                    aria-label={`进入 ${item.title} 主题馆`}>
                    <Image src={withBasePath(item.cover)}
                      alt={item.coverAlt ?? `${item.title} 主题馆封面`} fill
                      priority={index < 3}
                      sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 48vw, 32vw"
                      className={styles.cover} />
                    <div className={styles.collectionCopy}>
                      <span className={styles.collectionIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}<span />
                      </span>
                      <h3 lang="en">{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className={styles.enter} aria-hidden="true">
                      <ArrowRight size={21} strokeWidth={1.25} />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>主题馆正在整理中。</p>
          )}
          <div className={styles.collectionCaption}>
            <span lang="en">Collections</span>
            <p>持续生长的生活主题馆。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
