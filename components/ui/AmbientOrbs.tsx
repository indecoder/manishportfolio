"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Ambient parallax gradient orbs.
 *
 * Soft, heavily blurred pale blue / purple discs that sit *behind* page
 * content (`-z-10`) and drift vertically as the visitor scrolls. They are pure
 * atmosphere: no text, no interaction, `aria-hidden`.
 *
 * Motion rules
 * ------------
 * - `yPercent` is scrubbed against the *section* the orbs live in, so each orb
 *   travels a percentage of its own size - predictable on any viewport.
 * - A per-orb `depth` makes nearby discs move further than distant ones, which
 *   is what actually sells the parallax.
 * - Desktop adds a slow endless drift so a resting page never looks frozen.
 * - `gsap.matchMedia` simplifies everything below `lg` (half the travel, no
 *   drift) and matches *nothing* under `prefers-reduced-motion`, so the orbs
 *   simply render as still background art there.
 *
 * Because `useGSAP` wraps the callback in a `gsap.context`, the matchMedia
 * instance and every tween/ScrollTrigger created inside it are reverted on
 * unmount - no leaked listeners when navigating between routes.
 */

type Orb = {
  /** Tailwind placement + size. */
  placement: string;
  /** Pale wash. Keep these low-opacity: they sit behind text. */
  tone: string;
  /** How far this orb travels while scrolling (1 = reference speed). */
  depth: number;
  /** Endless drift in px / scale units. Desktop only. */
  drift: { x: number; y: number; scale: number; duration: number };
};

export type AmbientOrbsPreset = "hero" | "contact" | "section";

const PRESETS: Record<AmbientOrbsPreset, Orb[]> = {
  /** Behind the hero: the strongest wash on the site. */
  hero: [
    {
      placement: "-left-32 -top-28 h-[30rem] w-[30rem] sm:h-[34rem] sm:w-[34rem]",
      tone: "bg-blue-300/40",
      depth: 1.15,
      drift: { x: 22, y: -18, scale: 1.06, duration: 16 },
    },
    {
      placement: "-right-40 top-0 h-[32rem] w-[32rem] sm:h-[38rem] sm:w-[38rem]",
      tone: "bg-purple-300/30",
      depth: 0.7,
      drift: { x: -26, y: 20, scale: 0.94, duration: 21 },
    },
    {
      placement: "-bottom-24 left-[38%] h-[24rem] w-[24rem]",
      tone: "bg-indigo-200/45",
      depth: 1.5,
      drift: { x: 16, y: -24, scale: 1.04, duration: 18 },
    },
  ],

  /** Behind the contact panel: tighter, calmer. */
  contact: [
    {
      placement: "-left-20 -top-24 h-[22rem] w-[22rem]",
      tone: "bg-blue-300/35",
      depth: 1.1,
      drift: { x: 18, y: -12, scale: 1.05, duration: 17 },
    },
    {
      placement: "-bottom-28 -right-16 h-[26rem] w-[26rem]",
      tone: "bg-purple-300/30",
      depth: 0.85,
      drift: { x: -20, y: 14, scale: 0.96, duration: 20 },
    },
  ],

  /** Interior pages: two quiet discs so the ambience continues. */
  section: [
    {
      placement: "-right-32 -top-16 h-[24rem] w-[24rem]",
      tone: "bg-blue-200/40",
      depth: 0.9,
      drift: { x: 14, y: -10, scale: 1.04, duration: 19 },
    },
    {
      placement: "-left-28 bottom-0 h-[20rem] w-[20rem]",
      tone: "bg-purple-200/30",
      depth: 1.25,
      drift: { x: -16, y: 12, scale: 0.97, duration: 23 },
    },
  ],
};

type AmbientOrbsProps = {
  preset?: AmbientOrbsPreset;
  className?: string;
};

export function AmbientOrbs({ preset = "section", className }: AmbientOrbsProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerMotion();

      const orbs = gsap.utils.toArray<HTMLElement>("[data-orb]", scope.current);
      if (orbs.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          compact:
            "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop } = context.conditions as {
            desktop: boolean;
            compact: boolean;
          };

          // Small screens: keep a hint of depth, drop the endless drift.
          const range = desktop ? 1 : 0.45;

          orbs.forEach((orb) => {
            const depth = Number(orb.dataset.depth ?? 1) || 1;

            gsap.fromTo(
              orb,
              { yPercent: -7 * depth * range },
              {
                yPercent: 9 * depth * range,
                ease: "none",
                scrollTrigger: {
                  trigger: scope.current,
                  start: "top bottom",
                  end: "bottom top",
                  // A scrub lag on desktop makes the parallax feel weighted;
                  // `true` (1:1 tracking) is cheaper on phones.
                  scrub: desktop ? 1.2 : true,
                  invalidateOnRefresh: true,
                },
              },
            );

            // Different transform components (x/y/scale vs yPercent), so this
            // endless drift composes with the scrubbed parallax safely.
            if (desktop) {
              gsap.to(orb, {
                x: Number(orb.dataset.driftX ?? 0),
                y: Number(orb.dataset.driftY ?? 0),
                scale: Number(orb.dataset.driftScale ?? 1),
                duration: Number(orb.dataset.driftDuration ?? 18),
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              });
            }
          });
        },
      );
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {PRESETS[preset].map((orb) => (
        <div
          key={orb.placement}
          data-orb
          data-depth={orb.depth}
          data-drift-x={orb.drift.x}
          data-drift-y={orb.drift.y}
          data-drift-scale={orb.drift.scale}
          data-drift-duration={orb.drift.duration}
          className={cn("absolute rounded-full blur-3xl", orb.tone, orb.placement)}
        />
      ))}
    </div>
  );
}
