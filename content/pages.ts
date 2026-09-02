import type { Lang } from "@/config/routes";
import type { Section } from "@/content/services";
import { siteConfig, fullAddress } from "@/config/site";

export type StaticPage = {
  metaTitle: Record<Lang, string>;
  metaDescription: Record<Lang, string>;
  h1: Record<Lang, string>;
  lede: Record<Lang, string>;
  sections: Record<Lang, Section[]>;
};

export const ABOUT: StaticPage = {
  metaTitle: {
    fr: "À propos de B2 Autos | Recycleur automobile à Mascouche",
    en: "About B2 Autos | Auto recycler in Mascouche",
  },
  metaDescription: {
    fr: "B2 Autos est un recycleur automobile licencié établi au 340 Chemin Pincourt à Mascouche depuis 10 ans. Environ 2 000 véhicules achetés par année.",
    en: "B2 Autos is a licensed auto recycler at 340 Chemin Pincourt in Mascouche, in business for 10 years. Around 2,000 vehicles bought per year.",
  },
  h1: {
    fr: "Un recycleur automobile de Mascouche, pas un intermédiaire",
    en: "An auto recycler in Mascouche, not a middleman",
  },
  lede: {
    fr: `Notre cour est au ${fullAddress}. On y achète, remorque, dépollue et démantèle les véhicules nous-mêmes.`,
    en: `Our yard is at ${fullAddress}. We buy, tow, depollute and dismantle the vehicles ourselves.`,
  },
  sections: {
    fr: [
      {
        h2: "Ce qu'on fait",
        body: [
          `B2 Autos achète des véhicules en fin de vie sur la Rive-Nord, à Laval et dans l'est de Montréal depuis ${siteConfig.facts.yearsInBusiness} ans. On en rachète environ ${siteConfig.facts.vehiclesPerYear.toLocaleString("fr-CA")} par année.`,
          "La différence avec la plupart des numéros qu'on trouve en ligne, c'est qu'il n'y a personne entre vous et nous. Beaucoup d'annonces de « rachat d'auto » sont en réalité des courtiers : ils prennent votre appel, revendent votre coordonnée à un vrai recycleur, et le prix baisse d'autant. Nous, on est le recycleur.",
        ],
      },
      {
        h2: "Comment on établit un prix",
        body: [
          "Un prix honnête repose sur des données vérifiables : le poids du véhicule, son année, son modèle, la présence du convertisseur catalytique et l'état des pièces réutilisables. Nos offres se situent entre 300 $ et 3 000 $ selon ces facteurs.",
          "On confirme le montant au téléphone et on s'y tient. C'est la seule promesse qui compte dans cette industrie, parce que c'est celle qui est le plus souvent brisée.",
        ],
      },
      {
        h2: "La partie environnementale",
        body: [
          "Un véhicule en fin de vie contient de l'huile, de l'antigel, du liquide de frein, de l'essence, une batterie au plomb et un système de climatisation sous pression. Tout ça est retiré et traité avant le démantèlement, selon les normes environnementales du Québec.",
          "Les pièces encore fonctionnelles retournent en circulation ; le reste est broyé et le métal est recyclé. C'est ce qui donne encore une valeur à une auto que personne ne veut conduire.",
        ],
      },
      {
        h2: "Nos heures",
        body: [
          "On répond au téléphone 7 jours sur 7, de 8 h à 20 h 30 — incluant les fins de semaine et les jours fériés. Un véhicule mort dans une entrée ne choisit pas le moment, et on ne voit pas pourquoi il faudrait attendre au lundi.",
        ],
      },
    ],
    en: [
      {
        h2: "What we do",
        body: [
          `B2 Autos has been buying end-of-life vehicles across the North Shore, Laval and east-end Montreal for ${siteConfig.facts.yearsInBusiness} years. We take in around ${siteConfig.facts.vehiclesPerYear.toLocaleString("en-CA")} of them a year.`,
          "What separates us from most of the numbers you'll find online is that there is nobody between you and us. A lot of \"we buy cars\" ads are brokers: they take your call, sell your details on to an actual recycler, and the price drops by whatever they keep. We are the recycler.",
        ],
      },
      {
        h2: "How we set a price",
        body: [
          "An honest price rests on things that can be checked: the vehicle's weight, its year and model, whether the catalytic converter is still on it, and the condition of anything reusable. Our offers land between $300 and $3,000 depending on those factors.",
          "We confirm the amount on the phone and we stick to it. It's the only promise that matters in this industry, because it's the one most often broken.",
        ],
      },
      {
        h2: "The environmental part",
        body: [
          "An end-of-life vehicle holds oil, coolant, brake fluid, fuel, a lead-acid battery and a pressurised air-conditioning system. All of it is removed and handled before dismantling, to Quebec environmental standards.",
          "Parts that still work go back into circulation; the rest is shredded and the metal recycled. That's what still gives value to a car nobody wants to drive.",
        ],
      },
      {
        h2: "Our hours",
        body: [
          "We answer the phone 7 days a week, 8:00am to 8:30pm — weekends and holidays included. A dead car in a driveway doesn't pick its moment, and we see no reason it should have to wait for Monday.",
        ],
      },
    ],
  },
};

