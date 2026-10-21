import { useEffect, useState } from 'react';

// One shared clock for every countdown on the page, ticking on the second
const listeners = new Set();
let timer = null;
function startClock() {
  if (timer) return;
  const tick = () => {
    const now = Date.now();
    listeners.forEach((fn) => fn(now));
    timer = setTimeout(tick, 1000 - (now % 1000) + 5);
  };
  timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
}

export function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    listeners.add(setNow);
    startClock();
    return () => {
      listeners.delete(setNow);
      if (!listeners.size) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    done: diff === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// Closes a popover on outside click or Escape
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, ref]);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
