/**
 * Single source of truth for the dev / uat / prod deployment stages.
 *
 * WHY THIS FILE EXISTS
 * This site is a STATIC Next.js export (`output: "export"` in next.config.ts),
 * so every environment-specific value is frozen into the HTML at BUILD time -
 * there is no server left that could read a runtime variable. Each stage
 * therefore needs its own build, and that build has to know which stage it is
 * producing.
 *
 * Keeping all stage-specific values here means lib/site.ts (through the
 * NEXT_PUBLIC_* variables), the RSS/search/OG scripts, both GitHub Actions
 * workflows and the Firebase deploy can never disagree about what "dev" or
 * "prod" means. Adding or renaming a stage is a one-file change.
 *
 * Consumed by (all ESM .mjs, so both Node scripts and tooling can import it):
 *   scripts/apply-env.mjs   writes .env.local and .env.deploy.json for a stage
 *   scripts/build.mjs       builds ./out for one stage
 *   scripts/deploy.mjs      deploys ./out to that stage's Hosting site
 *   scripts/generate-*.mjs  read the NEXT_PUBLIC_* variables these produce
 *
 * OVERRIDES
 * Every value below can be overridden by exporting an environment variable of
 * the same name before running a script - see resolveEnv(). CI uses that to
 * inject GitHub Actions variables without touching this file.
 */

/** Valid stage identifiers, listed in promotion order. */
export const STAGES = ["dev", "uat", "prod"];

/** Common aliases so `npm run build:production` and friends also work. */
const STAGE_ALIASES = {
  develop: "dev",
  development: "dev",
  staging: "uat",
  stage: "uat",
  acceptance: "uat",
  live: "prod",
  production: "prod",
  release: "prod",
};

/**
 * One Firebase Hosting SITE per stage inside the same Firebase project.
 *
 * Separate sites (rather than preview channels) are deliberate: dev and UAT get
 * stable, bookmarkable URLs that never expire, so a UAT sign-off link still
 * works next week, and a dev deploy can never touch the production site.
 *
 * `firebaseSite` is the Hosting site ID; Firebase serves it at
 * https://<siteId>.web.app, which is why it matches `siteUrl`.
 *
 * The `target` names in firebase.json equal `firebaseSite`, so a stage deploys
 * with `firebase deploy --only hosting:<firebaseSite>` and nothing else in the
 * project is touched.
 */
export const STAGE_CONFIG = {
  dev: {
    label: "Development",
    /** Canonical origin baked into canonical tags, sitemap, RSS and JSON-LD. */
    siteUrl: "https://fullstackmanish-dev.web.app",
    /** Shown in the header/title so testers can see which stage they are on. */
    siteName: "Manish Kumar (Dev)",
    firebaseProject: "fullstackmanish",
    firebaseSite: "fullstackmanish-dev",
    /** Never let a non-production build be indexed by Google. */
    indexable: false,
    /** Branch that auto-deploys to this stage. */
    branch: "develop",
  },
  uat: {
    label: "User Acceptance Testing",
    siteUrl: "https://fullstackmanish-uat.web.app",
    siteName: "Manish Kumar (UAT)",
    firebaseProject: "fullstackmanish",
    firebaseSite: "fullstackmanish-uat",
    indexable: false,
    branch: "main",
  },
  prod: {
    label: "Production",
    siteUrl: "https://fullstackmanish.web.app",
    siteName: "Manish Kumar",
    firebaseProject: "fullstackmanish",
    firebaseSite: "fullstackmanish",
    indexable: true,
    /** Production is released by tag (v*) or an approved manual dispatch. */
    branch: null,
  },
};

/** Keys this project treats as stage-dependent build-time variables. */
export const ENV_KEYS = [
  "NEXT_PUBLIC_APP_STAGE",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_NAME",
  "NEXT_PUBLIC_INDEXABLE",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_HOSTING_SITE",
];

/**
 * Normalises a stage argument ("production" -> "prod", "UAT" -> "uat").
 * Returns null when the value is not a known stage.
 *
 * @param {unknown} input
 * @returns {"dev"|"uat"|"prod"|null}
 */
