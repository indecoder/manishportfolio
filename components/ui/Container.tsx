import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centred page-width wrapper. `wide` is for marketing surfaces (hero, grids,
 * page headers) that need room for two columns; the default narrow measure
 * stays for prose so long-form text keeps a comfortable ~70ch line length.
 */
export function Container({
  children,
  className,
  wide = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-6",
        wide ? "max-w-6xl" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
