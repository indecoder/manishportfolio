import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bordered surface used by post cards, project cards and callouts.
 *
 * `hoverable` gives the card the site's signature interaction: a small upward
 * lift (`-translate-y-1`), a slightly warmer border and a softer, larger
 * shadow. Transitions stay on `transform`/`shadow`/`border-color` so the lift
 * stays on the compositor.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
  hoverable?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "glass relative rounded-2xl p-6",
        hoverable &&
          "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:bg-white/85 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-900/[0.08]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
