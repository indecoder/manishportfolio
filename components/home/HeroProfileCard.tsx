import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Floating profile card for the hero's right column.
 *
 * A rounded white card holding the avatar placeholder, the author's name and
 * location, plus two chips that overlap the card edges so the composition
 * reads as layered rather than a flat box.
 *
 * Purely static markup: the depth in this section comes from the scrubbed orb
 * field behind it (AmbientOrbs), so nothing here needs JS, pointer listeners
 * or reduced-motion handling.
 */
export function HeroProfileCard() {
  return (
    <figure className="relative mx-auto w-full max-w-sm">
      <div className="glass relative overflow-hidden rounded-3xl p-3">
        <Image
          src={site.author.avatar}
          alt={site.author.avatarAlt}
          width={512}
          height={512}
          priority
          className="h-auto w-full rounded-2xl"
        />

        <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {site.author.name}
            </p>
            <p className="text-xs text-gray-600">{site.author.location}</p>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
            9+ yrs
          </span>
        </figcaption>
      </div>

      {/* Floating chips - glass, sans (not mono), and inset from the edges so
          nothing is clipped. aria-hidden because both repeat facts already
          stated in the left column. */}
      <span
        aria-hidden
        className="glass absolute left-4 top-10 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700"
      >
        React · TypeScript
      </span>
      <span
        aria-hidden
        className="glass absolute bottom-20 right-4 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700"
      >
        MCP · AI automation
      </span>
    </figure>
  );
}