export function resolveStage(input) {
  if (typeof input !== "string") return null;
  const value = input.trim().toLowerCase();
  if (STAGES.includes(value)) return /** @type {"dev"|"uat"|"prod"} */ (value);
  const alias = STAGE_ALIASES[value];
  return STAGES.includes(alias) ? /** @type {"dev"|"uat"|"prod"} */ (alias) : null;
}

/**
 * Builds the complete environment for a stage.
 *
 * Precedence: an explicitly exported variable of the same name WINS over the
 * value in STAGE_CONFIG. That is what lets a GitHub Actions variable override
 * the canonical URL (for example after connecting a custom domain) without a
 * code change, while a plain `npm run build:prod` still does the right thing
 * with no configuration at all.
 *
 * @param {"dev"|"uat"|"prod"} stage
 * @param {Record<string, string|undefined>} [source] defaults to process.env
 * @returns {Record<string,string>}
 */
export function resolveEnv(stage, source = process.env) {
  const config = STAGE_CONFIG[stage];
  if (!config) throw new Error(`[env] unknown stage: ${String(stage)}`);

  /** @type {Record<string,string>} */
  const resolved = {
    NEXT_PUBLIC_APP_STAGE: stage,
    NEXT_PUBLIC_SITE_URL: config.siteUrl,
    NEXT_PUBLIC_SITE_NAME: config.siteName,
    NEXT_PUBLIC_INDEXABLE: String(config.indexable),
    FIREBASE_PROJECT_ID: config.firebaseProject,
    FIREBASE_HOSTING_SITE: config.firebaseSite,
  };

  for (const key of ENV_KEYS) {
    const override = source[key];
    // An empty string means "unset" in GitHub Actions expressions, so ignore it
    // rather than blanking out a working default.
    if (typeof override === "string" && override.trim() !== "") {
      resolved[key] = override.trim();
    }
  }

  // Absolute URLs must never carry a trailing slash: lib/site.ts, the RSS feed
  // and the sitemap all concatenate paths directly onto this value.
  resolved.NEXT_PUBLIC_SITE_URL = resolved.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");

  return resolved;
}

/**
 * Fails loudly on a misconfigured stage instead of publishing broken absolute
 * URLs. Called by apply-env/build/deploy so a bad value can never reach a
 * deployment.
 *
 * @param {"dev"|"uat"|"prod"} stage
 * @param {Record<string,string>} env
 * @returns {string[]} human-readable problems (empty means valid)
 */
export function validateEnv(stage, env) {
  const problems = [];
  const url = env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!/^https?:\/\/[^\s/]+$/i.test(url)) {
    problems.push(`NEXT_PUBLIC_SITE_URL must be an absolute http(s) origin, got "${url}"`);
  }

  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(url);
  if (stage === "prod" && isLocalhost) {
    problems.push("the prod stage cannot point at localhost - it would publish canonical tags for a local URL");
  }

  if (!/^[a-z0-9][a-z0-9-]{0,62}$/i.test(env.FIREBASE_HOSTING_SITE ?? "")) {
    problems.push(`FIREBASE_HOSTING_SITE "${env.FIREBASE_HOSTING_SITE}" is not a valid Hosting site ID`);
  }

  if (!env.FIREBASE_PROJECT_ID) {
    problems.push("FIREBASE_PROJECT_ID is required");
  }

  if (!["true", "false"].includes(env.NEXT_PUBLIC_INDEXABLE ?? "")) {
    problems.push(`NEXT_PUBLIC_INDEXABLE must be "true" or "false", got "${env.NEXT_PUBLIC_INDEXABLE}"`);
  }

  // Guard against the classic mistake of shipping an indexable non-prod build.
  if (stage !== "prod" && env.NEXT_PUBLIC_INDEXABLE === "true") {
    problems.push(`the ${stage} stage must not be indexable - it would compete with production in Google`);
  }

  return problems;
}

/**
 * Pinned firebase-tools version. Read by scripts/deploy.mjs and
 * scripts/firebase.mjs so the version cannot drift between npm scripts.
 */
export const FIREBASE_TOOLS_VERSION = "15.30.2";
