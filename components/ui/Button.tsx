import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent/90",
  secondary: "border border-line bg-card text-fg hover:bg-muted",
  ghost: "text-muted-fg hover:bg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Internal link button. */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: CommonProps & { href: string }) {
  const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
        {...(href.startsWith("mailto:")
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
