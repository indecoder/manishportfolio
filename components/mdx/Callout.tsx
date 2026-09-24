import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CalloutType =
  | "note"
  | "info"
  | "tip"
  | "success"
  | "warning"
  | "warn"
  | "danger";

const styles: Record<CalloutType, { box: string; label: string; emoji: string }> = {
  note: {
    box: "border-sky-500/40 bg-sky-500/10",
    label: "text-sky-600 dark:text-sky-400",
    emoji: "ℹ️",
  },
  tip: {
    box: "border-emerald-500/40 bg-emerald-500/10",
    label: "text-emerald-600 dark:text-emerald-400",
    emoji: "💡",
  },
  warning: {
    box: "border-amber-500/40 bg-amber-500/10",
    label: "text-amber-600 dark:text-amber-400",
    emoji: "⚠️",
  },
  danger: {
    box: "border-red-500/40 bg-red-500/10",
    label: "text-red-600 dark:text-red-400",
    emoji: "⛔",
  },
  // Aliases, so `type="info"` / `"success"` / `"warn"` read naturally in MDX.
  info: {
    box: "border-sky-500/40 bg-sky-500/10",
    label: "text-sky-600 dark:text-sky-400",
    emoji: "ℹ️",
  },
  success: {
    box: "border-emerald-500/40 bg-emerald-500/10",
    label: "text-emerald-600 dark:text-emerald-400",
    emoji: "✅",
  },
  warn: {
    box: "border-amber-500/40 bg-amber-500/10",
    label: "text-amber-600 dark:text-amber-400",
    emoji: "⚠️",
  },
};

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
};

/**
 * Usage inside an MDX file:
 *
 * <Callout type="tip" title="Static export">
 *   Firebase Hosting's free plan cannot run server code.
 * </Callout>
 */
export function Callout({ type = "note", title, children }: CalloutProps) {
  // Fall back to the neutral style so an unknown `type` can never crash a build.
  const style = styles[type] ?? styles.note;

  return (
    <aside
      className={cn(
        "my-6 rounded-xl border p-4 text-sm [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
        style.box,
      )}
    >
      <p className={cn("mb-1 flex items-center gap-2 font-semibold", style.label)}>
        <span aria-hidden="true">{style.emoji}</span>
        {title ?? type.charAt(0).toUpperCase() + type.slice(1)}
      </p>
      {children}
    </aside>
  );
}
