import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TagList } from "@/components/blog/TagList";
import { getAllProjectSlugs, getProject, getProjectMeta } from "@/lib/projects";
import {
  breadcrumbJsonLd,
  jsonLdToString,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { absoluteUrl, formatDate, truncate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

/** Required by `output: "export"` - every project page is known at build. */
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectMeta(slug);
  if (!project) return {};

  const url = `/projects/${project.slug}`;
  const image = project.cover ?? "/og-default.png";

  return {
    title: project.title,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: absoluteUrl(url) },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title: project.title,
      description: project.description,
      publishedTime: project.date,
      modifiedTime: project.lastModified,
      images: [
        {
          url: absoluteUrl(image),
          alt: project.coverAlt ?? project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: truncate(project.description, 200),
      images: [absoluteUrl(image)],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { meta, Content } = project;

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
            <Link href="/projects" className="hover:text-accent">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-fg" aria-current="page">
            {meta.title}
          </li>
        </ol>
      </nav>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {meta.role && <Badge>{meta.role}</Badge>}
            {meta.featured && (
              <Badge className="border-accent/50 text-accent">Featured</Badge>
            )}
            <span className="font-mono text-xs text-muted-fg">
              {meta.period ?? formatDate(meta.date, "medium")}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-fg">
            {meta.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {meta.live && (
              <Button href={meta.live} size="sm">
                Live demo ↗
              </Button>
            )}
            {meta.repo && (
              <Button href={meta.repo} variant="secondary" size="sm">
                Source code ↗
              </Button>
            )}
          </div>

          <div className="mt-5">
            <TagList tags={meta.tags} />
          </div>
        </header>

        {meta.highlights.length > 0 && (
          <section aria-labelledby="highlights" className="mb-10">
            <h2
              id="highlights"
              className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
            >
              Highlights
            </h2>
            <ul className="space-y-2">
              {meta.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-xl border border-line bg-card px-4 py-3 text-sm leading-6"
                >
                  <span className="mr-2 text-accent" aria-hidden="true">
                    ▸
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* No `.prose` wrapper: @tailwindcss/typography is not installed and
            every element is styled directly by mdx-components.tsx. */}
        <Content />

        <footer className="mt-12 border-t border-line pt-8">
          <p className="text-sm text-muted-fg">
            Built with{" "}
            {(meta.stack.length > 0 ? meta.stack : meta.tags)
              .slice(0, 4)
              .join(", ")}
            .
            {meta.repo && (
              <>
                {" "}
                <a href={meta.repo} className="text-accent hover:underline">
                  Read the source
                </a>
              </>
            )}
          </p>
        </footer>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(softwareApplicationJsonLd(meta)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: meta.title, path: `/projects/${meta.slug}` },
            ]),
          ),
        }}
      />
    </Container>
  );
}
