/**
 * Generates out/rss.xml after `next build`.
 *
 * This runs as a plain Node ESM script (not through Next) because the static
 * export is already finished by the time it runs. It reads the same content
 * directory as lib/mdx.ts and applies the same draft filter, so nothing
 * unpublished can leak into the feed.
 *
 * Wired up in package.json as: "postbuild": "... && node scripts/generate-rss.mjs"
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "out");
const OUT_FILE = path.join(OUT_DIR, "rss.xml");

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fullstackmanish.web.app"
).replace(/\/$/, "");

// These defaults mirror lib/site.ts. Keep them in step, or set the
// NEXT_PUBLIC_* variables (the CI workflow injects them from repo variables).
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Manish Kumar";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Portfolio and blog of Manish Kumar - software engineer writing about web development, TypeScript, React and automation.";
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Manish Kumar";
const AUTHOR_EMAIL = process.env.NEXT_PUBLIC_AUTHOR_EMAIL || "you@example.com";

/** Escapes the five characters that are illegal in XML text content. */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value) {
  return `<![CDATA[${String(value ?? "").replace(/]]>/g, "]]&gt;")}]]>`;
}

async function collectPosts() {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(mdx?|md)$/.test(entry.name)) continue;

    const fullPath = path.join(BLOG_DIR, entry.name);
    const raw = await readFile(fullPath, "utf8");
    const { data } = matter(raw);

    if (data.draft === true) continue;
    if (!data.title || !data.date) continue;

    const slug = entry.name.replace(/\.(mdx?|md)$/, "");
    const date = new Date(data.date);
    if (Number.isNaN(date.getTime())) continue;

    posts.push({
      slug,
      title: String(data.title),
      description: String(data.description ?? ""),
      tags: Array.isArray(data.tags) ? data.tags : [],
      date,
      lastModified: data.updated ? new Date(data.updated) : date,
    });
  }

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

function buildXml(posts) {
  const lastBuildDate = posts[0]
    ? posts[0].lastModified.toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        `      <description>${cdata(post.description)}</description>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(
      AUTHOR_EMAIL ? `${AUTHOR_EMAIL} (${AUTHOR_NAME})` : AUTHOR_NAME,
    )}</managingEditor>
${items}
  </channel>
</rss>
`;
}

async function main() {
  const posts = await collectPosts();
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, buildXml(posts), "utf8");
  console.log(`[rss] wrote ${posts.length} item(s) to out/rss.xml`);
}

main().catch((error) => {
  console.error("[rss] failed:", error);
  process.exit(1);
});
