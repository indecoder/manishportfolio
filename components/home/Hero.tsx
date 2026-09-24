import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";
import { HeroProfileCard } from "@/components/home/HeroProfileCard";

/**
 * Home hero: a sell-first pitch in two columns.
 *
 * Left column - availability pill, outcome headline, role line, bio, the two
 * primary actions, proof stats and monochrome social links. Right column - a
 * floating profile card with overlapping chips.
 *
 * Motion: this section is entirely static. The only moving layer on the route
 * is the single fixed global background mounted once in app/layout.tsx, which
 * scrubs against scroll and is inert under prefers-reduced-motion. Nothing in
 * the hero itself animates, so the background parallax reads as depth instead
 * of smear.
 */
export function Hero() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32">
      {/* The hero owns its Container - app/page.tsx renders <Hero /> outside the
          page wrapper - so this grid must never sit flush to the viewport edge.
          No `overflow-hidden` here: the global background is fixed, and clipping
          would cut the profile card's floating chips. */}
      <Container wide>
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          {/* Availability: the first thing a recruiter should see. */}
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur-sm">
            {/* Static dot + soft ring: reads as "live" without an infinite
                `animate-ping`, which ignores prefers-reduced-motion. */}
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-600/15"
            />
            {site.author.availability}
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3rem] lg:leading-[1.12]">
            <span className="block text-balance">
              Hi, I&apos;m {site.author.name}.
            </span>
            {/* The claim sits one tier below the name instead of competing with
                it at the same 3rem weight. */}
            <span className="mt-3 block text-balance text-[0.68em] font-semibold leading-snug text-blue-600">
              I take React, TypeScript and AI platforms from idea to production.
            </span>
          </h1>

          {/* Subheadline: the role, stated plainly. */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-700">
            {site.author.heroLead}
          </p>

          {/* Bio: the employers that back the headline up. */}
          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
            {site.author.heroSupport}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/projects">View selected work</Button>
            <Button href={site.author.resume} variant="secondary">
              Download résumé
            </Button>
          </div>

          {/* Proof points. `flex-col-reverse` puts the number on top while
              keeping <dt> before <dd> in the DOM. */}
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-gray-200 pt-6">
            {site.author.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-5 text-gray-600">
                  {stat.label}
                </dt>
                <dd className="text-2xl font-bold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* RSS stays out of the hero - it lives in the footer colophon. */}
          <SocialLinks
            links={site.socialLinks.filter((link) => link.icon !== "rss")}
            className="mt-6 flex flex-wrap items-center gap-2"
          />
        </div>

        {/* Right column: the floating profile card. */}
        <HeroProfileCard />
      </div>
      </Container>
    </section>
  );
}

