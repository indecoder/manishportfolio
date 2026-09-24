# Portfolio & Blog

A statically exported **Next.js 16** portfolio and MDX blog, deployed to
**Firebase Hosting** with **GitHub Actions**. Zero hosting cost, full SEO, and
every page prerendered to plain HTML.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (CSS-first config, class-based dark mode) |
| Content | MDX compiled at build time with `@mdx-js/mdx` |
| Markdown | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code` (Shiki), `reading-time` |
| Hosting | Firebase Hosting (static, global CDN) |
| CI/CD | GitHub Actions (lint, typecheck, build, deploy) |

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static export to `out/` + RSS + search index |
| `npm run preview` | Serves `out/` locally on :4173 |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generate:og` | Regenerates `public/og-default.png` + `apple-icon.png` |
| `npm run firebase` | Runs `firebase-tools` via npx (not a local dependency) |
| `npm run deploy` | Deploys `out/` to the live channel |
| `npm run deploy:channel` | Deploys to a `preview` channel |

## Project structure

```
app/
  layout.tsx            # fonts, metadata, theme script, JSON-LD
  page.tsx              # home: hero, projects, latest posts, contact
  globals.css           # Tailwind v4 theme tokens + dark mode + Shiki
  sitemap.ts            # -> out/sitemap.xml
  robots.ts             # -> out/robots.txt
  manifest.ts           # -> out/manifest.webmanifest
  not-found.tsx         # -> out/404.html
  blog/                 # index, [slug], tag/[tag]
  projects/             # index, [slug]
  about/  uses/         # static pages
components/
  mdx/                  # components usable inside MDX files
  blog/  projects/  home/  site/  ui/
content/
  blog/*.mdx            # posts
  projects/*.mdx        # projects
lib/
  site.ts               # EDIT: your name, links, URLs
  mdx.ts  projects.ts   # content loading + MDX compilation
  seo.ts                # JSON-LD builders
  utils.ts              # cn, formatters, slugify, reading time
scripts/
  generate-rss.mjs          # postbuild  -> out/rss.xml
  generate-search-index.mjs # postbuild  -> out/search.json
  generate-og-images.mjs    # on demand  -> public/og-default.png, apple-icon.png
public/
  og-default.png  apple-icon.png  icon.svg  avatar.svg
```

## Personalise it

1. **`lib/site.ts`** - name, role, location, email, social links, site URL.
2. **`app/about/page.tsx`** and **`app/uses/page.tsx`** - the marked data arrays.
3. **`content/blog/*.mdx`** and **`content/projects/*.mdx`** - delete the
   samples and add your own.
4. **`public/`** - replace `avatar.svg` / `icon.svg`, and add `resume.pdf`.
5. **`.firebaserc`** - set your Firebase project ID.
6. After changing your name/role/description, run `npm run generate:og` so the
   default social card matches.

## Writing content

Drop an `.mdx` file in `content/blog/` - no registration step, no config.

```mdx
---
title: "My post title"
date: "2026-09-23"          # required
updated: "2026-09-25"       # optional, shows as "Updated"
description: "Shown in cards, meta description and RSS."  # required
tags: ["nextjs", "seo"]     # lowercase, hyphenated
cover: "/images/cover.png"  # optional OG image
draft: false                # true hides it everywhere
featured: true              # surfaces it on the home page
---

Body in Markdown, with any MDX component below.
```

Projects use the same pattern in `content/projects/`, plus `summary`, `role`,
`status` (`active` | `archived` | `maintained`), `demo`, `repo`, `highlights`
and `gallery`.

`draft: true` removes a file from the pages, `generateStaticParams`,
`sitemap.xml`, `rss.xml` and the search index.

## MDX components

Available without importing: `<Callout type="info|warn|success|tip">`,
`<YouTube id="..." title="...">`, `<Image src alt width height caption>`.
Fenced code gets line numbers, a filename tab and a copy button:

````mdx
```ts filename="example.ts" {2}
export const a = 1;
export const b = 2;
```
````

## Environments

Three stages, each with its own Firebase Hosting **site** inside the
`fullstackmanish` project. Separate sites rather than preview channels: dev and
UAT get stable URLs that never expire, and a dev deploy physically cannot touch
production.

