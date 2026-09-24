"use client";

import { ParallaxLayer } from "@/components/ui/ParallaxLayer";

type ParallaxBackdropProps = {
  /** Horizontal position of the glow: "left" | "right" | "center". */
  side?: "left" | "right" | "center";
  /** Counter-scroll speed; vary it between sections so depth keeps shifting. */
  speed?: number;
  /** Glow size in rem. */
  size?: number;
};

const sideClass: Record<NonNullable<ParallaxBackdropProps["side"]>, string> = {
  left: "left-[-8rem] top-[-4rem]",
  right: "right-[-8rem] top-[-2rem]",
  // mx-auto (not -translate-x-1/2): ParallaxLayer writes an inline transform,
  // which would override a transform-based centering utility.
  center: "left-0 right-0 top-[-6rem] mx-auto",
};

/**
 * Section-level depth: one accent glow counter-scrolling behind the content
 * at a different rate per section, so the page keeps separating into layers
 * as you scroll. aria-hidden + pointer-events-none, and ParallaxLayer no-ops
 * under prefers-reduced-motion.
 *
 * Render inside a `relative overflow-hidden` section; content siblings need
 * `relative` to sit above it.
 */
export function ParallaxBackdrop({
  side = "right",
  speed = 0.14,
  size = 26,
}: ParallaxBackdropProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <ParallaxLayer speed={speed} maxShift={140} className="absolute inset-0">
        <div
          className={`glow-orb absolute ${sideClass[side]}`}
          style={{ width: `${size}rem`, height: `${size}rem` }}
        />
      </ParallaxLayer>
    </div>
  );
}