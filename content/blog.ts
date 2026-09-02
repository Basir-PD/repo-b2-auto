import type { Lang } from "@/config/routes";
import type { Section } from "@/content/services";

export type Post = {
  slug: string;
  /** Articles are French-only for now — there is no English twin to link to. */
  lang: Lang;
  title: string;
  description: string;
  /** ISO date. Drives the sitemap lastmod and the Article schema. */
  date: string;
  lede: string;
  sections: Section[];
};

export const POSTS: Post[] = [
  {
    slug: "combien-vaut-une-auto-pour-la-scrap-au-quebec",
    lang: "fr",
    title: "Combien vaut une auto pour la scrap au Québec en 2026 ?",
    description:
      "Ce qui fait vraiment monter ou descendre le prix d'une auto scrap au Québec : le poids, le convertisseur catalytique, l'année et les pièces récupérables.",
    date: "2026-01-15",
    lede: "La réponse courte : entre 300 $ et 3 000 $. La réponse utile, c'est de comprendre ce qui vous place en haut ou en bas de cette fourchette — parce que la plupart des facteurs sont connus avant même que quiconque regarde le véhicule.",
    sections: [
      {
        h2: "Le poids fixe le plancher",
        body: [
          "Une auto en fin de vie est d'abord vendue comme métal. Le poids du véhicule fixe donc un montant de base qu'aucune négociation ne change : une compacte de 1 200 kg et une camionnette pleine grandeur de 2 400 kg ne partent pas du même point.",
          "C'est la raison la plus simple pour laquelle les camions, les VUS et les fourgonnettes se retrouvent presque toujours dans le haut de la fourchette. Ce n'est pas une question de marque ni de popularité : c'est de la masse.",
        ],
      },
      {
        h2: "Le convertisseur catalytique est la pièce qui change tout",
        body: [
          "Le catalyseur contient du platine, du palladium et du rhodium. C'est, de loin, la pièce la plus valable d'un véhicule qu'on ne réparera pas, et sa présence ou son absence peut faire une différence de plusieurs centaines de dollars sur l'offre.",
          "Si le vôtre a été volé — un problème fréquent au Québec depuis quelques années — dites-le au téléphone. Ça ne disqualifie pas le véhicule, mais un acheteur qui découvre l'absence en arrivant va vouloir renégocier, et vous perdez le contrôle de la conversation.",
        ],
      },
      {
        h2: "L'année et le modèle : la demande pour les pièces",
        body: [
          "Un véhicule dont il reste beaucoup d'exemplaires sur la route vaut plus qu'un modèle rare, parce que ses pièces se revendent. Une Civic ou une F-150 de dix ans a une demande constante pour ses portières, ses phares, ses rétroviseurs et ses modules électroniques.",
          "À l'inverse, un modèle marginal ou très ancien vaut souvent son poids en métal, point. Ce n'est pas de la mauvaise volonté : les pièces qui ne se vendent pas coûtent de l'espace d'entreposage.",
        ],
      },
      {
        h2: "L'état, mais pas comme vous pensez",
        body: [
          "Beaucoup de gens s'excusent au téléphone : l'auto ne démarre plus, elle est rouillée, elle a été accidentée. Pour un recycleur, ce sont des informations, pas des défauts. Un véhicule accidenté mais complet vaut souvent plus qu'un véhicule roulant dont on a retiré le moteur.",
          "Ce qui compte, c'est ce qui est encore là : moteur, transmission, catalyseur, roues, portières, sièges. Un véhicule « dépouillé » — dont on a vendu les pièces une par une avant d'appeler — est celui qui vaut le moins.",
        ],
      },
      {
        h2: "Ce qui ne devrait pas faire varier le prix",
        body: [
          "Le remorquage. S'il est annoncé comme gratuit, il doit être gratuit : pas déduit, pas facturé à l'arrivée, pas conditionnel à la distance à l'intérieur de la zone de service annoncée.",
          "Et surtout, le prix ne devrait pas changer entre l'appel et l'arrivée de la remorqueuse, sauf si le véhicule ne correspond pas à ce que vous avez décrit. La renégociation dans l'entrée est la pratique la plus répandue de l'industrie, et c'est celle contre laquelle il faut se protéger en obtenant un montant ferme au téléphone.",
        ],
      },
      {
        h2: "Comment obtenir un prix fiable en un appel",
        list: [
          "L'année, la marque et le modèle exacts",
          "Est-ce que le moteur et la transmission sont encore dans le véhicule",
          "Est-ce que le convertisseur catalytique est là",
          "L'état général : roulant, non roulant, accidenté, rouillé",
          "Votre ville, pour confirmer que le remorquage est couvert",
        ],
      },
    ],
  },

  {
    slug: "ceder-son-vehicule-a-la-saaq-guide",
    lang: "fr",
    title: "Comment céder son véhicule à la SAAQ : le guide complet",
    description:
      "Cession, plaque, remboursement d'immatriculation : les étapes exactes pour se départir d'un véhicule au Québec sans continuer à payer pour lui.",
    date: "2026-02-03",
    lede: "Se débarrasser d'un véhicule au Québec, ce n'est pas seulement le faire remorquer. Tant que la cession n'est pas enregistrée, le véhicule reste à votre nom — et l'immatriculation continue de courir.",
    sections: [
      {
        h2: "Le principe : tant que c'est à votre nom, c'est votre responsabilité",
        body: [
          "Au Québec, un véhicule est lié à son propriétaire inscrit au registre de la SAAQ. Le faire disparaître physiquement ne change rien à cette inscription. Tant qu'elle existe, vous êtes redevable des droits d'immatriculation et responsable du véhicule.",
          "C'est le piège le plus courant : quelqu'un fait remorquer une vieille auto, n'obtient aucun papier, et reçoit un avis de renouvellement l'année suivante.",
        ],
      },
      {
        h2: "Ce qu'il vous faut avant l'enlèvement",
        list: [
          "Le certificat d'immatriculation du véhicule",
          "Une pièce d'identité valide",
          "La plaque, si elle est encore sur le véhicule",
          "Le nom exact de l'acheteur, tel qu'il apparaîtra sur le document de cession",
        ],
      },
      {
        h2: "Les étapes",
        body: [
          "Premièrement, la cession est signée entre vous et l'acheteur. Un recycleur sérieux remplit ce document sur place, au moment de l'enlèvement, et vous en laisse une copie avant de partir avec le véhicule.",
          "Deuxièmement, la plaque est retirée du véhicule. Elle ne part jamais avec l'auto : elle vous appartient et reste liée à votre dossier.",
          "Troisièmement, vous confirmez auprès de la SAAQ que le véhicule n'est plus en votre possession, en ligne ou en point de service, avec le document de cession en main. C'est cette étape qui arrête officiellement l'immatriculation.",
        ],
      },
      {
        h2: "Le remboursement des droits d'immatriculation",
        body: [
          "Si vous avez payé pour une période qui n'est pas terminée, un remboursement au prorata est possible dans plusieurs situations. Il n'est pas automatique : il découle de la démarche que vous faites auprès de la SAAQ, pas du remorquage.",
          "C'est une des raisons pour lesquelles il ne faut pas laisser traîner l'étape trois. Plus vous attendez, plus la portion récupérable diminue.",
        ],
      },
      {
        h2: "Si vous avez perdu les papiers",
        body: [
          "Ça se règle. Le certificat d'immatriculation peut être remplacé auprès de la SAAQ par le propriétaire inscrit, en présentant une pièce d'identité.",
          "La situation plus délicate est celle d'un véhicule hérité ou laissé par quelqu'un d'autre : le registre doit d'abord refléter le bon propriétaire avant qu'une cession soit possible. Appelez avant de planifier un enlèvement — c'est une démarche courante et il vaut mieux la faire dans le bon ordre.",
        ],
      },
      {
        h2: "Ce qu'un acheteur devrait faire pour vous",
        body: [
          "Remplir la cession sur place, récupérer la plaque, vous remettre une copie du document officiel et vous expliquer la dernière étape. Si un acheteur repart avec votre véhicule sans vous laisser de papier, vous n'avez rien pour prouver qu'il ne vous appartient plus.",
        ],
      },
    ],
  },

  {
    slug: "vendre-une-auto-accidentee-apres-une-perte-totale",
    lang: "fr",
    title: "Vendre une auto accidentée : vos options après une perte totale",
    description:
      "Ce que veut dire une perte totale, quand garder le véhicule est avantageux, et comment vendre une épave au Québec.",
    date: "2026-03-10",
    lede: "Quand un assureur déclare une perte totale, il vous propose un montant pour le véhicule. Ce que beaucoup de gens ignorent, c'est qu'il existe souvent un deuxième choix — et qu'il peut être plus payant.",
    sections: [
      {
        h2: "Ce que veut dire « perte totale »",
        body: [
          "Une perte totale n'est pas un jugement sur l'état du véhicule : c'est un calcul. L'assureur compare le coût estimé des réparations à la valeur marchande du véhicule avant l'accident. Quand le premier dépasse le second, réparer n'a plus de sens économique.",
          "Un véhicule peut donc être déclaré perte totale avec un dommage qui semble mineur, simplement parce que sa valeur marchande était faible au départ.",
        ],
      },
      {
        h2: "Les deux options habituelles",
        body: [
          "La première : l'assureur prend le véhicule et vous verse l'indemnité complète. C'est simple, et c'est ce que la majorité des gens choisissent.",
          "La deuxième : vous conservez le véhicule et l'assureur retranche de l'indemnité ce qu'il aurait obtenu en le revendant — la valeur de récupération. Vous vous retrouvez avec un montant réduit, plus une épave qui vous appartient.",
        ],
      },
      {
        h2: "Quand garder l'épave est avantageux",
        body: [
          "Ça devient intéressant quand la valeur de récupération retranchée par l'assureur est inférieure à ce qu'un recycleur vous paierait directement. Ça arrive plus souvent qu'on pense sur les véhicules lourds : un VUS ou une camionnette complète, même accidentée, a une vraie valeur en pièces et en métal.",
          "Avant de décider, faites l'exercice : demandez à l'assureur le montant exact qu'il retranche, puis appelez un recycleur avec l'année, le modèle et la description du dommage. La comparaison prend dix minutes et elle est chiffrée.",
        ],
      },
      {
        h2: "Ce qui garde de la valeur dans un véhicule accidenté",
        list: [
          "Le convertisseur catalytique, s'il est intact",
          "Le moteur et la transmission, si l'impact ne les a pas touchés",
          "Les portières, hayons et panneaux du côté non touché",
          "Les roues, les sièges et les modules électroniques",
          "Le poids du métal, qui ne change pas avec le dommage",
        ],
      },
      {
        h2: "Les papiers après un sinistre",
        body: [
          "Gardez le document de l'assureur qui confirme votre décision de conserver le véhicule. Avec le certificat d'immatriculation, c'est ce qui permet de faire la cession normalement.",
          "Un véhicule accidenté se cède exactement comme un autre : cession signée, plaque récupérée, reçu officiel remis. Le fait qu'il ne roule plus ne change rien à la procédure.",
        ],
      },
    ],
  },

  {
    slug: "cour-a-scrap-ou-vente-privee",
    lang: "fr",
    title: "Cour à scrap ou vente privée : lequel rapporte le plus ?",
    description:
      "Comparaison honnête entre vendre son vieux véhicule à un particulier et le vendre à un recycleur : montant, délai, risques et paperasse.",
    date: "2026-04-07",
    lede: "Sur papier, une vente privée rapporte presque toujours plus. En pratique, ça dépend entièrement de l'état du véhicule — et il existe un point de bascule assez net.",
    sections: [
      {
        h2: "Le point de bascule",
        body: [
          "Tant qu'un véhicule roule, passe l'inspection et peut être immatriculé par un acheteur, la vente privée gagne. Quelqu'un qui cherche une auto à 2 500 $ paiera toujours plus que sa valeur en pièces et en métal.",
          "Le calcul s'inverse dès que le véhicule ne roule plus, qu'il nécessite une réparation majeure, ou qu'il ne passerait pas une inspection mécanique. À partir de là, l'acheteur privé disparaît — et ceux qui restent négocient à la baisse en connaissant votre situation.",
        ],
      },
      {
        h2: "Ce que la vente privée coûte vraiment",
        list: [
          "Le temps : annonces, messages, rendez-vous manqués, essais routiers",
          "Les frais préalables : parfois une inspection ou une réparation pour rendre le véhicule vendable",
          "L'immatriculation qui continue de courir pendant que le véhicule attend un acheteur",
          "Le risque de recevoir un paiement qui ne passe pas",
          "La responsabilité si l'acheteur revient se plaindre après coup",
        ],
      },
      {
        h2: "Ce qu'une cour à scrap offre en échange d'un montant plus bas",
        body: [
          "Un prix ferme donné d'avance, un délai de 24 à 48 heures, le remorquage inclus, aucune remise en état, et la cession SAAQ réglée sur place.",
          "Autrement dit, vous échangez un montant potentiellement plus élevé contre la certitude et la vitesse. Pour un véhicule qui vaut encore 3 000 $ en vente privée, c'est un mauvais échange. Pour un véhicule immobilisé depuis deux ans dans une entrée, c'est le seul échange réaliste.",
        ],
      },
      {
        h2: "La question à se poser",
        body: [
          "« Est-ce que quelqu'un accepterait de conduire ce véhicule demain matin ? »",
          "Si oui, essayez la vente privée en premier : vous pourrez toujours appeler un recycleur ensuite, et le prix qu'il offre ne diminuera pas parce que vous avez attendu deux semaines.",
          "Si non, la vente privée va surtout vous coûter du temps pour aboutir au même endroit.",
        ],
      },
      {
        h2: "Le cas particulier des véhicules sans papiers",
        body: [
          "Un véhicule dont les papiers sont perdus ou dont le propriétaire inscrit n'est plus la bonne personne est presque invendable en privé : l'acheteur ne pourra pas l'immatriculer. Un recycleur, lui, ne remet pas le véhicule sur la route et peut travailler avec vous pour régulariser la cession.",
        ],
      },
    ],
  },
];

export function postsFor(lang: Lang): Post[] {
  return POSTS.filter((p) => p.lang === lang).sort((a, b) => b.date.localeCompare(a.date));
}

export function postBySlug(lang: Lang, slug: string): Post | undefined {
  return POSTS.find((p) => p.lang === lang && p.slug === slug);
}
