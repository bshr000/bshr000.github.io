'use client';
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useMapTheme() {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === 'dark', () => false);
}
