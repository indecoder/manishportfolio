import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

/** Tag pills linking to /blog/tag/<tag>. */
export function TagList({
  tags,
  className,
}: {
  tags: ReadonlyArray<string>;
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={className ?? "flex flex-wrap gap-1.5"}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/blog/tag/${tag}`} className="group relative z-10">
            <Badge className="transition-colors group-hover:border-accent/50 group-hover:text-accent">
              #{tag}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
