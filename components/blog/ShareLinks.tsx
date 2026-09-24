"use client";

import { useState } from "react";
import { absoluteUrl } from "@/lib/utils";

/**
 * Share row for an article. Client Component because of the copy-to-clipboard
 * button; it lives in the page shell (never inside the MDX tree) so the
 * runtime-evaluated MDX stays RSC-safe.
 */
export function ShareLinks({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/blog/${slug}`);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-muted-fg transition-colors hover:border-accent/50 hover:bg-muted hover:text-fg";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-wide text-muted-fg">
        Share
      </span>

      <a
        href={`https://x.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Post on X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </a>

      <button type="button" onClick={copy} className={linkClass} aria-live="polite">
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
