import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centred page-width wrapper.
 *
 * The design keeps a single generous measure (`max-w-5xl`) for every surface —
 * hero, grids, prose and page headers — so the page reads as one calm column
 * with a lot of air around it. `wide` is kept as an accepted prop (every
 * existing call site passes it) but no longer changes the width.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Accepted for backwards compatibility; both measures are `max-w-5xl`. */
  wide?: boolean;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Tag>
  );
}
