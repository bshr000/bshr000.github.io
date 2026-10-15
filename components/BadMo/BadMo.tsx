"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  BADMO_ACTIONS,
  BADMO_EVENTS,
  BADMO_SPRITE,
  DEFAULT_DIALOGUES,
  ACTION_SEQUENCES,
  getFramePosition,
  getPageProfile,
  pickInteractionAction,
  type BadMoActionId,
  type BadMoMood,
} from "./animations";
import { usePetDrag } from "./usePetDrag";
import { RotateCcw } from "lucide-react";
import styles from "./BadMo.module.css";

const DEFAULT_STORAGE_KEY = "badmo-interaction-count";
const POINTER_REACTION_DISTANCE = 120;

export interface BadMoInteractionDetail {
  action: Exclude<BadMoActionId, "idle">;
  count: number;
  mood: BadMoMood;
  pathname: string;
}

export interface BadMoHandle {
  getInteractionCount: () => number;
  play: (action: Exclude<BadMoActionId, "idle">, message?: string) => void;
  say: (message: string) => void;
}

export interface BadMoProps {
  className?: string;
  dialogues?: readonly string[];
  interactionStorageKey?: string;
  mood?: BadMoMood;
  onActionChange?: (action: BadMoActionId) => void;
  onInteract?: (detail: BadMoInteractionDetail) => void;
  showDialogue?: boolean;
  spriteSrc: string;
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

export const BadMo = forwardRef<BadMoHandle, BadMoProps>(function BadMo(
  {
    className,
    dialogues = DEFAULT_DIALOGUES,
    interactionStorageKey = DEFAULT_STORAGE_KEY,
    mood: moodOverride,
    onActionChange,
    onInteract,
    showDialogue = true,
    spriteSrc,
  },
  ref,
) {
  const pathname = usePathname();
  const pageProfile = getPageProfile(pathname);
  const mood = moodOverride ?? pageProfile.mood;
  const reducedMotion = useReducedMotion();
  const [activeAction, setActiveAction] = useState<BadMoActionId>("idle");
  const [animationNonce, setAnimationNonce] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spriteRef = useRef<HTMLSpanElement>(null);
  const actionTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const lookingRef = useRef(false);
  const interactionCountRef = useRef(0);

  const previousInteractionRef = useRef<
    Exclude<BadMoActionId, "idle"> | undefined
  >(undefined);

  const setSpriteFrame = useCallback((row: number, frame: number) => {
    if (spriteRef.current) {
      spriteRef.current.style.backgroundPosition = getFramePosition(row, frame);
    }
  }, []);

  const { draggingRef, suppressClickRef, resetPosition } = usePetDrag(rootRef, buttonRef, () => {
    if (actionTimerRef.current !== null) window.clearTimeout(actionTimerRef.current);
    busyRef.current = false;
    lookingRef.current = false;
    rootRef.current?.removeAttribute("data-near");
    setActiveAction("idle");
    setBubble(null);
    setSpriteFrame(0, 0);
  });

  const say = useCallback((message: string) => {
    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current);
    }

    setBubble(message);
    bubbleTimerRef.current = window.setTimeout(() => {
      setBubble(null);
      bubbleTimerRef.current = null;
    }, 2_400);
  }, []);

  const play = useCallback(
    (action: Exclude<BadMoActionId, "idle">, message?: string) => {
      if (busyRef.current || draggingRef.current) return;

      busyRef.current = true;
      lookingRef.current = false;
      rootRef.current?.removeAttribute("data-near");
      setActiveAction(action);
      setAnimationNonce((value) => value + 1);
      onActionChange?.(action);

      if (message && showDialogue) {
        say(message);
      }

    },
    [onActionChange, say, showDialogue, draggingRef],
  );

  useImperativeHandle(
    ref,
    () => ({
      getInteractionCount: () => interactionCountRef.current,
      play,
      say,
    }),
    [play, say],
  );

  useEffect(() => {
    try {
      const savedCount = window.localStorage.getItem(interactionStorageKey);
      interactionCountRef.current = savedCount ? Number.parseInt(savedCount, 10) || 0 : 0;
    } catch {
      interactionCountRef.current = 0;
    }
  }, [interactionStorageKey]);

