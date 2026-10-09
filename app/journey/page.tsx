import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllContent } from "@/lib/content";
import {
  getJourneyGallery,
  getJourneyPreviewImages,
  getJourneyReadingTime,
  getJourneyStory,
} from "@/lib/journey";
import { PhotoWindow } from "@/components/journey/PhotoWindow";
import { ArchiveHeader } from "@/components/ArchiveHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Journey",
  description: "Xuyang Zhao 的私人影集，保留值得记住的时间、地点与片段。",
};

export default function JourneyPage() {
  const items = getAllContent("journey");

  return (
    <div className={styles.page}>
      <ArchiveHeader title="Journey" statement="翻开那些属于时间与人生的章节。"
        english="Places I've been. Chapters I've lived. Moments I keep."
        description="A living archive of time, memory, places, and becoming."
        background="/images/headers/journey.png" />

      <section className={`container ${styles.archive}`} aria-label="Memory timeline">
        {items.length > 0 ? (
          <div className={styles.timeline}>
            {items.map((item, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              const current = index === 0;
              const date = item.date ?? item.year ?? "";
              const images = getJourneyPreviewImages(item);
              const gallery = getJourneyGallery(item.slug);
              const story = getJourneyStory(item.slug);
              const galleryHref = gallery ? `/journey/${item.slug}/gallery` : undefined;
              const showCurrentLabel = current && date.trim().toLowerCase() !== "now";

              return (
                <article
                  id={`memory-${item.slug}`}
                  className={styles.memoryEntry}
                  data-side={side}
                  data-variant={index % 3}
                  key={item.slug}
                >
                  <span
                    className={`${styles.marker} ${current ? styles.currentMarker : ""}`}
                    aria-hidden="true"
                  />

                  <div className={styles.memoryContent}>
                    {(date || showCurrentLabel) && (
                      <div className={styles.dateRow}>
                        {date && (
                          <time className={styles.date} dateTime={item.sortDate}>
                            {date}
                          </time>
                        )}
                        {showCurrentLabel && <span className={styles.currentLabel}>Now</span>}
                      </div>
                    )}
                    {item.location && <p className={styles.location}>{item.location}</p>}
                    <h2>{item.title}</h2>

                    <PhotoWindow
                      images={images}
                      title={item.title}
                      priority={index === 0}
                      galleryHref={galleryHref}
                      autoPlay={gallery?.presentation !== "chapters"}
                    />

                    <div className={styles.memoryText}>
                      {item.body.trim() ? (
                        <MDXRemote source={item.body} />
                      ) : (
                        <p>{item.description}</p>
                      )}
                    </div>

                    {(gallery || story) && (
                      <nav className={styles.entryLinks} aria-label={`More from ${item.title}`}>
                        {gallery && (
                          <Link href={`/journey/${item.slug}/gallery`}>
                            <span>Album</span>
                            <span className={styles.linkMeta}>{gallery.images.length} photos</span>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </Link>
                        )}
                        {story && (
                          <Link href={`/journey/${item.slug}/story`}>
                            <span>Story</span>
                            <span className={styles.linkMeta}>{getJourneyReadingTime(story.body)}</span>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </Link>
                        )}
                      </nav>
                    )}
                  </div>
                </article>
              );
            })}

            <p className={styles.continuation}>The rest is still being written.</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No memories have been added yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
