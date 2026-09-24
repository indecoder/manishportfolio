import type { ComponentProps, ReactNode } from "react";

type HeadingProps = ComponentProps<"h1"> & { children?: ReactNode };

/**
 * Headings rendered inside MDX articles.
 * `rehype-slug` injects the `id` and `rehype-autolink-headings` injects the
 * "#" permalink anchor, so the CSS in globals.css handles the hover affordance.
 */
export function H1(props: HeadingProps) {
  return <h1 className="mt-2 mb-4 text-4xl font-bold tracking-tight" {...props} />;
}

export function H2(props: HeadingProps) {
  return (
    <h2
      className="mt-12 mb-4 scroll-mt-24 border-b border-line pb-2 text-2xl font-semibold tracking-tight"
      {...props}
    />
  );
}

export function H3(props: HeadingProps) {
  return (
    <h3 className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight" {...props} />
  );
}

export function H4(props: HeadingProps) {
  return (
    <h4 className="mt-6 mb-2 scroll-mt-24 text-base font-semibold uppercase tracking-wide text-muted-fg" {...props} />
  );
}
