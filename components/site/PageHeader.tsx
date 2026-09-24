import { Container } from "@/components/ui/Container";

type PageHeaderProps = {
  /** Small mono kicker above the title (e.g. "5 projects"). */
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Slot beside the title block on desktop (filters, tag nav…). */
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * Shared interior-page header: kicker, title, description, with an optional
 * aside slot. Gives every index page the same treatment without repeating
 * markup.
 *
 * Server Component: nothing here needs the client, so no JS is shipped. The
 * ambient depth behind every route comes from the single fixed `GlobalBackground`
 * layer mounted once in app/layout.tsx.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pb-10 pt-14 sm:pt-16">
      <Container
        wide
        className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-7 text-muted-fg">
              {description}
            </p>
          )}
        </div>

        {aside && <div className="shrink-0">{aside}</div>}
      </Container>

      {children}
    </header>
  );
}