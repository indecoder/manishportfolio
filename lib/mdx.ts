import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { EvaluateOptions } from "@mdx-js/mdx";
import type { ReactElement } from "react";
import { mdxComponents } from "@/mdx-components";
import { normalizeTags, toIsoDate } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * Blog content layer
 * ---------------------------------------------------------------------------
 * Everything here runs at BUILD time only (Node, inside Server Components).
 * Because the app is statically exported, `next build` reads ./content/blog,
 * compiles each MDX file into a React component and prerenders it to
 * ./out/blog/<slug>.html. No server, no database, and no Firebase service
 * beyond Hosting is involved.
 */

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type MDXContent = (props?: Record<string, unknown>) => ReactElement;

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date, e.g. 2026-09-23 */
  date: string;
  updated?: string;
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
  cover?: string;
  coverAlt?: string;
  canonical?: string;
  series?: string;
  slug?: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  cover?: string;
  coverAlt?: string;
  canonical?: string;
  series?: string;
  /** human readable, e.g. "6 min read" */
  readingTime: string;
  words: number;
  /** ISO timestamp used for sitemap lastmod + JSON-LD dateModified */
  lastModified: string;
};

export type TocEntry = {
  depth: 2 | 3;
  text: string;
  slug: string;
};

export type Post = {
  meta: PostMeta;
  Content: MDXContent;
  toc: TocEntry[];
};

/* ------------------------------------------------------------------ */
/* MDX compilation                                                     */
/* ------------------------------------------------------------------ */

const evaluateOptions = {
  ...runtime,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["heading-anchor"],
          "aria-hidden": true,
          tabIndex: -1,
        },
        content: {
          type: "element",
          tagName: "span",
          properties: { className: ["anchor-symbol"] },
          children: [{ type: "text", value: "#" }],
        },
      },
    ],
    [
      rehypePrettyCode,
      {
        // Light-only site: one Shiki theme, so token colours arrive as inline
        // styles and globals.css needs no `.dark` variable swap.
        theme: "github-light",
        keepBackground: false,
        defaultLanguage: "text",
      },
    ],
  ],
  useMDXComponents: () => mdxComponents,
} as unknown as EvaluateOptions;

/** Compile an MDX body string into a renderable React component. */
export async function compileMdx(source: string): Promise<MDXContent> {
  const result = (await evaluate(source, evaluateOptions)) as unknown as {
    default: MDXContent;
  };
  return result.default;
}

/* ------------------------------------------------------------------ */
/* Parsing helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Mirror of `github-slugger` (what rehype-slug uses) so the generated table of
 * contents links to the exact ids present in the rendered HTML.
 */
function githubSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/ /g, "-");
}

/** Extract ## / ### headings with ids that match rehype-slug output. */
export function extractToc(markdown: string): TocEntry[] {
  const seen = new Map<string, number>();
  const entries: TocEntry[] = [];
  let inCodeFence = false;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```") || line.startsWith("~~~")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[*_`]/g, "").trim();
    const base = githubSlug(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    entries.push({
      depth: match[1].length === 2 ? 2 : 3,
      text,
      slug: count === 0 ? base : `${base}-${count}`,
    });
  }

  return entries;
}

function shouldIncludeDrafts(): boolean {
  return process.env.INCLUDE_DRAFTS === "true";
}

function parsePost(slugFromFile: string, raw: string): PostMeta | null {
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  if (!fm.title) {
    console.warn(`[content] ${slugFromFile}: missing "title" frontmatter - skipped.`);
    return null;
  }

  const stats = readingTime(content);
  const date = fm.date ? toIsoDate(fm.date) : toIsoDate(new Date());
  const updated = fm.updated ? toIsoDate(fm.updated) : undefined;

  return {
    slug: fm.slug ?? slugFromFile,
    title: fm.title,
    description: fm.description ?? "",
    date,
    updated,
    tags: normalizeTags(fm.tags),
    draft: Boolean(fm.draft),
    featured: Boolean(fm.featured),
    cover: fm.cover,
    coverAlt: fm.coverAlt,
    canonical: fm.canonical,
    series: fm.series,
    readingTime: stats.text,
    words: stats.words,
    lastModified: updated ?? date,
  };
}

async function listSlugs(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .sort();
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Queries (all build-time)                                            */
/* ------------------------------------------------------------------ */

/** Read every post's metadata (newest first), honouring draft visibility. */
export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await listSlugs(BLOG_DIR);
  const posts: PostMeta[] = [];

  for (const slug of slugs) {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
    const meta = parsePost(slug, raw);
    if (!meta) continue;
    if (meta.draft && !shouldIncludeDrafts()) continue;
    posts.push(meta);
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Slug list for generateStaticParams(). */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Full post: metadata + compiled component + table of contents. */
export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const meta = parsePost(slug, raw);
  if (!meta) return null;
  if (meta.draft && !shouldIncludeDrafts()) return null;

  const { content } = matter(raw);
  const Content = await compileMdx(content);

  return { meta, Content, toc: extractToc(content) };
}

/** Previous / next links shown at the bottom of an article. */
export async function getAdjacentPosts(slug: string): Promise<{
  previous: PostMeta | null;
  next: PostMeta | null;
}> {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  // `posts` is newest-first, so the newer article sits at index - 1.
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export async function getRecentPosts(limit = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getFeaturedPosts(limit = 3): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((post) => post.featured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag.toLowerCase()));
}

/** All tags with post counts, sorted by count desc then alphabetically. */
export async function getAllTags(): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getAllTagSlugs(): Promise<string[]> {
  const tags = await getAllTags();
  return tags.map(({ tag }) => tag);
}

/** Group posts by year for the blog archive view. */
export async function getPostsByYear(): Promise<
  Array<{ year: number; posts: PostMeta[] }>
> {
  const posts = await getAllPosts();
  const groups = new Map<number, PostMeta[]>();

  for (const post of posts) {
    const year = new Date(post.date).getUTCFullYear();
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}


