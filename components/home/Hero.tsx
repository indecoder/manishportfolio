import Image from "next/image";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";

/**
 * Home hero: a sell-first pitch. Availability, an outcome headline, proof and
 * a single next step - plus a framed portrait so the page sells a person, not
 * just text.
 *
 * Static by design: entrance animation only (CSS, staggered), no scroll
 * listeners. The previous scroll-parallax backdrop is gone - on light
 * backgrounds it read as smudges, and a hero this short never scrolled enough
 * for parallax to be visible anyway.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="hero-mesh pointer-events-none absolute inset-0" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            className="hero-enter inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted-fg"
            style={{ animationDelay: "0ms" }}
          >
            <span
              aria-hidden
              className="availability-dot inline-block h-2 w-2 rounded-full bg-green-500"
            />
            {site.author.availability}
          </p>

          <h1
            className="hero-enter mt-5 text-balance text-4xl font-bold tracking-tight text-fg sm:text-5xl"
            style={{ animationDelay: "90ms" }}
          >
            Hi, I&apos;m {site.author.name}.
            <span className="mt-2 block text-2xl font-medium text-muted-fg sm:text-3xl">
              I take React, TypeScript and AI platforms from idea to production.
            </span>
          </h1>

          <p
            className="hero-enter mt-6 max-w-xl text-base leading-7 text-muted-fg"
            style={{ animationDelay: "180ms" }}
          >
            {site.author.role} in {site.author.location}. I lead front-end
            teams delivering enterprise learning and AI automation platforms —
            nine years across Kyndryl, Oracle, IBM, Cognizant and Tech Mahindra.
          </p>

          <div
            className="hero-enter mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "270ms" }}
          >
            <Button href="/projects">View selected work</Button>
            <Button href={site.author.resume} variant="secondary">
              Download résumé
            </Button>
            <Button href={`mailto:${site.author.email}`} variant="ghost">
              Get in touch
            </Button>
          </div>

          <div
            className="hero-enter mt-10 grid max-w-md grid-cols-3 gap-6"
            style={{ animationDelay: "360ms" }}
          >
            {site.author.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold tracking-tight text-fg">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-fg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <SocialLinks
            links={site.socialLinks}
            className="hero-enter mt-8 flex flex-wrap items-center gap-2"
          />
        </div>

        <figure
          className="hero-enter relative mx-auto w-full max-w-sm"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-3 shadow-2xl shadow-black/10 dark:shadow-black/50">
            <Image
              src={site.author.avatar}
              alt={site.author.avatarAlt}
              width={512}
              height={512}
              priority
              className="h-auto w-full rounded-[1.5rem]"
            />
            <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {site.author.name}
                </p>
                <p className="font-mono text-xs text-muted-fg">
                  {site.author.location}
                </p>
              </div>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[11px] font-medium text-accent">
                9+ yrs
              </span>
            </figcaption>
          </div>

          <span
            aria-hidden
            className="absolute -left-4 top-10 rounded-full border border-line bg-card px-3 py-1 font-mono text-xs text-muted-fg shadow-lg shadow-black/5 dark:shadow-black/40"
          >
            React · TypeScript
          </span>
          <span
            aria-hidden
            className="absolute -right-3 bottom-16 rounded-full border border-line bg-card px-3 py-1 font-mono text-xs text-muted-fg shadow-lg shadow-black/5 dark:shadow-black/40"
          >
            MCP · AI automation
          </span>
        </figure>
      </div>
    </section>
  );
}

