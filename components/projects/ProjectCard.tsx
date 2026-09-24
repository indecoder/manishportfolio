import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/** Project tile used on /projects and the home page. */
export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Card as="article" hoverable className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-fg">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        {project.featured && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent">
            Featured
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-6 text-muted-fg">{project.description}</p>

      {project.stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li key={item}>
              <Badge>{item}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="font-mono text-xs text-muted-fg">
          {project.period ?? formatDate(project.date, "medium")}
        </span>
        <span className="flex items-center gap-3 text-xs">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-medium text-accent hover:underline"
            >
              Live ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-medium text-muted-fg hover:text-fg hover:underline"
            >
              Source ↗
            </a>
          )}
        </span>
      </div>
    </Card>
  );
}
