import { CheckCircle2, Clock, DollarSign, Truck, ShieldCheck, Leaf } from "lucide-react";

export type Language = 'en' | 'fr';

export const translations = {
  en: {
    header: {
      services: "Services",
      about: "About Us",
      faq: "FAQ",
      getOffer: "Get Offer",
    },
    hero: {
      badge: "Buying cars 7 days a week",
      title: "Turn Your Car Into",
      titleHighlight: "Instant Cash",
      description: "We buy all types of vehicles in any condition. Get a free quote in minutes, free towing included, and immediate payment on the spot.",
      cta: "Get My Free Offer",
      call: "Call +1 (514) 623-2787",
      benefits: {
        price: "Best Price Guaranteed",
        towing: "Free Towing Included",
        paid: "Paid on the Spot",
      }
    },
    services: {
      title: "Why Choose B2 Auto?",
      subtitle: "We make selling your car simple, fast, and profitable. Experience the premium difference.",
      items: [
        {
          title: "Instant Cash Offer",
          description: "Get a competitive offer for your vehicle in minutes. We pay top dollar for all makes and models.",
        },
        {
          title: "Free Towing",
          description: "We come to you! Enjoy complimentary towing service anywhere in the Greater Montreal area.",
        },
        {
          title: "Same-Day Payment",
          description: "Walk away with cash in hand. We handle all the paperwork and payment on the spot.",
        },
        {
          title: "All Conditions Accepted",
          description: "Running or not, damaged, wrecked, or just old - we buy cars in absolutely any condition.",
        },
        {
          title: "Eco-Friendly Recycling",
          description: "We follow strict environmental guidelines to ensure your vehicle is recycled responsibly.",
        },
        {
          title: "Professional Service",
          description: "Our licensed and insured team provides a safe, transparent, and hassle-free experience.",
        }
      ]
    },
    about: {
      title: "More Than Just a",
      titleHighlight: "Scrap Yard",
      p1: "At B2 Auto, we're redefining the auto recycling industry. We believe that selling an old car shouldn't be a hassle—it should be a seamless, professional experience.",
      p2: "Our mission is to provide the highest level of service while ensuring every vehicle is recycled in an environmentally responsible manner. We don't just buy cars; we build trust.",
      list: [
        "Over 10 years of industry experience",
        "Locally owned and operated",
        "Committed to green recycling practices",
        "Thousands of satisfied customers"
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Got questions? We've got answers. Here's what our customers usually ask.",
      items: [
        {
          question: "How much is my car worth?",
          answer: "The value depends on the make, model, year, and condition of your vehicle. Call us for a free, no-obligation quote!",
        },
        {
          question: "Do you pick up the car?",
          answer: "Yes! We offer free towing for all vehicles we purchase. We'll schedule a pickup time that works for you.",
        },
        {
          question: "What documents do I need?",
          answer: "You'll need the vehicle registration and a valid ID. We'll handle the rest of the paperwork.",
        },
        {
          question: "Do you buy cars that don't run?",
          answer: "Absolutely. We buy cars in any condition—running, not running, damaged, or wrecked.",
        },
        {
          question: "How fast can you pick up my car?",
          answer: "We often offer same-day or next-day pickup service depending on your location and our schedule.",
        }
      ]
    },
    footer: {
      description: "The modern way to sell your car. Fast, fair, and hassle-free. We turn your vehicle into cash instantly.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      businessHours: "Business Hours",
      days: {
        week: "Monday - Friday",
        sat: "Saturday",
        sun: "Sunday",
      },
      rights: "All rights reserved."
    }
  },
  fr: {
    header: {
      services: "Services",
      about: "À Propos",
      faq: "FAQ",
      getOffer: "Obtenir une Offre",
    },
    hero: {
      badge: "Achat de voitures 7 jours sur 7",
      title: "Transformez votre auto en",
      titleHighlight: "Argent Comptant",
      description: "Nous achetons tous types de véhicules, peu importe l'état. Obtenez une estimation gratuite en quelques minutes, remorquage inclus, et paiement immédiat sur place.",
      cta: "Obtenir Mon Offre Gratuite",
      call: "Appeler +1 (514) 623-2787",
      benefits: {
        price: "Meilleur Prix Garanti",
        towing: "Remorquage Gratuit Inclus",
        paid: "Payé sur Place",
      }
    },
    services: {
      title: "Pourquoi Choisir B2 Auto ?",
      subtitle: "Nous rendons la vente de votre voiture simple, rapide et rentable. Découvrez la différence premium.",
      items: [
        {
          title: "Offre Comptant Instantanée",
          description: "Obtenez une offre compétitive pour votre véhicule en quelques minutes. Nous payons le meilleur prix pour toutes marques et modèles.",
        },
        {
          title: "Remorquage Gratuit",
          description: "Nous venons à vous ! Profitez de notre service de remorquage gratuit partout dans le Grand Montréal.",
        },
        {
          title: "Paiement le Jour Même",
          description: "Repartez avec l'argent en main. Nous nous occupons de tous les papiers et du paiement sur place.",
        },
        {
          title: "Toutes Conditions Acceptées",
          description: "En marche ou non, accidentée, endommagée ou simplement vieille - nous achetons les voitures dans n'importe quel état.",
        },
        {
          title: "Recyclage Écologique",
          description: "Nous suivons des directives environnementales strictes pour assurer que votre véhicule est recyclé de manière responsable.",
        },
        {
          title: "Service Professionnel",
          description: "Notre équipe licenciée et assurée offre une expérience sécuritaire, transparente et sans tracas.",
        }
      ]
    },
    about: {
      title: "Plus qu'une simple",
      titleHighlight: "Cour à Scrap",
      p1: "Chez B2 Auto, nous redéfinissons l'industrie du recyclage automobile. Nous croyons que vendre une vieille voiture ne devrait pas être un casse-tête, mais une expérience fluide et professionnelle.",
      p2: "Notre mission est d'offrir le plus haut niveau de service tout en assurant que chaque véhicule est recyclé de manière écologiquement responsable. Nous n'achetons pas seulement des voitures; nous bâtissons la confiance.",
      list: [
        "Plus de 10 ans d'expérience dans l'industrie",
        "Entreprise locale et opérée localement",
        "Engagés envers des pratiques de recyclage vertes",
        "Des milliers de clients satisfaits"
      ]
    },
    faq: {
      title: "Foire Aux Questions",
      subtitle: "Vous avez des questions ? Nous avons les réponses. Voici ce que nos clients demandent habituellement.",
      items: [
        {
          question: "Combien vaut ma voiture ?",
          answer: "La valeur dépend de la marque, du modèle, de l'année et de l'état de votre véhicule. Appelez-nous pour une estimation gratuite et sans obligation !",
        },
        {
          question: "Venez-vous chercher la voiture ?",
          answer: "Oui ! Nous offrons le remorquage gratuit pour tous les véhicules que nous achetons. Nous planifierons une heure de ramassage qui vous convient.",
        },
        {
          question: "Quels documents ai-je besoin ?",
          answer: "Vous aurez besoin de l'immatriculation du véhicule et d'une pièce d'identité valide. Nous nous occupons du reste des papiers.",
        },
        {
          question: "Achetez-vous des voitures qui ne roulent pas ?",
          answer: "Absolument. Nous achetons des voitures dans n'importe quel état—en marche, en panne, accidentées ou endommagées.",
        },
        {
          question: "À quelle vitesse pouvez-vous ramasser ma voiture ?",
          answer: "Nous offrons souvent un service de ramassage le jour même ou le lendemain, selon votre emplacement et notre horaire.",
        }
      ]
    },
    footer: {
      description: "La façon moderne de vendre votre voiture. Rapide, juste et sans tracas. Nous transformons votre véhicule en argent instantanément.",
      quickLinks: "Liens Rapides",
      contactUs: "Contactez-nous",
      businessHours: "Heures d'Ouverture",
      days: {
        week: "Lundi - Vendredi",
        sat: "Samedi",
        sun: "Dimanche",
      },
      rights: "Tous droits réservés."
    }
  }
};
