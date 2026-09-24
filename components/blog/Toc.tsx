import type { TocEntry } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * Table of contents built at build time from the article's ## / ### headings.
 * Pure markup - scroll-spy would need client JS, so it is intentionally
 * omitted to keep articles at zero JavaScript.
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-line bg-muted/50 p-4">
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-fg">
        On this page
      </p>
      <ol className="space-y-1.5 text-sm">
        {entries.map((entry) => (
          <li key={`${entry.depth}-${entry.slug}`}>
            <a
              href={`#${entry.slug}`}
              className={cn(
                "block text-muted-fg transition-colors hover:text-accent",
                entry.depth === 3 && "pl-4",
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
