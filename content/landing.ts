import type { Lang } from "@/config/routes";

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
  /**
   * Five, because on a phone they sit between the buttons and the form and
   * every extra line pushes the form down.
   *
   * Every page carries the same three money facts — free towing that is
   * never deducted, a firm price that does not drop when the truck arrives,
   * cash at pickup — because those are the three things a scrap seller fears
   * being cheated on, whatever they typed. The other two are the page's own.
   *
   * No "best price in town". It is a claim nobody can check, the Consumer
   * Protection Act treats an unfounded one as misleading, and a price that
   * does not change at the door is the promise these sellers actually want.
   */
  bullets: string[];
  reassurance: string;
  /**
   * Ids from content/faq.ts, in display order. Chosen per page for the
   * questions this searcher has left once they have scrolled past the form,
   * not the homepage five: the damaged-car visitor is asking about the
   * insurer's write-off, not about what a scrap car is worth.
   */
  faq: readonly string[];
};

export const LANDING_CONTENT: LandingContent[] = [
  {
    slug: "vendre-mon-auto",
    lang: "fr",
    title: "Vendre mon auto comptant | Recyclage Autos B2",
    h1: "Vendez votre auto aujourd'hui — argent comptant, sur place",
    sub: "Peu importe l'état : en panne, accidentée, sans moteur ou déclarée perte totale. On vient la chercher gratuitement et on vous paie à l'enlèvement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Remorquage gratuit, jamais déduit de votre montant",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Argent comptant à l'enlèvement",
      "En panne, accidentée ou perte totale : on achète pareil",
      "Transfert SAAQ réglé sur place",
    ],
    reassurance:
      "On est le recycleur, pas un intermédiaire. Notre cour est au 340 Chemin Pincourt à Mascouche.",
    faq: ["valeur", "prix-change", "documents", "saaq", "paiement"],
  },
  {
    slug: "remorquage-gratuit",
    lang: "fr",
    title: "Remorquage gratuit de votre véhicule | Recyclage Autos B2",
    h1: "Faites enlever votre véhicule gratuitement — et repartez avec de l'argent",
    sub: "On remorque sans frais partout sur la Rive-Nord, à Laval et dans l'est de Montréal, souvent le jour même. Et on vous paie comptant pour le véhicule.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Remorquage gratuit, jamais déduit de votre montant",
      "Enlèvement souvent le jour même",
      "Plateau : on sort un véhicule sans roues ou aux freins bloqués",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Payé comptant à l'enlèvement",
    ],
    reassurance:
      "Entrée en pente, cour arrière, terrain non asphalté : dites-nous la situation et on arrive équipés.",
    faq: ["remorquage", "delai", "ne-demarre-pas", "documents", "saaq"],
  },
  {
    slug: "offre-facebook",
    lang: "fr",
    title: "Votre vieux char vaut de l'argent | Recyclage Autos B2",
    h1: "Votre vieux char dort dans l'entrée ? Il vaut de l'argent.",
    sub: "Donnez-nous l'année, la marque et le modèle. On vous rappelle avec un prix ferme en quelques minutes — et si ça vous convient, on vient le chercher gratuitement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Estimation en 2 minutes, sans obligation",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Remorquage gratuit, jamais déduit de votre montant",
      "Payé comptant à l'enlèvement",
      "On s'occupe de toute la paperasse SAAQ",
    ],
    /*
      This used to restate the years in business and the vehicles-per-year
      figure. Both were removed from the whole site on 2026-09-19 as
      unverifiable — see the note on `facts` in config/site.ts — so there is
      nothing to restate. The stat band below now leads with the payout range.
    */
    reassurance: "Pas d'intermédiaire : on achète, on remorque et on paie nous-mêmes.",
    faq: ["valeur", "minoune", "prix-change", "documents", "paiement"],
  },
  /*
    The "recyclage auto {ville}" set. Built for Google Ads keyword-level
    final URLs, not for search: they are noindex, so they cannot compete with
    /fr/rachat-auto-laval/ or /fr/cour-a-scrap-terrebonne/, which already rank
    for those cities and would have been cannibalised by an indexed twin.
    That distinction is the whole reason these live under /lp/ — three
    indexed pages saying "recyclage auto Laval" next to an existing page
    saying "scrap auto Laval" is the textbook doorway set Google filters.

    Each carries its own distance, its own sectors and its own opening
    sentence, because a landing page that is the previous one with the city
    swapped converts like one too.
  */
  {
    slug: "recyclage-auto-laval",
    lang: "fr",
    title: "Recyclage auto Laval | Recyclage Autos B2",
    h1: "Recyclage auto à Laval — on rachète votre véhicule comptant",
    sub: "Recycleur licencié établi à Mascouche, à 24 km de Laval. On rachète votre auto en fin de vie, on la remorque gratuitement et on vous paie sur place.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "24 km de notre cour — environ 25 minutes de route",
      "Chomedey, Sainte-Rose, Vimont, Laval-des-Rapides, Duvernay",
      "Remorquage gratuit, jamais déduit de votre montant",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Payé comptant à l'enlèvement",
    ],
    reassurance:
      "On recycle nous-mêmes, au 340 Chemin Pincourt. Votre véhicule n'est pas revendu à un tiers.",
    faq: ["qui-achete", "recyclage", "valeur", "documents", "paiement"],
  },
  {
    slug: "recyclage-auto-terrebonne",
    lang: "fr",
    title: "Recyclage auto Terrebonne | Recyclage Autos B2",
    h1: "Recyclage auto à Terrebonne — la cour est à 9 km",
    sub: "Notre cour du 340 Chemin Pincourt est le recycleur le plus proche de Terrebonne : 9 km, environ 15 minutes. Enlèvement souvent le jour même.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "9 km de votre porte — le ramassage part de Mascouche",
      "Lachenaie, La Plaine, Vieux-Terrebonne, secteur des Seigneurs",
      "Remorquage gratuit, souvent le jour même de l'appel",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Argent comptant à l'enlèvement, pas de virement à attendre",
    ],
    reassurance:
      "Vous pouvez aussi passer à la cour. On est ouvert 7 jours et voisin de chez vous.",
    // `cour-pres-de-moi`, not `qui-achete`: that one names Laval and Montréal.
    faq: ["cour-pres-de-moi", "recyclage", "valeur", "documents", "paiement"],
  },
  {
    slug: "recyclage-auto-montreal",
    lang: "fr",
    title: "Recyclage auto Montréal | Recyclage Autos B2",
    h1: "Recyclage auto à Montréal — enlèvement gratuit, payé comptant",
    sub: "On se déplace sur l'île de Montréal pour racheter et recycler les véhicules en fin de vie. Le remorquage est gratuit et vous êtes payé au moment de l'enlèvement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Montréal-Nord, Anjou, Rivière-des-Prairies, Pointe-aux-Trembles — jusqu'au West Island",
      "Ruelle étroite ou stationnement intérieur : dites-le-nous d'avance",
      "Remorquage gratuit, jamais déduit de votre montant",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Payé comptant à l'enlèvement",
    ],
    reassurance:
      "Notre cour est au 340 Chemin Pincourt à Mascouche. On vient à vous, vous ne déplacez rien.",
    faq: ["qui-achete", "recyclage", "valeur", "documents", "paiement"],
  },
  /*
    The English "scrap yard / junkyard {city}" set.

    These two words carry a split intent that the French terms do not: about
    half the people typing "junkyard montreal" want a fender for a Civic, not
    a buyer for one. Google's own idea list for this set includes "scrap yard
    montreal car parts" and "junkyard montreal car parts", which is the same
    audience saying so out loud. At a CA$5.71 top-of-page bid, every one of
    those clicks is paid for and none of them convert.

    So the H1 says "we buy" before it says anything else, and the page never
    pretends to be a parts counter. What the page cannot do is stop the click
    being bought in the first place — that is a negative keyword list, not a
    landing page.
  */
  {
    slug: "scrap-yard-montreal",
    lang: "en",
    title: "Scrap Yard Montreal — We Buy Your Car | Recyclage Autos B2",
    h1: "The scrap yard that buys your car in Montreal",
    sub: "A licensed auto recycler covering the island of Montreal. We buy end-of-life, wrecked and non-running vehicles, tow them away free, and pay cash at pickup.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "We buy vehicles — you do not drive anything to a yard",
      "Montreal-Nord, Anjou, Rivière-des-Prairies, Pointe-aux-Trembles — out to the West Island",
      "Free towing, never deducted from your price",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup",
    ],
    reassurance:
      "Our yard is at 340 Chemin Pincourt in Mascouche. We come to you, and the tow costs you nothing.",
    faq: ["cour-pres-de-moi", "qui-achete", "valeur", "documents", "paiement"],
  },
  {
    slug: "scrap-yard-laval",
    lang: "en",
    title: "Scrap Yard Laval — We Buy Your Car | Recyclage Autos B2",
    h1: "A scrap yard 24 km from Laval that pays cash for your car",
    sub: "We are a licensed recycler in Mascouche, about 25 minutes from Laval. Give us the year, make and model and we come back with a firm price — then collect it free.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "We buy vehicles — you do not drive anything to a yard",
      "Chomedey, Sainte-Rose, Vimont, Laval-des-Rapides, Duvernay",
      "Free towing, never deducted from your price",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup, not a transfer to wait for",
    ],
    reassurance:
      "We recycle the vehicles ourselves at 340 Chemin Pincourt. We are the buyer, not a broker passing your call along.",
    faq: ["cour-pres-de-moi", "qui-achete", "valeur", "documents", "paiement"],
  },
  /*
    Damaged is not a synonym for junk, and pointing "cash for damaged cars"
    at the junk-car page would be treating it as one.

    The junk-car searcher has a vehicle that stopped being worth repairing
    some time ago and wants it gone. This one had a working car until
    recently, has probably just been told by an insurer that it is a write-
    off, and is deciding what to do about it — a different question, asked in
    a worse week. The page answers that question instead of selling scrap
    removal at them.
  */
  {
    slug: "cash-for-damaged-cars",
    lang: "en",
    title: "Cash for Damaged Cars | Recyclage Autos B2",
    h1: "Cash for a damaged car — wrecked, written off, or after a collision",
    sub: "If the insurer declared it a total loss, or the repair quote came back higher than the car is worth, we buy it as it stands. Free towing, cash at pickup.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "Total loss, write-off, or a repair bill that is not worth paying",
      "Front, rear or rollover damage — it does not need to drive",
      "Towed free from the body shop, the yard or your driveway",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup",
    ],
    reassurance:
      "The undamaged half of a wrecked car still has real value. That is what you are being paid for.",
    /*
      No `valeur`: its question is "what is my scrap car worth?", and calling
      a car that was on the road last week scrap is the mismatch this page
      exists to avoid.
    */
    faq: ["auto-accidentee", "prix-change", "remorquage", "documents", "saaq"],
  },
  {
    slug: "cash-for-junk-cars",
    lang: "en",
    title: "Cash for Junk Cars & Scrap Cars | Recyclage Autos B2",
    h1: "Cash for junk cars and scrap cars — paid on the spot",
    sub: "Junk car, scrap car, end-of-life vehicle — different words for the same thing, and we buy all of them. Any condition. Free pickup, cash at the door.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "Free towing, never deducted from your price",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup",
      "Not running, wrecked or written off — we buy it anyway",
      "SAAQ transfer handled on site",
    ],
    reassurance:
      "We're the recycler, not a middleman. Our yard is at 340 Chemin Pincourt in Mascouche.",
    faq: ["valeur", "ne-demarre-pas", "prix-change", "documents", "paiement"],
  },
  /*
    The generic scrapyard pages, one per language, for the searches that name
    no city: "scrapyard", "cour à scrap", "cour a scrap pres de moi".

    They inherit the problem the Montreal and Laval scrap-yard pages were
    written around, and answer it the same way. Someone typing "scrapyard" may
    be looking to buy a used alternator, or to drive a dead car somewhere and
    leave it. We do neither: we buy whole vehicles and we come to the car. So
    the H1 says we buy, and says it before anything else, rather than letting
    the visitor find out three scrolls down that the page is not a parts
    counter. Note what the page cannot do — stop that click being bought at
    all. That is a negative keyword list, not a landing page.

    The FR slug is "cour-scrap", not "cour-a-scrap": it is what gets typed.
  */
  {
    slug: "cour-scrap",
    lang: "fr",
    title: "Cour à scrap qui achète votre auto | Recyclage Autos B2",
    h1: "La cour à scrap qui vient chercher votre auto et vous paie comptant",
    sub: "Recycleur automobile licencié à Mascouche. On achète les véhicules en fin de vie, accidentés ou qui ne démarrent plus, on les remorque gratuitement et on paie à l'enlèvement.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "On achète le véhicule — vous n'avez rien à remorquer jusqu'à une cour",
      "Notre cour est au 340 Chemin Pincourt à Mascouche, ouverte 7 jours sur 7",
      "Remorquage gratuit, jamais déduit de votre montant",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Argent comptant à l'enlèvement",
    ],
    reassurance:
      "On est le recycleur, pas un intermédiaire qui revend votre appel. La cour est à Mascouche et on se déplace partout sur la Rive-Nord, à Laval et dans l'est de Montréal.",
    faq: ["cour-pres-de-moi", "adresse", "qui-achete", "valeur", "paiement"],
  },
  {
    slug: "scrapyard",
    lang: "en",
    title: "Scrapyard That Buys Your Car | Recyclage Autos B2",
    h1: "The scrapyard that comes to your car and pays cash",
    sub: "A licensed auto recycler in Mascouche. We buy end-of-life, wrecked and non-running vehicles, tow them away free, and pay cash at pickup — you tow nothing.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "We buy the vehicle — you do not drive or tow anything to a yard",
      "Our yard is at 340 Chemin Pincourt in Mascouche, open 7 days a week",
      "Free towing, never deducted from your price",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup",
    ],
    reassurance:
      "We are the recycler, not a broker passing your call along. The yard is in Mascouche and we cover the North Shore, Laval and east-end Montreal.",
    faq: ["cour-pres-de-moi", "adresse", "qui-achete", "valeur", "paiement"],
  },
  /*
    "Recycleur auto" without a city, the counterpart to the recyclage-auto-*
    set that only covers Laval, Terrebonne and Montreal.

    It is a different search from "cour à scrap", so it gets a different
    page rather than a synonym of one. Someone typing "cour à scrap" is
    picturing a place to get rid of a car. Someone typing "recycleur auto"
    has usually been told they need a *licensed* one — by an insurer, by the
    SAAQ, or by having read that you cannot simply abandon a vehicle. They
    are checking legitimacy, so the page leads with the credential and the
    paperwork: depollution before dismantling, and the official transfer
    receipt that actually ends their registration.

    That is also why the FAQ opens on what recycling involves rather than on
    what a car is worth.
  */
  {
    slug: "recycleur-auto",
    lang: "fr",
    title: "Recycleur automobile licencié | Recyclage Autos B2",
    h1: "Un recycleur automobile licencié qui rachète votre véhicule comptant",
    sub: "Dépollution complète, cession SAAQ réglée sur place et argent comptant à l'enlèvement. Notre cour est au 340 Chemin Pincourt à Mascouche et le remorquage est gratuit.",
    beats: ["Offre rapide", "Enlèvement facile", "Paiement immédiat"],
    bullets: [
      "Recycleur licencié : dépollution complète avant tout démontage",
      "Reçu officiel de cession SAAQ remis sur place — c'est lui qui met fin à votre immatriculation",
      "Remorquage gratuit, jamais déduit de votre montant",
      "Prix ferme au téléphone — il ne baisse pas à l'arrivée de la remorqueuse",
      "Argent comptant à l'enlèvement",
    ],
    reassurance:
      "On recycle nous-mêmes, au 340 Chemin Pincourt à Mascouche. Votre véhicule n'est pas revendu à un tiers.",
    faq: ["recyclage", "qui-achete", "documents", "saaq", "valeur"],
  },
  {
    slug: "auto-recycler",
    lang: "en",
    title: "Licensed Auto Recycler | Recyclage Autos B2",
    h1: "A licensed auto recycler that buys your vehicle for cash",
    sub: "Full depollution, the SAAQ transfer handled on the spot, and cash at pickup. Our yard is at 340 Chemin Pincourt in Mascouche and the towing is free.",
    beats: ["Quick offer", "Easy pickup", "Fast payment"],
    bullets: [
      "A licensed recycler: full depollution before anything is dismantled",
      "Official SAAQ transfer receipt on the spot — that is what ends your registration",
      "Free towing, never deducted from your price",
      "Firm price on the phone — it does not drop when the truck arrives",
      "Cash in hand at pickup",
    ],
    reassurance:
      "We recycle the vehicles ourselves at 340 Chemin Pincourt in Mascouche. Yours is not resold to a third party.",
    faq: ["recyclage", "qui-achete", "documents", "saaq", "valeur"],
  },
];

export function landingBySlug(lang: Lang, slug: string) {
  return LANDING_CONTENT.find((lp) => lp.lang === lang && lp.slug === slug);
}
