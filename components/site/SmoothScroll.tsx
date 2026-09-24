"use client";

import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { ScrollTrigger, gsap, prefersReducedMotion, registerMotion } from "@/lib/motion";

/**
 * Global smooth scrolling (Lenis) driven by the GSAP ticker.
 *
 * Why one ticker instead of `lenis.raf` in its own `requestAnimationFrame`
 * loop: ScrollTrigger and Lenis then read/write on the *same* frame. Driving
 * them from two loops makes ScrollTrigger see stale positions for one frame,
 * which is exactly the jitter people report when combining the two.
 *
 * `lenis.on("scroll", ScrollTrigger.update)` keeps every pinned/scrubbed
 * trigger in sync while Lenis is still lerping towards its target.
 *
 * Renders nothing - mount it once in app/layout.tsx.
 */
export function SmoothScroll() {
  useGSAP(() => {
    // Honour the OS setting: no smoothing, no ticker, native scrolling.
    if (prefersReducedMotion()) return;

    registerMotion();

    // Header geometry lives in ONE place: the `--header-h` token in
    // globals.css. Read it here so the anchor offset can never drift from the
    // real sticky header height. The extra 24px is breathing room so a
    // permalinked heading never lands flush against the header's bottom edge.
    const headerHeight = (() => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")
        .trim();
      const px = Number.parseFloat(raw);
      return Number.isFinite(px) ? px : 64;
    })();

    const lenis = new Lenis({
      // Lower lerp = longer, heavier glide. 0.09 reads as premium without
      // ever feeling laggy behind the cursor.
      lerp: 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: true,
      gestureOrientation: "vertical",
      // Same-page anchors (skip link, MDX heading permalinks) are intercepted
      // by Lenis; the negative offset keeps the target clear of the header.
      anchors: { offset: -(headerHeight + 24) },
      // Never smooth-scroll for visitors who asked for reduced motion.
      respectReducedMotion: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // GSAP's ticker hands us seconds; Lenis wants milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lenis interpolates forever - never let the ticker "catch up" after a
    // tab was backgrounded, or the page would jump on return.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  });

  return null;
}
