/**
 * Generates the default OpenGraph card and the Apple touch icon as real PNG
 * files in ./public.
 *
 * Why a script instead of `app/opengraph-image.tsx`?
 * With `output: "export"`, Next writes those metadata routes to
 * `out/opengraph-image` and `out/apple-icon` - with NO file extension. Firebase
 * Hosting infers Content-Type from the extension, so those files would be
 * served as application/octet-stream and social crawlers would refuse to render
 * them. Committing real `public/*.png` files guarantees the correct MIME type.
 *
 * Run this after editing the name/role/description below:
 *   npm run generate:og
 *
 * Values mirror lib/site.ts. They can be overridden with the same
 * NEXT_PUBLIC_* environment variables the CI workflow injects.
 */

// Node ESM requires the explicit file path; `next/og` only resolves inside the
// Next.js bundler.
import { ImageResponse } from "next/og.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Manish Kumar";
const AUTHOR_ROLE = process.env.NEXT_PUBLIC_AUTHOR_ROLE || "Software Engineer";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Portfolio and blog - writing about web development, TypeScript, React and automation.";
const SITE_HOST =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://fullstackmanish.web.app")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

const BG = "#0b0d10";
const FG = "#e8eaed";
const MUTED = "#9aa4af";
const ACCENT = "#6ea8fe";

function png(buffer) {
  return new Uint8Array(buffer);
}

async function generateOpenGraph() {
  const response = new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: BG,
          color: FG,
          fontFamily: "monospace",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontSize: "22px",
                color: ACCENT,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              },
              children: AUTHOR_ROLE,
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "18px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", fontSize: "76px", fontWeight: 700 },
                    children: SITE_NAME,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: "30px",
                      color: MUTED,
                      maxWidth: "900px",
                    },
                    children: SITE_DESCRIPTION,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                fontSize: "22px",
                color: MUTED,
              },
              children: [
                { type: "div", props: { style: { display: "flex" }, children: "Portfolio & Blog" } },
                { type: "div", props: { style: { display: "flex" }, children: SITE_HOST } },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 },
  );

  return png(await response.arrayBuffer());
}

async function generateAppleIcon() {
  const initials = SITE_NAME.split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const response = new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
          color: ACCENT,
          fontSize: "76px",
          fontWeight: 700,
          fontFamily: "monospace",
        },
        children: initials,
      },
    },
    { width: 180, height: 180 },
  );

  return png(await response.arrayBuffer());
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const [og, icon] = await Promise.all([
    generateOpenGraph(),
    generateAppleIcon(),
  ]);

  await writeFile(path.join(PUBLIC_DIR, "og-default.png"), og);
  await writeFile(path.join(PUBLIC_DIR, "apple-icon.png"), icon);

  console.log(
    `[og] wrote public/og-default.png (1200x630) and public/apple-icon.png (180x180)`,
  );
}

main().catch((error) => {
  console.error("[og] failed:", error);
  process.exit(1);
});
