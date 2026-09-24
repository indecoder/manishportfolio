import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

/** "Selected projects" section on the home page. */
export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Selected projects</h2>
        <Link
          href="/projects"
          className="font-mono text-xs text-muted-fg transition-colors hover:text-accent"
        >
          All projects →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
