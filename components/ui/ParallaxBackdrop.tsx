"use client";

import { ParallaxLayer } from "@/components/ui/ParallaxLayer";

type ParallaxBackdropProps = {
  /** Horizontal position of the main glow: "left" | "right" | "center". */
  side?: "left" | "right" | "center";
  /** Counter-scroll speed of the main glow; vary it between sections. */
  speed?: number;
  /** Glow size in rem. */
  size?: number;
};

const sideClass: Record<NonNullable<ParallaxBackdropProps["side"]>, string> = {
  left: "left-[-8rem] top-[-4rem]",
  right: "right-[-8rem] top-[-2rem]",
  // The ParallaxLayer wrapper is centred via its `centered` prop so the
  // inline parallax transform and the centring never fight.
  center: "left-1/2 top-[-6rem]",
};

/**
 * Section-level depth: TWO accent glows counter-scrolling behind the content
 * at different speeds and sizes, so the layers visibly separate from each
 * other and from the static content as you scroll. aria-hidden +
 * pointer-events-none, and ParallaxLayer no-ops under prefers-reduced-motion.
 *
 * Render inside a `relative overflow-hidden` section; content siblings need
 * `relative` to sit above it.
 */
export function ParallaxBackdrop({
  side = "right",
  speed = 0.16,
  size = 30,
}: ParallaxBackdropProps) {
  const companionSide = side === "left" ? "right" : "left";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <ParallaxLayer speed={speed} maxShift={180} className="absolute inset-0">
        <div
          className={`glow-orb orb-drift-a absolute ${sideClass[side]}`}
          style={{ width: `${size}rem`, height: `${size}rem` }}
        />
      </ParallaxLayer>

      <ParallaxLayer
        speed={speed * 2.2}
        maxShift={260}
        centered={side === "center"}
        className="absolute inset-0"
      >
        <div
          className={`glow-orb orb-drift-b absolute ${sideClass[companionSide]} bottom-[-6rem] top-auto`}
          style={{ width: `${size * 0.6}rem`, height: `${size * 0.6}rem` }}
        />
      </ParallaxLayer>
    </div>
  );
}