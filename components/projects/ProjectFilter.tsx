"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectMeta } from "@/lib/projects";

type Props = {
  projects: ProjectMeta[];
};

/**
 * Client-side filter for the projects grid. Kept client-side because the site
 * is statically exported - there is no server to run the query against.
 * The full list is still in the initial HTML, so it stays indexable.
 */
export function ProjectFilter({ projects }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const item of project.stack) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [projects]);

  const visible = active
    ? projects.filter((project) => project.stack.includes(active))
    : projects;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            active === null
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-line text-muted-fg hover:border-accent/40 hover:text-accent"
          }`}
        >
          All <span className="ml-1 opacity-60">{projects.length}</span>
        </button>

        {tags.map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag === active ? null : tag)}
            aria-pressed={active === tag}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              active === tag
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-line text-muted-fg hover:border-accent/40 hover:text-accent"
            }`}
          >
            {tag} <span className="ml-1 opacity-60">{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-muted-fg">
          No projects match <span className="font-mono text-accent">{active}</span>.
        </p>
      )}
    </div>
  );
}
