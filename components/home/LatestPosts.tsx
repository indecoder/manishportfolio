import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/ui/Reveal";

/** "Latest writing" section on the home page. */
export function LatestPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-10">
      <Reveal>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Latest writing</h2>
          <Link
            href="/blog"
            className="font-mono text-xs text-muted-fg transition-colors hover:text-accent"
          >
            All posts →
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 70} className="h-full">
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
