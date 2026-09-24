import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/site/SocialLinks";

/** Site footer: navigation, social links, colophon and copyright. */
export function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-bg">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-mono text-sm font-semibold text-fg">{site.name}</p>
          <p className="text-sm leading-6 text-muted-fg">
            {site.author.role} · {site.author.location}. Writing about web
            development, TypeScript and developer automation.
          </p>
          <SocialLinks links={site.socialLinks} />
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-fg transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          {/* Plain anchors: rss.xml and sitemap.xml are static files, not App
              Router routes. Using <Link> here makes the client router prefetch
              a non-existent RSC payload and log a 404. */}
          <a
            href="/rss.xml"
            className="text-sm text-muted-fg transition-colors hover:text-fg"
          >
            RSS feed
          </a>
          <a
            href="/sitemap.xml"
            className="text-sm text-muted-fg transition-colors hover:text-fg"
          >
            Sitemap
          </a>
        </nav>
      </Container>

      <Container className="border-t border-line py-5">
        <p className="text-xs text-muted-fg">
          © {year} {site.author.name}. Built with Next.js + MDX, statically
          exported and served by Firebase Hosting.
        </p>
      </Container>
    </footer>
  );
}
