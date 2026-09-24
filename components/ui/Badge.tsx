import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small pill used for tags, stack items and status labels.
 *
 * Outline style by default (white fill, thin gray border) so pills read as
 * quiet metadata next to a card title. Pass a className to invert to the
 * light-blue "category" treatment used on post cards.
 */
export function Badge({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "li" | "div";
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 font-mono text-xs text-gray-600",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
