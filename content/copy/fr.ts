import { siteConfig, hoursLong, hoursRange } from "@/config/site";

const PHONE = siteConfig.phone.display;

/**
 * French copy. French is the primary language of this site — the copy below
 * is written in Quebec French on purpose ("char", "scrap", "soumission",
 * "remorquage", "SAAQ") and must not be neutralised into France French.
 *
 * `en.ts` is typed against this object, so any key added here has to be
 * added there too or the build fails.
 */
export const fr = {
  meta: {
    langLabel: "Français",
    switchTo: "English",
    switchAria: "Voir cette page en anglais",
  },

  nav: {
    services: "Nos services",
    scrapBuying: "Auto scrap",
    towing: "Remorquage",
    damaged: "Accidentée",
    trucks: "Camions et VUS",
    cities: "Villes desservies",
    about: "À propos",
    faq: "FAQ",
    blog: "Blogue",
    contact: "Contact",
    quote: "Estimation gratuite",
  },

  crossLinks: {
    servicesInCity: "Nos services à",
    citiesForService: "Où on offre ce service",
    citiesLead:
      "On se déplace gratuitement dans ces villes. Chaque page donne la distance depuis notre cour et le délai d'enlèvement habituel.",
    servicesLead: "Ce qu'on achète et ce qu'on fait sur place :",
  },
  common: {
    callCta: `Appeler ${PHONE}`,
    callAria: "Appeler Autos B2 maintenant",
    quoteCta: "Obtenir mon estimation gratuite",
    callShort: "Appeler",
    whatsapp: "WhatsApp",
    whatsappAria: "Écrire à Autos B2 sur WhatsApp",
    whatsappTagline: "Envoyez-nous une photo de votre auto",
    hoursLong: hoursLong("fr"),
    addressLabel: "Notre cour",
    emailLabel: "Courriel",
    phoneLabel: "Téléphone",
    breadcrumbHome: "Accueil",
    backToQuote: "Obtenir une estimation",
    readMore: "Lire l'article",
    published: "Publié le",
    skipToContent: "Aller au contenu principal",
    /** Shown only when siteConfig.GBP_REVIEW_LINK is set. */
    reviewCta: "Laissez-nous un avis Google",
  },

  home: {
    metaTitle: "Vendre son auto scrap Laval, Montréal | Autos B2",
    metaDescription:
      "Acheteur d'auto scrap à Laval, Montréal et la Rive-Nord. On achète accidentée, en panne ou perte totale. Cash pour auto et remorquage gratuit.",

    /*
      Two halves, deliberately. `promise` is the claim every scrap buyer
      makes; `guarantee` is the one none of them will put in writing, and it
      is rendered in brand green so the eye lands on the half that is
      actually different. Splitting it in the data rather than slicing the
      string at "ou" keeps the two languages independent.
    */
    h1: {
      promise: "Le meilleur prix pour votre auto scrap,",
      guarantee: "ou on vous paie la différence.",
    },
    /* Three beats, not a paragraph. Rendered as a row with green dots. */
    sub: ["Offre en 2 minutes", "Cash", "Remorquage gratuit"],
    priceAnchor: "De 300 $ à 3 000 $ comptant selon le véhicule",
    priceFigure: "300 $ – 3 000 $",
    priceCaption: "comptant, selon le véhicule",
    whatsappCta: "Envoyer une photo sur WhatsApp",
    whatsappPrefill: "Bonjour ! J'aimerais une estimation pour mon véhicule. Voici une photo :",
    ctaPrimary: "Obtenir mon estimation gratuite",
    ctaSecondary: `Appeler ${PHONE}`,

    /*
      These are the eight callout assets from the Google Ads account, word for
      word, because someone who clicks an ad promising "Aucuns frais cachés"
      has to land on a page that says "Aucuns frais cachés". Message match is
      the cheapest conversion win there is, and Google scores the landing page
      against the ad for Quality Score on top of that.

      Four of the eight. "Paiement comptant" and "Ramassage gratuit" are two
      more callouts, but they are already the subtitle, and saying them twice
      two elements apart is what this strip used to do wrong. "Prix
      compétitifs" and the opening hours were dropped on request: the price
      claim is weaker than the guarantee already in the H1, and the hours are
      stated in the footer, the schema and the contact page without being
      repeated a fourth time above the fold.
    */
    trustStrip: [
      "Aucuns frais cachés",
      "Reçu SAAQ officiel",
      "Service rapide",
      "Recyclage responsable",
    ],

    howItWorks: {
      title: "Vendre son char scrap en 3 étapes, moins de 24 heures",
      /*
        `alt` describes the illustration for each step. The image paths are not
        here: they are the same file in both languages, and stating a path
        twice is how the two copy files drift apart. They live beside the
        render in app/(public)/[lang]/page.tsx, where the order of the sequence
        already lives.
      */
      steps: [
        {
          title: "Donnez-nous les infos de base",
          body: "Année, marque, modèle et état. Par téléphone ou avec le formulaire. Ça prend 2 minutes et vous recevez un prix ferme, sans obligation.",
          alt: "Un homme au téléphone à côté de son auto accidentée",
        },
        {
          title: "On planifie l'enlèvement gratuit",
          body: "Vous choisissez le moment. Notre remorqueuse se déplace partout sur la Rive-Nord et à Laval, souvent le jour même.",
          alt: "Un chauffeur charge une auto accidentée sur le plateau de la remorqueuse Autos B2",
        },
        {
          title: "Vous êtes payé comptant sur place",
          body: "On vous remet l'argent à l'enlèvement, on récupère la plaque et on produit le reçu officiel pour la SAAQ. Vous arrêtez de payer l'immatriculation.",
          alt: "Un chauffeur Autos B2 remet l'argent comptant au propriétaire devant la remorqueuse chargée",
        },
      ],
    },

    buyAll: {
      title: "Se débarrasser de son auto, peu importe son état",
      items: [
        "Vendre char scrap qui ne démarre plus",
        "Vendre mon auto accidentée ou perte totale",
        "Auto sans moteur ou sans transmission",
        "Vendre minoune, camion, VUS ou fourgonnette",
        "Auto trop rouillée pour passer l'inspection",
        "Véhicule sans papiers ou papiers perdus — on vous guide",
      ],
    },

    stats: [
      "2 000 véhicules achetés par année",
      "10 ans d'expérience à Mascouche",
      `Ouvert 7 jours sur 7, ${hoursRange("fr").replace("de ", "")}`,
    ],

    why: {
      title: "Qui achète les autos scrap à Laval et Montréal ?",
      points: [
        {
          title: "Un vrai recycleur, pas un intermédiaire.",
          body: "Notre cour est au 340 Chemin Pincourt à Mascouche. On ne revend pas votre appel à quelqu'un d'autre — on achète, on remorque et on paie nous-mêmes.",
        },
        {
          title: "Le prix annoncé est le prix payé.",
          body: "Pas de renégociation à l'arrivée de la remorqueuse. Le montant confirmé au téléphone est celui que vous recevez.",
        },
        {
          title: "On s'occupe de la SAAQ.",
          body: "Transfert, cession et reçu officiel gérés sur place pour que vous cessiez immédiatement de payer pour un véhicule que vous n'avez plus.",
        },
        {
          title: "Recyclage responsable.",
          body: "Fluides, batteries et pneus traités selon les normes environnementales du Québec.",
        },
      ],
    },

    serviceArea: {
      title: "Scrap auto à Montréal, Laval, la Rive-Nord et les Laurentides",
      lead: "Le remorquage est gratuit partout dans ces secteurs. Les villes en vert ont leur propre page, avec la distance depuis la cour et le délai habituel de ramassage.",
      linkLabel: "Voir la page de votre ville",
    },

    fleetTitle: "Notre flotte de remorquage, au travail",
    fleetSub:
      "Nos propres camions, nos propres chauffeurs. Ces photos sont prises sur nos ramassages, pas achetées dans une banque d'images.",
    reviewsHeading: "Ce que disent nos clients sur Google",

    faqHeading: "Questions fréquentes",
    faqAllLink: "Voir toutes les questions",

    yard: {
      eyebrow: "Notre cour",
      title: "On est un vrai recycleur, à une vraie adresse",
      body: "Pas un intermédiaire avec un numéro de téléphone. Notre cour est ouverte 7 jours sur 7 et vous êtes bienvenu de passer.",
      directions: "Obtenir l'itinéraire",
      mapAlt: "Carte de la cour d'Autos B2 au 340 Chemin Pincourt, Mascouche",
    },
    finalCta: {
      title: "Votre vieux char vaut de l'argent. Découvrez combien.",
      sub: "Estimation gratuite, sans obligation, en moins de 2 minutes.",
    },
  },

  form: {
    eyebrow: "Estimation gratuite",
    title: "Combien vaut votre véhicule ?",
    subtitle: "Quatre questions, moins d'une minute. On vous rappelle avec un prix ferme.",
    /* No hours here. The visitor is submitting the form now; what they want
       to know is how long they wait, not when the yard closes. */
    replyTime: "On rappelle habituellement en moins de 5 minutes.",

    vehicle: "Année, marque et modèle",
    name: "Prénom et nom",
    phone: "Téléphone",
    postal: "Code postal ou ville",

    submit: "Obtenir mon estimation",
    submitting: "Envoi en cours…",

    required: "Ce champ est requis",
    invalidPhone: "Entrez un numéro de téléphone valide",
    errorBody: "Ça n'a pas fonctionné. Appelez-nous plutôt :",
    tooManyBody:
      "Trop de tentatives en peu de temps. Réessayez dans quelques minutes, ou appelez-nous tout de suite :",
    privacyNote:
      "En envoyant ce formulaire, vous acceptez qu'Autos B2 vous contacte par téléphone, texto ou courriel au sujet de votre soumission. Sans obligation. On ne partage jamais vos coordonnées.",
  },

  thanks: {
    metaTitle: "Merci — votre demande est reçue | Autos B2",
    metaDescription:
      "Votre demande d'estimation est reçue. Un membre de l'équipe Autos B2 vous rappelle sous peu.",
    h1: "Merci — on vous rappelle sous peu",
    body: `Votre demande est bien reçue. Un membre de l'équipe vous téléphone généralement en moins de 30 minutes pendant nos heures d'ouverture, de ${hoursRange("fr").replace("de ", "")}, 7 jours sur 7.`,
    urgent: "Vous êtes pressé ? Appelez-nous directement :",
    whatNext: "Ce qui arrive ensuite",
    steps: [
      "On vous appelle pour confirmer l'année, la marque, le modèle et l'état du véhicule.",
      "On vous donne un prix ferme au téléphone, sans obligation.",
      "Si vous acceptez, on planifie l'enlèvement gratuit — souvent le jour même.",
    ],
    backHome: "Retour à l'accueil",
  },
};

/**
 * Deliberately not `as const`: the type is the CONTRACT the English file has
 * to satisfy, so it needs `string`, not the French string literals. Adding a
 * key here without adding it to en.ts is a build error, which is the whole
 * point.
 */
export type Copy = typeof fr;
