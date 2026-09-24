"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/lib/site";

type Tilt = { rotateX: number; rotateY: number; x: number; y: number };

const NO_TILT: Tilt = { rotateX: 0, rotateY: 0, x: 0, y: 0 };

/**
 * Portrait card with pointer-driven depth: the card tilts in 3D toward the
 * cursor (max ~5deg), an accent glow inside the card tracks the pointer, and
 * the floating chips drift at their own depths. Static everywhere else -
 * no listeners under prefers-reduced-motion, and they never touch layout.
 */
export function HeroPortrait() {
  const [tilt, setTilt] = useState<Tilt>(NO_TILT);
  const reducedMotion = useRef<boolean | null>(null);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion.current === null) {
      reducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
    if (reducedMotion.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -py * 10,
      rotateY: px * 10,
      x: px * rect.width,
      y: py * rect.height,
    });
  }, []);

  const onPointerLeave = useCallback(() => setTilt(NO_TILT), []);

  const moving = tilt.rotateX !== 0 || tilt.rotateY !== 0;

  return (
    <figure
      className="hero-enter relative mx-auto w-full max-w-sm"
      style={{ animationDelay: "200ms" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-3 shadow-2xl shadow-black/10 transition-transform duration-200 ease-out will-change-transform dark:shadow-black/50"
        style={{
          transform: `perspective(900px) rotateX(${tilt.rotateX.toFixed(
            2,
          )}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {moving && (
          <div
            aria-hidden
            className="pointer-events-none absolute h-56 w-56 rounded-full"
            style={{
              left: tilt.x - 112,
              top: tilt.y - 112,
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 28%, transparent), transparent)",
            }}
          />
        )}

        <Image
          src={site.author.avatar}
          alt={site.author.avatarAlt}
          width={512}
          height={512}
          priority
          className="relative h-auto w-full rounded-[1.5rem]"
        />
        <figcaption className="relative flex items-center justify-between gap-3 px-2 pb-1 pt-3">
          <div>
            <p className="text-sm font-semibold text-fg">{site.author.name}</p>
            <p className="font-mono text-xs text-muted-fg">
              {site.author.location}
            </p>
          </div>
          <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[11px] font-medium text-accent">
            9+ yrs
          </span>
        </figcaption>
      </div>

      <span
        aria-hidden
        className="absolute -left-4 top-10 rounded-full border border-line bg-card px-3 py-1 font-mono text-xs text-muted-fg shadow-lg shadow-black/5 transition-transform duration-200 ease-out will-change-transform dark:shadow-black/40"
        style={{
          transform: `translate3d(${(tilt.rotateY * 2.2).toFixed(
            1,
          )}px, ${(-tilt.rotateX * 2.2).toFixed(1)}px, 0)`,
        }}
      >
        React · TypeScript
      </span>
      <span
        aria-hidden
        className="absolute -right-3 bottom-16 rounded-full border border-line bg-card px-3 py-1 font-mono text-xs text-muted-fg shadow-lg shadow-black/5 transition-transform duration-200 ease-out will-change-transform dark:shadow-black/40"
        style={{
          transform: `translate3d(${(-tilt.rotateY * 3.4).toFixed(
            1,
          )}px, ${(tilt.rotateX * 3.4).toFixed(1)}px, 0)`,
        }}
      >
        MCP · AI automation
      </span>
    </figure>
  );
}