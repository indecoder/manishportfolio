import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { TagList } from "@/components/blog/TagList";

/** Blog list item used on /blog, tag pages and the home page. */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Card as="article" hoverable className="h-full">
      <Link href={`/blog/${post.slug}`} className="group block focus-visible:outline-none">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-fg">
          <time dateTime={post.date}>{formatDate(post.date, "medium")}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          {post.featured && (
            <>
              <span aria-hidden="true">·</span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                Featured
              </span>
            </>
          )}
        </p>

        <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg transition-colors group-hover:text-accent group-focus-visible:text-accent">
          <span className="after:absolute after:inset-0">{post.title}</span>
        </h3>

        {post.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-fg">
            {post.description}
          </p>
        )}
      </Link>

      {post.tags.length > 0 && (
        <div className="relative mt-4">
          <TagList tags={post.tags} />
        </div>
      )}
    </Card>
  );
}
