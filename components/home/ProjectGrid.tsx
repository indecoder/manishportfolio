import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

/** "Selected projects" section on the home page. */
export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-10">
      <Reveal>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Selected projects</h2>
          <Link
            href="/projects"
            className="font-mono text-xs text-muted-fg transition-colors hover:text-accent"
          >
            All projects →
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 70} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
