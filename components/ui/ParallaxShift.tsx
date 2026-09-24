"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ParallaxShiftProps = {
  children: ReactNode;
  /** Fraction of distance-from-viewport-centre this block lags by. */
  speed?: number;
  /** Cap on the transform in px - keep small for blocks containing text. */
  maxShift?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Bidirectional scroll parallax for a CONTENT block: shifts its children both
 * entering and leaving the viewport, relative to the viewport centre, so the
 * motion is obvious during a normal scroll.
 *
 * Keep `speed` small (0.04-0.08) and `maxShift` tight (<=48px) whenever text
 * is inside: the block drifts as a unit, so it reads as depth rather than
 * smear. Transform-only, rAF-throttled, inert under prefers-reduced-motion.
 */
export function ParallaxShift({
  children,
  speed = 0.06,
  maxShift = 40,
  className,
  style,
}: ParallaxShiftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const elementCentre = rect.top + rect.height / 2;
      const offset = elementCentre - window.innerHeight / 2;
      const shift = Math.max(-maxShift, Math.min(maxShift, -offset * speed));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [speed, maxShift]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}