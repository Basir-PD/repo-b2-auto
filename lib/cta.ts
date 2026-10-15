/*
 * Lives outside PhoneLink because that is a client module: a server page that
 * imported a string from it would get a client reference, not the classes.
 */

/**
 * The main call to action on every page: a full-width solid button. Whatever
 * sits next to it (WhatsApp, the quote form) is styled as the second choice.
 */
export const CALL_CTA =
  "flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-brand-600 px-6 py-4 text-base font-bold tabular-nums text-white shadow-lg shadow-brand-900/20 transition-all hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";