| Stage | Trigger | Hosting site | URL | Indexable |
| --- | --- | --- | --- | --- |
| `dev` | merge a PR into `develop` | `fullstackmanish-dev` | https://fullstackmanish-dev.web.app | no |
| `uat` | merge a PR into `uat` | `fullstackmanish-uat` | https://fullstackmanish-uat.web.app | no |
| `prod` | merge a PR into `main`, tag `v*`, or manual run | `fullstackmanish` | https://fullstackmanish.web.app | yes |
| preview | open or update a PR | channel on the dev site | ephemeral | no |

One branch per stage, so the day-to-day flow is PR-driven with no manual deploy
step: branch off `develop` → open a PR (CI builds every stage and a preview
channel is published) → merge into `develop` (auto-deploys dev) → PR
`develop` → `uat` and merge (auto-deploys UAT) → PR `uat` → `main` and merge
(auto-deploys production; approval-gated once `prod` has required reviewers).

Every stage-specific value lives in **`env.config.mjs`** — canonical URL, site
name, Hosting site, indexability. Nothing else hard-codes them.

Non-production builds are `noindex, nofollow`, disallow everything in
`robots.txt`, emit an empty `sitemap.xml` and show a coloured top banner, so
they can never compete with production in Google.

### Caching: content changes are visible immediately

`firebase.json` sets the same policy on all three sites:

| Files | Policy | Why it can never serve stale content |
| --- | --- | --- |
| `_next/static/**` | `max-age=31536000, immutable` | Next.js content-hashes these filenames per build — a new build gets new URLs, so old JS/CSS becomes unreachable, not stale |
| everything else — pages, `resume.pdf`, images, `rss.xml`, `search.json`, `sitemap.xml` | `max-age=0, must-revalidate` | revalidated on every request. Firebase Hosting serves strong ETags, so an unchanged file costs one cheap `304`, while a changed file is picked up the moment a deploy finishes |

Pages are served at clean URLs (`/blog/my-post`, no `.html`), so
extension-based rules can never cover them — that is why the revalidate
policy is the `**` default rather than an `*.html` rule, and why it also
catches `resume.pdf` (which matches no extension list at all).

Firebase Hosting purges its CDN on every deploy, and the browser revalidates
on every load — so after a deploy there is **no layer that can serve an old
blog post or an old `resume.pdf`**. Add or edit MDX under `content/blog/`,
replace `public/resume.pdf`, commit, and merge the PR: the change is live
when the deploy job finishes. (One-off: until this header change itself has
deployed, a browser may still hold a previously-cached page — one hard
refresh, Ctrl+F5, clears it.)

### First-time setup (once)

The two extra Hosting sites must exist before dev/uat can deploy:

```bash
npm run firebase -- login
npm run firebase:sites:list                  # confirm the project
npm run firebase:sites:create:dev
npm run firebase:sites:create:uat
```

### Build for a stage

This is a static export, so the environment is frozen in at build time and every
stage needs its own build:

```bash
npm run build:dev      # ./out with dev URLs
npm run build:uat
npm run build          # same as build:prod
```

`scripts/build.mjs` exports the stage variables, runs `next build`, regenerates
`rss.xml` and `search.json`, then verifies that `./out` carries this stage's
origin and no other stage's.

### Deploy

```bash
npm run deploy:dev
npm run deploy:uat
npm run deploy                        # prod
npm run deploy:dev -- --channel pr-42 # preview channel on the dev site
```

Each script refuses to upload a `./out` that was built for a different stage, so
you cannot accidentally publish dev content to production. Deploys are scoped to
one site with `--only hosting:<site>`, which is why `/tmp`-style accidents
cannot happen.

### Apply a stage to local dev

```bash
npm run env:dev     # writes the dev block into .env.local
npm run dev
```

`apply-env` only rewrites its own marked block in `.env.local`, so any variables
you added yourself survive.

## GitHub Actions

Two workflows: `ci.yml` (quality gate plus a build of **every** stage) and
`deploy.yml` (the promotion pipeline above).

Add in **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `FIREBASE_SERVICE_ACCOUNT` | Service account JSON (see the three roles below) |
| Variable | `FIREBASE_PROJECT_ID` | `fullstackmanish` (optional — `env.config.mjs` already defaults to it) |
| Variable | `NEXT_PUBLIC_SITE_URL` | optional override, e.g. after connecting a custom domain |

Create the service account in *IAM & Admin → Service Accounts* inside the
`fullstackmanish` project and grant it exactly three roles:

