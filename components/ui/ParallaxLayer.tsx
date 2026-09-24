"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type ParallaxLayerProps = {
  /** Fraction of section overshoot this layer moves by (0.3 = 30%). */
  speed: number;
  /** Cap on the transform, in px. Layers further "back" want a bigger cap. */
  maxShift?: number;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

/**
 * Scroll-parallax for a DECORATIVE layer (aria-hidden). Translates the layer
 * as the owning section scrolls past, so layers at different speeds separate
 * from the static content and from each other - that contrast is where the
 * depth reads. Content must never sit inside a layer: moving text is what
 * made the earlier version look smeared.
 *
 * One rAF-throttled passive scroll listener per layer, transform-only, and
 * fully inert under prefers-reduced-motion.
 */
export function ParallaxLayer({
  speed,
  maxShift = 160,
  className,
  style,
  children,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const overshoot = Math.max(0, -rect.top);
      const shift = Math.min(overshoot * speed, maxShift);
      el.style.transform = `translate3d(0, ${-shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (window.scrollY === lastY) return;
      lastY = window.scrollY;
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
    <div ref={ref} aria-hidden className={className} style={style}>
      {children}
    </div>
  );
}