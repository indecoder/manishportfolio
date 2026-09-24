import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/Badge";
import { getAllTags, getPostsByYear } from "@/lib/mdx";
import { breadcrumbJsonLd, jsonLdToString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about web development, TypeScript, React, automation and lessons learned from production systems.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const [groups, tags] = await Promise.all([getPostsByYear(), getAllTags()]);
  const total = groups.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <Container className="py-14">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {total} {total === 1 ? "post" : "posts"}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-fg">
          Notes on building for the web — practical guides, deep dives and the
          occasional post-mortem.
        </p>
      </header>

      {tags.length > 0 && (
        <nav aria-label="Topics" className="mt-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-fg">
            Browse by topic
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link href={`/blog/tag/${tag}`}>
                  <Badge className="transition-colors hover:border-accent/50 hover:text-accent">
                    #{tag} <span className="ml-1 opacity-60">{count}</span>
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-12 space-y-12">
        {groups.map(({ year, posts }) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2
              id={`year-${year}`}
              className="mb-4 font-mono text-sm text-muted-fg"
            >
              {year}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {total === 0 && (
        <p className="mt-12 text-sm text-muted-fg">
          No posts yet. Add an <code>.mdx</code> file to{" "}
          <code>content/blog/</code> and it will appear here.
        </p>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]),
          ),
        }}
      />
    </Container>
  );
}
