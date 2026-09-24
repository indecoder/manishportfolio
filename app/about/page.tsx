import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/site/SocialLinks";
import { site } from "@/lib/site";
import { jsonLdToString, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.author.name} - ${site.author.role} based in ${site.author.location}.`,
  alternates: { canonical: "/about" },
};

/* ------------------------------------------------------------------ */
/* Content taken from the LinkedIn profile. Plain data, no markup.     */
/* ------------------------------------------------------------------ */

const BIO = [
  `I am ${site.author.name}, a Senior Lead Technical Specialist at Kyndryl, based in ${site.author.location}. I lead an RPA team and design and build enterprise learning-management solutions from the ground up.`,
  "Nine years in, my path has run through Kyndryl, Oracle, IBM, Cognizant and Tech Mahindra - application development, front-end architecture and agile delivery. I work mostly in React, TypeScript and Node.js, and I am increasingly focused on AI integration: MCP servers, agentic tooling and Microsoft Power Platform automation.",
];

const SERVICES = [
  {
    title: "Front-end architecture",
    description:
      "Designing React and TypeScript systems that stay maintainable at team scale, plus the build tooling, design systems and accessibility foundations around them.",
  },
  {
    title: "AI & automation",
    description:
      "Enterprise chatbots on IBM Watson, Power Platform workflows and MCP-based integrations that take repetitive work off people's plates.",
  },
  {
    title: "Technical leadership",
    description:
      "Leading and mentoring engineering teams - most recently a front-end team of twelve - while staying hands-on in the code.",
  },
];

/** A named engagement inside a role. Kyndryl roles are project-based. */
type Engagement = {
  name: string;
  role: string;
  detail: string;
};

type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  engagements?: Engagement[];
};

const EXPERIENCE: Experience[] = [
  {
    role: "Senior Lead Technical Specialist",
    company: "Kyndryl",
    period: "Jun 2022 – Present",
    location: "India",
    summary:
      "Lead an RPA team and build learning platforms from the ground up across four major engagements:",
    engagements: [
      {
        name: "JAIN University Management Solution",
        role: "Software Architect",
        detail:
          "Architected a Learning Management System from scratch and led a front-end engineering team of twelve, delivering scalable, high-performance interfaces.",
      },
      {
        name: "AskHR",
        role: "AI & Automation Developer",
        detail:
          "Engineered an organisation-wide HR chatbot on IBM Watson, automating routine requests such as leave applications and payslip retrieval.",
      },
      {
        name: "Kortex (CIO internal)",
        role: "Lead Developer",
        detail:
          "Spearheaded internal applications on Microsoft Power Platform while mentoring a team of trainee developers.",
      },
      {
        name: "The Very Group",
        role: "Senior Lead Engineer",
        detail:
          "Led checkout-flow delivery across BFF and SPA application development cycles.",
      },
    ],
  },
  {
    role: "Senior Application Engineer",
    company: "Oracle",
    period: "Aug 2021 – Jun 2022",
    location: "India",
    summary:
      "Built the next-generation front end for the LRM/LRS project (Oracle Financial Services). Developed in Knockout.js and jQuery while migrating the back end from JSP to Spring Boot, then supported and iterated on the shipped product.",
  },
  {
    role: "Senior System Engineer",
    company: "IBM",
    period: "Apr 2020 – Aug 2021",
    location: "India",
    summary:
      "Application developer on the Angular + Spring stack. Built the PDHA internal app (UI architecture and design in Figma and Webflow, agile with Jira/GitHub/Trello) and the BMS business-management tool, including making the existing application responsive.",
  },
  {
    role: "Programming Analyst",
    company: "Cognizant",
    period: "Aug 2019 – Apr 2020",
    location: "Bangalore",
    summary:
      "Requirements analysis and feature enhancement for Prudential Insurance in Angular, with unit testing in Jasmine. Maintained a Backbone.js CRM application for US Bank.",
  },
  {
    role: "Frontend Developer",
    company: "Tech Mahindra",
    period: "Mar 2017 – Aug 2019",
    location: "Pune Area, India",
    summary:
      "Front-end developer and designer on the MEAN stack. Prototyped interactive experiences in Justinmind, developed and unit-tested Angular 5+ against microservices, and worked with flex-layout and Bootstrap. Agile delivery using Jira and GitLab.",
  },
  {
    role: "Trainee Android Developer",
    company: "Palle Technologies",
    period: "Aug 2016 – Mar 2017",
    location: "Karnataka, India",
    summary:
      "Where it started: Android application development as a trainee, before moving into front-end engineering.",
  },
];

const SKILLS = [
  {
    group: "Languages & frameworks",
    items: ["TypeScript", "JavaScript", "React", "Angular", "Node.js", "Knockout.js"],
  },
  {
    group: "Platform & cloud",
    items: ["AWS", "Microsoft Power Platform", "IBM Watson", "Firebase", "Spring Boot"],
  },
  {
    group: "AI & automation",
    items: ["MCP", "AI integration", "RPA", "Three.js", "Project management", "Figma"],
  },
];

const CERTIFICATIONS = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
  },
  {
    name: "Javascript Basic",
    issuer: "HackerRank",
  },
];

const EDUCATION = [
  {
    qualification:
      "Bachelor's degree, Electrical, Electronics and Communications Engineering",
    institution: "Rajiv Gandhi Prodyogiki Vishwavidyalaya",
    period: "2012 – 2016",
  },
];

const AWARDS = [
  {
    name: "Innovator's Edge Award",
    note: "Recognised for innovation and delivery impact.",
  },
];

/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <Container className="py-14">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={site.author.avatar}
          alt={site.author.name}
          width={96}
          height={96}
          priority
          className="rounded-2xl border border-line object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            About {site.author.name}
          </h1>
          <p className="mt-2 text-base text-muted-fg">
            {site.author.role} · {site.author.location}
          </p>
          <div className="mt-3">
            <SocialLinks links={site.socialLinks} />
          </div>
        </div>
      </header>

      <section aria-labelledby="bio" className="mt-10 max-w-2xl">
        <h2 id="bio" className="sr-only">
          Biography
        </h2>
        <div className="space-y-4">
          {BIO.map((paragraph) => (
            <p key={paragraph} className="text-base leading-7 text-muted-fg">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="services" className="mt-12">
        <h2
          id="services"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
        >
          What I do
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <h3 className="text-sm font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-fg">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="experience" className="mt-12">
        <h2
          id="experience"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
        >
          Experience
        </h2>
        <ol className="space-y-4">
          {EXPERIENCE.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {job.role} · {job.company}
                </h3>
                <span className="font-mono text-xs text-muted-fg">
                  {job.period}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-fg">
                {job.location}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-fg">
                {job.summary}
              </p>
              {job.engagements && (
                <ul className="mt-4 space-y-3 border-l border-line pl-4">
                  {job.engagements.map((engagement) => (
                    <li key={engagement.name}>
                      <p className="text-sm font-medium">
                        {engagement.name}
                        <span className="ml-2 font-mono text-xs text-muted-fg">
                          {engagement.role}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-fg">
                        {engagement.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills" className="mt-12">
        <h2
          id="skills"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
        >
          Skills
        </h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          {SKILLS.map((group) => (
            <div
              key={group.group}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-fg">
                {group.group}
              </dt>
              <dd className="mt-2 text-sm leading-6">
                {group.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="credentials" className="mt-12">
        <h2
          id="credentials"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
        >
          Certifications & education
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-mono text-xs uppercase tracking-wide text-muted-fg">
              Certifications
            </h3>
            <ul className="mt-3 space-y-3">
              {CERTIFICATIONS.map((certification) => (
                <li key={certification.name}>
                  <p className="text-sm font-medium">{certification.name}</p>
                  <p className="mt-0.5 text-sm text-muted-fg">
                    {certification.issuer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <h3 className="font-mono text-xs uppercase tracking-wide text-muted-fg">
              Education
            </h3>
            <ul className="mt-3 space-y-3">
              {EDUCATION.map((entry) => (
                <li key={entry.institution}>
                  <p className="text-sm font-medium">{entry.institution}</p>
                  <p className="mt-0.5 text-sm text-muted-fg">
                    {entry.qualification}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-fg">
                    {entry.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="awards" className="mt-12">
        <h2
          id="awards"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-fg"
        >
          Awards
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {AWARDS.map((award) => (
            <li
              key={award.name}
              className="rounded-2xl border border-line bg-card p-4"
            >
              <p className="text-sm font-semibold">{award.name}</p>
              <p className="mt-1 text-sm text-muted-fg">{award.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        {/* Add your CV to public/resume.pdf - this link is static, so the file
            must exist before it resolves. */}
        <a
          href={site.author.resume}
          download
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90"
        >
          Download résumé
        </a>
        <Button href={`mailto:${site.author.email}`} variant="secondary">
          Email me
        </Button>
        <Button href="/blog" variant="ghost">
          Read the blog
        </Button>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(personJsonLd()) }}
      />
    </Container>
  );
}