  // One scheduler owns both frame playback and action completion.
  useEffect(() => {
    let cancelled = false;
    const schedule = (callback: () => void, delay: number) => {
      actionTimerRef.current = window.setTimeout(() => {
        if (!cancelled) callback();
      }, delay);
    };
    const finish = () => {
      busyRef.current = false;
      setSpriteFrame(0, 0);
      setActiveAction("idle");
      onActionChange?.("idle");
    };
    setSpriteFrame(0, 0);

    if (reducedMotion) {
      if (activeAction !== "idle") schedule(finish, 250);
    } else if (activeAction === "idle") {
      // Other idle cells contain isolated tail fragments. Keep the verified
      // clean standing cell until a consistent blink sequence is available.
      setSpriteFrame(0, 0);
    } else {
      const sequence = ACTION_SEQUENCES[activeAction];
      let index = 0;
      const advance = () => {
        const step = sequence[index++];
        if (!step || document.hidden) { finish(); return; }
        setSpriteFrame(step.row, step.frame);
        schedule(advance, step.hold);
      };
      advance();
    }
    const onVisibility = () => {
      if (!document.hidden) return;
      if (actionTimerRef.current !== null) window.clearTimeout(actionTimerRef.current);
      finish();
      setAnimationNonce(value => value + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      if (actionTimerRef.current !== null) window.clearTimeout(actionTimerRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [activeAction, animationNonce, reducedMotion, setSpriteFrame, onActionChange]);

  useEffect(() => {
    if (reducedMotion) return;
    let dwell: number | undefined;
    const reset = () => {
      window.clearTimeout(dwell);
      dwell = undefined;
      const wasLooking = lookingRef.current;
      lookingRef.current = false;
      rootRef.current?.removeAttribute("data-near");
      if (wasLooking && !busyRef.current) setSpriteFrame(0, 0);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || busyRef.current || draggingRef.current || !buttonRef.current) {
        reset(); return;
      }
      const bounds = buttonRef.current.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - bounds.left - bounds.width / 2,
        event.clientY - bounds.top - bounds.height / 2);
      // Separate entry/exit radii avoid flickering along the boundary.
      if (distance > (lookingRef.current ? 160 : POINTER_REACTION_DISTANCE)) {
        reset(); return;
      }
      if (lookingRef.current || dwell !== undefined) return;
      dwell = window.setTimeout(() => {
        dwell = undefined;
        if (busyRef.current || draggingRef.current || document.hidden) return;
        lookingRef.current = true;
        rootRef.current?.setAttribute("data-near", "true");
        // Same standing pose: acknowledge proximity without a full-body turn.
        setSpriteFrame(0, 0);
      }, 220);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [reducedMotion, setSpriteFrame, draggingRef]);

  useEffect(() => {
    return () => {
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
      }
      if (bubbleTimerRef.current !== null) {
        window.clearTimeout(bubbleTimerRef.current);
      }
    };
  }, []);

  const handleInteraction = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current && event.detail !== 0) {
      suppressClickRef.current = false;
      return;
    }
    if (busyRef.current || draggingRef.current) {
      return;
    }

    const action = pickInteractionAction(previousInteractionRef.current);
    const nextCount = interactionCountRef.current + 1;
    const easterEggMessage =
      nextCount === 7
        ? "你已经摸清我的脾气了。"
        : nextCount === 21
          ? "这是我们的第 21 次默契。"
          : undefined;
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    const message = easterEggMessage ?? randomDialogue;

    previousInteractionRef.current = action;
    interactionCountRef.current = nextCount;

    try {
      window.localStorage.setItem(interactionStorageKey, String(nextCount));
    } catch {
      // Interaction remains available when storage is blocked.
    }

    const detail: BadMoInteractionDetail = {
      action,
      count: nextCount,
      mood,
      pathname,
    };

    window.dispatchEvent(
      new CustomEvent<BadMoInteractionDetail>(BADMO_EVENTS.interaction, { detail }),
    );
    onInteract?.(detail);
    play(action, message);
  };

  const actionDefinition = BADMO_ACTIONS[activeAction];
  const rootClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      data-badmo-pet
      data-action={activeAction}
      data-mood={mood}
      data-motion={actionDefinition.motion}
    >
      {showDialogue && bubble ? (
        <div className={styles.bubble} role="status" aria-live="polite">
          {bubble}
        </div>
      ) : null}

      <button
        ref={buttonRef}
        className={styles.button}
        type="button"
        aria-label="和坏墨 BadMo 互动"
        onClick={handleInteraction}
        title="点击互动，按住拖动；聚焦后可用方向键移动"
      >
        <span className={styles.floatLayer} aria-hidden="true">
          <span
            ref={spriteRef}
            className={styles.sprite}
            style={{
              backgroundPosition: getFramePosition(0, 0),
              backgroundImage: `url(${JSON.stringify(spriteSrc)})`,
              backgroundSize: `${BADMO_SPRITE.columns * 100}% ${BADMO_SPRITE.rows * 100}%`,
            }}
          />
        </span>
      </button>
      <button type="button" className={styles.reset} onClick={resetPosition} aria-label="将 BadMo 放回右下角" title="回到右下角"><RotateCcw size={14} aria-hidden="true" /></button>
    </div>
  );
});

BadMo.displayName = "BadMo";
