"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import type { AboutPhoto } from "@/lib/about";
import { withBasePath } from "@/lib/site";
import styles from "./PhotoGallery.module.css";

export default function PhotoGallery({ photos }: { photos: AboutPhoto[] }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = photos[index];
  if (!photo) return null;

  function move(direction: number) {
    setIndex(current => (current + direction + photos.length) % photos.length);
  }

  return (
    <div className={styles.gallery}>
      <button className={styles.photo} onClick={() => dialog.current?.showModal()} aria-label={`放大照片：${photo.caption}`}>
        <Image src={withBasePath(photo.src)} alt={photo.alt} fill priority sizes="(max-width: 768px) 92vw, 56vw" style={{ objectPosition: photo.objectPosition }} />
        <span className={styles.enlarge}><Maximize2 size={16} aria-hidden="true" /></span>
      </button>
      <div className={styles.caption}>
        <span>{photo.caption}</span>
        {photos.length > 1 && <div className={styles.controls}>
          <button onClick={() => move(-1)} aria-label="上一张照片"><ArrowLeft size={18} /></button>
          <span aria-live="polite">{index + 1} / {photos.length}</span>
          <button onClick={() => move(1)} aria-label="下一张照片"><ArrowRight size={18} /></button>
        </div>}
      </div>
      {photos.length > 1 && <div className={styles.thumbnails} aria-label="选择照片">
        {photos.map((item, i) => <button key={item.id} onClick={() => setIndex(i)} aria-label={`查看${item.caption}`} aria-pressed={i === index}>
          <Image src={withBasePath(item.src)} alt={item.alt} width={160} height={100} style={{ objectPosition: item.objectPosition }} />
        </button>)}
      </div>}
      <dialog ref={dialog} className={styles.dialog} aria-label="个人照片预览">
        <div className={styles.dialogToolbar}>
          <span>{photo.caption}</span>
          <button onClick={() => dialog.current?.close()} aria-label="关闭照片预览"><X size={24} /></button>
        </div>
        <div className={styles.fullPhoto}><Image src={withBasePath(photo.src)} alt={photo.alt} fill sizes="95vw" /></div>
        {photos.length > 1 && <div className={styles.dialogControls}>
          <button onClick={() => move(-1)} aria-label="预览上一张"><ArrowLeft size={20} /></button>
          <span aria-live="polite">{index + 1} / {photos.length}</span>
          <button onClick={() => move(1)} aria-label="预览下一张"><ArrowRight size={20} /></button>
        </div>}
      </dialog>
    </div>
  );
}
