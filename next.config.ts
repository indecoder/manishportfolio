import type { NextConfig } from "next";

/**
 * This site is deployed to Firebase Hosting on the Spark (free) plan, which
 * serves STATIC files only. Cloud Functions / SSR rewrites require the Blaze
 * plan, so the whole app is statically exported to `./out` at build time.
 *
 * Consequences of `output: "export"` that this config respects:
 *  - no route handlers that read `Request`, no cookies()/headers()
 *  - no rewrites/redirects/headers here (they live in firebase.json instead)
 *  - no middleware, no ISR, no server actions
 *  - every dynamic route must implement generateStaticParams()
 *  - next/image must use `unoptimized` (no image optimization server)
 */
const nextConfig: NextConfig = {
  output: "export",
  // Produces `out/blog/my-post.html` (not `out/blog/my-post/index.html`).
  // firebase.json sets `cleanUrls: true` so it is served at `/blog/my-post`.
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
