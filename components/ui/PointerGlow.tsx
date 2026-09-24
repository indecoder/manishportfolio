"use client";

import { useEffect, useRef } from "react";

type PointerGlowProps = {
  /** Halo size in rem. Bigger reads as atmosphere, smaller as a spotlight. */
  size?: number;
  /** Accent opacity at the halo core. */
  intensity?: number;
};

/**
 * Decorative halo that chases the pointer with a lag (lerp ~0.09) inside the
 * nearest positioned ancestor. The trailing motion is the effect: the glow
 * always feels half a beat behind the cursor. Render it inside a single
 * aria-hidden layer; it is pointer-events-none and renders nothing (static,
 * no listeners) under prefers-reduced-motion.
 */
export function PointerGlow({ size = 30, intensity = 22 }: PointerGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let active = false;

    const step = () => {
      frame = 0;
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      el.style.transform = `translate3d(${(x - el.offsetWidth / 2).toFixed(
        1,
      )}px, ${(y - el.offsetHeight / 2).toFixed(1)}px, 0)`;
      if (Math.abs(targetX - x) > 0.4 || Math.abs(targetY - y) > 0.4) {
        frame = requestAnimationFrame(step);
      } else {
        active = false;
      }
    };

    const kick = () => {
      if (!active) {
        active = true;
        frame = requestAnimationFrame(step);
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      kick();
    };

    root.addEventListener("pointermove", onMove);

    return () => {
      root.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 opacity-90"
      style={{
        width: `${size}rem`,
        height: `${size * 0.8}rem`,
        background: `radial-gradient(closest-side, color-mix(in oklab, var(--accent) ${intensity}%, transparent), transparent)`,
        willChange: "transform",
      }}
    />
  );
}