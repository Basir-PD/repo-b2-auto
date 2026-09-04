import Image from "next/image";
import type { Lang } from "@/config/routes";
import type { Photo } from "@/content/photos";

/**
 * A grid of real photographs.
 *
 * Server component — no JavaScript ships for it. Every image is lazy (no
 * `priority`), sits in a fixed aspect-ratio box so it cannot shift the page
 * while it loads, and is sized so a phone fetches a phone-sized file rather
 * than a desktop one.
 */
export default function PhotoGrid({
  lang,
  photos,
  /** Widest column count. Drives `sizes`, so it has to match the grid. */
  columns = 3,
}: {
  lang: Lang;
  photos: Photo[];
  columns?: 2 | 3;
}) {
  const sizes =
    columns === 3
      ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      : "(min-width: 640px) 50vw, 100vw";

  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""} sm:gap-5`}
    >
      {photos.map((photo) => (
        <li key={photo.file}>
          <figure className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/10">
            <div className="relative aspect-[4/3]">
              <Image
                src={`/photos/${photo.file}`}
                alt={photo.alt[lang]}
                fill
                sizes={sizes}
                quality={55}
                className="object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm font-semibold leading-snug text-slate-700">
              {photo.caption[lang]}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
