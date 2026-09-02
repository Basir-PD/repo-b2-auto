import type { Lang, PageKey } from "@/config/routes";

export type Section = {
  h2: string;
  body?: string[];
  list?: string[];
};

export type ServicePage = {
  key: Extract<PageKey, "scrapBuying" | "towing" | "damaged" | "trucks">;
  /** schema.org Service name, per language. */
  serviceName: Record<Lang, string>;
  metaTitle: Record<Lang, string>;
  metaDescription: Record<Lang, string>;
  h1: Record<Lang, string>;
  lede: Record<Lang, string>;
  sections: Record<Lang, Section[]>;
};

export const SERVICES: ServicePage[] = [
  {
    key: "scrapBuying",
    serviceName: {
      fr: "Rachat d'auto scrap",
      en: "Cash for junk cars",
    },
    metaTitle: {
      fr: "Rachat Auto Scrap | Argent Comptant Sur Place — Autos B2 Mascouche",
      en: "Cash for Junk Cars | Paid On the Spot — Autos B2 Mascouche",
    },
    metaDescription: {
      fr: "Autos B2 rachète votre auto scrap comptant, de 300 $ à 3 000 $ selon le véhicule. Remorquage gratuit, transfert SAAQ inclus, ouvert 7 jours de 8 h à 20 h 30.",
      en: "Autos B2 buys your junk car for cash, $300 to $3,000 depending on the vehicle. Free towing, SAAQ transfer included, open 7 days 8am to 8:30pm.",
    },
    h1: {
      fr: "Rachat d'auto scrap — payé comptant, remorquage gratuit",
      en: "Cash for junk cars — paid on the spot, free towing",
    },
    lede: {
      fr: "On achète les véhicules en fin de vie pour les recycler nous-mêmes, dans notre cour du 340 Chemin Pincourt à Mascouche. Vous n'avez ni transport à organiser, ni paperasse à faire, ni frais à payer.",
      en: "We buy end-of-life vehicles and recycle them ourselves, at our yard at 340 Chemin Pincourt in Mascouche. Nothing to arrange, no paperwork to file, no fees to pay.",
    },
    sections: {
      fr: [
        {
          h2: "Ce qui détermine le montant",
          body: [
            "Une auto scrap n'est pas payée « au feeling ». Le montant repose sur quatre facteurs mesurables : le poids du véhicule, qui fixe la valeur du métal ; l'année et le modèle, qui déterminent la demande pour les pièces ; la présence du convertisseur catalytique, la pièce la plus valable d'un véhicule en fin de vie ; et l'état des composantes encore réutilisables, comme le moteur, la transmission, les portières ou les jantes.",
            "C'est pour ça que nos offres varient de 300 $ à 3 000 $. Un petit véhicule dépouillé de son catalyseur est au bas de l'échelle ; un VUS récent accidenté mais complet est en haut.",
          ],
        },
        {
          h2: "Obtenir un prix ferme en quelques minutes",
          body: [
            "Donnez-nous l'année, la marque, le modèle et l'état réel du véhicule — au téléphone ou avec le formulaire. On vous revient avec un montant ferme, sans obligation.",
            "Ce prix ne change pas à l'arrivée de la remorqueuse, tant que le véhicule correspond à ce qui a été décrit. La renégociation sur place, c'est la tactique qui donne mauvaise réputation à l'industrie. On ne la pratique pas.",
          ],
        },
        {
          h2: "Ce qu'on achète",
          list: [
            "Auto qui ne démarre plus",
            "Véhicule accidenté ou déclaré perte totale",
            "Auto sans moteur ou sans transmission",
            "Véhicule trop rouillé pour passer l'inspection",
            "Auto immobilisée depuis des années dans une entrée ou un garage",
            "Véhicule sans clés ou dont les papiers ont été perdus",
          ],
        },
        {
          h2: "Le recyclage, concrètement",
          body: [
            "Un véhicule qui entre dans la cour est vidé de ses fluides — huile, antigel, essence, liquide de frein — avant toute autre opération. La batterie, les pneus et le climatiseur sont retirés et traités séparément, selon les normes environnementales du Québec.",
            "Les pièces encore bonnes sont récupérées et remises en circulation ; la carrosserie part au broyage. C'est ce qui permet de payer comptant un véhicule que personne ne veut conduire.",
          ],
        },
      ],
      en: [
        {
          h2: "What determines the amount",
          body: [
            "A scrap car isn't priced on a hunch. The amount rests on four measurable things: the vehicle's weight, which sets the metal value; the year and model, which drive demand for parts; whether the catalytic converter is still on it, the single most valuable component on an end-of-life vehicle; and the condition of anything still reusable — engine, transmission, doors, rims.",
            "That's why our offers range from $300 to $3,000. A small car stripped of its converter sits at the bottom; a recent SUV, wrecked but complete, sits at the top.",
          ],
        },
        {
          h2: "Getting a firm price in minutes",
          body: [
            "Give us the year, make, model and honest condition — by phone or through the form. We come back with a firm amount, no obligation.",
            "That price doesn't move when the tow truck arrives, as long as the vehicle matches what was described. Renegotiating in the driveway is the tactic that gives this industry its reputation. We don't do it.",
          ],
        },
        {
          h2: "What we buy",
          list: [
            "Cars that no longer start",
            "Accident-damaged or written-off vehicles",
            "Cars with no engine or no transmission",
            "Vehicles too rusted to pass inspection",
            "Cars that have sat in a driveway or garage for years",
            "Vehicles with no keys or with lost paperwork",
          ],
        },
        {
          h2: "What recycling actually involves",
          body: [
            "A vehicle entering the yard is drained of its fluids — oil, coolant, fuel, brake fluid — before anything else happens. The battery, the tires and the air-conditioning system are removed and handled separately, to Quebec environmental standards.",
            "Parts still worth having are pulled and put back into circulation; the shell goes to the shredder. That's what makes it possible to pay cash for a vehicle nobody wants to drive.",
          ],
        },
      ],
    },
  },

  {
    key: "towing",
    serviceName: {
      fr: "Remorquage gratuit de véhicule",
      en: "Free vehicle towing",
    },
    metaTitle: {
      fr: "Remorquage Gratuit Rive-Nord et Laval | Enlèvement d'Auto — Autos B2",
      en: "Free Towing North Shore & Laval | Vehicle Removal — Autos B2",
    },
    metaDescription: {
      fr: "Remorquage gratuit inclus avec chaque rachat de véhicule. Enlèvement partout sur la Rive-Nord, à Laval et dans l'est de Montréal, souvent le jour même. 7 jours sur 7.",
      en: "Free towing included with every vehicle purchase. Pickup across the North Shore, Laval and east-end Montreal, often same day. 7 days a week.",
    },
    h1: {
      fr: "Remorquage gratuit — inclus, jamais déduit de votre montant",
      en: "Free towing — included, never deducted from your amount",
    },
    lede: {
      fr: "Le remorquage fait partie du service. Il n'est pas facturé, pas soustrait du prix convenu, et pas conditionnel à la valeur du véhicule.",
      en: "Towing is part of the service. It isn't billed, isn't subtracted from the agreed price, and isn't conditional on what the vehicle is worth.",
    },
    sections: {
      fr: [
        {
          h2: "« Gratuit » veut dire gratuit",
          body: [
            "Certains acheteurs annoncent un montant, puis retranchent 100 $ ou 150 $ de « frais de déplacement » une fois la remorqueuse sur place. Le prix qu'on vous confirme au téléphone est le montant que vous recevez en main, remorquage compris.",
            "C'est vrai partout dans notre zone de service, que vous soyez à cinq minutes de la cour ou à Saint-Lin-Laurentides.",
          ],
        },
        {
          h2: "Ce qu'on peut sortir",
          body: [
            "On utilise un plateau plutôt qu'une dépanneuse à crochet, ce qui change beaucoup de choses : un véhicule sans roues, avec les freins bloqués ou enfoncé dans la terre peut être treuillé sur le plateau sans rouler.",
            "Entrée en pente, cour arrière, stationnement souterrain, garage, terrain non asphalté, véhicule coincé derrière une autre auto : dites-nous la situation au téléphone et on arrive avec le bon équipement du premier coup.",
          ],
        },
        {
          h2: "Délais habituels",
          list: [
            "Mascouche et Terrebonne : souvent le jour même",
            "Repentigny, L'Assomption, Bois-des-Filion : 24 heures en général",
            "Laval, Blainville, Montréal-Est : 24 à 48 heures, regroupés par secteur",
            "Saint-Lin-Laurentides et les rangs : environ 48 heures",
          ],
        },
        {
          h2: "Ce qu'on vous demande de préparer",
          list: [
            "Le certificat d'immatriculation et une pièce d'identité",
            "Vider le véhicule de vos effets personnels",
            "Retirer la plaque si vous l'avez déjà fait — sinon on s'en occupe",
            "Dégager l'accès si c'est possible, surtout en hiver",
          ],
        },
      ],
      en: [
        {
          h2: "\"Free\" means free",
          body: [
            "Some buyers quote an amount, then take $100 or $150 of \"travel fees\" off it once the tow truck is in the driveway. The price we confirm on the phone is the amount that ends up in your hand, towing included.",
            "That holds anywhere in our service area, whether you're five minutes from the yard or up in Saint-Lin-Laurentides.",
          ],
        },
        {
          h2: "What we can get out",
          body: [
            "We run a flatbed rather than a hook truck, which changes a lot: a vehicle with no wheels, with seized brakes, or sunk into the ground can be winched onto the deck without rolling.",
            "Sloped driveway, back yard, underground garage, unpaved lot, a car boxed in behind another one — tell us the situation on the phone and we arrive with the right equipment the first time.",
          ],
        },
        {
          h2: "Typical timing",
          list: [
            "Mascouche and Terrebonne: often the same day",
            "Repentigny, L'Assomption, Bois-des-Filion: usually within 24 hours",
            "Laval, Blainville, Montreal East: 24 to 48 hours, grouped by sector",
            "Saint-Lin-Laurentides and the rangs: around 48 hours",
          ],
        },
        {
          h2: "What to have ready",
          list: [
            "The registration certificate and photo ID",
            "The vehicle emptied of your personal belongings",
            "The plate removed if you've already done it — otherwise we handle it",
            "Clear access if possible, especially in winter",
          ],
        },
      ],
    },
  },

  {
    key: "damaged",
    serviceName: {
      fr: "Achat de véhicule accidenté",
      en: "Damaged and written-off vehicle buying",
    },
    metaTitle: {
      fr: "Achat Auto Accidentée et Perte Totale | Comptant — Autos B2",
      en: "We Buy Damaged & Written-Off Cars | Cash — Autos B2",
    },
    metaDescription: {
      fr: "Votre véhicule est accidenté ou déclaré perte totale ? Autos B2 l'achète comptant, remorquage gratuit inclus. Offre ferme au téléphone, enlèvement souvent le jour même.",
      en: "Vehicle wrecked or written off? Autos B2 buys it for cash, free towing included. Firm offer on the phone, pickup often the same day.",
    },
    h1: {
      fr: "Achat d'auto accidentée et de perte totale",
      en: "We buy accident-damaged and written-off vehicles",
    },
    lede: {
      fr: "Après un accident, l'assureur déclare parfois le véhicule perte totale et vous laisse avec une carcasse à faire disparaître. C'est exactement ce qu'on achète.",
      en: "After a collision the insurer sometimes writes the vehicle off and leaves you with a wreck to get rid of. That's exactly what we buy.",
    },
    sections: {
      fr: [
        {
          h2: "Perte totale : ce que ça veut dire pour vous",
          body: [
            "Un assureur déclare une perte totale quand le coût des réparations dépasse la valeur du véhicule. Dans plusieurs cas, vous avez le choix de conserver l'épave — c'est ce qu'on appelle garder la valeur de récupération.",
            "Si vous la gardez, elle vous appartient, avec l'obligation de vous en débarrasser. Un véhicule accidenté a encore une valeur réelle : les pièces intactes, le catalyseur et le métal ne disparaissent pas parce que l'avant est enfoncé.",
          ],
        },
        {
          h2: "Ce qu'on achète, même très abîmé",
          list: [
            "Impact avant, arrière ou latéral, peu importe la sévérité",
            "Véhicule déclaré perte totale par l'assureur",
            "Auto avec dommages d'eau, de grêle ou de feu",
            "Véhicule non réparable ou dont l'inspection serait trop coûteuse",
            "Auto immobilisée depuis l'accident, sans roues ou sans direction",
          ],
        },
        {
          h2: "Comment on établit l'offre",
          body: [
            "On vous demande l'année, la marque, le modèle, l'endroit de l'impact et si le véhicule est complet — moteur, transmission, catalyseur en place. Ces informations suffisent pour donner un prix ferme au téléphone.",
            "Des photos aident, surtout pour un dommage important. Envoyez-les par WhatsApp au même numéro : c'est souvent plus rapide que de tout décrire.",
          ],
        },
        {
          h2: "La paperasse après un sinistre",
          body: [
            "Si l'assureur a déjà traité le dossier, gardez le document qui confirme votre décision de conserver le véhicule. Avec le certificat d'immatriculation, ça suffit dans la grande majorité des cas.",
            "On récupère la plaque, on remplit la cession et on vous remet le reçu officiel SAAQ à l'enlèvement, comme pour n'importe quel autre véhicule.",
          ],
        },
      ],
      en: [
        {
          h2: "What a write-off means for you",
          body: [
            "An insurer writes a vehicle off when the cost of repairs exceeds what the vehicle is worth. In many cases you have the option of keeping the wreck — retaining the salvage value.",
            "If you keep it, it's yours, along with the obligation to get rid of it. A wrecked vehicle still has real value: the undamaged parts, the converter and the metal don't disappear because the front end is caved in.",
          ],
        },
        {
          h2: "What we buy, however bad it looks",
          list: [
            "Front, rear or side impact, at any severity",
            "Vehicles written off by the insurer",
            "Cars with water, hail or fire damage",
            "Vehicles beyond repair or too expensive to re-certify",
            "Cars that haven't moved since the crash, with no wheels or no steering",
          ],
        },
        {
          h2: "How we work out the offer",
          body: [
            "We'll ask for the year, make, model, where the impact is, and whether the vehicle is complete — engine, transmission, converter still in place. That's enough to give a firm price on the phone.",
            "Photos help, especially with heavy damage. Send them by WhatsApp to the same number: it's usually faster than describing it all.",
          ],
        },
        {
          h2: "Paperwork after a claim",
          body: [
            "If the insurer has already settled, keep the document confirming your decision to retain the vehicle. Along with the registration certificate, that covers the large majority of cases.",
            "We take the plate, complete the release and hand you the official SAAQ receipt at pickup, exactly as with any other vehicle.",
          ],
        },
      ],
    },
  },

  {
    key: "trucks",
    serviceName: {
      fr: "Achat de camions, VUS et fourgonnettes",
      en: "Truck, SUV and van buying",
    },
    metaTitle: {
      fr: "Achat de Camion, VUS et Fourgonnette | Comptant — Autos B2",
      en: "We Buy Trucks, SUVs & Vans | Cash Paid — Autos B2",
    },
    metaDescription: {
      fr: "Autos B2 achète camionnettes, VUS, fourgonnettes et véhicules commerciaux légers, en état ou non. Argent comptant, remorquage gratuit, partout sur la Rive-Nord et à Laval.",
      en: "Autos B2 buys pickups, SUVs, vans and light commercial vehicles, running or not. Cash paid, free towing, across the North Shore and Laval.",
    },
    h1: {
      fr: "Achat de camions, VUS et fourgonnettes",
      en: "We buy trucks, SUVs and vans",
    },
    lede: {
      fr: "Les véhicules plus lourds valent généralement plus cher à la scrap : plus de métal, des pièces plus recherchées et un catalyseur souvent plus gros.",
      en: "Heavier vehicles are usually worth more as scrap: more metal, parts in higher demand, and often a larger catalytic converter.",
    },
    sections: {
      fr: [
        {
          h2: "Pourquoi un camion vaut plus qu'une berline",
          body: [
            "Le poids joue directement sur la valeur du métal, et une camionnette pleine grandeur pèse facilement le double d'une compacte. Les pièces de camions et de VUS se revendent aussi mieux : boîtes de transfert, différentiels, hayons, essieux et pare-chocs partent rapidement.",
            "C'est pour cette raison que le haut de notre fourchette — jusqu'à 3 000 $ — concerne presque toujours des camions, des VUS ou des fourgonnettes.",
          ],
        },
        {
          h2: "Ce qu'on ramasse",
          list: [
            "Camionnettes pleine grandeur et compactes",
            "VUS de toutes tailles",
            "Fourgonnettes familiales et fourgons de travail",
            "Véhicules commerciaux légers et véhicules de flotte",
            "Camions avec boîte endommagée, moteur mort ou transmission finie",
          ],
        },
        {
          h2: "Véhicules de travail et flottes",
          body: [
            "Si vous remplacez un véhicule de flotte ou videz une cour d'entrepreneur, dites-le en appelant. On peut souvent charger plus d'un véhicule dans le même déplacement, et on planifie l'enlèvement en dehors de vos heures d'opération pour ne pas bloquer votre stationnement.",
            "Le lettrage et les équipements installés ne posent pas de problème : on les retire au démantèlement.",
          ],
        },
        {
          h2: "Avant l'enlèvement",
          body: [
            "Videz la boîte et les compartiments — les outils oubliés dans un coffre latéral partent avec le véhicule et sont difficiles à récupérer ensuite. Gardez le certificat d'immatriculation et une pièce d'identité à portée de main pour la cession SAAQ.",
          ],
        },
      ],
      en: [
        {
          h2: "Why a truck is worth more than a sedan",
          body: [
            "Weight feeds straight into the metal value, and a full-size pickup easily weighs double a compact. Truck and SUV parts also resell better: transfer cases, differentials, tailgates, axles and bumpers move quickly.",
            "That's why the top of our range — up to $3,000 — almost always involves a truck, an SUV or a van.",
          ],
        },
        {
          h2: "What we collect",
          list: [
            "Full-size and compact pickups",
            "SUVs of every size",
            "Minivans and work vans",
            "Light commercial and fleet vehicles",
            "Trucks with a damaged box, a dead engine or a finished transmission",
          ],
        },
        {
          h2: "Work vehicles and fleets",
          body: [
            "If you're replacing a fleet vehicle or clearing a contractor's yard, say so when you call. We can often load more than one vehicle in the same trip, and we'll schedule pickup outside your operating hours so we don't block your lot.",
            "Lettering and installed equipment are not a problem — they come off at dismantling.",
          ],
        },
        {
          h2: "Before pickup",
          body: [
            "Empty the box and the compartments — tools left in a side locker leave with the vehicle and are hard to get back afterwards. Keep the registration certificate and photo ID handy for the SAAQ release.",
          ],
        },
      ],
    },
  },
];

export function serviceByKey(key: string): ServicePage | undefined {
  return SERVICES.find((s) => s.key === key);
}
