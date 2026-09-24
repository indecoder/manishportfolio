#!/usr/bin/env node
/**
 * Deploys ./out to one stage's Firebase Hosting site.
 *
 *   node scripts/deploy.mjs <dev|uat|prod> [--channel <id>] [--build] [--dry-run]
 *
 * Each stage owns a separate Hosting SITE in the same Firebase project, so this
 * always deploys with `--only hosting:<site>` and can never disturb another
 * stage. See env.config.mjs for the stage -> site mapping.
 *
 * Preflight (runs before anything is uploaded):
 *   - ./out must exist and contain index.html
 *   - ./out must have been built for THIS stage. Deploying a prod build to dev
 *     (or a dev build to prod) is exactly the mistake that leaks the wrong
 *     canonical URLs, so it is refused here rather than discovered later.
 *
 * Authentication (non-interactive, as documented for firebase-tools in CI):
 *   - GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json, or
 *   - FIREBASE_TOKEN=<refresh token from `firebase login:ci`>, or
 *   - an interactive `firebase login` session for local use.
 *
 * Options:
 *   --channel <id>  deploy to a preview channel instead of the live site
 *   --expires <dur> channel expiry, default 7d (e.g. 30d, 1h)
 *   --build         run scripts/build.mjs for this stage first
 *   --dry-run       print the exact firebase-tools command without running it
 */

import { spawnSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import {
  FIREBASE_TOOLS_VERSION,
  STAGES,
  STAGE_CONFIG,
  resolveEnv,
  resolveStage,
  validateEnv,
} from "../env.config.mjs";

const ROOT = process.cwd();

function parseArgs(argv) {
  const flags = new Set();
  const options = {};
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
    } else if (arg === "--channel" || arg === "--expires") {
      options[arg.slice(2)] = argv[++i];
    } else {
      flags.add(arg);
    }
  }

  return { flags, options, positional };
}

/**
 * Reads ./out/index.html and confirms it was built for the intended stage.
 * @returns {Promise<string|null>} a problem description, or null when correct
 */
async function checkArtifactStage(stage, env) {
  let html;
  try {
    html = await readFile(path.join(ROOT, "out", "index.html"), "utf8");
  } catch {
    return `./out/index.html is missing - run \`npm run build:${stage}\` first (or pass --build)`;
  }

  // Judge the artifact by the origin Next.js GENERATED into it, i.e. the
  // canonical link. Scanning every URL in the document would be wrong: content
  // may legitimately link to the production site from any stage (a project's
  // `live:` frontmatter does exactly that).
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];

  if (!canonical) {
    return `./out/index.html has no canonical link; rebuild with \`npm run build:${stage}\``;
  }

  const expected = env.NEXT_PUBLIC_SITE_URL;

  if (!canonical.startsWith(expected)) {
    let builtFor = canonical;
    try {
      builtFor = new URL(canonical).origin;
    } catch {
      // Keep the raw value when it is not a parseable absolute URL.
    }
    return `./out was built for ${builtFor}, not ${expected}; rebuild with \`npm run build:${stage}\``;
  }

  return null;
}

function detectAuth() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return "GOOGLE_APPLICATION_CREDENTIALS (service account)";
  if (process.env.FIREBASE_TOKEN) return "FIREBASE_TOKEN (refresh token)";
  return "interactive login session";
}

