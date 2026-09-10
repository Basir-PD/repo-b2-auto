import type { Lang } from "@/config/routes";
import { siteConfig, hoursRange } from "@/config/site";

/**
 * Paid-traffic landing pages.
 *
 * Each one matches an ad group's promise word-for-word — a visitor who
 * clicked "remorquage gratuit" must land on a page whose headline says
 * remorquage gratuit, or the click is wasted and Quality Score suffers.
 *
 * These pages are noindex: they duplicate the organic pages' intent and
 * would compete with them, and they carry no navigation to compete with
 * the single call to action.
 */
export type LandingContent = {
  slug: string;
  lang: Lang;
  title: string;
  h1: string;
  /**
   * Not rendered. This is the meta description and the og:description — the
   * text that shows when the URL is pasted into Messenger or a text message,
   * which is how a Facebook ad's landing page actually gets shared onward.
   * The visible subtitle is `beats`.
   */
  sub: string;
  /**
   * Three beats, not a sentence. Rendered as a dotted row directly under the
   * H1, the same device the homepage hero uses, because a paid visitor scans
   * before they read. Identical across every page in a language on purpose:
   * these three are true of every job we do, and the per-page promise is
   * carried by the H1 and the bullets, which is where message match belongs.
   */
  beats: string[];
  bullets: string[];
  reassurance: string;
};

export const LANDING_CONTENT: LandingContent[] = [
  {
    slug: "vendre-mon-auto",
    lang: "fr",
    title: "Vendre mon auto comptant | Autos B2",
    h1: "Vendez votre auto aujourd'hui — argent comptant, sur place",
    sub: "Peu importe l'état : en panne, accidentée, sans moteur ou déclarée perte totale. On vient la chercher gratuitement et on vous paie à l'enlèvement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Remorquage gratuit inclus, jamais déduit",
      "Argent comptant à l'enlèvement",
      "Transfert SAAQ réglé sur place",
      "En panne, accidentée ou perte totale : on achète pareil",
      "Prix ferme confirmé au téléphone",
    ],
    reassurance:
      "On est le recycleur, pas un intermédiaire. Notre cour est au 340 Chemin Pincourt à Mascouche.",
  },
  {
    slug: "remorquage-gratuit",
    lang: "fr",
    title: "Remorquage gratuit de votre véhicule | Autos B2",
    h1: "Faites enlever votre véhicule gratuitement — et repartez avec de l'argent",
    sub: "On remorque sans frais partout sur la Rive-Nord, à Laval et dans l'est de Montréal, souvent le jour même. Et on vous paie comptant pour le véhicule.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Enlèvement souvent le jour même",
      "Plateau : on sort un véhicule sans roues ou aux freins bloqués",
      "Aucuns frais de déplacement, jamais",
      "On récupère la plaque et on remplit la cession",
      "Soir et fin de semaine comme en semaine",
    ],
    reassurance:
      "Entrée en pente, cour arrière, terrain non asphalté : dites-nous la situation et on arrive équipés.",
  },
  {
    slug: "offre-facebook",
    lang: "fr",
    title: "Votre vieux char vaut de l'argent | Autos B2",
    h1: "Votre vieux char dort dans l'entrée ? Il vaut de l'argent.",
    sub: "Donnez-nous l'année, la marque et le modèle. On vous rappelle avec un prix ferme en quelques minutes — et si ça vous convient, on vient le chercher gratuitement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Estimation en 2 minutes, sans obligation",
      "Remorquage gratuit inclus",
      "Payé comptant à l'enlèvement",
      "On s'occupe de toute la paperasse SAAQ",
      "Envoyez-nous une photo par WhatsApp si c'est plus simple",
    ],
    /*
      This used to restate the ten years and the two thousand vehicles. The
      stat band below now says both as numerals, so repeating them here was
      the same fact twice in one screen.
    */
    reassurance: "Pas d'intermédiaire : on achète, on remorque et on paie nous-mêmes.",
  },
  {
    slug: "cash-for-junk-cars",
    lang: "en",
    title: "Cash for Junk Cars | Autos B2",
    h1: "Sell your junk car today — cash, paid on the spot",
    sub: "Any condition: not running, wrecked, no engine, or written off. We pick it up free and pay you at pickup.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "Free towing included, never deducted",
      "Cash in hand at pickup",
      "SAAQ transfer handled on site",
      "Not running, wrecked or written off — we buy it anyway",
      "Firm price confirmed on the phone",
    ],
    reassurance:
      "We're the recycler, not a middleman. Our yard is at 340 Chemin Pincourt in Mascouche.",
  },
];

/**
 * The three numbers under the hero, derived from `siteConfig.facts` so they
 * can never drift from the homepage's version of the same claims.
 *
 * These are the real figures: two thousand vehicles a year, ten years at
 * Mascouche. An earlier build of this site advertised "10 000+ vehicles",
 * "350+ reviews" and "25+ years"; all three were removed because nobody
 * could source them, and they are not coming back. A number a competitor
 * can disprove in one phone call is worth less than no number at all — and
 * this is the page where a stranger decides whether to hand over a car.
 *
 * The price range is deliberately not one of these. It was removed from the
 * hero on request, and reintroducing it as a stat would be the same claim
 * wearing a different hat.
 */
export function landingStats(lang: Lang) {
  const { vehiclesPerYear, yearsInBusiness } = siteConfig.facts;

  return lang === "fr"
    ? [
        {
          figure: vehiclesPerYear.toLocaleString("fr-CA"),
          label: "véhicules achetés par année",
        },
        { figure: `${yearsInBusiness} ans`, label: "de recyclage à Mascouche" },
        { figure: "7 j/7", label: hoursRange("fr").replace("de ", "") },
      ]
    : [
        {
          figure: vehiclesPerYear.toLocaleString("en-CA"),
          label: "vehicles bought per year",
        },
        { figure: `${yearsInBusiness} years`, label: "recycling in Mascouche" },
        { figure: "7 days", label: hoursRange("en") },
      ];
}

export function landingBySlug(lang: Lang, slug: string) {
  return LANDING_CONTENT.find((lp) => lp.lang === lang && lp.slug === slug);
}
