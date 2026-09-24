import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** Publication date, reading time and (optional) last-updated note. */
export function PostMetaInfo({ post }: { post: PostMeta }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-fg">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingTime}</span>
      <span aria-hidden="true">·</span>
      <span>{post.words.toLocaleString("en-US")} words</span>
      {post.updated && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={post.updated}>{formatDate(post.updated, "medium")}</time>
          </span>
        </>
      )}
    </p>
  );
}
