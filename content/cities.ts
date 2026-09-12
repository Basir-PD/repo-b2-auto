import type { Lang } from "@/config/routes";
import { hoursLong } from "@/config/site";

/**
 * Every city page is generated from this file. Adding a city is one entry —
 * the route, sitemap, hreflang cluster, service-area schema and internal links
 * all pick it up automatically.
 *
 * The copy blocks are NOT a template with the city name swapped in. Google
 * classifies that as doorway content and filters the whole set, so each city
 * gets its own distances, its own arteries and sectors, and its own pickup
 * window. Roughly 400+ words of genuinely distinct prose per city.
 *
 * Every city has an English twin. For a while only three did, which showed up
 * on the homepage as nine linked cities in French and three in English — the
 * same map, visibly thinner in one language. A city with no `en` slug drops
 * out of the English sitemap and emits no English hreflang, so the missing
 * six were not merely unlinked, they did not exist for an English search at
 * all. The English copy is written from the same verified facts as the
 * French — same distances, same arteries, same pickup windows — not machine
 * translated, because a translated doorway set is still a doorway set.
 */
export type CityCopy = {
  /** Unique opening, ~60 words. Sets the local scene. */
  lede: string;
  /** "Combien vaut votre auto ici" — ~90 words. */
  worth: string;
  /** Towing, route and arteries — ~90 words. */
  towing: string;
  /** What we buy here, with a local angle — ~80 words. */
  vehicles: string;
  /** SAAQ paperwork, ~70 words. */
  paperwork: string;
  /** City-specific FAQ about the typical pickup window. */
  faqQ: string;
  faqA: string;
};

export type City = {
  key: string;
  /** Display name, identical in both languages. */
  name: string;
  slug: { fr: string; en?: string };
  /** Approximate road distance and drive time from 340 Chemin Pincourt. */
  distanceKm: number;
  driveMinutes: number;
  /** Named sectors and neighbourhoods — the local-intent signal. */
  sectors: string[];
  /** Main artery or landmark someone there would recognise. */
  landmark: string;
  copy: { fr: CityCopy; en?: CityCopy };
};

