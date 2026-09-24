#!/usr/bin/env node
/**
 * Applies a deployment stage's environment to this working copy.
 *
 *   node scripts/apply-env.mjs <dev|uat|prod> [options]
 *
 * What it does:
 *   1. Resolves the stage through env.config.mjs (exported variables override
 *      the built-in defaults, so CI can inject GitHub Actions values).
 *   2. Validates the result and refuses to continue on a bad value.
 *   3. Writes the variables into a clearly marked block in `.env.local`, which
 *      Next.js loads automatically for `next dev` and `next build`. Anything
 *      you added to `.env.local` yourself OUTSIDE that block is preserved.
 *   4. Writes `.env.deploy.json` - a machine-readable copy that CI reads to
 *      turn the resolved values into job outputs.
 *
 * Both files are gitignored; nothing secret is ever written.
 *
 * Options:
 *   --no-write      resolve, validate and print, but touch no files
 *   --json          print the resolved environment as JSON on stdout
 *   --github-output also append the values to $GITHUB_OUTPUT for later steps
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ENV_KEYS,
  STAGES,
  STAGE_CONFIG,
  resolveEnv,
  resolveStage,
  validateEnv,
} from "../env.config.mjs";

const ROOT = process.cwd();
const DOTENV_LOCAL = path.join(ROOT, ".env.local");
const DEPLOY_JSON = path.join(ROOT, ".env.deploy.json");

const BLOCK_START = "# >>> managed by scripts/apply-env.mjs - do not edit by hand >>>";
const BLOCK_END = "# <<< managed by scripts/apply-env.mjs <<<";

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const positional = argv.filter((a) => !a.startsWith("--"));
  return { flags, positional };
}

function usage(message) {
  if (message) console.error(`\n[apply-env] ${message}\n`);
  console.error(`Usage: node scripts/apply-env.mjs <${STAGES.join("|")}> [--no-write] [--json] [--github-output]`);
  process.exit(1);
}

/** Quotes a value so dotenv parses it back verbatim. */
function quote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function renderBlock(stage, env) {
  const lines = [
    BLOCK_START,
    `# stage: ${stage} (${STAGE_CONFIG[stage].label})`,
    `# regenerate with: npm run env:${stage}`,
    "",
  ];
  for (const key of ENV_KEYS) lines.push(`${key}=${quote(env[key])}`);
  lines.push(BLOCK_END);
  return lines.join("\n");
}

/**
 * Replaces only the managed block, leaving a developer's own variables alone.
 * @param {string} existing full current contents of .env.local
 * @param {string} block the freshly rendered managed block
 */
function mergeInto(existing, block) {
  const start = existing.indexOf(BLOCK_START);
  const end = existing.indexOf(BLOCK_END);

  if (start === -1 || end === -1 || end < start) {
    const separator = existing.trim() === "" ? "" : `${existing.replace(/\n+$/, "")}\n\n`;
    return `${separator}${block}\n`;
  }

  const before = existing.slice(0, start).replace(/\n+$/, "");
  const after = existing.slice(end + BLOCK_END.length).replace(/^\n+/, "");
  return [before, block, after].filter((part) => part !== "").join("\n\n").concat("\n");
}

async function readIfExists(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return "";
  }
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const stage = resolveStage(positional[0] ?? process.env.APP_STAGE);

  if (!stage) {
    usage(`unknown stage "${positional[0] ?? ""}" - expected one of: ${STAGES.join(", ")}`);
  }

  const env = resolveEnv(stage);
  const problems = validateEnv(stage, env);

  if (problems.length > 0) {
    console.error(`[apply-env] refusing to apply the "${stage}" stage:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  if (!flags.has("--no-write")) {
    const existing = await readIfExists(DOTENV_LOCAL);
    await writeFile(DOTENV_LOCAL, mergeInto(existing, renderBlock(stage, env)), "utf8");
    await writeFile(
      DEPLOY_JSON,
      `${JSON.stringify({ stage, label: STAGE_CONFIG[stage].label, env }, null, 2)}\n`,
      "utf8",
    );
  }

  // Feed later GitHub Actions steps without re-resolving in shell.
  const outputFile = process.env.GITHUB_OUTPUT;
  if (flags.has("--github-output") && outputFile) {
    const lines = [`app_stage=${stage}`, ...ENV_KEYS.map((key) => `${key}=${env[key]}`)];
    await writeFile(outputFile, `${lines.join("\n")}\n`, { flag: "a" });
  }

  if (flags.has("--json")) {
    process.stdout.write(`${JSON.stringify({ stage, env }, null, 2)}\n`);
    return;
  }

  console.log(`[apply-env] stage ${stage} (${STAGE_CONFIG[stage].label})`);
  for (const key of ENV_KEYS) console.log(`  ${key}=${env[key]}`);
  if (!flags.has("--no-write")) {
    console.log("  wrote .env.local and .env.deploy.json");
  }
}

main().catch((error) => {
  console.error("[apply-env] failed:", error?.message ?? error);
  process.exit(1);
});
