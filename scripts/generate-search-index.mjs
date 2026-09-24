/**
 * Generates out/search.json after `next build`.
 *
 * The static export has no server, so search has to be client-side. This script
 * produces a compact index of every published post and project; the browser
 * fetches it once and filters it in memory. For a few hundred documents this is
 * faster and simpler than shipping a full-text index like Lunr.
 *
 * Wired up in package.json as part of "postbuild" and in scripts/build.mjs.
 *
 * STATUS: the generator is live and out/search.json is a required build output,
 * but no component fetches it YET - the blog search UI that consumes it is a
 * scheduled deliverable. Until that lands the file is published but unused.
 * If that UI is dropped, remove this script, its call in scripts/build.mjs,
 * the "postbuild" entry in package.json, and "out/search.json" from
 * REQUIRED_OUTPUTS in scripts/build.mjs.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const OUT_FILE = path.join(OUT_DIR, "search.json");

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fullstackmanish.web.app"
).replace(/\/$/, "");

/**
 * Reduces MDX source to searchable plain text. Deliberately crude - the index
 * only needs to be good enough for substring matching, not lossless.
 */
function mdxToPlainText(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/import\s+.*?from\s+["'].*?["'];?/g, " ") // MDX imports
    .replace(/export\s+(const|default|function)[\s\S]*?\n\n/g, " ")
    .replace(/<\s*[A-Za-z][^>]*>/g, " ") // JSX opening tags
    .replace(/<\s*\/\s*[A-Za-z][^>]*>/g, " ") // JSX closing tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // heading markers
    .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // list bullets
    .replace(/^\s{0,3}\d+\.\s+/gm, "") // ordered list markers
    .replace(/[*_~`]/g, "") // inline emphasis / code
    .replace(/^\s*\|.*\|\s*$/gm, " ") // table rows
    .replace(/^\s*[-:| ]+\s*$/gm, " ") // table separators
    .replace(/\s+/g, " ")
    .trim();
}

async function collect(dir, baseRoute, shape) {
  const fullDir = path.join(ROOT, "content", dir);
  let entries;
  try {
    entries = await readdir(fullDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const documents = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(mdx?|md)$/.test(entry.name)) continue;

    const raw = await readFile(path.join(fullDir, entry.name), "utf8");
    const { data, content } = matter(raw);
    if (data.draft === true) continue;

    const slug = entry.name.replace(/\.(mdx?|md)$/, "");
    const title = String(data.title ?? slug);
    const body = mdxToPlainText(content);
    const date = data.date ? new Date(data.date).toISOString().slice(0, 10) : "";

    documents.push(
      shape({
        slug,
        title,
        url: `${SITE_URL}${baseRoute}/${slug}`,
        description: String(data.description ?? data.summary ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        date,
        // Cap body length so the index stays small over the wire.
        body: body.slice(0, 2000),
      }),
    );
  }

  return documents;
}

async function main() {
  const [posts, projects] = await Promise.all([
    collect("blog", "/blog", (doc) => ({ ...doc, type: "post" })),
    collect("projects", "/projects", (doc) => ({ ...doc, type: "project" })),
  ]);

  const index = {
    generatedAt: new Date().toISOString(),
    documents: [...posts, ...projects],
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(index), "utf8");
  console.log(
    `[search] indexed ${posts.length} post(s) and ${projects.length} project(s) -> out/search.json`,
  );
}

main().catch((error) => {
  console.error("[search] failed:", error);
  process.exit(1);
});
