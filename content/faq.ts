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
    a: "On est ouvert 7 jours sur 7, de 8 h à 20 h 30.",
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
    a: "We're open 7 days a week, from 8:00am to 8:30pm.",
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
