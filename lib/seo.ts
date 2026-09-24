import { absoluteUrl } from "@/lib/utils";
import { site } from "@/lib/site";
import type { PostMeta } from "@/lib/mdx";
import type { ProjectMeta } from "@/lib/projects";

/**
 * JSON-LD structured data builders. These are rendered into
 * <script type="application/ld+json"> and are what makes Google eligible to
 * show rich results (author, dates, breadcrumbs) for your articles.
 *
 * All values are absolute URLs - required by Google's rich result tests.
 */

export type JsonLd = Record<string, unknown>;

/** Person schema for the home / about page. */
export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    url: absoluteUrl("/"),
    jobTitle: site.author.role,
    description: site.author.bio,
    email: `mailto:${site.author.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.author.address.locality,
      addressRegion: site.author.address.region,
      addressCountry: site.author.address.country,
    },
    image: absoluteUrl(site.author.avatar),
    sameAs: site.socialLinks
      .filter((link) => link.icon !== "email" && link.icon !== "rss")
      .map((link) => link.href),
  };
}

/** WebSite + publisher graph, emitted once in the root layout. */
export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: site.locale,
    publisher: {
      "@type": "Person",
      name: site.author.name,
      url: absoluteUrl("/about"),
    },
  };
}

/** BlogPosting schema for an individual article. */
export function blogPostingJsonLd(post: PostMeta): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.cover ? absoluteUrl(post.cover) : absoluteUrl("/og-default.png"),
    datePublished: post.date,
    dateModified: post.lastModified,
    inLanguage: site.locale,
    wordCount: post.words,
    keywords: post.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    author: {
      "@type": "Person",
      name: site.author.name,
      url: absoluteUrl("/about"),
      image: absoluteUrl(site.author.avatar),
    },
    publisher: {
      "@type": "Person",
      name: site.author.name,
      url: absoluteUrl("/about"),
    },
    isPartOf: {
      "@type": "Blog",
      name: `${site.name} Blog`,
      url: absoluteUrl("/blog"),
    },
  };
}

/** BreadcrumbList for any nested page. */
export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** CollectionPage schema for the blog index and tag pages. */
export function blogCollectionJsonLd(posts: PostMeta[], name: string, path: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", url: absoluteUrl("/") },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
    })),
  };
}

/** Escape a JSON-LD object for safe injection into a <script> tag. */
export function jsonLdToString(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** SoftwareApplication schema for a project detail page. */
export function softwareApplicationJsonLd(project: ProjectMeta): JsonLd {
  const keywords = project.stack.length > 0 ? project.stack : project.tags;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(project.live ? { sameAs: project.live } : {}),
    ...(project.cover ? { image: absoluteUrl(project.cover) } : {}),
    datePublished: project.date,
    dateModified: project.lastModified,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    inLanguage: site.locale,
    keywords: keywords.join(", "),
    author: {
      "@type": "Person",
      name: site.author.name,
      url: absoluteUrl("/about"),
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** ItemList schema for index pages such as /projects. URLs must be absolute. */
export function itemListJsonLd(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
