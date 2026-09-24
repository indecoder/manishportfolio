"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Contact block: mailto CTA plus a copy-email button, on a gradient panel
 * with a counter-scrolling glow behind it - the page ends on the same depth
 * language as the hero.
 */
export function ContactCTA() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.author.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="relative overflow-hidden py-16">
      <ParallaxBackdrop side="center" speed={0.1} size={22} />

      <Reveal className="relative">
        <div className="hero-mesh overflow-hidden rounded-3xl border border-line bg-card p-8 shadow-xl shadow-black/5 sm:p-12 dark:shadow-black/40">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Let&apos;s talk
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-fg">
                Open to interesting work, collaborations and speaking
                opportunities. The fastest way to reach me is email — I usually
                reply within a couple of days.
              </p>

              <SocialLinks
                links={site.socialLinks}
                className="mt-6 flex flex-wrap items-center gap-2"
              />
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3">
              <Button href={`mailto:${site.author.email}`}>Email me</Button>
              <Button href={site.author.resume} variant="secondary">
                Download résumé
              </Button>
              <button
                type="button"
                onClick={copyEmail}
                aria-live="polite"
                className="font-mono text-xs text-muted-fg transition-colors hover:text-accent"
              >
                {copied ? "Copied!" : site.author.email}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
