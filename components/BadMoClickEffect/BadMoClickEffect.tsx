"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./BadMoClickEffect.module.css";

const DEFAULT_DURATION = 820;
const DEFAULT_MAX_MARKS = 24;

interface PawMark {
  id: number;
  rotation: number;
  scale: number;
  x: number;
  y: number;
}

type PawStyle = CSSProperties & {
  "--paw-rotation": string;
  "--paw-scale": number;
  "--paw-duration": string;
  "--paw-x": string;
  "--paw-y": string;
};

export interface BadMoClickEffectProps {
  duration?: number;
  markSrc?: string;
  maxMarks?: number;
}

export function BadMoClickEffect({
  duration = DEFAULT_DURATION,
  markSrc,
  maxMarks = DEFAULT_MAX_MARKS,
}: BadMoClickEffectProps) {
  const [marks, setMarks] = useState<PawMark[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, number>());

  useEffect(() => {
    const timers = timersRef.current;

    const handleClick = (event: MouseEvent) => {
      if (event.detail === 0 || (event.target instanceof Element && event.target.closest("[data-badmo-pet]"))) {
        return;
      }

      const id = nextIdRef.current++;
      const mark: PawMark = {
        id,
        x: event.clientX,
        y: event.clientY,
        rotation: Math.round(Math.random() * 30 - 15),
        scale: Number((0.9 + Math.random() * 0.2).toFixed(2)),
      };

      setMarks((current) => [...current, mark].slice(-maxMarks));

      const timer = window.setTimeout(() => {
        setMarks((current) => current.filter((item) => item.id !== id));
        timers.delete(id);
      }, duration);

      timers.set(id, timer);
    };

    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, [duration, maxMarks]);

  return (
    <div className={styles.layer} data-badmo-click-layer aria-hidden="true">
      {marks.map((mark) => {
        const style: PawStyle = {
          "--paw-x": `${mark.x}px`,
          "--paw-y": `${mark.y}px`,
          "--paw-rotation": `${mark.rotation}deg`,
          "--paw-scale": mark.scale,
          "--paw-duration": `${duration}ms`,
        };

        return (
          <span
            key={mark.id}
            className={styles.effect}
            data-badmo-paw
            style={style}
          >
            {markSrc ? (
              <span
                className={styles.imageMark}
                style={{ backgroundImage: `url(${JSON.stringify(markSrc)})` }}
              />
            ) : (
              <span className={styles.paw}>
                <span className={styles.pad} />
                <span className={`${styles.toe} ${styles.toeOne}`} />
                <span className={`${styles.toe} ${styles.toeTwo}`} />
                <span className={`${styles.toe} ${styles.toeThree}`} />
                <span className={`${styles.toe} ${styles.toeFour}`} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
