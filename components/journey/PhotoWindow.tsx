"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PhotoWindow.module.css";

interface PhotoWindowProps {
  autoPlay?: boolean;
  images: string[];
  title: string;
  priority?: boolean;
  galleryHref?: string;
}

const formatCount = (value: number) => String(value).padStart(2, "0");

export function PhotoWindow({ images, title, priority = false, galleryHref, autoPlay = true }: PhotoWindowProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const pointerStart = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const imageCount = images.length;

  const showImage = useCallback((nextIndex: number) => {
    if (imageCount < 2) return;

    const normalizedIndex = (nextIndex + imageCount) % imageCount;
    if (normalizedIndex === current) return;

    setPrevious(current);
    setCurrent(normalizedIndex);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    transitionTimer.current = window.setTimeout(() => {
      setPrevious(null);
      transitionTimer.current = null;
    }, 760);
  }, [current, imageCount]);

  const showNext = useCallback(() => {
    showImage(current + 1);
  }, [current, showImage]);

  const showPrevious = useCallback(() => {
    showImage(current - 1);
  }, [current, showImage]);

  useEffect(() => {
    if (!autoPlay || imageCount < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(showNext, 7000);
    return () => window.clearInterval(interval);
  }, [imageCount, paused, showNext, autoPlay]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  if (imageCount === 0) {
    return (
      <div
        className={`${styles.frame} ${styles.emptyFrame}`}
        role="img"
        aria-label={`${title}, no photos added yet`}
      >
        <span>Photos will appear here.</span>
      </div>
    );
  }

  const frameContent = (
    <>
      {previous !== null && (
        <span className={`${styles.imageLayer} ${styles.previousImage}`}>
          <Image
            src={images[previous]}
            alt=""
            fill
            sizes="(max-width: 768px) calc(100vw - 64px), (max-width: 1024px) 43vw, 38vw"
            className={styles.image}
          />
        </span>
      )}
      <span key={current} className={`${styles.imageLayer} ${styles.currentImage}`}>
        <Image
          src={images[current]}
          alt={`${title}, photo ${current + 1} of ${imageCount}`}
          fill
          priority={priority && current === 0}
          sizes="(max-width: 768px) calc(100vw - 64px), (max-width: 1024px) 43vw, 38vw"
          className={styles.image}
        />
      </span>
    </>
  );

  const isFrameInteractive = Boolean(galleryHref) || imageCount > 1;
  const frameLabel = galleryHref
    ? `Open the full album for ${title}`
    : `Show next photo from ${title}`;

  return (
    <div
      className={styles.photoWindow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {isFrameInteractive ? (
        <button
          className={styles.frame}
          type="button"
          onClick={() => {
            if (didSwipe.current) {
              didSwipe.current = false;
              return;
            }

            if (galleryHref) {
              router.push(galleryHref);
              return;
            }

            showNext();
          }}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
            didSwipe.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;

            if (Math.abs(distance) < 40) return;
            didSwipe.current = true;
            if (distance < 0) showNext();
            else showPrevious();
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
            didSwipe.current = false;
          }}
          aria-label={frameLabel}
        >
          {frameContent}
        </button>
      ) : (
        <div className={styles.frame}>{frameContent}</div>
      )}

      <div className={styles.controls} data-single={imageCount === 1}>
        {imageCount > 1 && (
          <div className={styles.arrows}>
            <button type="button" onClick={showPrevious} aria-label={`Previous photo from ${title}`}>
              <ArrowLeft size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={showNext} aria-label={`Next photo from ${title}`}>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
        <span className={styles.counter} aria-live="polite">
          {formatCount(current + 1)} / {formatCount(imageCount)}
        </span>
      </div>
    </div>
  );
}