export const PRIVACY: StaticPage = {
  metaTitle: {
    fr: "Politique de confidentialité | B2 Autos",
    en: "Privacy policy | B2 Autos",
  },
  metaDescription: {
    fr: "Comment B2 Autos recueille, utilise et conserve vos renseignements personnels, conformément à la Loi 25 du Québec.",
    en: "How B2 Autos collects, uses and retains your personal information, in line with Quebec's Law 25.",
  },
  h1: { fr: "Politique de confidentialité", en: "Privacy policy" },
  lede: {
    fr: "Cette politique explique quels renseignements on recueille, pourquoi, combien de temps on les garde et comment retirer votre consentement.",
    en: "This policy explains what information we collect, why, how long we keep it, and how to withdraw your consent.",
  },
  sections: {
    fr: [
      {
        h2: "Qui est responsable de vos renseignements",
        body: [
          `${siteConfig.name}, ${fullAddress}. Pour toute question concernant vos renseignements personnels, écrivez à ${siteConfig.email} ou téléphonez au ${siteConfig.phone.display}.`,
        ],
      },
      {
        h2: "Ce qu'on recueille",
        list: [
          "Les renseignements que vous fournissez dans le formulaire d'estimation : nom, numéro de téléphone, code postal ou ville, courriel si vous le donnez, et les informations sur le véhicule.",
          "Des données techniques de navigation : pages consultées, provenance de la visite, type d'appareil.",
          "Les identifiants publicitaires (gclid, fbclid et paramètres utm) présents dans le lien qui vous a amené ici, lorsque vous avez consenti aux témoins marketing.",
        ],
      },
      {
        h2: "Pourquoi on les recueille",
        list: [
          "Vous rappeler et vous donner un prix pour votre véhicule — c'est la raison principale.",
          "Organiser le remorquage et produire les documents de cession SAAQ.",
          "Mesurer la performance de nos publicités, uniquement si vous avez accepté les témoins marketing.",
          "Comprendre quelles pages sont utiles, uniquement si vous avez accepté les témoins analytiques.",
        ],
      },
      {
        h2: "Combien de temps on les garde",
        body: [
          "Les demandes d'estimation sont conservées 24 mois, puis supprimées. Les dossiers liés à une transaction complétée sont conservés plus longtemps quand la loi l'exige, notamment pour les obligations fiscales et les documents de cession de véhicule.",
          "Les témoins de consentement expirent après 6 mois, après quoi la question vous est reposée.",
        ],
      },
      {
        h2: "Avec qui on les partage",
        body: [
          "On ne vend jamais vos renseignements. Ils sont accessibles à notre équipe et aux fournisseurs qui font fonctionner le site et les communications (hébergement, envoi de courriels, mesure publicitaire). Ces fournisseurs peuvent traiter des données à l'extérieur du Québec.",
        ],
      },
      {
        h2: "Vos droits et comment retirer votre consentement",
        body: [
          "Vous pouvez demander l'accès à vos renseignements, leur correction ou leur suppression, et retirer votre consentement en tout temps.",
          `Pour les témoins : rouvrez la bannière de consentement au bas de cette page ou effacez les témoins de votre navigateur, puis rechargez le site. Pour tout le reste : écrivez à ${siteConfig.email} et on traite la demande dans les 30 jours.`,
          "Si notre réponse ne vous satisfait pas, vous pouvez déposer une plainte auprès de la Commission d'accès à l'information du Québec.",
        ],
      },
    ],
    en: [
      {
        h2: "Who is responsible for your information",
        body: [
          `${siteConfig.name}, ${fullAddress}. For any question about your personal information, write to ${siteConfig.email} or call ${siteConfig.phone.display}.`,
        ],
      },
      {
        h2: "What we collect",
        list: [
          "What you enter in the quote form: name, phone number, postal code or city, email if you give one, and the vehicle details.",
          "Technical browsing data: pages viewed, where the visit came from, device type.",
          "Advertising identifiers (gclid, fbclid and utm parameters) present in the link that brought you here, where you consented to marketing cookies.",
        ],
      },
      {
        h2: "Why we collect it",
        list: [
          "To call you back and give you a price for your vehicle — that is the main reason.",
          "To arrange towing and produce the SAAQ release documents.",
          "To measure how our advertising performs, only if you accepted marketing cookies.",
          "To understand which pages are useful, only if you accepted analytics cookies.",
        ],
      },
      {
        h2: "How long we keep it",
        body: [
          "Quote requests are kept for 24 months, then deleted. Records tied to a completed transaction are kept longer where the law requires it, in particular for tax obligations and vehicle transfer documents.",
          "Consent cookies expire after 6 months, at which point you are asked again.",
        ],
      },
      {
        h2: "Who we share it with",
        body: [
          "We never sell your information. It is accessible to our team and to the providers that run the site and our communications (hosting, email delivery, advertising measurement). Those providers may process data outside Quebec.",
        ],
      },
      {
        h2: "Your rights and how to withdraw consent",
        body: [
          "You can request access to your information, its correction or its deletion, and withdraw your consent at any time.",
          `For cookies: reopen the consent banner at the bottom of this page or clear your browser's cookies and reload the site. For anything else: write to ${siteConfig.email} and we will handle the request within 30 days.`,
          "If our answer does not satisfy you, you may file a complaint with the Commission d'accès à l'information du Québec.",
        ],
      },
    ],
  },
};

