import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";

/** Home hero: who you are, what you do, where to go next. */
export function Hero() {
  return (
    <section className="py-14 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {site.author.role} · {site.author.location}
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
        Hi, I&apos;m {site.author.name}.
        <span className="mt-2 block text-2xl font-medium text-muted-fg sm:text-3xl">
          React, TypeScript and AI automation for the enterprise.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-7 text-muted-fg">
        {site.author.bio}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/projects">View projects</Button>
        <Button href="/blog" variant="secondary">
          Read the blog
        </Button>
        <Button href={`mailto:${site.author.email}`} variant="ghost">
          Get in touch
        </Button>
      </div>

      <SocialLinks links={site.socialLinks} className="mt-8 flex flex-wrap items-center gap-2" />
    </section>
  );
}
