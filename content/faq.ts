import type { Lang } from "@/config/routes";

/**
 * The FAQ. One source for three consumers: the full /faq/ page, the five-item
 * block on the homepage, and the FAQPage JSON-LD on both. Because the schema
 * is generated from the same array the visitor reads, the markup can never
 * drift from the page — which is what Google's structured-data guidelines
 * actually require.
 */
export type FaqItem = {
  id: string;
  q: string;
  a: string;
  /** Shown in the homepage block. Google wants the schema to match what's visible. */
  onHome?: boolean;
};

const FR: FaqItem[] = [
  {
    id: "valeur",
    onHome: true,
    q: "Combien vaut mon auto scrap ?",
    a: "Ça dépend du poids du véhicule, de l'année, du modèle, de la présence du convertisseur catalytique et de l'état des pièces réutilisables. Nos offres se situent généralement entre 300 $ et 3 000 $. Appelez-nous avec l'année, la marque et le modèle et on vous donne un prix ferme en quelques minutes.",
  },
  {
    id: "remorquage",
    onHome: true,
    q: "Est-ce que le remorquage est vraiment gratuit ?",
    a: "Oui. Le remorquage est inclus et n'est jamais déduit de votre montant, partout dans notre zone de service.",
  },
  {
    id: "ne-demarre-pas",
    onHome: true,
    q: "Vous achetez une auto qui ne démarre pas ?",
    a: "Oui. En panne, sans moteur, accidentée ou déclarée perte totale — on l'achète quand même.",
  },
  {
    id: "cour-pres-de-moi",
    q: "Où trouver une cour à scrap près de chez moi ?",
    a: "Notre cour est au 340 Chemin Pincourt à Mascouche, et comme acheteur auto scrap on se déplace gratuitement à Laval, à Montréal, à Terrebonne et partout sur la Rive-Nord. Vous n'avez pas besoin de trouver une cour près de chez vous : on vient à vous.",
  },
  {
    id: "qui-achete",
    onHome: true,
    q: "Qui achète une auto scrap à Laval et à Montréal ?",
    a: "Nous. Autos B2 est un acheteur d'auto scrap établi au 340 Chemin Pincourt à Mascouche, et on se déplace à Laval, à Montréal et partout sur la Rive-Nord. On achète directement — on n'est pas un intermédiaire qui revend votre appel à un autre ferrailleur.",
  },
  {
    id: "vendre-char-scrap",
    q: "Comment vendre mon char scrap rapidement ?",
    a: "Appelez-nous avec l'année, la marque et le modèle, ou remplissez le formulaire. On vous donne un prix ferme en quelques minutes, on planifie l'enlèvement gratuit et vous recevez votre cash pour auto à l'enlèvement. La plupart des ventes se règlent en moins de 24 heures.",
  },
  {
    id: "minoune",
    q: "Vous achetez les minounes et les vieilles autos non roulantes ?",
    a: "Oui. Une minoune qui dort dans l'entrée depuis des années a encore de la valeur : le métal, le convertisseur catalytique et les pièces réutilisables. Se débarrasser de son auto ne devrait rien vous coûter, et chez nous ça vous rapporte.",
  },
  {
    id: "recyclage",
    q: "Que veut dire recycler une voiture au Québec ?",
    a: "Le recyclage automobile commence par la dépollution : on retire l'huile, l'antigel, l'essence, la batterie et le liquide de climatisation avant tout démontage. Les pièces encore bonnes sont récupérées, et la ferraille automobile qui reste part au broyage pour être refondue.",
  },
  {
    id: "auto-accidentee",
    q: "Comment vendre une auto accidentée ou déclarée perte totale ?",
    a: "De la même façon qu'une autre : on l'achète comptant et on la remorque gratuitement. Un véhicule accidenté garde de la valeur — les pièces intactes, le catalyseur et le métal ne disparaissent pas parce que l'avant est enfoncé. Dites-nous où est l'impact et si le véhicule est complet.",
  },
  {
    id: "documents",
    q: "Quels documents ça me prend ?",
    a: "Le certificat d'immatriculation du véhicule et une pièce d'identité valide. Si vous avez perdu vos papiers, appelez-nous, on vous explique la marche à suivre.",
  },
  {
    id: "saaq",
    onHome: true,
    q: "Est-ce que je dois annuler mon immatriculation à la SAAQ ?",
    a: "On récupère la plaque et on vous remet le document officiel de cession. Avec ce reçu, vous cessez de payer pour le véhicule. On vous explique tout sur place.",
  },
  {
    id: "paiement",
    q: "Comment je suis payé ?",
    a: "En argent comptant, directement à vous, au moment de l'enlèvement. Jamais après.",
  },
  {
    id: "delai",
    q: "Ça prend combien de temps ?",
    a: "Souvent le jour même ou le lendemain, selon votre ville et notre horaire de remorquage.",
  },
  {
    id: "prix-change",
    onHome: true,
    q: "Est-ce que le prix change quand la remorqueuse arrive ?",
    a: "Non. Si les informations fournies sont exactes, le prix confirmé au téléphone est celui que vous recevez.",
  },
  {
    id: "camions",
    q: "Vous achetez les camions et les VUS ?",
    a: "Oui, incluant fourgonnettes et véhicules commerciaux légers.",
  },
  {
    id: "heures",
    q: "Quelles sont vos heures ?",
    a: "On est ouvert 7 jours sur 7, de 8 h à 20 h.",
  },
  {
    id: "adresse",
    q: "Où êtes-vous situés ?",
    a: "Notre cour est au 340 Chemin Pincourt, Mascouche, QC J7L 2W3. On se déplace partout sur la Rive-Nord, à Laval et dans l'est de Montréal.",
  },
];

