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
    box: "border-sky-200 bg-sky-50",
    label: "text-sky-700",
    emoji: "ℹ️",
  },
  tip: {
    box: "border-emerald-200 bg-emerald-50",
    label: "text-emerald-700",
    emoji: "💡",
  },
  warning: {
    box: "border-amber-200 bg-amber-50",
    label: "text-amber-700",
    emoji: "⚠️",
  },
  danger: {
    box: "border-red-200 bg-red-50",
    label: "text-red-700",
    emoji: "⛔",
  },
  // Aliases, so `type="info"` / `"success"` / `"warn"` read naturally in MDX.
  info: {
    box: "border-sky-200 bg-sky-50",
    label: "text-sky-700",
    emoji: "ℹ️",
  },
  success: {
    box: "border-emerald-200 bg-emerald-50",
    label: "text-emerald-700",
    emoji: "✅",
  },
  warn: {
    box: "border-amber-200 bg-amber-50",
    label: "text-amber-700",
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