export const CITIES: City[] = [
  {
    key: "mascouche",
    name: "Mascouche",
    slug: { fr: "cour-a-scrap-mascouche", en: "scrap-yard-mascouche" },
    distanceKm: 0,
    driveMinutes: 10,
    sectors: [
      "Vieux-Mascouche",
      "Mascouche Heights",
      "Domaine Bordeleau",
      "secteur de La Croisée",
      "parc industriel de Mascouche",
      "secteur du Golf",
    ],
    landmark: "la montée Masson et l'autoroute 640",
    copy: {
      fr: {
        lede: "Notre cour est à Mascouche, au 340 Chemin Pincourt. Pas de sous-traitant, pas d'intermédiaire à Montréal qui revend votre appel : quand vous nous téléphonez, vous parlez au recycleur qui va acheter votre véhicule, envoyer la remorqueuse et vous payer. C'est la ville où on opère depuis dix ans, et celle qu'on connaît le mieux.",
        worth:
          "Le montant qu'on offre dépend surtout du poids du véhicule, de son année, de la présence du convertisseur catalytique et de l'état des pièces encore réutilisables. Comme la cour est ici même, il n'y a aucun frais de déplacement à absorber sur un ramassage à Mascouche : ce que le marché du métal et des pièces vaut pour votre auto, vous le recevez au complet.",
        towing:
          "Un ramassage à Mascouche, c'est le trajet le plus court qu'on fait. Qu'on parte vers le Vieux-Mascouche, vers Mascouche Heights, vers le Domaine Bordeleau ou vers les rues résidentielles au nord de la montée Masson, la remorqueuse est chez vous en une quinzaine de minutes. On récupère aussi les véhicules stationnés dans le parc industriel, dans les cours arrière et dans les stationnements de condos — un plateau bas passe là où une dépanneuse ordinaire ne passe pas.",
        vehicles:
          "On achète tout ce qui roule et surtout tout ce qui ne roule plus : autos immobilisées depuis des années dans une entrée, véhicules déclarés perte totale par l'assureur après un accident sur la 640, camionnettes de chantier au bout de leur vie, VUS trop rouillés pour repasser l'inspection. Sans moteur, sans transmission, sans roues, sans clés : ça se ramasse pareil.",
        paperwork:
          "On s'occupe du transfert SAAQ sur place. On récupère la plaque, on remplit la cession et on vous remet le reçu officiel avant de partir avec le véhicule. C'est ce document qui prouve que l'auto n'est plus à vous et qui vous permet d'arrêter de payer l'immatriculation dès maintenant.",
        faqQ: "Ça prend combien de temps pour un ramassage à Mascouche ?",
        faqA: `Souvent la journée même. Comme la cour est au 340 Chemin Pincourt, un appel le matin donne presque toujours un enlèvement en après-midi, et un appel en fin de journée est ramassé le lendemain matin. On est ${hoursLong("fr").toLowerCase()}.`,
      },
      en: {
        lede: "Our yard is in Mascouche, at 340 Chemin Pincourt. No subcontractor, no Montreal middleman reselling your call: when you phone us, you are talking to the recycler who will buy the vehicle, send the tow truck and hand you the money. This is the city we have worked in for ten years, and the one we know best.",
        worth:
          "What we offer depends mostly on the vehicle's weight, its year, whether the catalytic converter is still on it, and the condition of any reusable parts. Because the yard is right here, there is no travel cost to absorb on a Mascouche pickup — whatever the metal and the parts are worth, you get all of it.",
        towing:
          "A Mascouche pickup is the shortest run we make. Whether we are heading into Vieux-Mascouche, up to Mascouche Heights, into Domaine Bordeleau or onto the residential streets north of Montée Masson, the tow truck is at your door in about fifteen minutes. We also pull vehicles out of the industrial park, out of back yards and out of condo lots — a low flatbed gets in where a standard wrecker cannot.",
        vehicles:
          "We buy anything that runs and, more to the point, everything that doesn't: cars that have sat in a driveway for years, vehicles written off by the insurer after a crash on the 640, work pickups at the end of their life, SUVs too rusted to pass inspection again. No engine, no transmission, no wheels, no keys — it still gets picked up.",
        paperwork:
          "We handle the SAAQ transfer on site. We take the plate, complete the release and hand you the official receipt before the vehicle leaves. That document is what proves the car is no longer yours and lets you stop paying registration immediately.",
        faqQ: "How fast is a pickup in Mascouche?",
        faqA: `Usually the same day. With the yard at 340 Chemin Pincourt, a morning call almost always means an afternoon pickup, and a late-day call gets collected the next morning. We are ${hoursLong("en").toLowerCase()}.`,
      },
    },
  },

  {
    key: "terrebonne",
    name: "Terrebonne",
    slug: { fr: "cour-a-scrap-terrebonne", en: "scrap-car-terrebonne" },
    distanceKm: 9,
    driveMinutes: 15,
    sectors: ["Vieux-Terrebonne", "Lachenaie", "La Plaine", "secteur des Seigneurs"],
    landmark: "l'Île-des-Moulins et le boulevard des Seigneurs",
    copy: {
      fr: {
        lede: "Terrebonne est la ville voisine de notre cour : une dizaine de kilomètres par la montée Masson ou la 640, et on y est. C'est de loin le secteur d'où on reçoit le plus d'appels après Mascouche, autant du Vieux-Terrebonne que de Lachenaie et de La Plaine, qui sont trois réalités bien différentes quand vient le temps de sortir un véhicule mort.",
        worth:
          "Le prix se calcule de la même façon partout : poids, année, convertisseur catalytique, pièces récupérables. Donnez-nous l'année, la marque, le modèle et l'état réel au téléphone et vous repartez avec un prix ferme en quelques minutes. Ce prix-là ne bouge pas quand la remorqueuse arrive, tant que les informations données étaient exactes.",
        towing:
          "Dans le Vieux-Terrebonne, les rues sont étroites et les entrées sont courtes : on envoie le plateau plutôt que la dépanneuse à crochet, ce qui évite les manœuvres serrées près de l'Île-des-Moulins. À Lachenaie et le long du boulevard des Seigneurs, l'accès est direct par la 640. À La Plaine, on couvre jusqu'aux rangs et aux terrains plus grands au nord, où beaucoup de véhicules dorment derrière la maison depuis des années.",
        vehicles:
          "Autos qui ne démarrent plus, véhicules accidentés sur la 640 ou la montée Masson, VUS et camionnettes, fourgonnettes de travailleurs autonomes, et beaucoup de deuxièmes voitures que plus personne ne conduit mais que le propriétaire immatricule encore par habitude. Une auto trop rouillée pour l'inspection vaut encore quelque chose chez nous.",
        paperwork:
          "Le transfert se fait à l'enlèvement : plaque récupérée, cession signée, reçu officiel remis en main propre. Vous n'avez aucun déplacement à faire dans un point de service SAAQ, et vous cessez de payer l'immatriculation d'un véhicule que vous n'avez plus.",
        faqQ: "Combien de temps entre l'appel et l'enlèvement à Terrebonne ?",
        faqA: "Généralement le jour même ou le lendemain. Terrebonne est à une quinzaine de minutes de la cour, alors on l'insère facilement dans la route de la journée. Pour le Vieux-Terrebonne, on s'entend d'avance sur une heure précise, parce que le stationnement dans les rues étroites demande un peu de coordination.",
      },
      en: {
        lede: "Terrebonne is the city next door to our yard: about nine kilometres by Montée Masson or the 640. After Mascouche it is where most of our calls come from — from Vieux-Terrebonne, from Lachenaie and from La Plaine, which are three quite different propositions when it comes to getting a dead vehicle out.",
        worth:
          "The price is worked out the same way everywhere: weight, year, catalytic converter, recoverable parts. Give us the year, make, model and honest condition on the phone and you get a firm price in minutes. That price does not move when the tow truck arrives, as long as what you told us was accurate.",
        towing:
          "In Vieux-Terrebonne the streets are narrow and the driveways are short, so we send the flatbed rather than a hook truck, which avoids tight manoeuvring near Île-des-Moulins. In Lachenaie and along boulevard des Seigneurs, access is straight off the 640. In La Plaine we cover out to the larger lots and rangs to the north, where plenty of vehicles have been sitting behind the house for years.",
        vehicles:
          "Cars that no longer start, vehicles wrecked on the 640 or Montée Masson, SUVs and pickups, tradespeople's vans, and a lot of second cars nobody drives any more but the owner still registers out of habit. A car too rusted for inspection is still worth something to us.",
        paperwork:
          "The transfer happens at pickup: plate taken, release signed, official receipt handed to you. You make no trip to a SAAQ service point, and you stop paying registration on a vehicle you no longer own.",
        faqQ: "How long from the call to the pickup in Terrebonne?",
        faqA: "Usually same day or next day. Terrebonne is about fifteen minutes from the yard, so it slots easily into the day's route. For Vieux-Terrebonne we agree on a specific time in advance, because parking on the narrow streets takes a bit of coordination.",
      },
    },
  },

  {
    key: "repentigny",
    name: "Repentigny",
    slug: { fr: "rachat-auto-repentigny", en: "junk-car-removal-repentigny" },
    distanceKm: 17,
    driveMinutes: 20,
    sectors: ["Le Gardeur", "Vieux-Repentigny", "secteur Iberville", "secteur Brien"],
    landmark: "le boulevard Iberville et les Galeries Rive Nord",
    copy: {
      fr: {
        lede: "Repentigny est à une vingtaine de minutes de la cour par la 640 puis la 40. On y descend plusieurs fois par semaine, autant dans le Vieux-Repentigny le long du fleuve que dans Le Gardeur et dans les quartiers résidentiels qui se sont développés autour du boulevard Brien.",
        worth:
          "Poids, année, convertisseur catalytique, pièces réutilisables : c'est ce qui détermine le montant. On donne un prix ferme au téléphone à partir des informations que vous fournissez, et c'est ce montant-là qui vous est remis comptant au moment de l'enlèvement — pas un prix « à confirmer sur place ».",
        towing:
          "Le trajet passe par la 640 est puis la 40, ce qui rend l'accès rapide à tout le secteur Iberville et aux rues autour des Galeries Rive Nord. Dans le Vieux-Repentigny, les terrains près de la rue Notre-Dame sont souvent longs et étroits ; le plateau permet de sortir un véhicule immobilisé au fond d'une entrée sans abîmer l'asphalte ni le gazon. À Le Gardeur, on couvre jusqu'aux limites de Charlemagne.",
        vehicles:
          "Beaucoup de véhicules familiaux en fin de vie, de VUS à haut kilométrage et d'autos accidentées sur la 40. On achète aussi les fourgonnettes commerciales, les camionnettes et les véhicules déclarés perte totale par l'assureur, y compris ceux qui n'ont plus ni moteur ni transmission.",
        paperwork:
          "On récupère la plaque, on remplit la cession et on vous laisse le reçu officiel SAAQ à l'enlèvement. C'est la preuve dont vous avez besoin pour que le véhicule cesse d'être à votre nom et pour arrêter d'en payer l'immatriculation.",
        faqQ: "Quel est le délai habituel pour un enlèvement à Repentigny ?",
        faqA: "Le plus souvent dans les 24 heures. On planifie généralement les ramassages de Repentigny et du Gardeur dans le même bloc horaire pour limiter les allers-retours sur la 40, alors on vous propose une plage de deux heures plutôt qu'une heure fixe.",
      },
      en: {
        lede: "Repentigny is about twenty minutes from the yard by the 640 and then the 40. We come down several times a week — into Vieux-Repentigny along the river, into Le Gardeur, and into the residential streets that grew up around boulevard Brien.",
        worth:
          "Weight, year, catalytic converter, reusable parts: that is what sets the amount. We give a firm price on the phone from what you tell us, and that is the amount handed to you in cash at pickup — not a price to be confirmed on site.",
        towing:
          "The run is the 640 east then the 40, which puts the whole Iberville sector and the streets around Galeries Rive Nord within easy reach. In Vieux-Repentigny the lots near rue Notre-Dame are often long and narrow; the flatbed pulls a dead vehicle out from the back of a driveway without tearing up the asphalt or the lawn. In Le Gardeur we cover right out to the Charlemagne line.",
        vehicles:
          "A lot of family vehicles at the end of their life, high-mileage SUVs and cars wrecked on the 40. We also buy commercial vans, pickups and insurer write-offs, including the ones with no engine and no transmission left in them.",
        paperwork:
          "We take the plate, complete the release and leave you the official SAAQ receipt at pickup. That is the proof you need for the vehicle to stop being in your name and for the registration to stop costing you.",
        faqQ: "How long is the usual wait for a pickup in Repentigny?",
        faqA: "Most often within 24 hours. We generally schedule Repentigny and Le Gardeur pickups in the same block to limit the back-and-forth on the 40, so we will offer you a two-hour window rather than a fixed time.",
      },
    },
  },

  {
    key: "laval",
    name: "Laval",
    slug: { fr: "rachat-auto-laval", en: "cash-for-cars-laval" },
    distanceKm: 24,
    driveMinutes: 25,
    sectors: [
      "Sainte-Rose",
      "Vimont",
      "Auteuil",
      "Duvernay",
      "Saint-François",
      "Chomedey",
      "Laval-des-Rapides",
      "Fabreville",
    ],
    landmark: "l'autoroute 440 et le boulevard des Laurentides",
    copy: {
      fr: {
        lede: "Pour du scrap auto à Laval, on se déplace — mais notre cour reste à Mascouche, au 340 Chemin Pincourt. On traverse par la 640 ouest ou la 25, ce qui met la plupart des secteurs lavallois à environ vingt-cinq minutes. C'est un grand territoire, et l'accès n'a rien à voir entre Saint-François et Chomedey.",
        worth:
          "Le recyclage automobile à Laval se calcule comme ailleurs : poids du véhicule, année, convertisseur catalytique, pièces encore bonnes. On confirme le montant au téléphone avant de se déplacer, pour que personne ne perde son temps — ni vous à attendre, ni nous à envoyer une remorqueuse pour un véhicule qui n'était pas celui décrit.",
        towing:
          "Dans l'est lavallois — Saint-François, Duvernay, Saint-Vincent-de-Paul — on arrive directement par la 25 et le boulevard Lévesque. Pour Vimont, Auteuil et Sainte-Rose, on passe par la 440 et le boulevard des Laurentides. Chomedey et Laval-des-Rapides, plus denses, demandent souvent un enlèvement planifié en dehors des heures de pointe : le plateau a besoin d'un espace dégagé, ce qui est plus simple en matinée dans les stationnements d'immeubles.",
        vehicles:
          "Autos qui ne démarrent plus, véhicules accidentés sur la 440 ou la 15, VUS et camionnettes, fourgonnettes commerciales, et beaucoup de véhicules laissés dans des stationnements de logements locatifs. Sans papiers en main, sans clés, trop rouillés pour l'inspection : on regarde chaque cas et on l'achète quand même dans la grande majorité des situations.",
        paperwork:
          "Même procédure qu'ailleurs : plaque récupérée, cession remplie, reçu officiel remis sur place à l'enlèvement. Vous n'avez pas à vous déplacer dans un point de service, et l'immatriculation cesse de courir à votre nom.",
        faqQ: "Vous ramassez partout à Laval, et dans quel délai ?",
        faqA: "Oui, dans tous les secteurs, de Sainte-Rose à Saint-François — c'est notre service d'auto recyclage Laval au complet. Le délai typique est de 24 à 48 heures parce qu'on regroupe les ramassages lavallois par secteur plutôt que de traverser la ville plusieurs fois dans la journée. Si c'est urgent, dites-le en appelant : il reste souvent une place le jour même.",
      },
      en: {
        lede: "Laval is a service area for us, not our address: the yard stays in Mascouche, at 340 Chemin Pincourt, and we are the junk car buyer that drives to you. We cross by the 640 west or the 25, which puts most Laval sectors about twenty-five minutes out. It is a large territory, and access is nothing alike between Saint-François and Chomedey.",
        worth:
          "The maths does not change from one city to the next: vehicle weight, year, catalytic converter, parts still worth pulling. We confirm the amount on the phone before we drive out, so nobody wastes a trip — not you waiting, and not us sending a tow truck for a vehicle that wasn't the one described.",
        towing:
          "Scrap car removal in east Laval — Saint-François, Duvernay, Saint-Vincent-de-Paul — comes straight in on the 25 and boulevard Lévesque. For Vimont, Auteuil and Sainte-Rose we take the 440 and boulevard des Laurentides. Chomedey and Laval-des-Rapides are denser and often need a pickup scheduled outside rush hour: the flatbed needs clear space, which is easier to find mid-morning in apartment lots.",
        vehicles:
          "Cars that no longer start, vehicles wrecked on the 440 or the 15, SUVs and pickups, commercial vans, and a lot of vehicles abandoned in rental-building parking lots. No paperwork in hand, no keys, too rusted for inspection — we look at each case and in the large majority of them we still buy it.",
        paperwork:
          "Same procedure as everywhere: plate taken, release completed, official receipt handed over at pickup. You make no trip to a service point, and the registration stops running in your name.",
        faqQ: "Do you pick up everywhere in Laval, and how quickly?",
        faqA: "Yes, every sector, from Sainte-Rose to Saint-François. The typical window is 24 to 48 hours because we group Laval pickups by sector rather than crossing the city several times in a day. If it is urgent, say so when you call — there is often still a slot the same day.",
      },
    },
  },

  {
    key: "lassomption",
    name: "L'Assomption",
    slug: { fr: "rachat-auto-lassomption", en: "scrap-car-lassomption" },
    distanceKm: 22,
    driveMinutes: 25,
    sectors: ["Vieux L'Assomption", "Saint-Gérard-Majella", "secteur de la rivière"],
    landmark: "le boulevard L'Ange-Gardien et le Collège de L'Assomption",
    copy: {
      fr: {
        lede: "L'Assomption est à environ vingt-cinq minutes de la cour, par la 640 puis la 40 ou par la route 343. C'est un secteur où les terrains sont plus grands qu'en banlieue dense, et où on retrouve souvent des véhicules remisés depuis longtemps derrière une maison ou dans une grange.",
        worth:
          "Le montant dépend du poids, de l'année, du convertisseur catalytique et des pièces récupérables. Un véhicule remisé depuis dix ans vaut encore quelque chose — le métal a une valeur peu importe depuis combien de temps l'auto ne bouge plus. Appelez avec l'année, la marque et le modèle et on vous donne un prix ferme.",
        towing:
          "On entre par le boulevard L'Ange-Gardien pour le secteur du Vieux L'Assomption et par la route 343 pour Saint-Gérard-Majella et les rangs. Sur les grands terrains, la difficulté n'est pas la distance mais le sol : un véhicule enfoncé dans la terre ou entouré de végétation demande un treuil et un peu plus de temps. Dites-le nous au téléphone pour qu'on prévoie l'équipement en conséquence.",
        vehicles:
          "Beaucoup de véhicules agricoles légers, de camionnettes de travail, de VUS à haut kilométrage et d'autos immobilisées depuis des années. On achète aussi les véhicules accidentés et les pertes totales déclarées, avec ou sans moteur.",
        paperwork:
          "On récupère la plaque, on signe la cession avec vous et on vous remet le reçu officiel SAAQ avant de partir. Si les papiers ont été perdus dans un déménagement ou un décès dans la famille, appelez-nous : on vous explique exactement quoi obtenir avant qu'on se déplace.",
        faqQ: "Vous vous déplacez jusque dans les rangs de L'Assomption ?",
        faqA: "Oui. On ramasse autant en secteur urbain que dans les rangs. Le délai habituel est de 24 à 48 heures, et on prévoit une plage horaire un peu plus large pour les adresses rurales, parce qu'un véhicule immobilisé sur un terrain meuble prend plus de temps à sortir qu'un véhicule dans une entrée asphaltée.",
      },
      en: {
        lede: "L'Assomption is about twenty-five minutes from the yard, by the 640 and then the 40, or by route 343. The lots here are bigger than in the dense suburbs, and it is a place where vehicles have often been parked up behind a house or inside a barn for a very long time.",
        worth:
          "The amount depends on weight, year, catalytic converter and recoverable parts. A vehicle stored for ten years is still worth something: the metal has a value no matter how long the car has sat. Call with the year, make and model and we give you a firm price.",
        towing:
          "We come in on boulevard L'Ange-Gardien for Vieux L'Assomption, and on route 343 for Saint-Gérard-Majella and the rangs. On a large property the problem is not the distance, it is the ground: a vehicle sunk into soft earth or grown over with vegetation needs a winch and a bit more time. Tell us on the phone so we bring the right equipment.",
        vehicles:
          "Plenty of light farm vehicles, work pickups, high-mileage SUVs and cars that have not moved in years. We also buy wrecked vehicles and declared write-offs, with or without an engine.",
        paperwork:
          "We take the plate, sign the release with you and hand over the official SAAQ receipt before we leave. If the paperwork went missing in a move or after a death in the family, call us: we will tell you exactly what to get before we drive out.",
        faqQ: "Do you come out to the rangs in L'Assomption?",
        faqA: "Yes. We pick up in the village and out on the rangs alike. The usual window is 24 to 48 hours, and we allow a slightly wider slot for rural addresses, because a vehicle stuck on soft ground takes longer to get out than one sitting on a paved driveway.",
      },
    },
  },

  {
    key: "blainville",
    name: "Blainville",
    slug: { fr: "rachat-auto-blainville", en: "scrap-car-removal-blainville" },
    distanceKm: 27,
    driveMinutes: 28,
    sectors: ["Fontainebleau", "Chante-Bois", "Notre-Dame", "secteur du Plateau"],
    landmark: "le boulevard du Curé-Labelle et l'autoroute 640",
    copy: {
      fr: {
        lede: "Blainville est à l'autre bout de la 640 par rapport à notre cour : une trentaine de kilomètres vers l'ouest, environ vingt-huit minutes de route. On y ramasse régulièrement, surtout dans les quartiers résidentiels de Fontainebleau et de Chante-Bois où les entrées doubles cachent souvent une deuxième auto qui ne roule plus.",
        worth:
          "Le prix se calcule sur le poids, l'année, le convertisseur catalytique et les pièces encore utilisables. On confirme le montant au téléphone avant de faire la route, parce qu'un déplacement de trente kilomètres n'a de sens ni pour vous ni pour nous si le véhicule n'est pas celui qui a été décrit.",
        towing:
          "L'accès se fait par la 640 ouest, puis par le boulevard du Curé-Labelle pour la partie centrale de la ville et par la 15 pour le secteur nord. Les quartiers plus récents ont des rues larges et des entrées dégagées, ce qui rend le chargement rapide. Pour un véhicule dans un garage ou coincé derrière une autre auto, prévenez-nous : on planifie une plage horaire plus longue.",
        vehicles:
          "Autos familiales en fin de vie, VUS à haut kilométrage, véhicules accidentés sur la 640 ou la 15, camionnettes de chantier. Comme partout, on prend aussi les véhicules sans moteur, sans transmission ou déclarés perte totale.",
        paperwork:
          "Plaque récupérée, cession remplie, reçu officiel remis sur place : le transfert SAAQ est réglé à l'enlèvement et vous n'avez pas à vous déplacer.",
        faqQ: "Quel est le délai pour un ramassage à Blainville ?",
        faqA: "Habituellement 24 à 48 heures. Blainville est notre point le plus à l'ouest sur la 640, alors on regroupe ces ramassages avec ceux de Bois-des-Filion et de Sainte-Thérèse dans la même sortie. Ça veut dire une plage horaire à convenir plutôt qu'un passage à l'improviste.",
      },
      en: {
        lede: "Blainville sits at the far end of the 640 from our yard: about thirty kilometres west, roughly twenty-eight minutes of road. We collect there regularly, mostly in the Fontainebleau and Chante-Bois neighbourhoods, where a double driveway often hides a second car that no longer runs.",
        worth:
          "The price comes off weight, year, catalytic converter and the parts still worth pulling. We confirm the amount on the phone before making the drive, because a thirty-kilometre run makes sense for neither of us if the vehicle is not the one that was described.",
        towing:
          "Access is the 640 west, then boulevard du Curé-Labelle for the middle of the city and the 15 for the north end. The newer neighbourhoods have wide streets and clear driveways, which makes loading quick. For a vehicle in a garage or boxed in behind another car, tell us in advance and we plan a longer slot.",
        vehicles:
          "Family cars at the end of the line, high-mileage SUVs, vehicles wrecked on the 640 or the 15, work pickups. As everywhere, we also take vehicles with no engine, no transmission, or declared a total loss.",
        paperwork:
          "Plate taken, release completed, official receipt handed over on the spot: the SAAQ transfer is settled at pickup and you go nowhere to do it.",
        faqQ: "How long for a pickup in Blainville?",
        faqA: "Usually 24 to 48 hours. Blainville is our furthest point west on the 640, so we group these pickups with Bois-des-Filion and Sainte-Thérèse on the same run. That means a time slot agreed in advance rather than an unannounced visit.",
      },
    },
  },

  {
    key: "saint-lin",
    name: "Saint-Lin-Laurentides",
    slug: { fr: "rachat-auto-saint-lin", en: "sell-scrap-car-saint-lin" },
    distanceKm: 28,
    driveMinutes: 30,
    sectors: ["secteur Saint-Lin", "secteur Laurentides", "rangs environnants"],
    landmark: "la route 335 et la rue Saint-Isidore",
    copy: {
      fr: {
        lede: "Saint-Lin-Laurentides est à une trentaine de minutes au nord de la cour, par la 25 puis la route 335. C'est le secteur le plus rural qu'on dessert régulièrement, et la réalité y est différente : beaucoup de véhicules y sont remisés depuis très longtemps sur de grands terrains, parfois plusieurs sur la même propriété.",
        worth:
          "Le montant dépend du poids, de l'année, du convertisseur catalytique et des pièces récupérables. Si vous avez plus d'un véhicule à faire disparaître, dites-le en appelant : on peut souvent en charger deux dans le même déplacement, ce qui change le calcul en votre faveur.",
        towing:
          "On monte par la route 335 et on rejoint la rue Saint-Isidore pour le cœur du village, puis les rangs pour les adresses plus éloignées. Sur un terrain non asphalté, un véhicule qui n'a pas bougé depuis des années a souvent les roues enfoncées ou bloquées ; c'est un treuil, pas un simple chargement. Mentionnez-le au téléphone et on arrive équipés du premier coup.",
        vehicles:
          "Camionnettes de travail, véhicules agricoles légers, VUS, autos remisées, véhicules accidentés. Sans moteur, sans roues, sans clés ou sans papiers en main : on regarde chaque cas et on trouve presque toujours une façon de l'acheter.",
        paperwork:
          "On remplit la cession SAAQ avec vous sur place, on récupère la plaque et on vous laisse le reçu officiel. Pour un véhicule remisé depuis longtemps ou hérité, appelez avant : il y a parfois une étape à faire de votre côté et on vous explique laquelle.",
        faqQ: "Vous montez jusqu'à Saint-Lin-Laurentides pour un seul véhicule ?",
        faqA: "Oui. Le délai est généralement de 48 heures parce qu'on planifie la montée vers Saint-Lin sur des journées précises plutôt qu'à la demande. Si vous avez deux véhicules ou plus, on s'organise plus vite — un déplacement qui charge deux autos se justifie tout seul.",
      },
      en: {
        lede: "Saint-Lin-Laurentides is about thirty minutes north of the yard, by the 25 and then route 335. It is the most rural area we serve regularly, and it works differently: many vehicles here have been sitting on large properties for a very long time, sometimes several on the same lot.",
        worth:
          "The amount depends on weight, year, catalytic converter and recoverable parts. If you have more than one vehicle to get rid of, say so when you call: we can often load two on the same trip, which changes the arithmetic in your favour.",
        towing:
          "We come up route 335 and take rue Saint-Isidore for the middle of the village, then the rangs for the addresses further out. On unpaved ground a vehicle that has not moved in years usually has its wheels sunk or seized; that is a winch job, not a straight load. Mention it on the phone and we arrive equipped the first time.",
        vehicles:
          "Work pickups, light farm vehicles, SUVs, stored cars, wrecked vehicles. No engine, no wheels, no keys, or no paperwork in hand — we look at each case and almost always find a way to buy it.",
        paperwork:
          "We complete the SAAQ release with you on site, take the plate and leave you the official receipt. For a vehicle stored a long time or inherited, call first: there is sometimes one step to take on your side, and we will tell you which one.",
        faqQ: "Will you come up to Saint-Lin-Laurentides for a single vehicle?",
        faqA: "Yes. The window is generally 48 hours, because we plan the run up to Saint-Lin on set days rather than on demand. With two vehicles or more we move faster — a trip that loads two cars pays for itself.",
      },
    },
  },

  {
    key: "bois-des-filion",
    name: "Bois-des-Filion",
    slug: { fr: "rachat-auto-bois-des-filion", en: "scrap-yard-bois-des-filion" },
    distanceKm: 19,
    driveMinutes: 20,
    sectors: ["secteur du boulevard Adolphe-Chapleau", "secteur de la rivière des Mille Îles"],
    landmark: "le pont Athanase-David et l'autoroute 640",
    copy: {
      fr: {
        lede: "Bois-des-Filion est directement sur notre route ouest : une vingtaine de minutes par la 640. C'est une petite ville, coincée entre la rivière des Mille Îles et l'autoroute, et on la dessert dans la même sortie que Rosemère et Sainte-Thérèse.",
        worth:
          "Comme partout, le prix repose sur le poids, l'année, le convertisseur catalytique et les pièces réutilisables. On donne un prix ferme au téléphone à partir de l'année, de la marque, du modèle et de l'état réel du véhicule.",
        towing:
          "L'accès se fait par la sortie de la 640 puis par le boulevard Adolphe-Chapleau. Les rues résidentielles près de la rivière sont étroites et plusieurs entrées descendent vers la maison, ce qui rend le plateau plus pratique qu'une dépanneuse à crochet : on tire le véhicule vers la rue plutôt que de manœuvrer dans une pente. Si le véhicule est près du pont Athanase-David aux heures de pointe, on planifie plutôt en milieu de journée.",
        vehicles:
          "Autos qui ne démarrent plus, deuxièmes véhicules laissés à l'abandon, VUS, camionnettes, véhicules accidentés et pertes totales. Trop rouillé pour l'inspection, sans moteur ou sans clés : ça se ramasse pareil.",
        paperwork:
          "Plaque récupérée, cession signée, reçu officiel SAAQ remis à l'enlèvement. Vous cessez de payer l'immatriculation dès que le véhicule quitte votre entrée.",
        faqQ: "Bois-des-Filion est une petite ville — vous vous déplacez quand même ?",
        faqA: "Oui, régulièrement. Bois-des-Filion est sur notre trajet vers l'ouest de la 640, alors le délai est court : souvent le jour même, sinon le lendemain. C'est un des secteurs où on peut le plus facilement s'ajuster à votre horaire.",
      },
      en: {
        lede: "Bois-des-Filion is directly on our route west: about twenty minutes on the 640. It is a small town, wedged between the Rivière des Mille Îles and the highway, and we serve it on the same run as Rosemère and Sainte-Thérèse.",
        worth:
          "As everywhere, the price rests on weight, year, catalytic converter and reusable parts. We give a firm price on the phone from the year, the make, the model and the vehicle's real condition.",
        towing:
          "We come off the 640 exit and take boulevard Adolphe-Chapleau. The residential streets near the river are narrow and several driveways slope down toward the house, which makes a flatbed more practical than a hook truck: we pull the vehicle out to the street rather than manoeuvring on a slope. If the vehicle is near the Athanase-David bridge, we schedule mid-day rather than at rush hour.",
        vehicles:
          "Cars that no longer start, second vehicles left to sit, SUVs, pickups, wrecked vehicles and total losses. Too rusted for inspection, no engine or no keys — it still gets picked up.",
        paperwork:
          "Plate taken, release signed, official SAAQ receipt handed over at pickup. You stop paying registration the moment the vehicle leaves your driveway.",
        faqQ: "Bois-des-Filion is a small town — do you still come out?",
        faqA: "Yes, regularly. Bois-des-Filion is on our way west along the 640, so the wait is short: often the same day, otherwise the next. It is one of the areas where we can most easily fit your schedule.",
      },
    },
  },

  {
    key: "montreal-est",
    name: "Montréal-Est",
    slug: { fr: "rachat-auto-montreal-est", en: "scrap-car-buyer-montreal-est" },
    distanceKm: 26,
    driveMinutes: 30,
    sectors: [
      "Montréal-Est",
      "Pointe-aux-Trembles",
      "Rivière-des-Prairies",
      "Anjou",
      "Montréal-Nord",
    ],
    landmark: "la rue Notre-Dame et l'autoroute 40",
    copy: {
      fr: {
        lede: "Pour du scrap auto à Montréal, l'est de l'île est la limite sud de notre zone de service : environ trente minutes par la 25 puis la 40. On y couvre Montréal-Est comme tel, mais aussi Pointe-aux-Trembles, Rivière-des-Prairies, Anjou et Montréal-Nord, qui sont dans le même corridor.",
        worth:
          "Poids, année, convertisseur catalytique, pièces encore bonnes : voilà ce qui fixe le montant. On confirme le prix au téléphone avant de descendre, et il ne change pas à l'arrivée de la remorqueuse tant que le véhicule correspond à ce qui a été décrit.",
        towing:
          "On arrive par la 40 et on rejoint la rue Notre-Dame ou le boulevard Henri-Bourassa selon le secteur. La contrainte principale dans l'est de l'île, ce n'est pas la distance mais le stationnement : rues à sens unique, ruelles, places réservées, immeubles à logements sans entrée privée. On planifie donc une heure précise plutôt qu'une plage large, et on vous demande de libérer l'espace devant le véhicule si c'est possible.",
        vehicles:
          "Autos immobilisées en rue ou en ruelle, véhicules accidentés sur la 40 ou la 25, fourgonnettes commerciales, camionnettes, VUS. On achète aussi les véhicules sans papiers en main, en vous guidant sur ce qu'il faut obtenir avant l'enlèvement.",
        paperwork:
          "On récupère la plaque, on remplit la cession et on vous remet le reçu officiel sur place. C'est ce document qui met fin à votre immatriculation — gardez-le.",
        faqQ: "Vous descendez vraiment jusqu'à Montréal-Est et Pointe-aux-Trembles ?",
        faqA: "Oui, c'est notre limite sud et on y va plusieurs fois par semaine. Le délai est généralement de 24 à 48 heures, avec une heure d'arrivée fixée d'avance plutôt qu'une plage : dans l'est de l'île, le stationnement se planifie, sinon la remorqueuse tourne en rond.",
      },
      en: {
        lede: "The east end of the island is the southern edge of our service area: about thirty minutes by the 25 and then the 40. We cover Montréal-Est itself, and also Pointe-aux-Trembles, Rivière-des-Prairies, Anjou and Montréal-Nord, which sit in the same corridor.",
        worth:
          "Weight, year, catalytic converter, parts still worth pulling: those four set the amount. We confirm the price on the phone before driving down, and it does not change when the tow truck arrives, as long as the vehicle matches what was described.",
        towing:
          "We come in on the 40 and pick up rue Notre-Dame or boulevard Henri-Bourassa depending on the sector. The constraint in the east end is not distance, it is parking: one-way streets, back lanes, reserved spaces, apartment buildings with no private driveway. So we set a specific arrival time rather than a wide window, and we ask you to clear the space in front of the vehicle if you can.",
        vehicles:
          "Cars stranded on the street or in a lane, vehicles wrecked on the 40 or the 25, commercial vans, pickups, SUVs. We also buy vehicles with no paperwork in hand, walking you through what has to be obtained before the pickup.",
        paperwork:
          "We take the plate, complete the release and hand you the official receipt on the spot. That document is what ends your registration — keep it.",
        faqQ: "Do you really come all the way down to Montréal-Est and Pointe-aux-Trembles?",
        faqA: "Yes, it is our southern limit and we are there several times a week. The window is generally 24 to 48 hours, with an arrival time fixed in advance rather than a range: in the east end, parking has to be planned or the tow truck ends up circling.",
      },
    },
  },
];

export function cityByKey(key: string): City | undefined {
  return CITIES.find((c) => c.key === key);
}

/** Cities that have a page in this language. */
export function citiesFor(lang: Lang): City[] {
  return CITIES.filter((c) => Boolean(c.slug[lang]));
}
