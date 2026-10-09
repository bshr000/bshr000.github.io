"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Grid2X2, BookOpen, X, ZoomIn, ZoomOut } from "lucide-react";
import type { JourneyGallery, JourneyGalleryImage } from "@/types/content";
import styles from "./ChapterAlbum.module.css";

const number = (n: number) => String(n).padStart(2, "0");

type Photo = JourneyGalleryImage & { chapter: number; index: number };
type Viewer = { photos: Photo[]; position: number };

function AlbumImage({ photo, priority = false }: { photo: JourneyGalleryImage; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={styles.imageError}>照片暂时无法加载</span>;
  return <Image src={photo.src} alt={photo.alt ?? "相册照片"} width={photo.width ?? 800} height={photo.height ?? 600}
    priority={priority} sizes="(max-width: 600px) 85vw, (max-width: 1000px) 45vw, 600px" onError={() => setFailed(true)} />;
}

export function ChapterAlbum({ title, period, location, gallery, storyHref }: {
  title: string; period: string; location?: string; gallery: JourneyGallery; storyHref?: string;
}) {
  const [mode, setMode] = useState<"chapters" | "index">("chapters");
  const [filter, setFilter] = useState(-1);
  const [activeChapter, setActiveChapter] = useState(0);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const reading = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  let index = 0;
  const chapters = gallery.sections.map((section, chapter) => ({ ...section,
    photos: section.images.map((photo) => ({ ...photo, chapter, index: index++ })),
  }));
  const photos = chapters.flatMap((chapter) => chapter.photos);
  const cover = (gallery.coverImages ?? photos.slice(0, 3).map((photo) => photo.src))
    .map((src) => photos.find((photo) => photo.src === src)).filter((photo): photo is Photo => Boolean(photo));
  const selected = viewer?.photos[viewer.position];
  const visible = filter < 0 ? photos : chapters[filter].photos;

  useEffect(() => {
    if (mode !== "chapters" || !reading.current) return;
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visibleEntry) setActiveChapter(Number((visibleEntry.target as HTMLElement).dataset.chapter));
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    reading.current.querySelectorAll("[data-chapter]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [mode]);

  const isOpen = viewer !== null;
  useEffect(() => {
    const element = dialog.current;
    if (!element || !isOpen) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function open(photo: Photo, sequence: Photo[]) {
    opener.current = document.activeElement as HTMLElement;
    setZoom(false);
    setViewer({ photos: sequence, position: sequence.findIndex((item) => item.src === photo.src) });
  }
  function move(direction: number) {
    setZoom(false);
    stage.current?.scrollTo(0, 0);
    setViewer((current) => current ? { ...current,
      position: (current.position + direction + current.photos.length) % current.photos.length } : null);
  }
  function start(nextMode: "chapters" | "index") {
    setMode(nextMode);
    document.getElementById("album-browse")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function photoCard(photo: Photo, sequence: Photo[], compact = false) {
    return <figure key={photo.src} className={styles.photo} data-featured={!compact && photo.featured}
      data-small={(photo.width ?? 800) < 400} data-portrait={(photo.height ?? 0) > (photo.width ?? 1)}>
      <button type="button" className={styles.photoButton} onClick={() => open(photo, sequence)}
        aria-label={`查看照片 ${number(photo.index + 1)}：${photo.alt ?? title}`}>
        <span className={styles.photoSurface} style={{ maxWidth: photo.width ?? 800 }}>
          <AlbumImage photo={photo} />
          <span className={styles.viewHint} aria-hidden="true"><ZoomIn size={16} /> 查看照片</span>
        </span>
      </button>
      <figcaption><span>{number(photo.index + 1)}</span>{photo.caption ?? photo.alt}</figcaption>
    </figure>;
  }

  return <div className={`container ${styles.album}`}>
    <nav className={styles.topNav} aria-label="相册导航">
      <Link href={`/journey/#memory-${gallery.slug}`}><ArrowLeft size={15} /> 返回 Journey</Link>
      <span>成长影集 <span className={styles.divider}>/</span> {gallery.label ?? period}</span>
    </nav>

    <header className={styles.cover}>
      <div className={styles.coverText}>
        <p className={styles.eyebrow}>JOURNEY / {gallery.label ?? period}</p>
        <h1>{title}<span>留在照片里的小时候。</span></h1>
        <p className={styles.introduction}>{gallery.introduction}</p>
        <p className={styles.coverMeta}>{period}{location && ` · ${location}`}</p>
        <div className={styles.coverActions}>
          <button type="button" onClick={() => start("chapters")}>开始翻阅 <ArrowDown size={16} /></button>
          <button type="button" onClick={() => start("index")}>全部 {photos.length} 张 <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <div className={styles.coverPictures} aria-label="相册封面照片">
        {cover.map((photo, i) => <button key={photo.src} type="button" className={styles.coverPicture}
          onClick={() => open(photo, chapters[photo.chapter].photos)} aria-label={`查看封面照片：${photo.alt}`}>
          <AlbumImage photo={photo} priority={i === 0} />
        </button>)}
        <p className={styles.coverNote}>{number(chapters.length)} 个章节 <span>—</span> {photos.length} 张旧照片</p>
      </div>
    </header>

    <div id="album-browse" className={styles.browseAnchor} />
    <div className={styles.browse}>
      <div className={styles.toolbar}>
        <div className={styles.modes} role="group" aria-label="相册浏览方式">
          <button type="button" aria-pressed={mode === "chapters"} onClick={() => start("chapters")}><BookOpen size={16} />章节阅读</button>
          <button type="button" aria-pressed={mode === "index"} onClick={() => start("index")}><Grid2X2 size={16} />全部照片 <small>{photos.length}</small></button>
        </div>
        <span className={styles.toolbarHint}>点击照片，慢慢看。</span>
      </div>
      <nav className={styles.chapterNav} aria-label={mode === "chapters" ? "相册章节" : "筛选照片"}>
        {mode === "index" && <button type="button" aria-pressed={filter === -1} onClick={() => { setFilter(-1); start("index"); }}>全部 <small>{photos.length}</small></button>}
        {chapters.map((chapter, i) => mode === "chapters"
          ? <a key={i} href={`#chapter-${i}`} aria-current={activeChapter === i ? "location" : undefined} onClick={() => setActiveChapter(i)}><span>{number(i + 1)}</span>{chapter.title}</a>
          : <button key={i} type="button" aria-pressed={filter === i} onClick={() => { setFilter(i); start("index"); }}>{chapter.title} <small>{chapter.photos.length}</small></button>)}
      </nav>
    </div>

    {mode === "chapters" ? <div ref={reading} className={styles.reading}>
      {chapters.map((chapter, i) => <section key={i} id={`chapter-${i}`} data-chapter={i} className={styles.chapter} aria-labelledby={`chapter-title-${i}`}>
        <header className={styles.chapterHeader}>
          <span className={styles.chapterNumber}>{number(i + 1)}</span>
          <div><h2 id={`chapter-title-${i}`}>{chapter.title}</h2><p>{chapter.description}</p></div>
          <span className={styles.chapterCount}>{chapter.photos.length} 张照片</span>
        </header>
        <div className={styles.editorialGrid}>{chapter.photos.map((photo) => photoCard(photo, chapter.photos))}</div>
        <p className={styles.chapterEnd}>— {chapter.title} · {chapter.photos.length} 张 —</p>
      </section>)}
    </div> : <section className={styles.indexSection} aria-label="照片索引">
      <p className={styles.indexCount} aria-live="polite">{filter < 0 ? "全部照片" : chapters[filter].title} · {visible.length} 张</p>
      <div className={styles.indexGrid}>{visible.map((photo) => photoCard(photo, visible, true))}</div>
    </section>}

    <footer className={styles.albumEnd}>
      <span className={styles.eyebrow}>这一页，先翻到这里。</span>
      <h2>照片之外，还有一些回忆。</h2>
      <div>{storyHref && <Link href={storyHref}>读这段回忆 <ArrowUpRight size={16} /></Link>}
        <Link href="/journey/">回到时间线 <ArrowRight size={16} /></Link></div>
    </footer>

    <dialog ref={dialog} className={styles.lightbox} aria-label="照片查看器" onCancel={() => setViewer(null)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" && !zoom) { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft" && !zoom) { event.preventDefault(); move(-1); }
      }}>
      {selected && <>
        <div className={styles.viewerHeader}>
          <span>{chapters[selected.chapter].title} <small>{number(viewer!.position + 1)} / {number(viewer!.photos.length)}</small></span>
          <div><button type="button" aria-label={zoom ? "还原照片" : "放大照片"} aria-pressed={zoom} onClick={() => { setZoom(!zoom); stage.current?.scrollTo(0, 0); }}>{zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button>
            <button type="button" aria-label="关闭照片查看器" onClick={() => setViewer(null)}><X size={22} /></button></div>
        </div>
        <div ref={stage} className={styles.viewerStage} data-zoom={zoom}
          onTouchStart={(event) => { if (event.touches.length === 1) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; else touch.current = null; }}
          onTouchEnd={(event) => {
            if (!zoom && touch.current && event.changedTouches.length === 1) {
              const dx = event.changedTouches[0].clientX - touch.current.x;
              const dy = event.changedTouches[0].clientY - touch.current.y;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
            }
            touch.current = null;
          }}>
          <div key={selected.src} className={styles.viewerImage} style={{ width: (selected.width ?? 800) * (zoom ? 2 : 1) }}>
            <AlbumImage photo={selected} priority />
          </div>
        </div>
        <div className={styles.viewerFooter}>
          <button type="button" aria-label="上一张照片" disabled={viewer!.photos.length < 2} onClick={() => move(-1)}><ArrowLeft size={22} /></button>
          <div aria-live="polite"><p>{selected.caption ?? selected.alt}</p><small>{zoom ? "放大查看 · 滚动查看细节" : `${number(viewer!.position + 1)} / ${number(viewer!.photos.length)} · 左右切换 · Esc 关闭`}</small></div>
          <button type="button" aria-label="下一张照片" disabled={viewer!.photos.length < 2} onClick={() => move(1)}><ArrowRight size={22} /></button>
        </div>
      </>}
    </dialog>
  </div>;
}
