import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small pill used for tags, stack items and status labels. */
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
        "inline-flex items-center rounded-full border border-line bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-fg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
