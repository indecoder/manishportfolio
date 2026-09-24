"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ScrollProgress } from "@/components/site/ScrollProgress";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky site header: name on the left, five nav items on the right, active
 * route underlined, and a hamburger panel below `md`.
 *
 * Light-only surface (`bg-white/85` + blur) so it reads as frosted glass over
 * the global background rather than a solid bar. The height comes from the
 * `--header-h` token in globals.css, which SmoothScroll also reads to offset
 * same-page anchors — so the two can never drift apart.
 */
export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/85 shadow-sm shadow-gray-900/[0.03] backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <Container wide className="flex h-(--header-h) items-center justify-between gap-4">
        <Link
          href="/"
          className="-mx-2 -my-1 rounded-lg px-2 py-1 text-sm font-semibold tracking-tight text-gray-900 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {site.author.name}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900",
                  active ? "font-medium text-gray-900" : "text-gray-600",
                )}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-1 h-px bg-blue-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <Container wide className="flex flex-col gap-1 py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
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
