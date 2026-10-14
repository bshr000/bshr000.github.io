"use client";
import { useEffect } from "react";
export function ArchiveAnchors() {
  useEffect(() => {
    const reveal = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const target = document.getElementById(id);
      const section = target?.closest<HTMLDetailsElement>("details[data-work-archive]");
      if (!section) return;
      section.open = true;
      requestAnimationFrame(() => target?.scrollIntoView({ block: "start", behavior: "instant" }));
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a");
      if (link?.getAttribute("href") === window.location.hash) reveal();
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("hashchange", reveal); document.removeEventListener("click", onClick); };
  }, []);
  return null;
}
