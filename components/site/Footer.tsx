import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Site footer: gradient wordmark, navigation, social links, colophon and
 * copyright. The top edge is a gradient hairline rather than a flat border so
 * it matches the header treatment.
 */
export function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="relative mt-24">
      <div aria-hidden className="hairline h-px w-full" />

      <Container wide className="py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <p className="text-2xl font-bold tracking-tight">
              <span className="text-gradient">{site.author.name}</span>
            </p>
            <p className="text-sm leading-6 text-muted-fg">
              {site.author.role} · {site.author.location}. Writing about web
              development, TypeScript and developer automation.
            </p>
            <SocialLinks links={site.socialLinks} />
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-2"
          >
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-fg transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            {/* Plain anchors: rss.xml and sitemap.xml are static files, not App
                Router routes. Using <Link> here makes the client router prefetch
                a non-existent RSC payload and log a 404. */}
            <a
              href="/rss.xml"
              className="text-sm text-muted-fg transition-colors hover:text-accent"
            >
              RSS feed
            </a>
            <a
              href="/sitemap.xml"
              className="text-sm text-muted-fg transition-colors hover:text-accent"
            >
              Sitemap
            </a>
          </nav>
        </div>
      </Container>

      <Container wide className="pb-8">
        <div aria-hidden className="hairline mb-6 h-px w-full opacity-50" />
        <p className="text-xs text-muted-fg">
          © {year} {site.author.name}. Built with Next.js + MDX, statically
          exported and served by Firebase Hosting.
        </p>
      </Container>
    </footer>
  );
}
