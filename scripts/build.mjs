#!/usr/bin/env node
/**
 * Builds ./out for exactly one deployment stage.
 *
 *   node scripts/build.mjs <dev|uat|prod> [--og] [--skip-verify]
 *
 * This replaces a bare `next build` for anything you intend to deploy, because
 * a static export freezes the canonical origin into the HTML. Running
 * `next build` directly would silently produce production URLs regardless of
 * which environment you meant to publish.
 *
 * Steps:
 *   1. Resolve + validate the stage environment (env.config.mjs).
 *   2. Export it into the child process environment. Real process variables
 *      take precedence over .env files in Next.js, so this is authoritative
 *      even if a stale .env.local from another stage is lying around.
 *   3. `next build` (static export into ./out).
 *   4. Post-build generators: rss.xml and search.json.
 *   5. Optionally regenerate the OpenGraph card for this stage (--og).
 *   6. Verify ./out really carries this stage's origin and no other stage's.
 *
 * The same command runs locally and in CI, so what you test is what ships.
 */

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  STAGES,
  STAGE_CONFIG,
  resolveEnv,
  resolveStage,
  validateEnv,
} from "../env.config.mjs";

const ROOT = process.cwd();
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

/** Files that must exist after a successful static export. */
const REQUIRED_OUTPUTS = [
  "out/index.html",
  "out/404.html",
  "out/sitemap.xml",
  "out/robots.txt",
  "out/rss.xml",
  "out/search.json",
  "out/manifest.webmanifest",
];

function parseArgs(argv) {
  return {
    flags: new Set(argv.filter((a) => a.startsWith("--"))),
    positional: argv.filter((a) => !a.startsWith("--")),
  };
}

