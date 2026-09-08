import { siteConfig } from "@/config/site";

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

  common: {
    callCta: `Appeler ${PHONE}`,
    callAria: "Appeler Autos B2 maintenant",
    quoteCta: "Obtenir mon estimation gratuite",
    callShort: "Appeler",
    whatsapp: "WhatsApp",
    whatsappAria: "Écrire à Autos B2 sur WhatsApp",
    whatsappTagline: "Envoyez-nous une photo de votre auto",
    hours: "Ouvert 7 jours, 8 h à 20 h 30",
    hoursLong: "Ouvert 7 jours sur 7, de 8 h à 20 h 30",
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

    h1: "Vendre son auto scrap à Laval et Montréal — payé comptant",
    sub: "Acheteur d'auto scrap à Laval, Montréal et sur la Rive-Nord. On achète votre véhicule peu importe son état : en panne, accidenté, sans moteur ou perte totale. Remorquage gratuit et cash pour auto à l'enlèvement.",
    priceAnchor: "De 300 $ à 3 000 $ comptant selon le véhicule",
    priceFigure: "300 $ – 3 000 $",
    priceCaption: "comptant, selon le véhicule",
    whatsappCta: "Envoyer une photo sur WhatsApp",
    whatsappPrefill: "Bonjour ! J'aimerais une estimation pour mon véhicule. Voici une photo :",
    ctaPrimary: "Obtenir mon estimation gratuite",
    ctaSecondary: `Appeler ${PHONE}`,

    trustStrip: [
      "Remorquage gratuit inclus",
      "Argent comptant à l'enlèvement",
      "On gère le transfert SAAQ",
      "Ouvert 7 jours, 8h à 20h30",
    ],

    howItWorks: {
      title: "Vendre son char scrap en 3 étapes, moins de 24 heures",
      steps: [
        {
          title: "Donnez-nous les infos de base",
          body: "Année, marque, modèle et état. Par téléphone ou avec le formulaire. Ça prend 2 minutes et vous recevez un prix ferme, sans obligation.",
        },
        {
          title: "On planifie l'enlèvement gratuit",
          body: "Vous choisissez le moment. Notre remorqueuse se déplace partout sur la Rive-Nord et à Laval, souvent le jour même.",
        },
        {
          title: "Vous êtes payé comptant sur place",
          body: "On vous remet l'argent à l'enlèvement, on récupère la plaque et on produit le reçu officiel pour la SAAQ. Vous arrêtez de payer l'immatriculation.",
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
      "Ouvert 7 jours sur 7, 8h à 20h30",
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
      title: "Scrap auto à Laval, Montréal et la Rive-Nord",
      cities: [
        "Mascouche",
        "Terrebonne",
        "Lachenaie",
        "La Plaine",
        "Repentigny",
        "L'Assomption",
        "Charlemagne",
        "Le Gardeur",
        "Saint-Lin-Laurentides",
        "Bois-des-Filion",
        "Rosemère",
        "Blainville",
        "Sainte-Thérèse",
        "Saint-Eustache",
        "Laval",
        "Montréal-Est",
        "Rivière-des-Prairies",
        "Pointe-aux-Trembles",
        "Anjou",
        "Montréal-Nord",
      ],
      linkLabel: "Voir la page de votre ville",
    },

    fleetTitle: "Notre flotte de remorquage, au travail",
    fleetSub:
      "Nos propres camions, nos propres chauffeurs. Ces photos sont prises sur nos ramassages, pas achetées dans une banque d'images.",
    reviewsHeading: "5,0 ★ sur 5 avis Google",

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
    replyTime: "On rappelle habituellement en moins de 5 minutes, de 8 h à 20 h 30.",

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
    body: "Votre demande est bien reçue. Un membre de l'équipe vous téléphone généralement en moins de 30 minutes pendant nos heures d'ouverture, de 8 h à 20 h 30, 7 jours sur 7.",
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
