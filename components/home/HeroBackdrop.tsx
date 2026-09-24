import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { PointerGlow } from "@/components/ui/PointerGlow";

/**
 * Hero depth layers: three glowing orbs on counter-scroll at DIFFERENT speeds
 * (near/mid/far separation), over a static accent wash and dot grid, plus a
 * halo that trails the pointer. Wrapped in one aria-hidden container and
 * pointer-events-none; every listener no-ops under prefers-reduced-motion.
 *
 * This lives behind bolt-static hero CONTENT on purpose - parallax reads as
 * depth only when something stays still to compare against.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-mesh absolute inset-0" />
      <div className="dot-grid absolute inset-0" />

      <ParallaxLayer speed={0.08} maxShift={70} className="absolute inset-0">
        <div className="glow-orb orb-drift-a absolute -left-24 -top-24 h-72 w-72" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.18} maxShift={120} className="absolute inset-0">
        <div className="glow-orb orb-drift-b absolute -right-28 top-10 h-80 w-80" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.32} maxShift={200} className="absolute inset-0">
        <div className="glow-orb orb-drift-a absolute bottom-[-7rem] left-[38%] h-64 w-64" />
      </ParallaxLayer>

      <PointerGlow />
    </div>
  );
}