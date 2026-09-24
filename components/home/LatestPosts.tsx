import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { RevealGroup } from "@/components/ui/RevealGroup";

/**
 * "Latest writing" section on the home page.
 *
 * Same reveal choreography as the project grid: one RevealGroup, `data-reveal`
 * on the header and on each card wrapper, staggered 0.1s apart.
 */
export function LatestPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">

      <RevealGroup className="relative">
        <div data-reveal className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest writing
          </h2>
          <Link
            href="/blog"
            className="group shrink-0 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            All posts{" "}
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} data-reveal className="h-full">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