| Role | ID | Why it is needed |
| --- | --- | --- |
| Firebase Hosting Admin | `roles/firebasehosting.admin` | deploys the three sites and the PR preview channels |
| Service Usage Consumer | `roles/serviceusage.serviceUsageConsumer` | quota billing against the project — required by firebase-tools ≥ 13.4.0 (this repo pins 15.30.2) |
| API Keys Viewer | `roles/serviceusage.apiKeysViewer` | required for CLI deploys |

Nothing broader. `firebaseauth.admin` only adds preview URLs to Auth authorised
domains and `run.viewer` only matters for Hosting rewrites to Cloud Run or
Functions — this project has neither, so both are deliberately omitted. Then
*Keys → Add key → Create new key → JSON* and paste the whole file into the
secret. `deploy.yml` writes it to `$RUNNER_TEMP` and exposes it as
`GOOGLE_APPLICATION_CREDENTIALS`, which is the CI authentication path documented
for firebase-tools; the file is deleted again in an `always()` step.

> **This repo pins the public npm registry.** `.npmrc` sets
> `registry=https://registry.npmjs.org/` for this directory only — your
> user-level `~/.npmrc` and any corporate registry configured there are untouched.
> It has to be committed: without it a local `npm install` rewrites every
> `resolved` URL in `package-lock.json` to whatever private registry this machine
> defaults to, and `npm ci` then fails with `E401` on the runners, which hold no
> private-registry credentials.

GitHub **environments** are created automatically the first time `deploy.yml`
references them, so `dev`, `uat` and `prod` need no manual setup for deploys to
work. Create one by hand only to add a gate: putting required reviewers on `prod`
(Settings → Environments → `prod`) makes production releases approval-gated, and
nothing else needs to change. Variables set on an environment override the
defaults in `env.config.mjs` for that stage only.

One repository-level secret covers all three stages. They share a single Firebase
project and differ only by Hosting site, so there is no per-stage credential to
keep separate — and repository-level secrets are visible to jobs that name an
environment, so it never needs duplicating into each one.

> **Branch = stage.** Merging a PR into `develop` / `uat` / `main` automatically
> deploys dev / UAT / production — no manual step, no tags needed (a `v*` tag
> remains as an optional release marker), and every PR gets a throwaway preview
> channel. And the first production deploy **replaces** the older portfolio
> currently served at https://fullstackmanish.web.app — to keep it, point
> `prod.firebaseSite` in `env.config.mjs` at a different Hosting site and update
> `firebase.json` and `.firebaserc` to match.

## Google indexing (free)

Generated on every build: `/sitemap.xml`, `/robots.txt`, `/rss.xml`, canonical
tags, OpenGraph/Twitter cards, and JSON-LD (`WebSite`, `Person`, `BlogPosting`,
`SoftwareApplication`, `BreadcrumbList`, `ItemList`).

Then, once: verify **https://fullstackmanish.web.app** in
[Google Search Console](https://search.google.com/search-console) and submit
`https://fullstackmanish.web.app/sitemap.xml`. New URLs are discovered
automatically after each deploy. Do not verify the
`fullstackmanish.firebaseapp.com` alias separately — every canonical tag
already points at the `.web.app` origin, so the alias cannot split your
ranking signals.

## Firebase free tier (Blaze not required)

- 10 GB storage, 360 MB/day transfer
- 1 GB Firebase Hosting cache, unlimited requests
- Custom domains with free SSL

For a personal site this is effectively unlimited.

## Deployment checklist

- [ ] `lib/site.ts` filled in (email, LinkedIn and X handles are still placeholders)
- [ ] Sample content replaced
- [x] `public/resume.pdf` exists (generated placeholder — swap in your real CV)
- [x] `.firebaserc` set to `fullstackmanish`, with dev/uat/prod targets
- [x] `firebase.json` defines all three Hosting sites
- [x] `env.config.mjs` is the single source of truth for every stage value
- [ ] `npm run firebase:sites:create:dev` and `firebase:sites:create:uat` run once
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret set — the only thing still blocking deploys
- [ ] `prod` environment created with required reviewers (`dev`/`uat` auto-create)
- [x] `main` is the default branch; `master` removed
- [x] `develop` branch pushed — merging a PR into it deploys dev
- [x] `uat` branch pushed — merging a PR into it deploys UAT
- [x] CI green on `main`: lint, typecheck and all three stage builds
- [ ] First PR merged into `main` — triggers the production deploy
- [ ] Search Console verified and sitemap submitted for production only