const EN: FaqItem[] = [
  {
    id: "valeur",
    onHome: true,
    q: "What is my scrap car worth?",
    a: "It depends on the vehicle's weight, year and model, whether the catalytic converter is still on it, and the condition of any reusable parts. Our offers generally land between $300 and $3,000. Call us with the year, make and model and we'll give you a firm price in minutes.",
  },
  {
    id: "remorquage",
    onHome: true,
    q: "Is the towing really free?",
    a: "Yes. Towing is included and is never deducted from your amount, anywhere in our service area.",
  },
  {
    id: "ne-demarre-pas",
    onHome: true,
    q: "Do you buy a car that won't start?",
    a: "Yes. Broken down, no engine, wrecked or written off — we buy it anyway.",
  },
  {
    id: "cour-pres-de-moi",
    q: "Is there a scrap yard near me?",
    a: "Our yard is at 340 Chemin Pincourt in Mascouche, and as a scrap car buyer we drive to you for free across Laval, Montreal, Terrebonne and the whole North Shore. You do not need a scrap yard near you — we come to you.",
  },
  {
    id: "qui-achete",
    onHome: true,
    q: "Who buys junk cars in Laval and Montreal?",
    a: "We do. Autos B2 is a junk car buyer based at 340 Chemin Pincourt in Mascouche, and we travel to Laval, Montreal and across the North Shore. We buy directly — we are not a middleman reselling your call to another scrap yard.",
  },
  {
    id: "vendre-char-scrap",
    q: "How do I sell junk car fast — what is the process?",
    a: "Call us with the year, make and model, or fill in the form. You get a firm price in minutes, we schedule the free scrap car removal, and you are paid cash on pickup. Most sales are done inside 24 hours.",
  },
  {
    id: "minoune",
    q: "Will you buy a non running car?",
    a: "Yes. A car that has sat in a driveway for years still has value: the metal, the catalytic converter and any reusable parts. Getting rid of it should not cost you anything, and with us it pays.",
  },
  {
    id: "recyclage",
    q: "What does automotive recycling actually involve?",
    a: "Recycling a car starts with depollution: the oil, coolant, fuel, battery and air-conditioning refrigerant come out before anything is dismantled. Parts worth keeping are pulled and resold, and the shell is shredded so the steel can be melted down.",
  },
  {
    id: "auto-accidentee",
    q: "Can I sell my damaged or totaled car?",
    a: "Yes, the same way as any other — we buy it for cash and tow it free. A wrecked vehicle keeps its value: the undamaged parts, the converter and the metal do not disappear because the front end is caved in. Tell us where the impact is and whether the car is complete.",
  },
  {
    id: "documents",
    q: "What documents do I need?",
    a: "The vehicle's registration certificate and valid photo ID. If you've lost your paperwork, call us and we'll explain what to do.",
  },
  {
    id: "saaq",
    onHome: true,
    q: "Do I have to cancel my registration with the SAAQ?",
    a: "We take the plate and hand you the official release document. With that receipt, you stop paying for the vehicle. We walk you through it on site.",
  },
  {
    id: "paiement",
    q: "How do I get paid?",
    a: "In cash, directly to you, at the moment of pickup. Never afterwards.",
  },
  {
    id: "delai",
    q: "How long does it take?",
    a: "Often the same day or the next, depending on your city and our towing schedule.",
  },
  {
    id: "prix-change",
    onHome: true,
    q: "Does the price change when the tow truck arrives?",
    a: "No. If the information you gave us is accurate, the price confirmed on the phone is the price you get.",
  },
  {
    id: "camions",
    q: "Do you buy trucks and SUVs?",
    a: "Yes, including vans and light commercial vehicles.",
  },
  {
    id: "heures",
    q: "What are your hours?",
    a: "We're open 7 days a week, from 8:00am to 8:00pm.",
  },
  {
    id: "adresse",
    q: "Where are you located?",
    a: "Our yard is at 340 Chemin Pincourt, Mascouche, QC J7L 2W3. We travel across the North Shore, Laval and the east end of Montreal.",
  },
];

const BY_LANG: Record<Lang, FaqItem[]> = { fr: FR, en: EN };

export function faqFor(lang: Lang): FaqItem[] {
  return BY_LANG[lang];
}

/** The five shown on the homepage — schema there covers exactly these. */
export function homeFaqFor(lang: Lang): FaqItem[] {
  return BY_LANG[lang].filter((item) => item.onHome);
}
