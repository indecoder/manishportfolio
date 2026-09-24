import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Site footer: name and a one-line bio on the left, two navigation columns on
 * the right, colophon underneath. Deliberately quiet — it closes the page
 * without competing with the contact panel above it.
 */
export function Footer() {
  const year = new Date().getUTCFullYear();

  // Split the footer links into two even columns (3 + 3 today).
  const half = Math.ceil(site.footerNav.length / 2);
  const columns = [site.footerNav.slice(0, half), site.footerNav.slice(half)];

  return (
    <footer className="relative mt-24">
      <div aria-hidden className="hairline h-px w-full" />

      <Container wide className="py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <Link
              href="/"
              className="inline-block text-xl font-semibold tracking-tight text-gray-900 transition-colors hover:text-blue-600"
            >
              {site.author.name}
            </Link>
            <p className="text-sm leading-6 text-gray-600">
              {site.author.role} in {site.author.location}. Writing about
              front-end architecture, TypeScript and AI-assisted development.
            </p>
            <SocialLinks links={site.socialLinks} />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12">
            {columns.map((column, index) => (
              <ul key={index} className="space-y-2.5">
                {column.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>
      </Container>

      <Container wide className="pb-8">
        <div aria-hidden className="hairline mb-6 h-px w-full opacity-50" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600">
            © {year} {site.author.name}. Built with Next.js + MDX, statically
            exported and served by Firebase Hosting.
          </p>
          {/* Plain anchors: rss.xml and sitemap.xml are static files, not App
              Router routes. Using <Link> here makes the client router prefetch
              a non-existent RSC payload and log a 404. */}
          <p className="font-mono text-xs text-gray-600">
            <a href="/rss.xml" className="transition-colors hover:text-gray-900">
              RSS
            </a>
            {" · "}
            <a
              href="/sitemap.xml"
              className="transition-colors hover:text-gray-900"
            >
              Sitemap
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
