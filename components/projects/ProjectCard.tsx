import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/** Project tile used on /projects and the home page. */
export function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Card as="article" hoverable className="group flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        {project.featured && (
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            Featured
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-600">{project.description}</p>

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
        <span className="text-xs text-gray-600">
          {project.period ?? formatDate(project.date, "medium")}
        </span>
        <span className="flex items-center gap-3 text-xs">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Live ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-medium text-gray-600 hover:text-gray-900 hover:underline"
            >
              Source ↗
            </a>
          )}
        </span>
      </div>
    </Card>
  );
}