/** Runs a child process, inheriting stdio, and aborts the build on failure. */
function run(command, args, env, label) {
  console.log(`\n[build] ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env,
    // Windows cannot execute .cmd shims without a shell; we always invoke
    // `node <script>` so this stays false and quoting stays predictable.
    shell: false,
  });

  if (result.error) {
    console.error(`[build] could not start "${label}": ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[build] "${label}" exited with code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

/**
 * Extracts the URLs Next.js GENERATES for this stage - canonical link,
 * OpenGraph url, JSON-LD, sitemap locs, robots directives and RSS links.
 *
 * Content links are excluded deliberately. A project's `live:` frontmatter may
 * legitimately point at the production site from every stage, and a link in
 * prose is not a canonical URL, so it cannot create duplicate-content problems.
 */
function metadataUrls(relative, contents) {
  const urls = [];

  if (relative.endsWith(".html")) {
    const canonical = contents.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
    if (canonical) urls.push(canonical[1]);
    const ogUrl = contents.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i);
    if (ogUrl) urls.push(ogUrl[1]);
    for (const match of contents.matchAll(/"url"\s*:\s*"(https?:[^"]+)"/g)) urls.push(match[1]);
  }

  if (relative.endsWith("sitemap.xml")) {
    for (const match of contents.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(match[1]);
  }

  if (relative.endsWith("robots.txt")) {
    for (const match of contents.matchAll(/^(?:Sitemap|Host):\s*(\S+)/gim)) urls.push(match[1]);
  }

  if (relative.endsWith("rss.xml")) {
    for (const match of contents.matchAll(/<link>([^<]+)<\/link>/g)) urls.push(match[1]);
    for (const match of contents.matchAll(/<guid[^>]*>([^<]+)<\/guid>/g)) urls.push(match[1]);
  }

  return urls;
}

/**
 * Confirms the export matches THIS stage: right origin, no other stage's
 * origin, and SEO behaviour consistent with whether the stage is indexable.
 * Catches the classic mistake of deploying a build made for the wrong stage.
 */
async function verifyOutput(stage, env) {
  const expected = env.NEXT_PUBLIC_SITE_URL;
  const indexable = env.NEXT_PUBLIC_INDEXABLE === "true";
  const foreign = STAGES.filter((s) => s !== stage).map((s) => STAGE_CONFIG[s].siteUrl);

  for (const relative of REQUIRED_OUTPUTS) {
    try {
      await readFile(path.join(ROOT, relative));
    } catch {
      console.error(`[build] missing expected output: ${relative}`);
      process.exit(1);
    }
  }

  // Small text/HTML files that carry the stage's identity.
  const probes = ["out/index.html", "out/sitemap.xml", "out/robots.txt", "out/rss.xml"];
  const contents = {};
  for (const relative of probes) {
    contents[relative] = await readFile(path.join(ROOT, relative), "utf8");
  }

  const fail = (message) => {
    console.error(`[build] ${message}`);
    process.exit(1);
  };

  // Every GENERATED metadata URL must point at this stage and never another.
  let checked = 0;
  for (const relative of probes) {
    for (const url of metadataUrls(relative, contents[relative])) {
      checked += 1;
      for (const other of foreign) {
        if (url.startsWith(other)) {
          fail(`${relative} contains a ${other} metadata URL in a ${stage} build: ${url}`);
        }
      }
    }
  }
  if (checked === 0) {
    fail("found no generated metadata URLs to verify - the SEO output is missing");
  }

  // The canonical link and OpenGraph url exist on every page, indexable or not.
  if (!contents["out/index.html"].includes(expected)) {
    fail(`out/index.html does not reference ${expected}`);
  }

  if (indexable) {
    // Production must advertise itself to crawlers.
    if (!contents["out/sitemap.xml"].includes(expected)) {
      fail("out/sitemap.xml is missing the production origin");
    }
    if (!/<loc>/.test(contents["out/sitemap.xml"])) {
      fail("out/sitemap.xml has no <loc> entries");
    }
    if (!contents["out/robots.txt"].includes(`${expected}/sitemap.xml`)) {
      fail("out/robots.txt does not advertise the sitemap");
    }
    if (!contents["out/rss.xml"].includes(expected)) {
      fail("out/rss.xml is missing the production origin");
    }
    if (/noindex/i.test(contents["out/index.html"])) {
      fail("the prod build is marked noindex - it would never appear in Google");
    }
  } else {
    // dev / UAT must be invisible to crawlers.
    if (/<loc>/.test(contents["out/sitemap.xml"])) {
      fail(`out/sitemap.xml lists URLs but the ${stage} stage must not be indexed`);
    }
    if (!/Disallow:\s*\/\s*$/m.test(contents["out/robots.txt"])) {
      fail(`out/robots.txt does not disallow everything for the ${stage} stage`);
    }
    if (!/noindex/i.test(contents["out/index.html"])) {
      fail(`out/index.html is missing the noindex robots meta tag for the ${stage} stage`);
    }
  }

  console.log(
    `[build] verified ${stage}: origin ${expected}, ${checked} metadata URL(s), indexable=${indexable}`,
  );
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const stage = resolveStage(positional[0] ?? process.env.APP_STAGE);

  if (!stage) {
    console.error(`[build] unknown stage "${positional[0] ?? ""}" - expected one of: ${STAGES.join(", ")}`);
    process.exit(1);
  }

  const env = resolveEnv(stage);
  const problems = validateEnv(stage, env);
  if (problems.length > 0) {
    console.error(`[build] refusing to build the "${stage}" stage:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log(`[build] stage ${stage} (${STAGE_CONFIG[stage].label}) -> ${env.NEXT_PUBLIC_SITE_URL}`);

  // Children inherit our environment plus the resolved stage values.
  const childEnv = { ...process.env, ...env };

  run(process.execPath, [NEXT_BIN, "build"], childEnv, "next build");
  run(process.execPath, [path.join(ROOT, "scripts", "generate-rss.mjs")], childEnv, "generate rss.xml");
  run(process.execPath, [path.join(ROOT, "scripts", "generate-search-index.mjs")], childEnv, "generate search.json");

  if (flags.has("--og")) {
    run(process.execPath, [path.join(ROOT, "scripts", "generate-og-images.mjs")], childEnv, "generate OG images");
  }

  if (!flags.has("--skip-verify")) {
    await verifyOutput(stage, env);
  }

  console.log(`\n[build] done - ./out is ready to deploy to ${env.FIREBASE_HOSTING_SITE}`);
}

main().catch((error) => {
  console.error("[build] failed:", error?.message ?? error);
  process.exit(1);
});
