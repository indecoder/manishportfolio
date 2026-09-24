import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { Badge } from "@/components/ui/Badge";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import { breadcrumbJsonLd, jsonLdToString } from "@/lib/seo";

type Props = { params: Promise<{ tag: string }> };

/** Every tag that appears on a published post gets a static archive page. */
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}"`,
    description: `Every article tagged ${tag}, newest first.`,
    alternates: { canonical: `/blog/tag/${tag}` },
    // Thin archive pages: indexable, but deliberately kept out of sitemap.xml.
    robots: { index: true, follow: true },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const allTags = await getAllTags();

  return (
    <Container wide className="py-14">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-fg">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/blog/tag/${tag}`} className="hover:text-accent">
              tag
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg" aria-current="page">
            {tag}
          </li>
        </ol>
      </nav>

      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Posts tagged <span className="text-accent">#{tag}</span>
        </h1>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <nav aria-label="Other topics" className="mt-14 border-t border-line pt-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-fg">
          Other topics
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {allTags
            .filter(({ tag: other }) => other !== tag)
            .slice(0, 20)
            .map(({ tag: other, count }) => (
              <li key={other}>
                <Link href={`/blog/tag/${other}`}>
                  <Badge className="transition-colors hover:border-accent/50 hover:text-accent">
                    #{other} <span className="ml-1 opacity-60">{count}</span>
                  </Badge>
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: `Tag: ${tag}`, path: `/blog/tag/${tag}` },
            ]),
          ),
        }}
      />
    </Container>
  );
}
