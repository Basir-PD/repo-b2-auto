import HeroSlideshow from "@/components/site/HeroSlideshow";
import type { Lang } from "@/config/routes";
import { getCopy } from "@/content/copy";
import { heroSlides } from "@/content/heroSlides";

/** The `lg` breakpoint, in px: where the hero goes from one column to two. */
const WIDE = 1024;

/**
 * The hero slideshow where it belongs at each width, so every page places it
 * the same way:
 *
 * - `phone`: in the hero, right above the call button, below `lg` only.
 * - `wide`: full width under the hero, from `lg` up, where the big tow
 *   truck used to be. Wider in shape (12:5) so it is not too tall across a
 *   laptop screen, and it loads nothing below `lg`.
 * - `always`: one slideshow at every width, for a single-column header.
 */
export default function PlacedSlideshow({
  lang,
  place,
  className = "",
}: {
  lang: Lang;
  place: "phone" | "wide" | "always";
  className?: string;
}) {
  const t = getCopy(lang);
  const shared = {
    label: t.home.slideshow.label,
    slideLabel: t.home.slideshow.slide,
    slides: heroSlides(lang),
  };

  if (place === "wide") {
    return (
      <div className={`hidden lg:block ${className}`}>
        <HeroSlideshow
          {...shared}
          aspect="aspect-[12/5]"
          onlyFrom={WIDE}
          sizes="(min-width: 1088px) 1024px, 100vw"
          className="mx-auto w-full max-w-5xl"
        />
      </div>
    );
  }

  return (
    <HeroSlideshow
      {...shared}
      // The phone copy is hidden from `lg` up; telling the browser it is tiny there
      // means a wide screen fetches a thumbnail for it, not a full-width photo.
      sizes={
        place === "phone"
          ? `(min-width: ${WIDE}px) 16px, calc(100vw - 2rem)`
          : "(min-width: 896px) 832px, calc(100vw - 2rem)"
      }
      className={`${place === "phone" ? "w-full max-w-md lg:hidden" : "w-full"} ${className}`}
    />
  );
}
