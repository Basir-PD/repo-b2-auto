import { siteConfig } from "@/config/site";
import type { Copy } from "@/content/copy/fr";

const PHONE = siteConfig.phone.display;

/**
 * English copy. Typed against the French object, so this file cannot fall
 * behind: add a key in fr.ts and the build fails until it lands here too.
 */
export const en: Copy = {
  meta: {
    langLabel: "English",
    switchTo: "Français",
    switchAria: "View this page in French",
  },

  nav: {
    services: "Services",
    scrapBuying: "Junk cars",
    towing: "Towing",
    damaged: "Damaged",
    trucks: "Trucks and SUVs",
    cities: "Areas we serve",
    about: "About",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contact",
    quote: "Free quote",
  },

  common: {
    callCta: `Call ${PHONE}`,
    callAria: "Call Autos B2 now",
    quoteCta: "Get my free quote",
    whatsapp: "WhatsApp",
    whatsappAria: "Message Autos B2 on WhatsApp",
    whatsappTagline: "Send us a photo of your car",
    hours: "Open 7 days, 8am–8:30pm",
    hoursLong: "Open 7 days a week, 8:00am to 8:30pm",
    addressLabel: "Our yard",
    emailLabel: "Email",
    phoneLabel: "Phone",
    breadcrumbHome: "Home",
    backToQuote: "Get a quote",
    readMore: "Read the article",
    published: "Published",
    skipToContent: "Skip to main content",
  },

  home: {
    metaTitle: "Cash for Junk Cars Mascouche & Laval | Free Towing — Autos B2",
    metaDescription:
      "We buy scrap, damaged and non-running cars for cash. Free towing across the North Shore and Laval, paid on the spot, SAAQ paperwork handled. Open 7 days, 8am to 8:30pm.",

    h1: "Cash for junk cars in Mascouche — paid on the spot",
    sub: "We buy your vehicle in any condition: not running, wrecked, engine-less or written off. Free towing, cash on pickup, and we handle the SAAQ paperwork for you.",
    priceAnchor: "$300 to $3,000 cash depending on the vehicle",
    priceFigure: "$300 – $3,000",
    priceCaption: "cash, depending on the vehicle",
    whatsappCta: "Send a photo on WhatsApp",
    whatsappPrefill: "Hi! I'd like a quote for my vehicle. Here's a photo:",
    ctaPrimary: "Get my free quote",
    ctaSecondary: `Call ${PHONE}`,

    trustStrip: [
      "Free towing included",
      "Cash on pickup",
      "We handle the SAAQ transfer",
      "Open 7 days, 8am–8:30pm",
    ],

    howItWorks: {
      title: "How it works — 3 steps, under 24 hours",
      steps: [
        {
          title: "Tell us about the vehicle",
          body: "Year, make, model and condition, by phone or through the form. Two minutes and you get a firm price, no obligation.",
        },
        {
          title: "We schedule free pickup",
          body: "You pick the time. Our tow truck covers the entire North Shore and Laval, often same day.",
        },
        {
          title: "You get paid cash on the spot",
          body: "We hand you the money at pickup, take the plate, and issue the official SAAQ receipt so you stop paying registration.",
        },
      ],
    },

    buyAll: {
      title: "We buy every vehicle — no exceptions",
      items: [
        "Cars that won't start",
        "Accident-damaged or total loss",
        "No engine or no transmission",
        "Trucks, SUVs and vans",
        "Too rusted to pass inspection",
        "Missing paperwork (we'll walk you through it)",
      ],
    },

    stats: [
      "2,000 vehicles bought per year",
      "10 years in Mascouche",
      "Open 7 days, 8am–8:30pm",
    ],

    why: {
      title: "Why people in Mascouche and Terrebonne call us",
      points: [
        {
          title: "A real recycler, not a middleman.",
          body: "Our yard is at 340 Chemin Pincourt in Mascouche. We don't sell your call to someone else — we buy, tow and pay ourselves.",
        },
        {
          title: "The quoted price is the price paid.",
          body: "No renegotiating when the tow truck shows up. What we confirm on the phone is what you get.",
        },
        {
          title: "We handle the SAAQ.",
          body: "Transfer, release and official receipt done on site so you stop paying for a vehicle you no longer own.",
        },
        {
          title: "Responsible recycling.",
          body: "Fluids, batteries and tires handled to Quebec environmental standards.",
        },
      ],
    },

    serviceArea: {
      title: "Areas we serve",
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
      linkLabel: "See your city's page",
    },

    reviewsHeading: "5.0 ★ from 5 Google reviews",

    faqHeading: "Frequently asked questions",
    faqAllLink: "See all questions",

    finalCta: {
      title: "Your old car is worth money. Find out how much.",
      sub: "Free quote, no obligation, in under 2 minutes.",
    },
  },

  consent: {
    title: "We use cookies",
    body: "We use cookies to improve your experience and measure how our advertising performs. You can accept, refuse or customise your choices at any time.",
    acceptAll: "Accept all",
    rejectAll: "Refuse all",
    customise: "Customise",
    save: "Save my choices",
    necessary: "Necessary",
    necessaryBody: "Required for the site to work: security, navigation, form submission. These cannot be turned off.",
    analytics: "Analytics",
    analyticsBody: "Help us understand which pages are useful and where visitors drop off.",
    marketing: "Marketing",
    marketingBody: "Let us measure our Google and Meta advertising and avoid showing you the same ad needlessly.",
    alwaysOn: "Always on",
    policyLink: "See our privacy policy.",
  },

  form: {
    eyebrow: "Free quote",
    title: "What is your vehicle worth?",
    subtitle: "Four questions, under a minute. We call you back with a firm price.",

    vehicle: "Year, make and model",
    vehiclePlaceholder: "e.g. 2011 Honda Civic",
    name: "First and last name",
    namePlaceholder: "Your full name",
    phone: "Phone",
    phonePlaceholder: "(514) 555-1234",
    postal: "Postal code or city",
    postalPlaceholder: "e.g. J7L 2W3 or Terrebonne",

    consent:
      "I agree that Autos B2 may contact me by phone, text or email about my quote. See our privacy policy.",
    consentLinkText: "privacy policy",

    submit: "Get my quote",
    submitting: "Sending…",

    required: "This field is required",
    invalidPhone: "Enter a valid phone number",
    consentRequired: "You need to agree before continuing",
    errorBody: "It didn't go through. Please call us instead:",
    privacyNote: "No obligation. We never share your details.",
  },

  thanks: {
    metaTitle: "Thank you — we've got your request | Autos B2",
    metaDescription:
      "Your quote request has been received. A member of the Autos B2 team will call you shortly.",
    h1: "Thanks — we'll call you shortly",
    body: "We've got your request. Someone on the team usually calls within 30 minutes during opening hours, 8am to 8:30pm, 7 days a week.",
    urgent: "In a hurry? Call us directly:",
    whatNext: "What happens next",
    steps: [
      "We call to confirm the year, make, model and condition of the vehicle.",
      "We give you a firm price on the phone, with no obligation.",
      "If you accept, we schedule the free pickup — often the same day.",
    ],
    backHome: "Back to home",
  },
};
