/**
 * ============================================================
 * SMS LEAD PING — Twilio, direct
 * ============================================================
 * Texts "a lead just came in" to the dispatch phone. Same job as
 * lib/whatsapp.ts and deliberately independent of it: the point of
 * having two is that one being misconfigured, rate-limited or down
 * still leaves somebody's phone buzzing.
 *
 * Next app env (.env.local, and the same keys in Vercel):
 *   TWILIO_ACCOUNT_SID   starts with AC…
 *   TWILIO_AUTH_TOKEN    from the Twilio console
 *   TWILIO_FROM          a Twilio number you own, E.164: +1…
 *   SMS_TO               recipient(s), comma separated; defaults to
 *                        the dispatch phone below
 *
 * While the SID, the token or the sender is unset this module does
 * nothing at all — no fetch, no log noise — exactly like the WhatsApp
 * one, so the site runs unchanged until Twilio is actually ready.
 *
 * WHY THIS EXISTS ALONGSIDE WHATSAPP. WhatsApp business-initiated
 * messages need a Meta business portfolio, a second SIM for the
 * sender, and an approved template. That is the right long-term
 * channel and lib/whatsapp.ts is ready for it. SMS needs a Twilio
 * account and a number, costs about $0.008 a message, and works the
 * same evening — which matters when the alternative is nobody being
 * paged at all. Neither replaces the other; the route tries both.
 * ============================================================
 */

const TWILIO_HOST = "https://api.twilio.com";
const API_VERSION = "2010-04-01";

/**
 * Where lead texts go when SMS_TO is not set — the dispatch phone,
 * 514 775-6790.
 *
 * Committed for the same reason the WhatsApp default is: it is a fact about
 * the business rather than a secret, and a notification path that depends on
 * somebody remembering a fourth environment variable is one that will be
 * silently off. Wiring SMS up is three variables, all three from Twilio.
 */
const DEFAULT_TO = "+15147756790";

/*
  Matches the webhook and WhatsApp budgets in the route. The visitor is
  waiting on this request, and a lead already stored is worth more than a
  text that arrives 8 seconds later, so a slow Twilio gets abandoned rather
  than holding up the thank-you screen.
*/
const TIMEOUT_MS = 3500;

/** What the ping needs to say. Same shape as the WhatsApp one. */
export type LeadSms = {
  name: string;
  phone: string;
  vehicle: string;
  partial: boolean;
  source: string;
  postal?: string;
  /** Whether the lead also reached Convex, i.e. whether /admin has a copy. */
  stored: boolean;
};

function env(key: string): string {
  return (process.env[key] || "").trim();
}

/**
 * Recipients in E.164, which is the only format Twilio accepts.
 *
 * Split on commas, semicolons and newlines but NOT whitespace — the same trap
 * lib/whatsapp.ts documents. SMS_TO="+1 514 775 6790" is the most natural way
 * to write it, and splitting on spaces would tear it into four fragments, none
 * of them a number, leaving no recipients, no text and no error.
 *
 * Rejected entries are returned rather than dropped so a typo gets logged
 * instead of quietly costing notifications.
 */
function parseRecipients(): { numbers: string[]; rejected: string[] } {
  const numbers: string[] = [];
  const rejected: string[] = [];

  for (const entry of (env("SMS_TO") || DEFAULT_TO)
    .split(/[,;\n]+/)
    .map((raw) => raw.trim())
    .filter(Boolean)) {
    const digits = entry.replace(/\D/g, "");
    if (digits.length === 10) numbers.push(`+1${digits}`);
    else if (digits.length >= 11 && digits.length <= 15) numbers.push(`+${digits}`);
    else rejected.push(entry);
  }

  return { numbers, rejected };
}

/** True when Twilio is wired up enough to try. Cheap, so callers can guard. */
export function smsIsConfigured(): boolean {
  return Boolean(
    env("TWILIO_ACCOUNT_SID") &&
      env("TWILIO_AUTH_TOKEN") &&
      env("TWILIO_FROM") &&
      parseRecipients().numbers.length
  );
}

/**
 * The text itself.
 *
 * Front-loaded on purpose: a phone's lock screen shows roughly the first
 * forty characters, and the two things worth deciding from that preview are
 * whether the form was finished and who to call. The vehicle and the rest
 * come after, for whoever opens it.
 *
 * Kept under 320 characters — two SMS segments. Twilio bills per segment, and
 * a long vehicle description is the field most likely to run away, so it is
 * the one that gets trimmed.
 */
export function buildSmsBody(lead: LeadSms): string {
  const flat = (value: string, max: number) =>
    (value || "").replace(/\s+/g, " ").trim().slice(0, max) || "—";

  const head = lead.partial ? "⚠️ FORMULAIRE ABANDONNÉ" : "Nouveau lead";

  /*
    Every field is capped, including the two in the tail. An earlier version
    capped only the name, phone and vehicle and let `source` and `postal`
    through whole, which meant the total was unbounded in exactly the place
    nobody looks — `source` is machine-generated (`city_hero_laval`,
    `lp_scrap-yard-montreal`) and grows whenever a page type is added. A spec
    caught it at 337 characters, which is a third segment nobody meant to buy.
  */
  const tail = [
    lead.postal && `Secteur: ${flat(lead.postal, 12)}`,
    `Source: ${flat(lead.source, 24)}`,
    lead.stored ? null : "⚠️ PAS dans /admin — seule copie",
  ]
    .filter(Boolean)
    .join("\n");

  return [`${head} — ${flat(lead.name, 60)}`, flat(lead.phone, 40), flat(lead.vehicle, 100), tail]
    .filter(Boolean)
    .join("\n");
}

async function sendOne(to: string, body: string): Promise<void> {
  const sid = env("TWILIO_ACCOUNT_SID");
  const url = `${TWILIO_HOST}/${API_VERSION}/Accounts/${sid}/Messages.json`;

  /*
    Form-encoded, not JSON: Twilio's REST API predates the convention and
    rejects an application/json body on this endpoint with a 400 that does not
    explain itself.
  */
  const form = new URLSearchParams({ To: to, From: env("TWILIO_FROM"), Body: body });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      // Basic auth, SID as the username. Twilio has no bearer-token form here.
      Authorization: `Basic ${Buffer.from(`${sid}:${env("TWILIO_AUTH_TOKEN")}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    /*
      Twilio's error body carries the useful part — code 21608 is "unverified
      recipient on a trial account", 21211 is a malformed number — and those
      are exactly the two mistakes that get made during setup. Logged in full
      rather than summarised.
    */
    throw new Error(`Twilio responded ${res.status}: ${await res.text()}`);
  }
}

/**
 * Text the dispatch phone. Never throws.
 *
 * Returns true only if at least one recipient was accepted by Twilio, because
 * the route uses that to decide whether ANY human was paged — and reporting
 * success for a message that was rejected would let a lead fall through the
 * one gap the route exists to close.
 */
export async function sendLeadSms(lead: LeadSms): Promise<boolean> {
  if (!smsIsConfigured()) return false;

  const { numbers, rejected } = parseRecipients();
  if (rejected.length) {
    console.error("[sms] ignoring unusable SMS_TO entries:", rejected.join(", "));
  }

  const body = buildSmsBody(lead);

  const results = await Promise.all(
    numbers.map(async (to) => {
      try {
        await sendOne(to, body);
        return true;
      } catch (err) {
        console.error(`[sms] failed for ${to} —`, err instanceof Error ? err.message : err);
        return false;
      }
    })
  );

  return results.some(Boolean);
}
