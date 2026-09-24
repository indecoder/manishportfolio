"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerMotion } from "@/lib/motion";

/**
 * The site's single background layer.
 *
 * Why this exists
 * ---------------
 * Ambient colour used to be painted per section (`<AmbientOrbs>` inside each
 * `<section class="overflow-hidden">`). Every section then clipped its own
 * gradient at its own box edge, which read as harsh horizontal seams wherever
 * two sections met. This component replaces all of that with ONE layer that is
 * `position: fixed` and lives outside the document flow, so the wash is
 * continuous from the top of the page to the bottom of the footer.
 *
 * Structure (three nested layers, each animating a different property so they
 * compose instead of overwriting each other):
 *
 *   .global-bg              fixed viewport-sized canvas + base mesh gradient
 *     .global-bg-parallax   GSAP scrub `yPercent`  <- scroll parallax
 *       .global-bg-blob--*  CSS keyframe drift     <- endless ambient motion
 *
 * Keeping the scroll transform on the wrapper and the keyframes on the blobs
 * matters: both write `transform`, so putting them on the same element would
 * make GSAP's inline style cancel the CSS animation.
 *
 * Content scrolls normally above it - the layer never moves with the page, so
 * the parallax comes from the content passing over a stationary, breathing
 * background. Cards are translucent (`glass`), so the wash shows through them.
 *
 * Accessibility / performance
 * ---------------------------
 * - `aria-hidden` + `pointer-events: none`: pure decoration, never focusable.
 * - `gsap.matchMedia` matches nothing under `prefers-reduced-motion`, and the
 *   CSS keyframes are switched off in the same media query, so the background
 *   becomes still art there.
 * - `useGSAP` scopes everything to a `gsap.context`, so the ScrollTrigger is
 *   reverted on unmount instead of leaking between routes.
 */
export function GlobalBackground() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerMotion();

      const layer = scope.current?.querySelector<HTMLElement>(
        "[data-bg-parallax]",
      );
      if (!layer) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scrubbed against the whole document: the wash drifts a few percent
        // of the viewport height from the top of the page to the bottom, which
        // is enough depth to feel layered without ever distracting.
        gsap.fromTo(
          layer,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden className="global-bg">
      {/* Animated mesh wash. `background-position` keyframes live on this
          element only, so the parallax transform above stays independent. */}
      <div className="global-bg-mesh" />

      <div data-bg-parallax className="global-bg-parallax">
        <div className="global-bg-blob global-bg-blob--blue" />
        <div className="global-bg-blob global-bg-blob--purple" />
        <div className="global-bg-blob global-bg-blob--indigo" />
      </div>
    </div>
  );
}
