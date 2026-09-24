/**
 * Single source of truth for every string, URL and setting used across the
 * site (metadata, sitemap, RSS, JSON-LD, navigation, footer).
 *
 * Values reflect Manish Kumar's LinkedIn profile (Bengaluru, Kyndryl). Update
 * this file when the role, location or contact details change and every page
 * follows automatically.
 */

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  /** key used to pick the inline SVG icon in components/site/SocialLinks.tsx */
  icon: "github" | "linkedin" | "x" | "email" | "rss";
};

export const site = {
  /** Brand name shown in the header, footer and JSON-LD. */
  name: "Manish Kumar",
  /** Default <title> template: "%s | Manish Kumar". */
  title: "Manish Kumar — Senior Lead Technical Specialist",
  /** Default meta description. Keep it between 140 and 160 characters. */
  description:
    "Senior Lead Technical Specialist at Kyndryl in Bengaluru. I lead front-end teams and build React, TypeScript and AI automation platforms for the enterprise.",
  /** Language code for <html lang>. */
  locale: "en",
  /** Used by manifest.json / browser chrome. */
  themeColor: "#ffffff",

  author: {
    name: "Manish Kumar",
    role: "Senior Lead Technical Specialist @ Kyndryl",
    location: "Bengaluru, Karnataka, India",
    /**
     * Structured parts for the PostalAddress in JSON-LD (lib/seo.ts). Kept
     * separate because schema.org wants locality/region/country as distinct
     * fields, not one display string.
     */
    address: {
      locality: "Bengaluru",
      region: "Karnataka",
      country: "IN",
    },
    /** Shown on the contact section and used for the mailto: link. */
    email: "manishsharan@protonmail.com",
    /** Availability pill rendered above the home hero headline. */
    availability: "Open to work",
    /**
     * Hero copy. `heroLead` is the one-line role/location statement that
     * follows the headline; `heroSupport` adds the employers so the claim is
     * grounded rather than generic.
     */
    heroLead:
      "Senior Lead Technical Specialist @ Kyndryl in Bengaluru, Karnataka, India.",
    heroSupport:
      "Nine years across Kyndryl, Oracle, IBM, Cognizant and Tech Mahindra — leading front-end teams that ship enterprise learning platforms and AI automation.",
    /**
     * Compact proof points rendered under the home hero actions: nine years
     * (bio), twelve projects shipped, five employers named in the bio.
     */
    stats: [
      { value: "9+", label: "Years building" },
      { value: "12", label: "Projects" },
      { value: "5", label: "Employers" },
    ],
    avatar: "/avatar.svg",
    avatarAlt: "Portrait of Manish Kumar",
    resume: "/resume.pdf",
    bio: "I lead front-end engineering at Kyndryl, building enterprise learning platforms and AI automation. Nine years across Kyndryl, Oracle, IBM, Cognizant and Tech Mahindra — mostly React, TypeScript and Node.js, and increasingly MCP and agentic tooling.",
  },

  social: {
    github: "https://github.com/indecoder",
    linkedin: "https://www.linkedin.com/in/sharanmanish",
    /**
     * No X/Twitter handle is published, so this key is intentionally absent
     * rather than shipping a dead link - app/layout.tsx omits the
     * twitter:creator tag when it is missing. Add it back to re-enable it.
     */
  },

  /**
   * Header navigation. Order is preserved.
   *
   * `/about` deliberately stays out of the header (the design keeps four items)
   * and is reachable from the footer plus the hero bio line.
   *
   * "Notes" is intentionally absent: there is no `content/notes` collection yet,
   * and a nav item pointing at a route the static export never emits would 404.
   * Add the collection plus `app/notes/page.tsx` first, then list it here.
   */
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "Uses", href: "/uses" },
  ] satisfies NavItem[],

  /** Footer navigation: the header items plus the pages only linked from here. */
  footerNav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Uses", href: "/uses" },
  ] satisfies NavItem[],

  socialLinks: [
    { label: "GitHub", href: "https://github.com/indecoder", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sharanmanish",
      icon: "linkedin",
    },
    { label: "Email", href: "mailto:manishsharan@protonmail.com", icon: "email" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
  ] satisfies SocialLink[],

  /** Number of posts rendered per page on /blog. */
  postsPerPage: 9,

  keywords: [
    "Manish Kumar",
    "Senior Lead Technical Specialist",
    "Kyndryl",
    "front-end architect",
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "AWS",
    "AI automation",
    "MCP",
    "Microsoft Power Platform",
    "Bengaluru",
  ],
} as const;

/**
 * `@handle` for the twitter:creator tag, or undefined when no X account is
 * configured (see site.social). Returning undefined lets app/layout.tsx omit
 * the tag instead of emitting a broken "@undefined".
 */
export const twitterCreator: string | undefined = (() => {
  const handle = (site.social as { x?: string }).x;
  if (!handle) return undefined;
  const last = handle.split("/").filter(Boolean).pop();
  return last ? `@${last}` : undefined;
})();

/**
 * Canonical origin. Must be absolute because it feeds `metadataBase`,
 * canonical URLs, sitemap.xml, robots.txt, RSS and JSON-LD.
 *
 * Production -> https://fullstackmanish.web.app (Firebase Hosting default
 *               domain for the `fullstackmanish` project). Baked in as the
 *               default so a plain `npm run build` always produces correct
 *               absolute URLs, even with no .env.local.
 * Local dev  -> override with NEXT_PUBLIC_SITE_URL=http://localhost:3000
 *
 * The site is also reachable at fullstackmanish.firebaseapp.com. Because every
 * canonical tag points at the .web.app origin, that alias cannot create
 * duplicate-content problems.
 *
 * If you later connect a custom domain in the Firebase console, change this
 * value and redeploy - every canonical tag, sitemap entry, RSS link and
 * OpenGraph URL is generated from it at build time.
 */
export const productionUrl = "https://fullstackmanish.web.app";

export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? productionUrl
).replace(/\/+$/, "");

/**
 * Deployment stage this build was produced for: "dev" | "uat" | "prod".
 *
 * Set by scripts/apply-env.mjs / scripts/build.mjs from env.config.mjs and
 * frozen into the bundle at build time, exactly like siteUrl. Defaults to
 * "prod" so a bare `next build` still behaves like a production build.
 */
export type AppStage = "dev" | "uat" | "prod";

export const appStage: AppStage = ((): AppStage => {
  const value = process.env.NEXT_PUBLIC_APP_STAGE;
  return value === "dev" || value === "uat" ? value : "prod";
})();

/** True only for the production build. */
export const isProduction = appStage === "prod";

/**
 * Whether search engines may index this build.
 *
 * dev and UAT are served on their own *.web.app origins. If they were
 * indexable they would compete with production as duplicate content, so
 * app/layout.tsx emits `noindex, nofollow`, app/robots.ts disallows everything
 * and app/sitemap.ts returns an empty sitemap for any non-prod stage.
 */
export const indexable: boolean =
  isProduction && process.env.NEXT_PUBLIC_INDEXABLE !== "false";

/** Human-readable stage name, used in the non-production banner. */
export const stageLabel =
  appStage === "dev" ? "Development" : appStage === "uat" ? "UAT" : "Production";

/**
 * Brand name for this build. Non-production builds are suffixed so a tester
 * looking at a tab or a screenshot can immediately tell which stage it is.
 */
export const siteName: string = (
  process.env.NEXT_PUBLIC_SITE_NAME ??
  (isProduction ? site.name : `${site.name} (${stageLabel})`)
).trim();

