import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import { ParallaxShift } from "@/components/ui/ParallaxShift";
import { Reveal } from "@/components/ui/Reveal";

/** "Selected projects" section on the home page. */
export function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16">
      <ParallaxBackdrop side="left" speed={0.12} />

      <div className="relative">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Selected projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group font-mono text-xs text-muted-fg transition-colors hover:text-accent"
            >
              All projects{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        {/* Two-column split parallax: the columns drift at different rates as
            the section passes, so the grid visibly separates into layers. */}
        <div className="mt-8 grid items-start gap-5 sm:grid-cols-2">
          <ParallaxShift speed={0.04} maxShift={26} className="grid gap-5">
            {projects
              .filter((_, index) => index % 2 === 0)
              .map((project, index) => (
                <Reveal key={project.slug} delay={index * 160}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
          </ParallaxShift>
          <ParallaxShift speed={0.07} maxShift={44} className="grid gap-5 sm:mt-10">
            {projects
              .filter((_, index) => index % 2 === 1)
              .map((project, index) => (
                <Reveal key={project.slug} delay={index * 160 + 80}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
          </ParallaxShift>
        </div>
      </div>
    </section>
  );
}
