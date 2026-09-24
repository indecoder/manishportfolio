import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroPortrait } from "@/components/home/HeroPortrait";

/**
 * Home hero: a sell-first pitch. Availability, an outcome headline, proof and
 * a single next step - plus a framed portrait so the page sells a person, not
 * just text.
 *
 * Motion lives in the backdrop only: counter-scrolling glow orbs, a static
 * accent wash, and a halo trailing the pointer (HeroBackdrop), plus 3D tilt on
 * the portrait card (HeroPortrait). The content column never moves - static
 * content against moving layers is what makes parallax read as depth instead
 * of smear. Everything is lerp/rAF CSS-transform motion, aria-hidden, and
 * inert under prefers-reduced-motion.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <HeroBackdrop />

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
            <span className="text-gradient mt-2 block text-2xl font-medium sm:text-3xl">
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

        <HeroPortrait />
      </div>

      {/* Scroll cue: hints the parallax layers below without stealing focus. */}
      <div
        aria-hidden
        className="hero-enter mt-16 flex justify-center lg:mt-20"
        style={{ animationDelay: "520ms" }}
      >
        <span className="scroll-cue flex h-9 w-5 items-start justify-center rounded-full border border-line p-1">
          <span className="scroll-cue-dot h-1.5 w-1 rounded-full bg-accent" />
        </span>
      </div>
    </section>
  );
}

