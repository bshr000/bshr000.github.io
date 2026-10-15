"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const STORAGE_KEY = "badmo-position-v1";
const MARGIN = 12;

export function clampPosition(x: number, y: number, width: number, height: number, viewportWidth: number, viewportHeight: number) {
  return {
    x: Math.max(MARGIN, Math.min(x, Math.max(MARGIN, viewportWidth - width - MARGIN))),
    y: Math.max(36, Math.min(y, Math.max(36, viewportHeight - height - MARGIN))),
  };
}

export function usePetDrag(rootRef: RefObject<HTMLDivElement | null>, buttonRef: RefObject<HTMLButtonElement | null>, onDragStart: () => void) {
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const resetRef = useRef<() => void>(() => {});
  const onStartRef = useRef(onDragStart);
  useEffect(() => { onStartRef.current = onDragStart; }, [onDragStart]);

  useEffect(() => {
    const element = rootRef.current;
    const handle = buttonRef.current;
    if (!element || !handle) return;
    let position: { x: number; y: number } | null = null;
    let normalized: { x: number; y: number } | null = null;
    let gesture: { id: number; x: number; y: number; left: number; top: number } | null = null;
    let frame = 0;
    let target: { x: number; y: number } | null = null;

    const place = (x: number, y: number) => {
      position = clampPosition(x, y, handle.offsetWidth, handle.offsetHeight, window.innerWidth, window.innerHeight);
      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
      element.style.right = "auto";
      element.style.bottom = "auto";
      element.dataset.bubbleSide = position.x < window.innerWidth / 2 ? "right" : "left";
      element.dataset.bubbleBelow = String(position.y < 140);
    };
    const save = () => {
      if (!position) return;
      normalized = { x: position.x / Math.max(1, innerWidth - handle.offsetWidth), y: position.y / Math.max(1, innerHeight - handle.offsetHeight) };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Optional persistence. */ }
    };
    const flush = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (target) { place(target.x, target.y); target = null; }
    };
    const end = () => {
      const wasDragging = draggingRef.current;
      const pointerId = gesture?.id;
      gesture = null;
      flush();
      draggingRef.current = false;
      delete element.dataset.dragging;
      if (pointerId !== undefined && handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
      if (wasDragging) save();
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || gesture) return;
      suppressClickRef.current = false;
      const bounds = handle.getBoundingClientRect();
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top };
      handle.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!draggingRef.current && Math.hypot(dx, dy) < 6) return;
      if (!draggingRef.current) {
        draggingRef.current = true;
        suppressClickRef.current = true;
        element.dataset.dragging = "true";
        onStartRef.current();
      }
      target = { x: gesture.left + dx, y: gesture.top + dy };
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const pointerEnd = (event: PointerEvent) => {
      if (gesture?.id !== event.pointerId) return;
      if (event.type !== "pointerup") suppressClickRef.current = true;
      end();
    };
    const resize = () => {
      end();
      if (normalized) place(normalized.x * (innerWidth - handle.offsetWidth), normalized.y * (innerHeight - handle.offsetHeight));
    };
    const keydown = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const bounds = handle.getBoundingClientRect();
      const step = event.shiftKey ? 40 : 12;
      place(bounds.left + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0), bounds.top + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0));
      save();
    };
    const reset = () => {
      end();
      position = null;
      normalized = null;
      ["left", "top", "right", "bottom"].forEach(property => element.style.removeProperty(property));
      delete element.dataset.bubbleSide;
      delete element.dataset.bubbleBelow;
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Optional persistence. */ }
    };
    resetRef.current = reset;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y) && saved.x >= 0 && saved.x <= 1 && saved.y >= 0 && saved.y <= 1) {
        normalized = saved;
        place(saved.x * (innerWidth - handle.offsetWidth), saved.y * (innerHeight - handle.offsetHeight));
      }
    } catch { /* Ignore invalid or unavailable saved position. */ }
    handle.addEventListener("pointerdown", down);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", pointerEnd);
    handle.addEventListener("pointercancel", pointerEnd);
    handle.addEventListener("lostpointercapture", pointerEnd);
    handle.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", end);
    return () => {
      end();
      resetRef.current = () => {};
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", pointerEnd);
      handle.removeEventListener("pointercancel", pointerEnd);
      handle.removeEventListener("lostpointercapture", pointerEnd);
      handle.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", end);
    };
  }, [rootRef, buttonRef]);

  return { draggingRef, suppressClickRef, resetPosition: useCallback(() => resetRef.current(), []) };
}
