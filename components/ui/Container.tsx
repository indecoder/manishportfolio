import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centred page-width wrapper.
 *
 * Two measures:
 * - default (`max-w-5xl`, 64rem) — the reading measure. Used for article
 *   bodies, where a ~68ch line length keeps long-form copy comfortable.
 * - `wide` (`max-w-7xl`, 80rem) — the chrome/grid measure. Used for the
 *   header, footer, page headers, hero and every card grid, so a 3-column
 *   grid gets ~390px cards instead of ~320px.
 *
 * Article routes deliberately stay on the default measure while the chrome
 * around them is `wide`; that inset reads as an intentional reading column.
 */
export function Container({
  children,
  className,
  wide = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Widen to the chrome/grid measure (`max-w-7xl`). */
  wide?: boolean;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        wide ? "max-w-7xl" : "max-w-5xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}
