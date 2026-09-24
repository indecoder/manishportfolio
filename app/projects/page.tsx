import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
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
    <>
      <PageHeader
        eyebrow={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        title="Projects"
        description="Things I have designed, built and shipped. Filter by stack below."
      />

      <Container wide className="pb-14">
        <ProjectFilter projects={projects} />
      </Container>

      <Container>
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
    </>
  );
}
