import type { SocialLink } from "@/lib/site";

const paths: Record<SocialLink["icon"], string> = {
  github:
    "M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 12 .5Z",
  linkedin:
    "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45Z",
  x: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z",
  email:
    "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2.5.6 7.5 5.4 7.5-5.4v-.2L12 11.4 4.5 6.4v.2Z",
  rss: "M4 11a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7v-2Zm0-5a14 14 0 0 1 14 14h-2A12 12 0 0 0 4 8V6Zm1.5 12.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",
};

/** Accessible icon links for GitHub / LinkedIn / X / email / RSS. */
export function SocialLinks({
  links,
  className,
}: {
  links: ReadonlyArray<SocialLink>;
  className?: string;
}) {
  return (
    <ul className={className ?? "flex flex-wrap items-center gap-2"}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            aria-label={link.label}
            title={link.label}
            {...(link.icon === "email" || link.icon === "rss"
              ? {}
              : { target: "_blank", rel: "noopener noreferrer me" })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted-fg transition-colors hover:border-accent/50 hover:bg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={paths[link.icon]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
