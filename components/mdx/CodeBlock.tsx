import type { ComponentProps, ReactNode } from "react";

/**
 * Renders the <pre> produced by `rehype-pretty-code`.
 *
 * Because we pass TWO themes ({ light, dark }) to rehype-pretty-code, Shiki
 * emits a single code block whose colours are CSS custom properties
 * (--shiki-light / --shiki-dark). globals.css swaps them based on the `.dark`
 * class - no duplicated DOM, no client-side JS.
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
