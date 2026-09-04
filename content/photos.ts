import type { Lang } from "@/config/routes";

/**
 * Real photographs of the fleet, shot by the company.
 *
 * Every one of these is here because it PROVES a claim the copy makes
 * elsewhere — that is the whole test for whether a photo earns its bytes.
 * Stock photography of shiny cars would actively hurt a scrap business;
 * a picture of our own driver strapping a wreck down does the opposite.
 *
 * Fifteen were supplied and six are used. The rest are duplicates of the
 * same angle or the same truck on the same kind of day, and a gallery that
 * repeats itself reads as padding rather than evidence.
 *
 * Speed: these are never in the hero and never on a /lp/ page. They sit
 * below the fold, lazy-loaded, in fixed aspect-ratio boxes so they cannot
 * move the layout, at quality 55 — which on a 400px-wide phone slot is
 * roughly 10 KB each.
 */
export type Photo = {
  file: string;
  /** Describes the scene, in the page's own language. */
  alt: Record<Lang, string>;
  /** The claim this photo backs up. */
  caption: Record<Lang, string>;
};

export const PHOTOS: Photo[] = [
  {
    file: "attache-vehicule-plateau.jpg",
    alt: {
      fr: "Un employé d'Autos B2 sangle une fourgonnette accidentée sur le plateau",
      en: "An Autos B2 employee strapping a wrecked van down on the flatbed",
    },
    caption: {
      fr: "On attache et on sécurise le véhicule nous-mêmes avant de partir.",
      en: "We strap and secure the vehicle ourselves before leaving.",
    },
  },
  {
    file: "transport-multi-vehicules.jpg",
    alt: {
      fr: "Remorque d'Autos B2 transportant cinq véhicules en fin de vie sur la Rive-Nord",
      en: "An Autos B2 trailer hauling five end-of-life vehicles on the North Shore",
    },
    caption: {
      fr: "Environ 2 000 véhicules ramassés par année.",
      en: "Around 2,000 vehicles collected per year.",
    },
  },
  {
    file: "enlevement-soir-residentiel.jpg",
    alt: {
      fr: "Enlèvement d'une auto en soirée devant une résidence de la Rive-Nord",
      en: "An evening car pickup outside a home on the North Shore",
    },
    caption: {
      fr: "On ramasse jusqu'à 20 h 30, 7 jours sur 7.",
      en: "We collect until 8:30pm, 7 days a week.",
    },
  },
  {
    file: "plateau-vus-charge.jpg",
    alt: {
      fr: "Plateau d'Autos B2 chargé d'un VUS, prêt à repartir vers la cour de Mascouche",
      en: "An Autos B2 flatbed loaded with an SUV, ready to head back to the Mascouche yard",
    },
    caption: {
      fr: "Notre propre plateau — pas un sous-traitant.",
      en: "Our own flatbed — not a subcontractor.",
    },
  },
  {
    file: "remorquage-chariot-elevateur.jpg",
    alt: {
      fr: "Chariot élévateur chargé sur le plateau d'Autos B2",
      en: "A forklift loaded on the Autos B2 flatbed",
    },
    caption: {
      fr: "Auto, camion, VUS — ou tout autre engin.",
      en: "Car, truck, SUV — or anything else on wheels.",
    },
  },
  {
    file: "remorquage-soir-berline.jpg",
    alt: {
      fr: "Remorquage d'une berline au crépuscule par Autos B2",
      en: "Autos B2 towing a sedan at dusk",
    },
    caption: {
      fr: "Enlèvement souvent le jour même.",
      en: "Pickup is often the same day.",
    },
  },
];

/** The three on the homepage: a person, the scale, and the evening hours. */
export const HOME_PHOTOS = [PHOTOS[0], PHOTOS[1], PHOTOS[2]];
