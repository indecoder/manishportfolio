import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { TagList } from "@/components/blog/TagList";

/**
 * Blog list item used on /blog, tag pages and the home page.
 *
 * Date · read time · category chip, then title, description and the remaining
 * tags as pills. The whole card is one link target via the `after:absolute
 * after:inset-0` overlay, so the title link stays the accessible name while the
 * surface stays clickable.
 */
export function PostCard({ post }: { post: PostMeta }) {
  // The first tag doubles as the category chip; the rest stay as pills.
  const [category, ...rest] = post.tags;

  return (
    <Card as="article" hoverable className="flex h-full flex-col">
      <Link href={`/blog/${post.slug}`} className="group block focus-visible:outline-none">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
          <time dateTime={post.date}>{formatDate(post.date, "medium")}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                {category}
              </span>
            </>
          )}
        </p>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 group-focus-visible:text-blue-600">
          <span className="after:absolute after:inset-0">{post.title}</span>
        </h3>

        {post.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
            {post.description}
          </p>
        )}
      </Link>

      {rest.length > 0 && (
        <div className="relative mt-auto pt-4">
          <TagList tags={rest} />
        </div>
      )}
    </Card>
  );
}
