#!/usr/bin/env node
/**
 * Runs the pinned firebase-tools with whatever arguments you pass.
 *
 *   node scripts/firebase.mjs <command> [args...]
 *   npm run firebase -- hosting:sites:list
 *
 * Exists so the firebase-tools version is declared once (FIREBASE_TOOLS_VERSION
 * in env.config.mjs) instead of being copy-pasted into every npm script, where
 * the copies inevitably drift apart. scripts/deploy.mjs uses the same constant
 * for actual deployments; this wrapper is for setup and ad-hoc commands such
 * as creating Hosting sites or inspecting channels.
 */

import { spawnSync } from "node:child_process";
import { FIREBASE_TOOLS_VERSION } from "../env.config.mjs";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/firebase.mjs <command> [args...]");
  console.error("Example: npm run firebase -- hosting:sites:list");
  process.exit(1);
}

const result = spawnSync("npx", ["--yes", `firebase-tools@${FIREBASE_TOOLS_VERSION}`, ...args], {
  cwd: process.cwd(),
  stdio: "inherit",
  // npx is a .cmd shim on Windows, so a shell is required there only.
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(`[firebase] could not start firebase-tools: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 0);
