import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { getAllProjects } from "@/lib/projects";
import { breadcrumbJsonLd, itemListJsonLd, jsonLdToString } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects built and shipped - side projects, libraries and client work, with the stack, results and links.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <Container className="py-14">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-fg">
          Things I have designed, built and shipped. Filter by stack below.
        </p>
      </header>

      <div className="mt-10">
        <ProjectFilter projects={projects} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            itemListJsonLd(
              projects.map((project) => ({
                name: project.title,
                url: absoluteUrl(`/projects/${project.slug}`),
              })),
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          ),
        }}
      />
    </Container>
  );
}
