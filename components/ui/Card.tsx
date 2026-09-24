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
        "rounded-2xl border border-line bg-card/85 p-5 relative backdrop-blur-sm",
        hoverable &&
          "transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.07] dark:hover:shadow-accent/[0.12]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
