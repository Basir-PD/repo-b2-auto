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
    cities: "Cities we serve",
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
    callShort: "Call",
    whatsapp: "WhatsApp",
    whatsappAria: "Message Autos B2 on WhatsApp",
    whatsappTagline: "Send us a photo of your car",
    hours: "Open 7 days, 8am–8pm",
    hoursLong: "Open 7 days a week, 8:00am to 8:00pm",
    addressLabel: "Our yard",
    emailLabel: "Email",
    phoneLabel: "Phone",
    breadcrumbHome: "Home",
    backToQuote: "Get a quote",
    readMore: "Read the article",
    published: "Published",
    skipToContent: "Skip to main content",
    /** Shown only when siteConfig.GBP_REVIEW_LINK is set. */
    reviewCta: "Leave us a Google review",
  },

  home: {
    metaTitle: "Sell My Junk Car Laval & Montreal | Autos B2",
    metaDescription:
      "Junk car buyer in Laval, Montreal and the North Shore. We buy damaged, totaled and non running cars. Free scrap car removal, cash on pickup.",

    h1: "Sell your junk car in Laval & Montreal — cash on the spot",
    sub: "We buy junk cars across Laval, Montreal and the North Shore, in any condition — not running, wrecked, engine-less or written off. Free scrap car removal and cash on pickup.",
    priceAnchor: "$300 to $3,000 cash depending on the vehicle",
    priceFigure: "$300 – $3,000",
    priceCaption: "cash, depending on the vehicle",
    whatsappCta: "Send a photo on WhatsApp",
    whatsappPrefill: "Hi! I'd like a quote for my vehicle. Here's a photo:",
    ctaPrimary: "Sell my scrap car — free quote",
    ctaSecondary: `Call ${PHONE}`,

    trustStrip: [
      "Free towing included",
      "Cash on pickup",
      "We handle the SAAQ transfer",
      "Open 7 days, 8am–8pm",
    ],

    howItWorks: {
      title: "Sell your scrap car in 3 steps, under 24 hours",
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
      title: "Sell a damaged, totaled or non running car",
      items: [
        "Sell my non running car — it does not have to start",
        "Sell my totaled car after an insurance write-off",
        "Sell damaged car with no engine or transmission",
        "Sell scrap car, truck, SUV or van",
        "Too rusted to pass inspection",
        "Missing paperwork — we walk you through it",
      ],
    },

    stats: ["2,000 vehicles bought per year", "10 years in Mascouche", "Open 7 days, 8am–8pm"],

    why: {
      title: "Who buys junk cars in Laval and Montreal?",
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
      title: "Scrap car removal in Laval, Montreal & the North Shore",
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
      linkLabel: "See your city's page",
    },

    fleetTitle: "Our removal fleet, at work",
    fleetSub:
      "Our own trucks, our own drivers. These are photos from our pickups, not bought from a stock library.",
    reviewsHeading: "What our customers say on Google",

    faqHeading: "Frequently asked questions",
    faqAllLink: "See all questions",

    yard: {
      eyebrow: "Our yard",
      title: "A real recycler, at a real address",
      body: "Not a middleman with a phone number. Our yard is open 7 days a week and you are welcome to drop by.",
      directions: "Get directions",
      mapAlt: "Map of the Autos B2 yard at 340 Chemin Pincourt, Mascouche",
    },
    finalCta: {
      title: "Your old car is worth money. Find out how much.",
      sub: "Free quote, no obligation, in under 2 minutes.",
    },
  },

  form: {
    eyebrow: "Free quote",
    title: "What is your vehicle worth?",
    subtitle: "Four questions, under a minute. We call you back with a firm price.",
    replyTime: "We usually call back within 5 minutes, 8am to 8pm.",

    vehicle: "Year, make and model",
    name: "First and last name",
    phone: "Phone",
    postal: "Postal code or city",

    submit: "Get my quote",
    submitting: "Sending…",

    required: "This field is required",
    invalidPhone: "Enter a valid phone number",
    errorBody: "It didn't go through. Please call us instead:",
    tooManyBody: "Too many attempts in a short time. Try again in a few minutes, or just call us:",
    privacyNote:
      "By sending this form you agree that Autos B2 may contact you by phone, text or email about your quote. No obligation. We never share your details.",
  },

  thanks: {
    metaTitle: "Thank you — we've got your request | Autos B2",
    metaDescription:
      "Your quote request has been received. A member of the Autos B2 team will call you shortly.",
    h1: "Thanks — we'll call you shortly",
    body: "We've got your request. Someone on the team usually calls within 30 minutes during opening hours, 8am to 8pm, 7 days a week.",
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
