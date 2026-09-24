import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bordered surface used by post cards, project cards and callouts. */
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
        "rounded-2xl border border-line bg-card p-5 relative",
        hoverable &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-muted/60 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
