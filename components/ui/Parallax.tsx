"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Scroll parallax: children drift at a different speed from the page, giving
 * the hero depth without an animation library.
 *
 *   <Parallax speed={0.12}>…</Parallax>
 *
 *   speed 0    -> scrolls normally
 *   speed 0.12 -> lags the scroll slightly (classic hero drift)
 *   speed 1    -> glued to the viewport
 *
 * The shift is window.scrollY * speed, clamped to maxShift so a long page can
 * never drag the layer away from its section. Built for above-the-fold layers;
 * anything below the fold should use <Reveal> instead. Disabled entirely when
 * the user prefers reduced motion.
 */
export function Parallax({
  children,
  speed = 0.2,
  maxShift = 120,
  className,
}: {
  children?: ReactNode;
  /** 0 = scrolls normally, 1 = glued to the viewport. */
  speed?: number;
  /** Largest drift in px the layer may accumulate. */
  maxShift?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const shift = Math.max(-maxShift, Math.min(maxShift, window.scrollY * speed));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    // rAF-throttled: at most one transform per frame, passive so scrolling
    // is never blocked by this listener.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed, maxShift]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
