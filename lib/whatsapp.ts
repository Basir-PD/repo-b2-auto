/**
 * ============================================================
 * WHATSAPP LEAD PING — Meta Cloud API, direct
 * ============================================================
 * Sends "a lead just came in" to the owner's phone. This is the
 * fastest path to a human dialling back, so it deliberately does
 * NOT go through Convex: a store outage must not also silence the
 * notification. See app/api/quote/route.ts for how the sinks are
 * kept independent.
 *
 * Next app env (.env.local, and the same keys in Vercel):
 *   WHATSAPP_TOKEN            permanent system-user token from Meta
 *   WHATSAPP_PHONE_NUMBER_ID  the SENDER's id (not the number itself)
 *   WHATSAPP_TO               recipient(s), comma separated; defaults to
 *                             the dispatch phone below
 *   WHATSAPP_TEMPLATE         approved template name  (default below)
 *   WHATSAPP_TEMPLATE_LANG    its language code       (default below)
 *   WHATSAPP_API_VERSION      graph version           (default below)
 *
 * While the token or the sender id is unset this module does nothing
 * at all — no fetch, no log noise — so the site runs unchanged until
 * the Meta side is actually ready.
 *
 * TWO THINGS THAT WILL BITE, both documented in README:
 *
 *   1. The sender CANNOT be 514 623-2787. That number is in every
 *      wa.me link on the site and lives in the WhatsApp app on the
 *      owner's phone; registering it to the Cloud API takes it out
 *      of the app. The sender must be a second number, and the
 *      owner's number is the RECIPIENT.
 *
 *   2. A business-initiated message must use a pre-approved
 *      template. Free-form text is only delivered inside the 24h
 *      window after the recipient messages the sender — which is
 *      why the fallback below exists: before the template is
 *      approved, the owner can message the sender number once and
 *      get real pings immediately, so the wiring can be proven
 *      end to end without waiting on Meta's review.
 * ============================================================
 */

const GRAPH_HOST = "https://graph.facebook.com";
const DEFAULT_API_VERSION = "v21.0";
const DEFAULT_TEMPLATE = "nouveau_lead";
const DEFAULT_TEMPLATE_LANG = "fr";

/**
 * Where lead pings go when WHATSAPP_TO is not set — the dispatch phone,
 * 514 775-6790.
 *
 * Committed rather than left to configuration for the same reason the shop's
 * other numbers live in config/site.ts: it is a fact about the business, not a
 * secret, and a notification path that depends on somebody remembering a third
 * environment variable is a notification path that will be silently off. With
 * this here, wiring WhatsApp up is two variables, both of which come from Meta.
 *
 * This is a RECIPIENT. It is not, and must never become, the sender — see the
 * header note above.
 */
const DEFAULT_TO = "15147756790";

/*
  Matches the webhook's budget in the route. The visitor is waiting on this
  request, and a lead that is already stored is worth more than a ping that
  arrives 8 seconds later, so a slow Graph API gets abandoned rather than
  holding up the thank-you screen.
*/
const TIMEOUT_MS = 3500;

