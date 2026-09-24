import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centred page-width wrapper used by every section. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-3xl px-5 sm:px-6", className)}>
      {children}
    </Tag>
  );
}
