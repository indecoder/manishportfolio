"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ScrollProgress } from "@/components/site/ScrollProgress";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sticky site header with active-route highlighting and a mobile menu. */
export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/80 shadow-sm shadow-black/[0.03] backdrop-blur-md supports-[backdrop-filter]:bg-bg/65 dark:shadow-black/20">
      <Container wide className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-fg transition-colors hover:text-accent"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 text-xs font-bold text-accent transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            {site.author.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <span aria-hidden="true">~/</span>
          {site.author.name.toLowerCase().replace(/\s+/g, "")}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "bg-muted font-medium text-fg"
                  : "text-muted-fg hover:bg-muted hover:text-fg",
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="ml-2">
            <ThemeToggle />
          </span>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted-fg transition-colors hover:bg-muted hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-bg md:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-muted font-medium text-fg"
                    : "text-muted-fg hover:bg-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}

      {/* Reading progress: gradient hairline pinned to the header's bottom
          edge, scaled to document scroll. */}
      <ScrollProgress />
    </header>
  );
}
