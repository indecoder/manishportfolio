import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { breadcrumbJsonLd, jsonLdToString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The hardware, software and services I use daily - editor, terminal, desktop setup, developer tools and hosting.",
  alternates: { canonical: "/uses" },
};

/* ------------------------------------------------------------------ */
/* EDIT THIS CONTENT - a "/uses" page is a well-known SEO format.       */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  {
    title: "Day job",
    items: [
      { name: "React + TypeScript", note: "The default for anything new" },
      { name: "Angular", note: "Where I started; still in the toolkit" },
      { name: "Node.js", note: "BFF layers and build tooling" },
      {
        name: "Microsoft Power Platform",
        note: "Power Apps, Power Automate, Dataverse",
      },
      { name: "IBM Watson", note: "Conversational AI for enterprise support" },
    ],
  },
  {
    title: "AI & automation",
    items: [
      {
        name: "MCP",
        note: "Model Context Protocol - wiring tools into assistants properly",
      },
      {
        name: "Agentic tooling",
        note: "Automating multi-step developer and ops workflows",
      },
      {
        name: "RPA",
        note: "Taking repetitive work off people's plates",
      },
    ],
  },
  {
    title: "Cloud & platform",
    items: [
      { name: "AWS", note: "Certified Solutions Architect - Associate" },
      { name: "Firebase Hosting", note: "Free static tier, global CDN" },
      { name: "GitHub Actions", note: "Lint, typecheck, build and deploy" },
    ],
  },
  {
    title: "Editor & collaboration",
    items: [
      { name: "VS Code", note: "Daily driver" },
      { name: "Figma", note: "UI architecture and design handoff" },
      { name: "Jira", note: "Agile delivery and sprint planning" },
      { name: "Git", note: "GitHub, GitLab or Bitbucket, depending on the client" },
    ],
  },
  {
    title: "This site",
    items: [
      { name: "Next.js 16", note: "App Router, static export" },
      { name: "Tailwind CSS v4", note: "Utility-first styling" },
      { name: "MDX", note: "Content as components" },
      { name: "TypeScript", note: "Strict mode" },
    ],
  },
];

/* ------------------------------------------------------------------ */

export default function UsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="/uses"
        title="Things I use to get work done"
        description={
          <>
            Hardware, software and services that survive daily use. Inspired by
            the{" "}
            <a
              href="https://uses.tech"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
            >
              uses.tech
            </a>{" "}
            community.
          </>
        }
      />

      <Container wide className="pb-14">
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title} aria-labelledby={`uses-${section.title}`}>
              <div className="mb-5 flex items-center gap-4">
                <h2
                  id={`uses-${section.title}`}
                  className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
                >
                  {section.title}
                </h2>
                <div aria-hidden className="hairline h-px flex-1 opacity-60" />
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-line bg-card/85 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/[0.07] dark:hover:shadow-accent/[0.12]"
                  >
                    <dt className="text-sm font-semibold">{item.name}</dt>
                    <dd className="mt-1 text-sm leading-6 text-muted-fg">
                      {item.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdToString(
              breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Uses", path: "/uses" },
              ]),
            ),
          }}
        />
      </Container>
    </>
  );
}
