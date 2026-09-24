"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative parallax backdrop for the hero: accent orbs and a dotted grid that
 * drift at different speeds while the page scrolls, so the heading layer
 * visibly separates from the background. The orbs also breathe slowly via CSS
 * keyframes — the parallax transform sits on this wrapper while the keyframe
 * animation sits on the inner element, so the two never fight over the same
 * transform property.
 *
 * Ornamental only: aria-hidden, pointer-events-none, and completely static for
 * prefers-reduced-motion.
 */

const LAYERS = [
  // Small, brighter orb near the heading — closest to the viewer.
  { position: "-left-28 -top-20 h-72 w-72", orb: "bg-accent/25 orb-drift-a", speed: 0.45 },
  // Large, faint orb on the right — furthest away, so it drifts fastest.
  { position: "-right-36 top-16 h-96 w-96", orb: "bg-accent/15 orb-drift-b", speed: 0.75 },
  // Low accent wash peeking in at the fold.
  { position: "left-1/4 -bottom-24 h-64 w-64", orb: "bg-accent/10 orb-drift-a", speed: 0.25 },
] as const;

export function HeroBackdrop() {
  const layers = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;

      layers.current.forEach((el, index) => {
        if (!el) return;
        const shift = Math.max(-140, Math.min(140, y * LAYERS[index].speed));
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    };

    // rAF-throttled: one transform per layer per frame at most, passive so the
    // listener never blocks scrolling.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYERS.map((layer, index) => (
        <div
          key={layer.position}
          ref={(el) => {
            layers.current[index] = el;
          }}
          className={`absolute ${layer.position}`}
        >
          <div className={`h-full w-full rounded-full blur-3xl ${layer.orb}`} />
        </div>
      ))}

      <div className="dot-grid absolute inset-0" />
    </div>
  );
}
