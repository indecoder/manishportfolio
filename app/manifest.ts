import type { MetadataRoute } from "next";
import { site, siteName } from "@/lib/site";

/** Required for metadata routes under `output: "export"`. */
export const dynamic = "force-static";

/**
 * PWA manifest. Static export writes out/manifest.webmanifest, which is why
 * app/layout.tsx points `manifest` at that filename.
 *
 * `name` uses the stage-aware siteName (lib/site.ts) so an app installed from a
 * dev or UAT build is distinguishable from production in the OS launcher.
 * `short_name` stays the plain author name because it has a tight character
 * budget and gets truncated.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: site.author.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: site.themeColor,
    categories: ["technology", "portfolio"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
