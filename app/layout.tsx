import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  indexable,
  isProduction,
  site,
  siteName,
  siteUrl,
  stageLabel,
  twitterCreator,
} from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { jsonLdToString, personJsonLd, websiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/**
 * Applies the saved (or system) theme before first paint so there is no flash
 * of the wrong colour scheme. Runs inline in <body> because a statically
 * exported page cannot decide this on a server.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=s?s==='dark':d;document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s | ${siteName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: siteName,
  authors: [{ name: site.author.name, url: `${siteUrl}/about` }],
  creator: site.author.name,
  publisher: site.author.name,
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: siteUrl,
    siteName: siteName,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    // Omitted entirely when no X handle is configured (see lib/site.ts).
    ...(twitterCreator ? { creator: twitterCreator } : {}),
    images: ["/og-default.png"],
  },
  /**
   * Only the production build may be indexed. dev and UAT live on their own
   * *.web.app origins and carry identical content, so indexing them would
   * split ranking signals and create duplicate-content competition with
   * production. `indexable` comes from lib/site.ts (build-time stage).
   */
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
  icons: {
    // `/favicon.ico` cannot be scaffolded (binary), so firebase.json redirects
    // that request to the SVG icon. Replace with a real .ico later if wanted.
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col bg-bg font-sans text-fg antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/*
          Non-production builds are served from their own *.web.app origin and
          look identical to the live site. This bar makes the stage obvious so
          nobody mistakes UAT for production while reviewing. It is compiled
          out of the prod bundle because `isProduction` is a build-time value.
        */}
        {!isProduction && (
          <div
            role="status"
            className="bg-accent px-4 py-1 text-center text-xs font-semibold tracking-wide text-accent-fg"
          >
            {stageLabel} environment — content and links here are not live
          </div>
        )}

        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdToString(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdToString(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
