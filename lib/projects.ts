import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMdx } from "@/lib/mdx";
import type { MDXContent } from "@/lib/mdx";
import { normalizeList, normalizeTags, toIsoDate } from "@/lib/utils";

/**
 * Projects content layer. Same build-time model as the blog: MDX files in
 * ./content/projects are compiled during `next build` and prerendered to
 * ./out/projects/<slug>.html.
 */

export const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectFrontmatter = {
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  stack?: string[];
  featured?: boolean;
  draft?: boolean;
  live?: string;
  repo?: string;
  cover?: string;
  coverAlt?: string;
  /** Lower numbers are shown first on /projects. */
  order?: number;
  role?: string;
  period?: string;
  /** Short bullet points rendered above the MDX body on the project page. */
  highlights?: string[];
  slug?: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  stack: string[];
  featured: boolean;
  draft: boolean;
  live?: string;
  repo?: string;
  cover?: string;
  coverAlt?: string;
  order: number;
  role?: string;
  period?: string;
  highlights: string[];
  lastModified: string;
};

export type Project = {
  meta: ProjectMeta;
  Content: MDXContent;
};

function shouldIncludeDrafts(): boolean {
  return process.env.INCLUDE_DRAFTS === "true";
}

function parseProject(slugFromFile: string, raw: string): ProjectMeta | null {
  const { data } = matter(raw);
  const fm = data as Partial<ProjectFrontmatter>;

  if (!fm.title) {
    console.warn(`[content] ${slugFromFile}: missing "title" frontmatter - skipped.`);
    return null;
  }

  const date = fm.date ? toIsoDate(fm.date) : toIsoDate(new Date());

  return {
    slug: fm.slug ?? slugFromFile,
    title: fm.title,
    description: fm.description ?? "",
    date,
    tags: normalizeTags(fm.tags),
    // Stack entries are display labels, so casing is preserved ("Next.js").
    stack: normalizeList(fm.stack),
    featured: Boolean(fm.featured),
    draft: Boolean(fm.draft),
    live: fm.live,
    repo: fm.repo,
    cover: fm.cover,
    coverAlt: fm.coverAlt,
    order: typeof fm.order === "number" ? fm.order : 99,
    role: fm.role,
    period: fm.period,
    highlights: Array.isArray(fm.highlights)
      ? fm.highlights.map((item) => String(item))
      : [],
    lastModified: date,
  };
}

async function listProjectSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR);
    return entries
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .sort();
  } catch {
    return [];
  }
}

/** All projects, ordered by `order` asc then newest first. */
export async function getAllProjects(): Promise<ProjectMeta[]> {
  const slugs = await listProjectSlugs();
  const projects: ProjectMeta[] = [];

  for (const slug of slugs) {
    const raw = await fs.readFile(path.join(PROJECTS_DIR, `${slug}.mdx`), "utf8");
    const meta = parseProject(slug, raw);
    if (!meta) continue;
    if (meta.draft && !shouldIncludeDrafts()) continue;
    projects.push(meta);
  }

  return projects.sort(
    (a, b) => a.order - b.order || (a.date < b.date ? 1 : -1),
  );
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
}

/**
 * Frontmatter only. Used by `generateMetadata` so the MDX body is not compiled
 * a second time just to read the title.
 */
export async function getProjectMeta(slug: string): Promise<ProjectMeta | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const meta = parseProject(slug, raw);
  if (!meta) return null;
  if (meta.draft && !shouldIncludeDrafts()) return null;

  return meta;
}

export async function getProject(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const meta = parseProject(slug, raw);
  if (!meta) return null;
  if (meta.draft && !shouldIncludeDrafts()) return null;

  const { content } = matter(raw);
  const Content = await compileMdx(content);

  return { meta, Content };
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectMeta[]> {
  const projects = await getAllProjects();
  const featured = projects.filter((project) => project.featured);
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

/** Distinct tech tags across all projects, for the /projects filter. */
export async function getAllProjectStack(): Promise<string[]> {
  const projects = await getAllProjects();
  const stack = new Set<string>();
  for (const project of projects) {
    for (const item of project.stack) stack.add(item);
  }
  return Array.from(stack).sort((a, b) => a.localeCompare(b));
}
