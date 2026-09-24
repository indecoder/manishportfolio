import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getAllProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/utils";
import { indexable } from "@/lib/site";

/** Required for metadata routes under `output: "export"`. */
export const dynamic = "force-static";

/**
 * Generates /sitemap.xml at build time (static export writes
 * out/sitemap.xml). Submit this URL once in Google Search Console - it is the
 * fastest way to get every page discovered.
 *
 * Draft posts are excluded automatically because getAllPosts() filters them.
 *
 * dev / UAT builds return an EMPTY sitemap. Those stages are noindexed (see
 * app/layout.tsx) and fully disallowed in app/robots.ts; advertising their URLs
 * here would contradict both and invite crawling of duplicate content.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable) return [];

  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/projects"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/uses"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.lastModified),
    changeFrequency: post.updated ? "monthly" : "yearly",
    priority: post.featured ? 0.8 : 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.lastModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Tag archives are intentionally left out: they are thin, near-duplicate
  // pages that add crawl noise. They stay indexable but are not advertised.
  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