async function main() {
  const { flags, options, positional } = parseArgs(process.argv.slice(2));
  const stage = resolveStage(positional[0] ?? process.env.APP_STAGE);

  if (!stage) {
    console.error(`[deploy] unknown stage "${positional[0] ?? ""}" - expected one of: ${STAGES.join(", ")}`);
    process.exit(1);
  }

  const env = resolveEnv(stage);
  const problems = validateEnv(stage, env);
  if (problems.length > 0) {
    console.error(`[deploy] refusing to deploy the "${stage}" stage:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  if (flags.has("--build")) {
    const built = spawnSync(
      process.execPath,
      [path.join(ROOT, "scripts", "build.mjs"), stage],
      { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env }, shell: false },
    );
    if (built.status !== 0) process.exit(built.status ?? 1);
  }

  const artifactProblem = await checkArtifactStage(stage, env);
  if (artifactProblem) {
    console.error(`[deploy] ${artifactProblem}`);
    process.exit(1);
  }

  const firebaseProject = env.FIREBASE_PROJECT_ID;
  const firebaseSite = env.FIREBASE_HOSTING_SITE;
  const channelId = options.channel;
  const expires = options.expires ?? "7d";

  // Preview channels take the target without the `hosting:` prefix; live
  // deploys take `hosting:<target>`. Both forms are scoped to a single site.
  // Channel deploys add --json so the generated URL can be parsed reliably
  // instead of being scraped out of human-readable log output.
  const args = channelId
    ? [
        "hosting:channel:deploy", channelId,
        "--only", firebaseSite,
        "--project", firebaseProject,
        "--expires", expires,
        "--non-interactive",
        "--json",
      ]
    : [
        "deploy",
        "--only", `hosting:${firebaseSite}`,
        "--project", firebaseProject,
        "--non-interactive",
        "--force",
      ];

  const expectedUrl = channelId
    ? `a preview channel on ${firebaseSite} (URL printed by firebase-tools)`
    : env.NEXT_PUBLIC_SITE_URL;

  console.log(`[deploy] stage   : ${stage} (${STAGE_CONFIG[stage].label})`);
  console.log(`[deploy] project : ${firebaseProject}`);
  console.log(`[deploy] site    : ${firebaseSite}`);
  console.log(`[deploy] target  : ${expectedUrl}`);
  console.log(`[deploy] auth    : ${detectAuth()}`);
  console.log(`[deploy] command : npx --yes firebase-tools@${FIREBASE_TOOLS_VERSION} ${args.join(" ")}`);

  if (flags.has("--dry-run")) {
    console.log("[deploy] --dry-run set, nothing was uploaded");
    return;
  }

  // With --json, firebase-tools prints only JSON on stdout, so capture it
  // instead of inheriting; stderr still streams through for progress/errors.
  const capturing = Boolean(channelId);
  const result = spawnSync("npx", ["--yes", `firebase-tools@${FIREBASE_TOOLS_VERSION}`, ...args], {
    cwd: ROOT,
    stdio: capturing ? ["inherit", "pipe", "inherit"] : "inherit",
    env: { ...process.env, ...env },
    // npx is a .cmd shim on Windows, so a shell is required there only.
    shell: process.platform === "win32",
  });

  const stdout = capturing ? (result.stdout?.toString() ?? "") : "";

  if (result.status !== 0) {
    if (stdout) process.stdout.write(stdout);
    console.error(`[deploy] firebase-tools exited with code ${result.status}`);
    process.exit(result.status ?? 1);
  }

  // A live deploy always lands on the stage's own origin; a channel deploy gets
  // a generated URL that only firebase-tools knows.
  const urls = channelId ? parseChannelUrls(stdout) : [env.NEXT_PUBLIC_SITE_URL];

  console.log(`\n[deploy] ${stage} published:`);
  for (const url of urls) console.log(`  ${url}`);
  if (urls.length === 0) console.log("  (no URL reported - see the firebase-tools output above)");

  await report(stage, firebaseSite, firebaseProject, urls);
}

/**
 * Pulls the deployed channel URL(s) out of `firebase hosting:channel:deploy
 * --json`. The result shape nests per site, so walk it rather than assuming a
 * fixed path.
 * @returns {string[]}
 */
function parseChannelUrls(raw) {
  try {
    const payload = JSON.parse(raw);

    if (payload.success === false) {
      console.error(`[deploy] firebase-tools reported failure: ${payload.error?.message ?? "unknown error"}`);
      process.exit(1);
    }

    const found = [];
    const walk = (value) => {
      if (!value || typeof value !== "object") return;
      if (typeof value.url === "string" && value.url.startsWith("http")) found.push(value.url);
      for (const child of Object.values(value)) walk(child);
    };
    walk(payload.result ?? payload);

    return [...new Set(found)];
  } catch {
    // Not JSON after all - surface the raw output so nothing is silently lost.
    if (raw.trim()) process.stdout.write(raw);
    return [];
  }
}

/** Publishes the outcome to the GitHub Actions step summary and job outputs. */
async function report(stage, firebaseSite, firebaseProject, urls) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    const lines = [
      `### Deployed \`${stage}\` (${STAGE_CONFIG[stage].label})`,
      "",
      `- Hosting site: \`${firebaseSite}\``,
      `- Project: \`${firebaseProject}\``,
      ...(urls.length > 0 ? urls.map((url) => `- URL: ${url}`) : ["- URL: see the firebase-tools output"]),
      "",
    ];
    await appendFile(summaryPath, `${lines.join("\n")}\n`);
  }

  // Expose the URL to later steps, e.g. the pull-request preview comment.
  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath && urls.length > 0) {
    await appendFile(outputPath, `deploy_url=${urls[0]}\n`);
  }
}

main().catch((error) => {
  console.error("[deploy] failed:", error?.message ?? error);
  process.exit(1);
});
