"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Reveal } from "@/components/ui/Reveal";

/** Contact block: mailto CTA plus a copy-email button. */
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
    <Reveal className="mt-10">
      <Card className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Let&apos;s talk</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-fg">
          Open to interesting work, collaborations and speaking opportunities.
          The fastest way to reach me is email — I usually reply within a couple of
          days.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
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

        <SocialLinks
          links={site.socialLinks}
          className="mt-6 flex flex-wrap items-center gap-2"
        />
      </Card>
    </Reveal>
  );
}
