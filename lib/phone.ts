/**
 * One definition of what a valid phone number is.
 *
 * The form and the API used to disagree: the form required exactly ten
 * digits, while the API accepted any 10–20 characters drawn from
 * `[+()\d\s.-]` — so the string "((((((((((", which contains no digits at
 * all, passed server-side validation. A lead is worthless without a number
 * that can actually be dialled, and the server is the side that has to be
 * right, because it is the only one an attacker cannot skip.
 */

/** Digits only, capped so a paste-bomb cannot grow unbounded. */
export function digitsOf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/**
 * North American numbers are ten digits, optionally with a leading country
 * code of 1. Anything else is a typo or junk.
 */
export function normalizePhone(value: string): string {
  return digitsOf(value).replace(/^1(?=\d{10}$)/, "");
}

export function phoneIsValid(value: string): boolean {
  return normalizePhone(value).length === 10;
}

/**
 * Progressive (514) 555-1234 formatting.
 *
 * Formats what is there without ever rejecting a keystroke, so the caret is
 * never pushed around mid-typing.
 */
export function formatPhone(value: string): string {
  const d = normalizePhone(value);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

/** E.164, for anything that has to dial or store it canonically. */
export function toE164(value: string): string | null {
  const d = normalizePhone(value);
  return d.length === 10 ? `+1${d}` : null;
}
