import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ParallaxBackdrop } from "@/components/ui/ParallaxBackdrop";
import { ParallaxShift } from "@/components/ui/ParallaxShift";

/**
 * Rendered to out/404.html by the static export. Firebase Hosting serves this
 * file automatically for any unmatched path, so no `errorPages` config is
 * needed in firebase.json.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <ParallaxBackdrop side="center" speed={0.12} size={24} />

      <Container wide className="relative flex flex-col items-center gap-5 py-28 text-center sm:py-36">
        {/* The numeral is aria-hidden decoration, so it can drift freely. */}
        <ParallaxShift speed={0.08} maxShift={44}>
          <p
            aria-hidden
            className="text-gradient text-7xl font-bold tracking-tight sm:text-8xl"
          >
            404
          </p>
        </ParallaxShift>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Error 404
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-fg">
          The page you were looking for has moved, been renamed, or never
          existed. Try the blog index or head back home.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/blog" variant="secondary">
            Browse the blog
          </Button>
          {/* Plain anchor: sitemap.xml is a static file, not a route. */}
          <a
            href="/sitemap.xml"
            className="inline-flex items-center px-1 py-2 font-mono text-xs text-muted-fg transition-colors hover:text-accent"
          >
            View sitemap →
          </a>
        </div>
      </Container>
    </section>
  );
}