export const TERMS: StaticPage = {
  metaTitle: {
    fr: "Conditions d'utilisation | B2 Autos",
    en: "Terms of use | B2 Autos",
  },
  metaDescription: {
    fr: "Conditions d'utilisation du site de B2 Autos et portée des estimations données en ligne ou par téléphone.",
    en: "Terms of use for the B2 Autos website and the scope of quotes given online or by phone.",
  },
  h1: { fr: "Conditions d'utilisation", en: "Terms of use" },
  lede: {
    fr: "Ce que vaut une estimation, ce qui l'engage et ce qui peut la faire changer.",
    en: "What a quote is worth, what it commits us to, and what can change it.",
  },
  sections: {
    fr: [
      {
        h2: "La valeur d'une estimation",
        body: [
          "Une estimation donnée en ligne ou au téléphone repose entièrement sur les informations que vous fournissez : année, marque, modèle, état, présence du moteur, de la transmission et du convertisseur catalytique.",
          "Si ces informations sont exactes, le montant confirmé est celui qui vous est payé à l'enlèvement. Si le véhicule diffère de façon importante de ce qui a été décrit — pièces majeures manquantes, dommages non mentionnés — le montant est réévalué et vous restez libre de refuser sans frais.",
        ],
      },
      {
        h2: "Ce qu'on vous demande",
        list: [
          "Être le propriétaire du véhicule ou avoir l'autorisation de le vendre.",
          "Fournir le certificat d'immatriculation et une pièce d'identité valide.",
          "Retirer vos effets personnels avant l'enlèvement. Ce qui reste dans le véhicule part avec lui.",
        ],
      },
      {
        h2: "Remorquage",
        body: [
          "Le remorquage est gratuit à l'intérieur de notre zone de service et n'est jamais déduit du montant convenu. L'accès au véhicule doit être raisonnablement dégagé ; si un obstacle empêche le chargement, on convient ensemble d'une solution ou d'une nouvelle date.",
        ],
      },
      {
        h2: "Contenu du site",
        body: [
          "Les délais, distances et montants indiqués sur ce site sont donnés à titre indicatif et peuvent varier selon la ville, l'horaire de remorquage et l'état réel du véhicule. Les prix affichés sont une fourchette, pas une offre ferme.",
        ],
      },
    ],
    en: [
      {
        h2: "What a quote is worth",
        body: [
          "A quote given online or by phone rests entirely on the information you provide: year, make, model, condition, and whether the engine, transmission and catalytic converter are present.",
          "If that information is accurate, the confirmed amount is what you are paid at pickup. If the vehicle differs materially from what was described — major parts missing, damage not mentioned — the amount is reassessed and you remain free to decline at no cost.",
        ],
      },
      {
        h2: "What we ask of you",
        list: [
          "That you own the vehicle or are authorised to sell it.",
          "That you provide the registration certificate and valid photo ID.",
          "That you remove your personal belongings before pickup. Anything left in the vehicle leaves with it.",
        ],
      },
      {
        h2: "Towing",
        body: [
          "Towing is free within our service area and is never deducted from the agreed amount. Access to the vehicle must be reasonably clear; if something prevents loading, we agree on a solution or a new date together.",
        ],
      },
      {
        h2: "Site content",
        body: [
          "Timings, distances and amounts shown on this site are indicative and can vary with the city, the towing schedule and the vehicle's actual condition. Prices shown are a range, not a firm offer.",
        ],
      },
    ],
  },
};

export const CONTACT: StaticPage = {
  metaTitle: {
    fr: "Contact | B2 Autos — 340 Chemin Pincourt, Mascouche",
    en: "Contact | B2 Autos — 340 Chemin Pincourt, Mascouche",
  },
  metaDescription: {
    fr: `Joignez B2 Autos au ${siteConfig.phone.display}, 7 jours sur 7 de 8 h à 20 h 30. Notre cour : ${fullAddress}.`,
    en: `Reach B2 Autos at ${siteConfig.phone.display}, 7 days a week from 8am to 8:30pm. Our yard: ${fullAddress}.`,
  },
  h1: { fr: "Nous joindre", en: "Contact us" },
  lede: {
    fr: "Le plus rapide reste le téléphone : on répond nous-mêmes, 7 jours sur 7.",
    en: "The phone is still fastest: we answer it ourselves, 7 days a week.",
  },
  sections: { fr: [], en: [] },
};
