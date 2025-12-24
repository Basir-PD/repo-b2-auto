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
    howItWorks: {
      title: "HOW IT WORKS",
      subtitle: "Three easy steps to turn your vehicle into instant cash today.",
      steps: [
        {
          number: "1",
          title: "Request Your Quote",
          description: "Share basic details about your vehicle with us. Our team will provide you with a competitive cash offer within minutes—no obligations attached.",
          cta: "Get Started"
        },
        {
          number: "2",
          title: "Schedule Free Pickup",
          description: "Choose a convenient time for us to collect your vehicle. Our professional towing service is completely free, and we come to your location anywhere in Laval.",
          cta: "Book Pickup"
        },
        {
          number: "3",
          title: "Get Paid Instantly",
          description: "Receive immediate payment when we arrive. We handle all paperwork on-site and put cash directly in your hands—simple, fast, and stress-free.",
          cta: "Start Now"
        }
      ],
      bottomIcons: {
        call: "Contact",
        pickup: "Service",
        cash: "Payment"
      }
    },
    googleReviews: {
      title: "What Our Customers Say",
      subtitle: "Rated 5/5 stars by hundreds of satisfied customers across Laval.",
      reviews: [
        {
          name: "Michael Chen",
          date: "2 days ago",
          text: "Excellent service from start to finish. They arrived within an hour, paid the exact amount quoted over the phone, and handled all the paperwork. Highly recommended!",
        },
        {
          name: "Sarah Tremblay",
          date: "1 week ago",
          text: "Best price I found in Laval. The driver was courteous and professional. The entire process took less than 15 minutes. Cash on the spot as promised.",
        },
        {
          name: "David Miller",
          date: "2 weeks ago",
          text: "Transparent and honest service. No hidden fees, free towing included, and excellent communication throughout. They turned my old car into cash instantly.",
        }
      ]
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
          description: "We come to you! Enjoy complimentary towing service anywhere in the Greater Laval area.",
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
    stats: {
      title: "WHY ALPHA",
      titleHighlight: "RECYCLING?",
      subtitle: "Selling an old scrap car has never been this simple — we take care of everything to make your life easier.",
      vehiclesPurchased: "VEHICLES PURCHASED PER YEAR",
      positiveReviews: "POSITIVE CUSTOMER REVIEWS",
      yearsExperience: "YEARS OF EXPERIENCE",
      imageAlt: "GUARANTEED PURCHASE, REGARDLESS OF THE CAR'S CONDITION!",
      guaranteed: "GUARANTEED PURCHASE",
      noRefusal: "NO VEHICLE REFUSED",
      noRefusalDesc: "Even those without an engine, without wheels, or declared a total loss.",
      noTracas: "NO HASSLE",
      noTracasDesc: "We take care of everything: transfer, SAAQ declaration, etc.",
      flexible: "7 DAYS A WEEK",
      flexibleDesc: "Flexible schedule, including weekends and holidays.",
    },
    about: {
      title: "More Than Just a",
      titleHighlight: "Scrap Yard",
      p1: "At B2 Auto, we're redefining the auto recycling industry. We believe that selling an old car shouldn't be a hassle—it should be a seamless, professional experience.",
      p2: "Our mission is to provide the highest level of service while ensuring every vehicle is recycled in an environmentally responsible manner. We don't just buy cars; we build trust.",
      list: [
        "Over 25 years of industry experience",
        "Locally owned and operated",
        "Committed to green recycling practices",
        "Thousands of satisfied customers"
      ]
    },
    contact: {
      title: "Visit Us",
      titleHighlight: "Today",
      subtitle: "We're located in Laval, Quebec. Contact us to get your free quote!",
      phoneTitle: "Call Us",
      phoneDesc: "Available 7 days a week",
      emailTitle: "Email Us",
      emailDesc: "Fast response guaranteed",
      hoursTitle: "Business Hours",
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
      ],
      ctaTitle: "Ready to sell your vehicle?",
      ctaSubtitle: "Get your free quote in minutes. We buy all vehicles, any condition.",
      ctaButton: "Call Now: +1 (514) 623-2787"
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
    howItWorks: {
      title: "COMMENT ÇA FONCTIONNE",
      subtitle: "Trois étapes faciles pour transformer votre véhicule en argent comptant dès aujourd'hui.",
      steps: [
        {
          number: "1",
          title: "Demandez Votre Soumission",
          description: "Partagez les détails de base de votre véhicule avec nous. Notre équipe vous fournira une offre comptant compétitive en quelques minutes—sans aucune obligation.",
          cta: "Commencer"
        },
        {
          number: "2",
          title: "Planifiez le Remorquage Gratuit",
          description: "Choisissez un moment qui vous convient pour la collecte de votre véhicule. Notre service de remorquage professionnel est entièrement gratuit, partout à Laval.",
          cta: "Réserver"
        },
        {
          number: "3",
          title: "Recevez Votre Paiement Immédiat",
          description: "Obtenez votre paiement instantané à notre arrivée. Nous gérons toute la paperasse sur place et vous remettez l'argent directement—simple, rapide et sans stress.",
          cta: "Débuter Maintenant"
        }
      ],
      bottomIcons: {
        call: "Contact",
        pickup: "Service",
        cash: "Paiement"
      }
    },
    googleReviews: {
      title: "Ce Que Disent Nos Clients",
      subtitle: "Noté 5/5 étoiles par des centaines de clients satisfaits à Laval.",
      reviews: [
        {
          name: "Michael Chen",
          date: "Il y a 2 jours",
          text: "Excellent service du début à la fin. Ils sont arrivés en une heure, ont payé le montant exact cité au téléphone et ont géré toute la paperasse. Hautement recommandé !",
        },
        {
          name: "Sarah Tremblay",
          date: "Il y a 1 semaine",
          text: "Meilleur prix trouvé à Laval. Le chauffeur était courtois et professionnel. Le processus entier a pris moins de 15 minutes. Argent comptant sur place comme promis.",
        },
        {
          name: "David Miller",
          date: "Il y a 2 semaines",
          text: "Service transparent et honnête. Pas de frais cachés, remorquage gratuit inclus et excellente communication tout au long. Ils ont transformé mon vieux véhicule en argent instantanément.",
        }
      ]
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
          description: "Nous venons à vous ! Profitez de notre service de remorquage gratuit partout dans la région de Laval.",
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
    stats: {
      title: "POURQUOI ALPHA",
      titleHighlight: "RECYCLAGE ?",
      subtitle: "Vendre une vieille voiture scrap n'a jamais été aussi simple — on s'occupe de tout pour vous faciliter la vie.",
      vehiclesPurchased: "VÉHICULES ACHETÉS PAR ANNÉE",
      positiveReviews: "AVIS POSITIFS DE NOS CLIENTS",
      yearsExperience: "ANNÉES D'EXPÉRIENCES",
      imageAlt: "ACHAT GARANTI, PEU IMPORTE L'ÉTAT DE L'AUTO !",
      guaranteed: "ACHAT GARANTI",
      noRefusal: "AUCUN VÉHICULE REFUSÉ",
      noRefusalDesc: "Même ceux sans moteur, sans roues ou ayant été déclarés perte totale.",
      noTracas: "AUCUN TRACAS",
      noTracasDesc: "On s'occupe de tout : transfert, déclaration à la SAAQ, etc.",
      flexible: "7 JOURS SUR 7",
      flexibleDesc: "Horaire flexible, y compris les fins de semaine et jours fériés.",
    },
    about: {
      title: "Plus qu'une simple",
      titleHighlight: "Cour à Scrap",
      p1: "Chez B2 Auto, nous redéfinissons l'industrie du recyclage automobile. Nous croyons que vendre une vieille voiture ne devrait pas être un casse-tête, mais une expérience fluide et professionnelle.",
      p2: "Notre mission est d'offrir le plus haut niveau de service tout en assurant que chaque véhicule est recyclé de manière écologiquement responsable. Nous n'achetons pas seulement des voitures; nous bâtissons la confiance.",
      list: [
        "Plus de 25 ans d'expérience dans l'industrie",
        "Entreprise locale et opérée localement",
        "Engagés envers des pratiques de recyclage vertes",
        "Des milliers de clients satisfaits"
      ]
    },
    contact: {
      title: "Visitez-nous",
      titleHighlight: "Aujourd'hui",
      subtitle: "Nous sommes situés à Laval, Québec. Contactez-nous pour obtenir votre soumission gratuite!",
      phoneTitle: "Appelez-nous",
      phoneDesc: "Disponible 7 jours sur 7",
      emailTitle: "Écrivez-nous",
      emailDesc: "Réponse rapide garantie",
      hoursTitle: "Heures d'ouverture",
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
      ],
      ctaTitle: "Prêt à vendre votre véhicule ?",
      ctaSubtitle: "Obtenez votre soumission gratuite en quelques minutes. Nous achetons tous les véhicules, peu importe l'état.",
      ctaButton: "Appelez maintenant : +1 (514) 623-2787"
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
