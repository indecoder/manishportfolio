import type { ComponentProps, ReactNode } from "react";
import { H1, H2, H3, H4 } from "@/components/mdx/Heading";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Callout } from "@/components/mdx/Callout";
import { MdxImage } from "@/components/mdx/Image";
import { YouTube } from "@/components/mdx/YouTube";

/**
 * Component map applied to every MDX article by lib/mdx.ts at build time.
 *
 * NOTE: this file is named `mdx-components.tsx` following the Next.js MDX
 * convention, but it deliberately exports a plain object instead of a
 * `useMDXComponents()` hook. The content layer calls it from a non-component
 * function during `next build`, and the react-hooks/rules-of-hooks ESLint rule
 * would (correctly) reject calling a `use*` function there.
 *
 * Every entry is a Server Component so the evaluated MDX tree stays RSC-safe
 * and articles ship zero client-side JavaScript.
 */

function Anchor({ children, href, ...props }: ComponentProps<"a">) {
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
  const isAsset = typeof href === "string" && /\.(pdf|zip|png|jpe?g|gif|webp|svg)$/i.test(href);

  if (isExternal || isAsset) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        {...props}
      >
        {children as ReactNode}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      {...props}
    >
      {children as ReactNode}
    </a>
  );
}

function Blockquote({ children, ...props }: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className="my-6 border-l-4 border-accent/60 bg-muted py-1 pl-4 pr-3 text-lg italic text-muted-fg [&>p]:my-2"
      {...props}
    >
      {children as ReactNode}
    </blockquote>
  );
}

function Table({ children, ...props }: ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm" {...props}>
        {children as ReactNode}
      </table>
    </div>
  );
}

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,

  p: ({ children, ...props }: ComponentProps<"p">) => (
    <p className="my-4 leading-7" {...props}>
      {children as ReactNode}
    </p>
  ),

  a: Anchor,

  ul: ({ children, ...props }: ComponentProps<"ul">) => (
    <ul className="my-4 list-disc space-y-2 pl-6 marker:text-muted-fg" {...props}>
      {children as ReactNode}
    </ul>
  ),

  ol: ({ children, ...props }: ComponentProps<"ol">) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-muted-fg" {...props}>
      {children as ReactNode}
    </ol>
  ),

  li: ({ children, ...props }: ComponentProps<"li">) => (
    <li className="leading-7 [&>ul]:my-2" {...props}>
      {children as ReactNode}
    </li>
  ),

  blockquote: Blockquote,

  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-10 border-line" {...props} />
  ),

  pre: CodeBlock,

  img: MdxImage,
  Image: MdxImage,

  table: Table,

  thead: ({ children, ...props }: ComponentProps<"thead">) => (
    <thead className="bg-muted" {...props}>
      {children as ReactNode}
    </thead>
  ),

  th: ({ children, ...props }: ComponentProps<"th">) => (
    <th
      className="border-b border-line px-3 py-2 text-left font-semibold"
      {...props}
    >
      {children as ReactNode}
    </th>
  ),

  td: ({ children, ...props }: ComponentProps<"td">) => (
    <td className="border-b border-line px-3 py-2 align-top" {...props}>
      {children as ReactNode}
    </td>
  ),

  strong: ({ children, ...props }: ComponentProps<"strong">) => (
    <strong className="font-semibold text-fg" {...props}>
      {children as ReactNode}
    </strong>
  ),

  em: ({ children, ...props }: ComponentProps<"em">) => (
    <em className="italic" {...props}>
      {children as ReactNode}
    </em>
  ),

  del: ({ children, ...props }: ComponentProps<"del">) => (
    <del className="text-muted-fg line-through" {...props}>
      {children as ReactNode}
    </del>
  ),

  // Custom components available to authors inside .mdx files.
  Callout,
  YouTube,
};

export type MDXComponents = typeof mdxComponents;

/** Convenience accessor used by lib/mdx.ts. */
export function getMDXComponents(): MDXComponents {
  return mdxComponents;
}
