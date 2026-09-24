import type { ReactNode } from "react";

type MdxImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  caption?: string;
  children?: ReactNode;
};

/**
 * Images inside MDX articles.
 *
 * `next/image` cannot be used here: the static export sets
 * `images.unoptimized` and the optimisation server does not exist on Firebase
 * Hosting's free plan. A plain <img> with explicit width/height prevents CLS,
 * and `loading="lazy"` keeps the page fast.
 *
 * Usage: <Image src="/posts/foo.png" alt="Diagram" width={1200} height={630} caption="Figure 1" />
 */
export function MdxImage({
  src,
  alt = "",
  width,
  height,
  title,
  caption,
}: MdxImageProps) {
  if (!src) return null;

  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        title={title}
        width={width ? Number(width) : undefined}
        height={height ? Number(height) : undefined}
        loading="lazy"
        decoding="async"
        className="mx-auto h-auto w-full rounded-xl border border-line"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-fg">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
