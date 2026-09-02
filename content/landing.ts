import type { Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";

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
  sub: string;
  badge: string;
  bullets: string[];
  reassurance: string;
};

export const LANDING_CONTENT: LandingContent[] = [
  {
    slug: "vendre-mon-auto",
    lang: "fr",
    title: "Vendre mon auto comptant | B2 Autos",
    h1: "Vendez votre auto aujourd'hui — argent comptant, sur place",
    sub: "Peu importe l'état : en panne, accidentée, sans moteur ou déclarée perte totale. On vient la chercher gratuitement et on vous paie à l'enlèvement.",
    badge: `De ${siteConfig.facts.cashMin} $ à ${siteConfig.facts.cashMax.toLocaleString("fr-CA")} $ comptant selon le véhicule`,
    bullets: [
      "Remorquage gratuit inclus, jamais déduit",
      "Argent comptant à l'enlèvement",
      "Transfert SAAQ réglé sur place",
      "Ouvert 7 jours, 8 h à 20 h 30",
      "Prix ferme confirmé au téléphone",
    ],
    reassurance:
      "On est le recycleur, pas un intermédiaire. Notre cour est au 340 Chemin Pincourt à Mascouche.",
  },
  {
    slug: "remorquage-gratuit",
    lang: "fr",
    title: "Remorquage gratuit de votre véhicule | B2 Autos",
    h1: "Faites enlever votre véhicule gratuitement — et repartez avec de l'argent",
    sub: "On remorque sans frais partout sur la Rive-Nord, à Laval et dans l'est de Montréal, souvent le jour même. Et on vous paie comptant pour le véhicule.",
    badge: "Remorquage 100 % gratuit — jamais déduit de votre montant",
    bullets: [
      "Enlèvement souvent le jour même",
      "Plateau : on sort un véhicule sans roues ou aux freins bloqués",
      "Aucuns frais de déplacement, jamais",
      "On récupère la plaque et on remplit la cession",
      "Ouvert 7 jours, 8 h à 20 h 30",
    ],
    reassurance:
      "Entrée en pente, cour arrière, terrain non asphalté : dites-nous la situation et on arrive équipés.",
  },
  {
    slug: "offre-facebook",
    lang: "fr",
    title: "Votre vieux char vaut de l'argent | B2 Autos",
    h1: "Votre vieux char dort dans l'entrée ? Il vaut de l'argent.",
    sub: "Donnez-nous l'année, la marque et le modèle. On vous rappelle avec un prix ferme en quelques minutes — et si ça vous convient, on vient le chercher gratuitement.",
    badge: `De ${siteConfig.facts.cashMin} $ à ${siteConfig.facts.cashMax.toLocaleString("fr-CA")} $ comptant selon le véhicule`,
    bullets: [
      "Estimation en 2 minutes, sans obligation",
      "Remorquage gratuit inclus",
      "Payé comptant à l'enlèvement",
      "On s'occupe de toute la paperasse SAAQ",
      "Envoyez-nous une photo par WhatsApp si c'est plus simple",
    ],
    reassurance:
      "Recycleur licencié établi à Mascouche depuis 10 ans. Environ 2 000 véhicules achetés par année.",
  },
  {
    slug: "cash-for-junk-cars",
    lang: "en",
    title: "Cash for Junk Cars | B2 Autos",
    h1: "Sell your junk car today — cash, paid on the spot",
    sub: "Any condition: not running, wrecked, no engine, or written off. We pick it up free and pay you at pickup.",
    badge: `$${siteConfig.facts.cashMin} to $${siteConfig.facts.cashMax.toLocaleString("en-CA")} cash depending on the vehicle`,
    bullets: [
      "Free towing included, never deducted",
      "Cash in hand at pickup",
      "SAAQ transfer handled on site",
      "Open 7 days, 8am to 8:30pm",
      "Firm price confirmed on the phone",
    ],
    reassurance:
      "We're the recycler, not a middleman. Our yard is at 340 Chemin Pincourt in Mascouche.",
  },
];

export function landingBySlug(lang: Lang, slug: string) {
  return LANDING_CONTENT.find((lp) => lp.lang === lang && lp.slug === slug);
}
