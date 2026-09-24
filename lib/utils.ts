import { siteUrl } from "@/lib/site";

/** Join class names, skipping falsy values. Keeps bundles dependency-free. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Turn any path into an absolute URL against the canonical site origin. */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${clean}`;
}

/**
 * Format a date as e.g. "23 September 2026".
 * Always rendered in UTC so the build-time HTML and any client re-render
 * produce identical strings (no hydration mismatch, no timezone flakiness).
 */
export function formatDate(
  input: string | Date,
  style: "long" | "medium" | "numeric" = "long",
): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";

  const formats: Record<
    "long" | "medium" | "numeric",
    Intl.DateTimeFormatOptions
  > = {
    long: { day: "numeric", month: "long", year: "numeric" },
    medium: { day: "numeric", month: "short", year: "numeric" },
    numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
  };

  const format = new Intl.DateTimeFormat("en-GB", formats[style]);

  return format.format(date);
}

/** ISO-8601 date (YYYY-MM-DD) for sitemap `lastmod` and JSON-LD. */
export function toIsoDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

/** URL-safe slug from arbitrary text (used for tag pages). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp a string to `max` characters on a word boundary. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** Split a comma/space separated list into a clean unique array. */
export function normalizeTags(tags: unknown): string[] {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : String(tags).split(",");
  return Array.from(
    new Set(
      list
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .map((tag) => tag.toLowerCase()),
    ),
  );
}

/**
 * Split a comma/space separated list into a clean unique array, preserving the
 * original casing. Used for display labels such as a project's tech stack
 * ("Next.js", not "next.js").
 */
export function normalizeList(items: unknown): string[] {
  if (!items) return [];
  const list = Array.isArray(items) ? items : String(items).split(",");
  return Array.from(
    new Set(
      list.map((item) => String(item).trim()).filter(Boolean),
    ),
  );
}

/** Group label for the blog timeline, e.g. "2026". */
export function getYear(input: string | Date): number {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.getUTCFullYear();
}
