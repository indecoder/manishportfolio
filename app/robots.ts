import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

/** Required for metadata routes under `output: "export"`. */
export const dynamic = "force-static";

/**
 * Generates /robots.txt at build time (out/robots.txt).
 *
 * Production: everything is crawlable and the sitemap location is advertised so
 * Google finds it without any manual step beyond Search Console verification.
 *
 * dev / UAT: crawl nothing. These stages are served from their own *.web.app
 * origins with the same content as production, so advertising them would create
 * duplicate-content competition. This backs up the `noindex` meta tag in
 * app/layout.tsx - together they guarantee a non-prod build can never rank.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Build artefacts are not content and would waste crawl budget.
        disallow: ["/_next/", "/cgi-bin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
