import type { Slide } from "@/components/site/HeroSlideshow";
import type { Lang } from "@/config/routes";
import { getCopy } from "@/content/copy";
import { HOME_PHOTOS, PHOTOS } from "@/content/photos";

/**
 * The hero slideshow's pictures, the same on the homepage and every landing
 * page so the two can never drift apart: the tow truck, every kind of
 * vehicle we take, a flatbed with a wrecked car, then the three company
 * photographs the fleet section further down does not already show.
 */
export function heroSlides(lang: Lang): Slide[] {
  const t = getCopy(lang);
  return [
    { src: "/tow-truck-hero.webp", alt: "" },
    {
      src: "/photos/all-vehicles.webp",
      alt: t.home.slideshow.vehiclesAlt,
      caption: t.home.slideshow.vehiclesCaption,
    },
    { src: "/photos/flatbed-damaged-car.webp", alt: t.home.slideshow.towAlt, fit: "cover" },
    ...PHOTOS.filter((photo) => !HOME_PHOTOS.includes(photo)).map((photo) => ({
      src: `/photos/${photo.file}`,
      alt: photo.alt[lang],
      caption: photo.caption[lang],
      fit: "cover" as const,
    })),
  ];
}
