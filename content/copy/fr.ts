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
    callAria: "Appeler B2 Autos maintenant",
    callShort: "Appeler",
    quoteCta: "Obtenir mon estimation gratuite",
    quoteShort: "Estimation",
    whatsapp: "WhatsApp",
    whatsappAria: "Écrire à B2 Autos sur WhatsApp",
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
  },

  home: {
    metaTitle:
      "Rachat Auto Scrap Mascouche | Argent Comptant + Remorquage Gratuit — B2 Autos",
    metaDescription:
      "Nous achetons votre auto scrap, accidentée ou en panne. Argent comptant sur place, remorquage gratuit partout sur la Rive-Nord. Estimation gratuite en 2 minutes. Ouvert 7 jours, 8h à 20h30.",

    h1: "Rachat d'auto scrap à Mascouche — payé comptant, sur place",
    sub: "On achète votre véhicule peu importe son état : en panne, accidenté, sans moteur ou déclaré perte totale. Remorquage gratuit, argent comptant à l'enlèvement, et on s'occupe de la paperasse SAAQ.",
    priceAnchor: "De 300 $ à 3 000 $ comptant selon le véhicule",
    priceFigure: "300 $ – 3 000 $",
    priceCaption: "comptant, selon le véhicule",
    whatsappCta: "Envoyer une photo sur WhatsApp",
    whatsappPrefill: "Bonjour ! J'aimerais une estimation pour mon véhicule. Voici une photo :",
    photoChip: "Notre propre plateau — 340 Chemin Pincourt, Mascouche",
    ctaPrimary: "Obtenir mon estimation gratuite",
    ctaSecondary: `Appeler ${PHONE}`,

    trustStrip: [
      "Remorquage gratuit inclus",
      "Argent comptant à l'enlèvement",
      "On gère le transfert SAAQ",
      "Ouvert 7 jours, 8h à 20h30",
    ],

    howItWorks: {
      title: "Comment ça fonctionne — 3 étapes, moins de 24 heures",
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
      title: "On achète tous les véhicules — aucune exception",
      items: [
        "Auto qui ne démarre plus",
        "Véhicule accidenté ou perte totale",
        "Auto sans moteur ou sans transmission",
        "Camion, VUS et fourgonnette",
        "Auto trop rouillée pour passer l'inspection",
        "Véhicule sans papiers ou avec papiers perdus (on vous guide)",
      ],
    },

    stats: [
      "2 000 véhicules achetés par année",
      "10 ans d'expérience à Mascouche",
      "Ouvert 7 jours sur 7, 8h à 20h30",
    ],

    why: {
      title: "Pourquoi les gens de Mascouche et Terrebonne nous appellent",
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
      title: "Notre zone de service",
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
        "Laval",
        "Montréal-Est",
        "Rivière-des-Prairies",
        "Pointe-aux-Trembles",
        "Anjou",
        "Montréal-Nord",
      ],
      linkLabel: "Voir la page de votre ville",
    },

    reviewsHeading: "5,0 ★ sur 5 avis Google",

    faqHeading: "Questions fréquentes",
    faqAllLink: "Voir toutes les questions",

    finalCta: {
      title: "Votre vieux char vaut de l'argent. Découvrez combien.",
      sub: "Estimation gratuite, sans obligation, en moins de 2 minutes.",
    },
  },

  consent: {
    title: "Nous utilisons des témoins (cookies)",
    body: "Nous utilisons des témoins pour améliorer votre expérience et mesurer la performance de nos publicités. Vous pouvez accepter, refuser ou personnaliser vos choix en tout temps.",
    acceptAll: "Tout accepter",
    rejectAll: "Tout refuser",
    customise: "Personnaliser",
    save: "Enregistrer mes choix",
    necessary: "Nécessaires",
    necessaryBody: "Requis pour le fonctionnement du site : sécurité, navigation, envoi du formulaire. Ne peuvent pas être désactivés.",
    analytics: "Analytiques",
    analyticsBody: "Nous aident à comprendre quelles pages sont utiles et où les visiteurs abandonnent.",
    marketing: "Marketing",
    marketingBody: "Permettent de mesurer nos publicités Google et Meta et d'éviter de vous montrer la même annonce inutilement.",
    alwaysOn: "Toujours actifs",
    policyLink: "Voir notre politique de confidentialité.",
  },

  form: {
    eyebrow: "Estimation gratuite",
    title: "Combien vaut votre véhicule ?",
    subtitle: "Quatre questions, moins d'une minute. On vous rappelle avec un prix ferme.",

    vehicle: "Année, marque et modèle",
    vehiclePlaceholder: "Ex. : 2011 Honda Civic",
    name: "Prénom et nom",
    namePlaceholder: "Votre nom complet",
    phone: "Téléphone",
    phonePlaceholder: "(514) 555-1234",
    postal: "Code postal ou ville",
    postalPlaceholder: "Ex. : J7L 2W3 ou Terrebonne",

    consent:
      "J'accepte que B2 Autos communique avec moi par téléphone, texto ou courriel au sujet de ma soumission. Consultez notre politique de confidentialité.",
    consentLinkText: "politique de confidentialité",

    submit: "Obtenir mon estimation",
    submitting: "Envoi en cours…",

    required: "Ce champ est requis",
    invalidPhone: "Entrez un numéro de téléphone valide",
    consentRequired: "Vous devez accepter pour continuer",
    errorBody: "Ça n'a pas fonctionné. Appelez-nous plutôt :",
    privacyNote: "Sans obligation. On ne partage jamais vos coordonnées.",
  },

  thanks: {
    metaTitle: "Merci — votre demande est reçue | B2 Autos",
    metaDescription:
      "Votre demande d'estimation est reçue. Un membre de l'équipe B2 Autos vous rappelle sous peu.",
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
