"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motion, registerMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal for a group of elements.
 *
 * Wrap a section's content in `<RevealGroup>` and mark the children you want
 * animated with `data-reveal`. Each marked element fades up
 * (`y: 30 -> 0`, `opacity: 0 -> 1`) with `power3.out`, staggered 0.1s apart -
 * which is how the project and post grids cascade in.
 *
 * Why a wrapper element carries the animation instead of the card itself:
 * GSAP leaves an inline `transform` behind when a tween finishes, and inline
 * styles beat classes. Animating a wrapper keeps `hover:-translate-y-1` on the
 * card fully functional.
 *
 * Accessibility / robustness
 * --------------------------
 * - Content is only ever hidden by the tween itself (`gsap.from`), never by
 *   CSS. If JS fails to run, or the visitor prefers reduced motion, nothing is
 *   hidden: the matchMedia context simply never matches and no tween exists.
 * - `once: true` means a section animates a single time and then stays put.
 * - `useGSAP` reverts the context on unmount, so navigating away cannot leave
 *   orphaned ScrollTriggers behind.
 */

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  /** Rendered element. Defaults to a plain `div`. */
  as?: ElementType;
  /** Seconds between siblings. Spec value for card grids: 0.1. */
  stagger?: number;
};

export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  stagger = motion.stagger,
}: RevealGroupProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerMotion();

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile:
            "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
          };

          const targets = gsap.utils.toArray<HTMLElement>(
            "[data-reveal]",
            scope.current,
          );
          if (targets.length === 0) return;

          gsap.from(targets, {
            // Full 30px slide on md+, a shorter hop on phones so the reveal
            // never feels slow on a small screen.
            y: desktop ? motion.distance : 16,
            opacity: 0,
            duration: desktop ? motion.duration : 0.5,
            ease: motion.ease,
            stagger: desktop ? stagger : stagger / 2,
            scrollTrigger: {
              trigger: scope.current,
              start: motion.start,
              once: true,
            },
          });
        },
      );
    },
    { scope },
  );

  return (
    <Tag ref={scope} className={cn(className)}>
      {children}
    </Tag>
  );
}
