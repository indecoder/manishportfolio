"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { RevealGroup } from "@/components/ui/RevealGroup";

/**
 * Contact block: a rounded light panel washed in faint blue and purple, with an
 * "Email me" CTA, a résumé link and a copy-email affordance. The drifting orbs
 * behind it give the end of the page the same ambient depth as the hero, with
 * no moving text anywhere.
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
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">

      <RevealGroup className="relative">
        <div
          data-reveal
          className="glass overflow-hidden rounded-3xl bg-blue-50/40 p-8 sm:p-12"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Let&apos;s talk
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600">
                Open to interesting work, collaborations and speaking
                opportunities. The fastest way to reach me is email — I usually
                reply within a couple of days.
              </p>
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
                className="text-xs text-gray-600 transition-colors hover:text-blue-600"
              >
                {copied ? "Copied to clipboard" : site.author.email}
              </button>
            </div>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
