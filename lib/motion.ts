import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single source of truth for the motion system.
 *
 * Every animated component imports GSAP + ScrollTrigger from here instead of
 * from `gsap` directly, so:
 *
 *   1. The plugin is registered exactly once, in the browser only. Registering
 *      during prerender would let ScrollTrigger initialise against a DOM that
 *      does not exist, which is the usual source of "cannot read property of
 *      null" errors during `next build`.
 *   2. Shared numbers (distance, easing, stagger, trigger start) stay identical
 *      across every section, so the page reads as one choreography.
 *
 * Call `registerMotion()` at the top of every `useGSAP` callback. It is
 * idempotent and a no-op on the server.
 */

let registered = false;

/** Idempotent, browser-only plugin registration. */
export function registerMotion(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };

/** Shared motion values. See components/ui/RevealGroup.tsx for usage. */
export const motion = {
  /** Spec: fade + slide up with `power3.out`. */
  ease: "power3.out",
  /** Seconds for a full reveal. */
  duration: 0.8,
  /** Pixels each element travels on entry (`y: 30 -> 0`). */
  distance: 30,
  /** Seconds between siblings — project/post cards stagger by this. */
  stagger: 0.1,
  /** Where a section starts animating, relative to the viewport. */
  start: "top 85%",
} as const;

/** Media query used by every `gsap.matchMedia` context. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor asked for reduced motion. Animated components bail out
 * early so content is never left at `opacity: 0`.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION).matches;
}
