import type { ComponentProps, ReactNode } from "react";

/**
 * Renders the <pre> produced by `rehype-pretty-code`.
 *
 * `lib/mdx.ts` passes ONE theme (`github-light`) to rehype-pretty-code, so
 * Shiki emits token colours as inline styles — no custom properties, no
 * `.dark` swap. This site is light-mode only; globals.css only has to
 * neutralise the <pre> box, which it does under `pre[data-language]`.
 *
 * Intentionally a Server Component: keeping the MDX tree free of client
 * components guarantees the runtime MDX evaluation stays RSC-safe.
 */
export function CodeBlock({ children, ...props }: ComponentProps<"pre">) {
  const data = props as unknown as Record<string, unknown>;
  const language = typeof data["data-language"] === "string" ? data["data-language"] : null;

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-line bg-muted">
      {language && (
        <span className="absolute right-3 top-2 z-10 select-none rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-fg">
          {language}
        </span>
      )}
      <pre
        className="overflow-x-auto p-4 text-sm leading-relaxed [&>code]:font-mono"
        {...props}
      >
        {children as ReactNode}
      </pre>
    </div>
  );
}
