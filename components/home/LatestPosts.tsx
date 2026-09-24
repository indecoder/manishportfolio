import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import { ParallaxShift } from "@/components/ui/ParallaxShift";
import { Reveal } from "@/components/ui/Reveal";

/** "Latest writing" section on the home page. */
export function LatestPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16">
      <ParallaxBackdrop side="right" speed={0.18} />

      <div className="relative">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Writing
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Latest writing
              </h2>
            </div>
            <Link
              href="/blog"
              className="group font-mono text-xs text-muted-fg transition-colors hover:text-accent"
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
        </Reveal>

        {/* Column split-parallax: each column drifts at its own rate as the
            section passes, so the grid visibly separates into layers. */}
        <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ParallaxShift speed={0.04} maxShift={26} className="grid gap-5">
            {posts
              .filter((_, index) => index % 3 === 0)
              .map((post, index) => (
                <Reveal key={post.slug} delay={index * 160}>
                  <PostCard post={post} />
                </Reveal>
              ))}
          </ParallaxShift>
          <ParallaxShift speed={0.06} maxShift={38} className="grid gap-5 sm:mt-8">
            {posts
              .filter((_, index) => index % 3 === 1)
              .map((post, index) => (
                <Reveal key={post.slug} delay={index * 160 + 60}>
                  <PostCard post={post} />
                </Reveal>
              ))}
          </ParallaxShift>
          <ParallaxShift speed={0.08} maxShift={50} className="grid gap-5 sm:mt-4">
            {posts
              .filter((_, index) => index % 3 === 2)
              .map((post, index) => (
                <Reveal key={post.slug} delay={index * 160 + 120}>
                  <PostCard post={post} />
                </Reveal>
              ))}
          </ParallaxShift>
        </div>
      </div>
    </section>
  );
}
