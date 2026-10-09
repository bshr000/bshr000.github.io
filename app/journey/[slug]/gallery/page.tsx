import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  getJourneyEntry,
  getJourneyGallery,
  getJourneySlugs,
  getJourneyStory,
  resolveJourneyImage,
} from "@/lib/journey";
import type { JourneyGalleryImage, JourneyGalleryLayout } from "@/types/content";
import styles from "./page.module.css";
import { ChapterAlbum } from "@/components/journey/ChapterAlbum";

export const dynamicParams = false;

export function generateStaticParams() {
  return getJourneySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getJourneyEntry(slug);
  const gallery = getJourneyGallery(slug);

  if (!item || !gallery) return {};

  return {
    title: `${item.title} | Gallery`,
    description: `${item.title} 的完整照片档案，共 ${gallery.images.length} 张照片。`,
    alternates: { canonical: `/journey/${slug}/gallery` },
  };
}

const layoutSequence: JourneyGalleryLayout[] = [
  "wide",
  "left",
  "right",
  "wide",
  "offset",
  "left",
  "right",
];

function getLayout(image: JourneyGalleryImage, index: number) {
  return image.layout ?? layoutSequence[index % layoutSequence.length];
}

export default async function JourneyGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getJourneyEntry(slug);
  const gallery = getJourneyGallery(slug);

  if (!item || !gallery) notFound();

  const story = getJourneyStory(slug);
  if (gallery.presentation === "chapters") {
    return <ChapterAlbum
      title={item.title}
      period={item.date ?? item.year ?? ""}
      location={item.location}
      gallery={{ ...gallery, sections: gallery.sections.map((section) => ({
        ...section, images: section.images.map((image) => ({ ...image, src: resolveJourneyImage(image.src) })),
      })), images: gallery.images.map((image) => ({ ...image, src: resolveJourneyImage(image.src) })),
      coverImages: gallery.coverImages?.map(resolveJourneyImage) }}
      storyHref={story ? `/journey/${slug}/story` : undefined}
    />;
  }
  const date = item.date ?? item.year ?? "";
  let imageIndex = 0;

  return (
    <div className={`container ${styles.page}`}>
      <nav className={styles.pageNav} aria-label="Journey pages">
        <Link href="/journey" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          Journey
        </Link>
        {story && (
          <Link href={`/journey/${slug}/story`} className={styles.relatedLink}>
            Read story
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        )}
      </nav>

      <header className={styles.header}>
        <div className={styles.meta}>
          {date && <time dateTime={item.sortDate}>{date}</time>}
          {item.location && <span>{item.location}</span>}
        </div>
        <h1>{item.title}</h1>
        <p>{gallery.images.length} photographs</p>
      </header>

      <div className={styles.archive}>
        {gallery.sections.map((section, sectionIndex) => (
          <section className={styles.gallerySection} key={`${section.title ?? "photos"}-${sectionIndex}`}>
            {section.title && <h2>{section.title}</h2>}
            <div className={styles.photoGrid}>
              {section.images.map((image) => {
                const index = imageIndex++;
                const layout = getLayout(image, index);
                const width = image.width ?? 1600;
                const height = image.height ?? 1067;

                return (
                  <figure className={styles.photo} data-layout={layout} key={`${image.src}-${index}`}>
                    <Image
                      src={resolveJourneyImage(image.src)}
                      alt={image.alt ?? `${item.title}, photograph ${index + 1}`}
                      width={width}
                      height={height}
                      priority={index === 0}
                      sizes={layout === "wide"
                        ? "(max-width: 768px) calc(100vw - 40px), 72rem"
                        : "(max-width: 768px) calc(50vw - 28px), 34rem"}
                    />
                  </figure>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
