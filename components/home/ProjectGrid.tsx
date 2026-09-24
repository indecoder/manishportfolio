import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { RevealGroup } from "@/components/ui/RevealGroup";

/**
 * "Selected projects" section on the home page.
 *
 * The whole section sits inside one RevealGroup: the header and every card
 * wrapper carry `data-reveal`, so they fade up in sequence (0.1s apart) as the
 * grid scrolls into view. Animating the *wrapper* rather than the card keeps
 * the card's own `hover:-translate-y-1` working, because GSAP would otherwise
 * leave an inline transform behind that beats the hover class.
 */
export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">

      <RevealGroup className="relative">
        <div data-reveal className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Selected projects
          </h2>
          <Link
            href="/projects"
            className="group shrink-0 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            See all projects{" "}
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.slug} data-reveal className="h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
