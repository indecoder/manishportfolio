import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Toc } from "@/components/blog/Toc";
import { TagList } from "@/components/blog/TagList";
import { PostMetaInfo } from "@/components/blog/PostMeta";
import { ShareLinks } from "@/components/blog/ShareLinks";
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPost,
  getPostMeta,
} from "@/lib/mdx";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  jsonLdToString,
} from "@/lib/seo";
import { absoluteUrl, truncate } from "@/lib/utils";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Required by `output: "export"` - every article must be known at build. */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMeta(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const canonical = post.canonical ?? absoluteUrl(url);
  const image = post.cover ?? "/og-default.png";

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.lastModified,
      authors: [absoluteUrl("/about")],
      tags: post.tags,
      images: [{ url: absoluteUrl(image), alt: post.coverAlt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: truncate(post.description, 200),
      images: [absoluteUrl(image)],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, Content, toc } = post;
  const { previous, next } = await getAdjacentPosts(slug);

  return (
    <Container className="py-14">
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
          <li className="truncate text-fg" aria-current="page">
            {meta.title}
          </li>
        </ol>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <div className="mt-3">
            <PostMetaInfo post={meta} />
          </div>
          {meta.description && (
            <p className="mt-4 text-lg leading-8 text-muted-fg">
              {meta.description}
            </p>
          )}
          {meta.tags.length > 0 && (
            <div className="mt-5">
              <TagList tags={meta.tags} />
            </div>
          )}
        </header>

        {toc.length > 0 && (
          <div className="mb-8">
            <Toc entries={toc} />
          </div>
        )}

        {/* No `.prose` wrapper: @tailwindcss/typography is not installed and
            every element is styled directly by mdx-components.tsx. */}
        <Content />

        <footer className="mt-12 space-y-8 border-t border-line pt-8">
          <ShareLinks slug={meta.slug} title={meta.title} />

          <nav aria-label="More posts" className="grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="rounded-xl border border-line p-4 transition-colors hover:border-accent/50 hover:bg-muted"
              >
                <span className="font-mono text-xs text-muted-fg">
                  ← Older post
                </span>
                <span className="mt-1 block font-medium">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="rounded-xl border border-line p-4 text-right transition-colors hover:border-accent/50 hover:bg-muted"
              >
                <span className="font-mono text-xs text-muted-fg">
                  Newer post →
                </span>
                <span className="mt-1 block font-medium">{next.title}</span>
              </Link>
            )}
          </nav>

          <p className="text-sm text-muted-fg">
            Written by {site.author.name}. Spot a mistake?{" "}
            <a
              href={`mailto:${site.author.email}?subject=${encodeURIComponent(`Re: ${meta.title}`)}`}
              className="text-accent hover:underline"
            >
              Send a correction
            </a>
            .
          </p>
        </footer>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(blogPostingJsonLd(meta)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: meta.title, path: `/blog/${meta.slug}` },
            ]),
          ),
        }}
      />
    </Container>
  );
}
