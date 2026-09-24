type YouTubeProps = {
  /** YouTube video id, e.g. "dQw4w9WgXcQ". */
  id: string;
  title?: string;
  start?: number;
};

/**
 * Privacy-enhanced YouTube embed with a reserved 16:9 box so the iframe never
 * causes layout shift. Server Component - no JS shipped to the reader.
 *
 * Usage: <YouTube id="VIDEO_ID" title="My talk" />
 */
export function YouTube({ id, title = "YouTube video", start }: YouTubeProps) {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (start) params.set("start", String(start));

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-muted">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-muted-fg">{title}</figcaption>
    </figure>
  );
}
