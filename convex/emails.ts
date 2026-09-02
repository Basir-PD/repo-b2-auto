import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * ============================================================
 * QUOTE NOTIFICATION EMAILS
 * ============================================================
 * Runs after the lead is already saved, so a mail failure costs
 * a notification, never the lead itself. The outcome is written
 * back onto the quote so the admin can see what didn't send.
 *
 * Set on the Convex deployment:
 *   npx convex env set RESEND_API_KEY re_xxxxxxxx
 *   npx convex env set QUOTE_FROM "Autos B2 <quotes@b2autos.com>"
 *   npx convex env set QUOTE_INBOX admin@b2autos.com
 * ============================================================
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Where new-lead notifications land. QUOTE_INBOX overrides it, but the
 * default is the real address so notifications work the moment the API
 * key is set, without a second piece of configuration to forget.
 */
const LEAD_INBOX = "admin@b2autos.com";

const BUSINESS = {
  name: "Autos B2",
  legalName: "Autos B2",
  phoneDisplay: "+1 (514) 623-2787",
  phoneHref: "tel:+15146232787",
  /** Public contact address, shown to customers in the confirmation email. */
  email: "info@b2autos.com",
  address: "340 Chemin Pincourt, Mascouche, QC J7L 2W3",
  url: "https://b2autos.com",
};

/** Escape untrusted values before interpolating into the HTML body. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function send(payload: Record<string, unknown>) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export const sendQuoteNotification = internalAction({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }): Promise<void> => {
    const quote = await ctx.runQuery(internal.quotes.loadQuote, { quoteId });
    if (!quote) return;

    if (!process.env.RESEND_API_KEY) {
      await ctx.runMutation(internal.quotes.recordEmailResult, {
        quoteId,
        emailSent: false,
        emailError: "RESEND_API_KEY is not set on this Convex deployment.",
      });
      return;
    }

    const from = process.env.QUOTE_FROM || `${BUSINESS.name} <onboarding@resend.dev>`;
    const inbox = process.env.QUOTE_INBOX || LEAD_INBOX;
    const submittedAt = new Date(quote._creationTime).toLocaleString("fr-CA", {
      timeZone: "America/Toronto",
    });

    const rows: Array<[string, string]> = [
      ["Name", quote.name],
      ["Phone", quote.phone],
      ["Email", quote.email || "—"],
      ["Vehicle", quote.vehicle],
      ["Condition", quote.condition || "—"],
      ["Message", quote.message || "—"],
      ["Submitted", submittedAt],
      ["Language", (quote.locale || "fr").toUpperCase()],
    ];

    const leadHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px;font-size:20px">New quote request</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px">via ${esc(BUSINESS.url)}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:8px 12px 8px 0;color:#64748b;white-space:nowrap;vertical-align:top;border-bottom:1px solid #e2e8f0">${esc(label)}</td>
              <td style="padding:8px 0;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0">${esc(value).replace(/\n/g, "<br>")}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin:20px 0 0">
          <a href="tel:${esc(quote.phone.replace(/[^\d+]/g, ""))}"
             style="display:inline-block;background:#206735;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">
            Call ${esc(quote.name)}
          </a>
        </p>
      </div>`;

    let emailSent = true;
    let emailError: string | undefined;

    try {
      await send({
        from,
        to: [inbox],
        // Omitted entirely when the lead left no email — Resend rejects an
        // empty reply_to, which would fail the whole notification.
        ...(quote.email ? { reply_to: quote.email } : {}),
        subject: `Quote request — ${quote.name} · ${quote.vehicle}`,
        html: leadHtml,
        text: rows.map(([l, val]) => `${l}: ${val}`).join("\n"),
      });
    } catch (err) {
      emailSent = false;
      emailError = err instanceof Error ? err.message : String(err);
    }

    await ctx.runMutation(internal.quotes.recordEmailResult, { quoteId, emailSent, emailError });

    // Courtesy copy to the customer. Best effort — never affects the lead.
    if (emailSent && quote.email) {
      const isEn = quote.locale === "en";
      const copy = isEn
        ? {
            subject: `We received your quote request — ${BUSINESS.name}`,
            heading: `Thanks, ${quote.name}.`,
            body: `We've received your request for <strong>${esc(quote.vehicle)}</strong> and we'll come back to you shortly with a cash offer. Towing is always free.`,
            callLabel: "Call us now",
          }
        : {
            subject: `Nous avons reçu votre demande — ${BUSINESS.name}`,
            heading: `Merci, ${quote.name}.`,
            body: `Nous avons bien reçu votre demande pour <strong>${esc(quote.vehicle)}</strong> et nous vous reviendrons rapidement avec une offre comptant. Le remorquage est toujours gratuit.`,
            callLabel: "Appelez-nous",
          };

      try {
        await send({
          from,
          to: [quote.email],
          subject: copy.subject,
          html: `
            <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px">
              <h2 style="margin:0 0 12px;font-size:20px">${esc(copy.heading)}</h2>
              <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6">${copy.body}</p>
              <p style="margin:0 0 20px">
                <a href="${esc(BUSINESS.phoneHref)}"
                   style="display:inline-block;background:#206735;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700">
                  ${esc(copy.callLabel)} — ${esc(BUSINESS.phoneDisplay)}
                </a>
              </p>
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6">
                ${esc(BUSINESS.legalName)}<br>
                ${esc(BUSINESS.address)}<br>
                ${esc(BUSINESS.phoneDisplay)} · ${esc(BUSINESS.email)}
              </p>
            </div>`,
        });
      } catch {
        // The shop has the lead; the confirmation is a nicety.
      }
    }
  },
});