/** What the ping needs to say. Mirrors the lead the route has in hand. */
export type LeadPing = {
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
 * Recipients, as Meta wants them: digits only, country code included, no `+`.
 *
 * A ten-digit number is assumed to be North American and given the 1, because
 * that is how every number in this business is written down. Anything already
 * carrying a country code is passed through. lib/phone.ts is deliberately not
 * used here: `digitsOf` caps at 11 digits, which is correct for validating a
 * Quebec customer and wrong for a recipient that might one day be abroad.
 *
 * ENTRIES ARE SEPARATED BY COMMAS, NOT SPACES. This split used to include
 * `\s`, which meant the single most natural way to write the variable —
 * WHATSAPP_TO="+1 514 623 2787" — was torn into four fragments, every one of
 * them too short to be a number, leaving zero recipients and therefore no
 * ping and no error. Whoever set it would have seen a site that simply never
 * paged anybody. Spaces, dashes and brackets inside a number are now fine.
 *
 * Rejected entries are returned rather than dropped, so a typo gets logged
 * instead of quietly costing notifications.
 */
function parseRecipients(): { numbers: string[]; rejected: string[] } {
  const numbers: string[] = [];
  const rejected: string[] = [];

  for (const entry of (env("WHATSAPP_TO") || DEFAULT_TO)
    .split(/[,;\n]+/)
    .map((raw) => raw.trim())
    .filter(Boolean)) {
    const digits = entry.replace(/\D/g, "");
    if (digits.length === 10) numbers.push(`1${digits}`);
    else if (digits.length >= 11 && digits.length <= 15) numbers.push(digits);
    else rejected.push(entry);
  }

  return { numbers, rejected };
}

/** True when Meta is wired up enough to try. Cheap, so callers can guard. */
export function whatsappIsConfigured(): boolean {
  return Boolean(
    env("WHATSAPP_TOKEN") && env("WHATSAPP_PHONE_NUMBER_ID") && parseRecipients().numbers.length
  );
}

/**
 * Flatten one value into something a template variable will accept.
 *
 * Meta rejects a parameter containing a newline, a tab, or four consecutive
 * spaces — the whole send fails with a 400, not just that line — and our lead
 * text is assembled from user input and multi-line notes. Collapsing all
 * whitespace is the only reliable way through. An empty parameter is also
 * rejected, hence the dash.
 */
function param(value: string, max: number): string {
  const flat = (value || "").replace(/\s+/g, " ").trim().slice(0, max);
  return flat || "—";
}

/**
 * The five template variables, in order.
 *
 * {{1}} leads with whether this is a finished form or an abandoned one,
 * because that is the difference between "call this person back" and "this
 * person never consented and never finished", and it has to be legible in a
 * phone's notification preview without opening the chat.
 */
function templateParams(lead: LeadPing): string[] {
  const status = lead.partial ? "⚠️ FORMULAIRE ABANDONNÉ" : "Formulaire complété";

  const info = [
    lead.postal && `secteur ${lead.postal}`,
    `source ${lead.source}`,
    /*
      Same reasoning as the webhook payload: whoever reads this needs to know
      whether the lead is also in /admin, or whether the message on their
      screen is the only record of it that exists anywhere.
    */
    lead.stored ? "copie dans /admin" : "⚠️ PAS dans /admin — seule copie",
  ]
    .filter(Boolean)
    .join(" · ");

  return [
    param(status, 60),
    param(lead.name, 120),
    param(lead.phone, 40),
    param(lead.vehicle, 200),
    param(info, 400),
  ];
}

/** The same facts as free text, for the in-window fallback. */
function plainText(lead: LeadPing): string {
  const [status, name, phone, vehicle, info] = templateParams(lead);
  return [
    `🚗 ${status}`,
    `Nom : ${name}`,
    `Tél : ${phone}`,
    `Véhicule : ${vehicle}`,
    `Info : ${info}`,
  ].join("\n");
}

async function postToGraph(payload: Record<string, unknown>): Promise<string | null> {
  const version = env("WHATSAPP_API_VERSION") || DEFAULT_API_VERSION;
  const url = `${GRAPH_HOST}/${version}/${env("WHATSAPP_PHONE_NUMBER_ID")}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("WHATSAPP_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // null means sent. A string is the reason it wasn't, ready for the log.
  if (res.ok) return null;
  return `${res.status} ${(await res.text()).slice(0, 400)}`;
}

/** One recipient: the approved template, then free text if that is refused. */
async function pingOne(to: string, lead: LeadPing): Promise<boolean> {
  const name = env("WHATSAPP_TEMPLATE") || DEFAULT_TEMPLATE;
  const lang = env("WHATSAPP_TEMPLATE_LANG") || DEFAULT_TEMPLATE_LANG;

  const templateError = await postToGraph({
    to,
    type: "template",
    template: {
      name,
      language: { code: lang },
      components: [
        {
          type: "body",
          parameters: templateParams(lead).map((text) => ({ type: "text", text })),
        },
      ],
    },
  }).catch((err) => `threw ${err instanceof Error ? err.message : String(err)}`);

  if (templateError === null) return true;

  console.error(`[whatsapp] template "${name}" (${lang}) failed for ${to} — ${templateError}`);

  /*
    Second attempt, free text. Delivered only if the recipient has messaged
    the sender in the last 24 hours, so this is expected to fail in the steady
    state and is expected to WORK during setup, before the template clears
    review. Logged either way; a silent notification path is the failure this
    whole file exists to avoid.
  */
  const textError = await postToGraph({
    to,
    type: "text",
    text: { preview_url: false, body: plainText(lead) },
  }).catch((err) => `threw ${err instanceof Error ? err.message : String(err)}`);

  if (textError === null) {
    console.warn(`[whatsapp] sent to ${to} as free text — the template is not usable`);
    return true;
  }

  console.error(`[whatsapp] free-text fallback also failed for ${to} — ${textError}`);
  return false;
}

/**
 * Ping every configured recipient. Never throws and never rejects: the caller
 * is deciding whether a lead was seen by anyone, not whether Meta is healthy.
 *
 * Resolves true if at least one phone got the message.
 */
export async function sendLeadWhatsApp(lead: LeadPing): Promise<boolean> {
  if (!whatsappIsConfigured()) return false;

  const { numbers, rejected } = parseRecipients();
  if (rejected.length) {
    console.error(
      `[whatsapp] WHATSAPP_TO has unusable entries, not paged: ${rejected.join(" | ")}`
    );
  }

  const results = await Promise.allSettled(numbers.map((to) => pingOne(to, lead)));
  return results.some((r) => r.status === "fulfilled" && r.value === true);
}
