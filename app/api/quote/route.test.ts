import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Convex is mocked, so these specs exercise our validation, throttling and
 * spam handling without a backend. `submit` is captured so a test can assert
 * what would have been stored — that is where the consent record and the
 * attribution end up.
 */
type StoredLead = { name: string; phone: string; vehicle: string; message: string };
const submit = vi.fn(async (_ref: string, _lead: StoredLead) => ({ _id: "test" }));
vi.mock("convex/browser", () => ({
  ConvexHttpClient: class {
    mutation = submit;
  },
}));
vi.mock("@/convex/_generated/api", () => ({ api: { quotes: { submit: "quotes:submit" } } }));

process.env.NEXT_PUBLIC_CONVEX_URL = "http://127.0.0.1:3210";
process.env.LEAD_WEBHOOK_URL = "https://hooks.example/lead";

/*
 * The webhook is a bare `fetch`, so it is stubbed globally rather than mocked
 * per module. Every spec runs with a reachable webhook unless it says
 * otherwise, which is what production looks like once LEAD_WEBHOOK_URL is set.
 */
const webhook = vi.fn(
  async (_url: string, _init: RequestInit) => new Response("{}", { status: 200 })
);
vi.stubGlobal("fetch", webhook);

const { POST } = await import("@/app/api/quote/route");

/** Each call gets its own IP so the throttle does not bleed between tests. */
let ip = 0;
function post(body: unknown, forwardedFor?: string) {
  ip += 1;
  return POST(
    new Request("http://localhost/api/quote/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": forwardedFor ?? `203.0.113.${ip % 250}`,
      },
      body: JSON.stringify(body),
    })
  );
}

const validLead = {
  vehicle: "2011 Honda Civic",
  name: "Jean Tremblay",
  phone: "(514) 623-2787",
  postal: "J7L 2W3",
  partial: false,
  locale: "fr",
  source: "quote_page",
};

beforeEach(() => {
  submit.mockClear();
  submit.mockImplementation(async () => ({ _id: "test" }));
  webhook.mockClear();
  webhook.mockImplementation(async () => new Response("{}", { status: 200 }));
  process.env.NEXT_PUBLIC_CONVEX_URL = "http://127.0.0.1:3210";
});

describe("POST /api/quote — accepting a real lead", () => {
  it("stores a complete submission and returns ok", async () => {
    const res = await post(validLead);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("records the consent moment, since the burden of proving it is ours", async () => {
    await post(validLead);
    const stored = submit.mock.calls[0][1];
    expect(stored.message).toMatch(/Formulaire envoyé le \d{4}-\d{2}-\d{2}T/);
    expect(stored.message).toMatch(/avis de consentement affiché/);
  });

  it("carries the ad click id through, which is what makes offline upload possible", async () => {
    await post({ ...validLead, attribution: { gclid: "abc123", utm_campaign: "fr-scrap" } });
    const stored = submit.mock.calls[0][1];
    expect(stored.message).toContain("gclid=abc123");
    expect(stored.message).toContain("utm_campaign=fr-scrap");
  });
});

describe("POST /api/quote — rejecting what cannot be called back", () => {
  it("requires a phone number", async () => {
    const res = await post({ ...validLead, phone: "" });
    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toMatchObject({ errors: { phone: "required" } });
    expect(submit).not.toHaveBeenCalled();
  });

  /*
   * The old server regex was a length check over an alphabet, so a string of
   * brackets passed and the lead arrived undialable. The client would never
   * send this; anything posting directly would.
   */
  it("rejects punctuation that contains no digits", async () => {
    const res = await post({ ...validLead, phone: "((((((((((" });
    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toMatchObject({ errors: { phone: "invalid" } });
  });

  it("rejects a number that is not ten digits", async () => {
    const res = await post({ ...validLead, phone: "514623" });
    expect(res.status).toBe(422);
  });

  it("requires name, postal and vehicle on a complete submission", async () => {
    const res = await post({ ...validLead, name: "", postal: "", vehicle: "" });
    expect(res.status).toBe(422);
    const body = (await res.json()) as { errors: Record<string, string> };
    expect(Object.keys(body.errors).sort()).toEqual(["name", "postal", "vehicle"]);
  });

  it("rejects a malformed body instead of throwing", async () => {
    const res = await POST(
      new Request("http://localhost/api/quote/", { method: "POST", body: "not json" })
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/quote — partial capture", () => {
  it("accepts a phone-only partial, which is still a callable lead", async () => {
    const res = await post({ phone: "(514) 623-2787", partial: true, source: "hero_form" });
    expect(res.status).toBe(200);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("flags the partial so nobody works it as a consented call list", async () => {
    await post({ phone: "(514) 623-2787", partial: true });
    const stored = submit.mock.calls[0][1];
    expect(stored.message).toContain("AUCUN CONSENTEMENT");
    expect(stored.name).toBe("(partiel)");
  });

  it("still requires a valid phone on a partial", async () => {
    const res = await post({ phone: "514", partial: true });
    expect(res.status).toBe(422);
    expect(submit).not.toHaveBeenCalled();
  });
});

describe("POST /api/quote — spam and abuse", () => {
  it("swallows a honeypot hit with 200 so the bot records success and leaves", async () => {
    const res = await post({ ...validLead, company: "Acme Spam Co" });
    expect(res.status).toBe(200);
    // Answered, but never stored.
    expect(submit).not.toHaveBeenCalled();
  });

  it("throttles one IP without affecting anybody else", async () => {
    const attacker = "198.51.100.7";
    let throttledAt = 0;
    for (let i = 1; i <= 20; i += 1) {
      const res = await post({ ...validLead, phone: "(514) 623-2787" }, attacker);
      if (res.status === 429) {
        throttledAt = i;
        break;
      }
    }
    expect(throttledAt).toBeGreaterThan(10);
    expect(throttledAt).toBeLessThanOrEqual(16);

    // A different visitor is unaffected — the bug that would silently kill
    // every lead site-wide.
    const other = await post(validLead, "198.51.100.99");
    expect(other.status).toBe(200);
  });
});

/*
 * Production shipped for its entire life answering every submission with
 * {"error":"backend_not_configured"}, because NEXT_PUBLIC_CONVEX_URL was
 * never set on the host and the handler returned 503 before it tried the
 * webhook. Nobody noticed: the form showed "call us instead", which reads
 * like a transient glitch rather than a funnel with no bottom. These specs
 * are the reason it cannot happen quietly again.
 */
describe("POST /api/quote — when a backend is missing", () => {
  /*
   * `= ""` and not `delete` or `= undefined`: Node coerces an assigned
   * undefined to the *string* "undefined", which is truthy, so the route
   * would sail past its own guard and the spec would pass for the wrong
   * reason. An empty string is falsy and is also the more realistic
   * failure — a variable present in Vercel with nothing in it.
   */
  it("still reaches a human through the webhook when the store is unconfigured", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";

    const res = await post(validLead);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(submit).not.toHaveBeenCalled();
    expect(webhook).toHaveBeenCalledTimes(1);
  });

  it("still reaches a human through the webhook when the store throws", async () => {
    submit.mockImplementation(async () => {
      throw new Error("convex is down");
    });

    const res = await post(validLead);

    expect(res.status).toBe(200);
    expect(webhook).toHaveBeenCalledTimes(1);
  });

  /*
   * Whoever reads the SMS needs to know whether the lead is also sitting in
   * /admin or whether the message in their hand is the only copy of it.
   */
  it("tells the webhook whether the lead was also stored", async () => {
    await post(validLead);
    expect(JSON.parse(String(webhook.mock.calls[0][1].body)).stored).toBe(true);

    webhook.mockClear();
    process.env.NEXT_PUBLIC_CONVEX_URL = "";

    await post(validLead);
    expect(JSON.parse(String(webhook.mock.calls[0][1].body)).stored).toBe(false);
  });

  it("refuses the lead only when there is nowhere at all for it to go", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";
    webhook.mockImplementation(async () => {
      throw new Error("webhook is down");
    });

    const res = await post(validLead);

    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ error: "backend_not_configured" });
  });
});

/*
 * The WhatsApp ping is the fastest route to somebody dialling back, so it is
 * wired straight into the route rather than through Convex like the
 * notification email. These specs pin that independence down: the ping has to
 * survive the store being gone, and it has to be enough on its own to keep a
 * lead from being refused.
 */
describe("POST /api/quote — the WhatsApp ping", () => {
  const GRAPH = "graph.facebook.com";

  /** Calls the route made to Meta, as opposed to the lead webhook. */
  const graphCalls = () => webhook.mock.calls.filter(([url]) => String(url).includes(GRAPH));

  beforeEach(() => {
    process.env.WHATSAPP_TOKEN = "test-token";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
    process.env.WHATSAPP_TO = "5146232787";
  });

  afterEach(() => {
    process.env.WHATSAPP_TOKEN = "";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "";
    process.env.WHATSAPP_TO = "";
  });

  it("pings the owner's phone with the lead", async () => {
    await post(validLead);

    expect(graphCalls()).toHaveLength(1);
    const body = JSON.parse(String(graphCalls()[0][1].body));
    expect(body.to).toBe("15146232787");
    const params = body.template.components[0].parameters.map((p: { text: string }) => p.text);
    expect(params).toContain("Jean Tremblay");
    expect(params).toContain("2011 Honda Civic");
  });

  it("marks an abandoned form as one, so it is not worked as a consented call", async () => {
    await post({ phone: "(514) 623-2787", partial: true, source: "hero_form" });

    const body = JSON.parse(String(graphCalls()[0][1].body));
    const params = body.template.components[0].parameters.map((p: { text: string }) => p.text);
    expect(params[0]).toContain("FORMULAIRE ABANDONNÉ");
  });

  /*
   * The whole reason it does not ride on Convex. A store outage already costs
   * the /admin record; it must not also cost the phone call.
   */
  it("still fires when Convex is unconfigured and the webhook is down", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";
    webhook.mockImplementation(async (url: string) => {
      if (!String(url).includes(GRAPH)) throw new Error("webhook is down");
      return new Response("{}", { status: 200 });
    });

    const res = await post(validLead);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(submit).not.toHaveBeenCalled();
    expect(graphCalls()).toHaveLength(1);
  });

  it("tells the owner when the message in their hand is the only copy", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";

    await post(validLead);

    const body = JSON.parse(String(graphCalls()[0][1].body));
    const params = body.template.components[0].parameters.map((p: { text: string }) => p.text);
    expect(params[4]).toContain("seule copie");
  });

  it("refuses the lead only when Convex, the webhook AND WhatsApp have all failed", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";
    webhook.mockImplementation(async () => {
      throw new Error("everything is down");
    });

    const res = await post(validLead);

    expect(res.status).toBe(503);
  });
});

describe("POST /api/quote — the SMS ping", () => {
  const TWILIO = "api.twilio.com";

  /** Calls the route made to Twilio, as opposed to the webhook or Meta. */
  const smsCalls = () => webhook.mock.calls.filter(([url]) => String(url).includes(TWILIO));

  /** The form-encoded body of the nth Twilio call. */
  const smsBody = (n = 0) => new URLSearchParams(String(smsCalls()[n][1].body));

  beforeEach(() => {
    process.env.TWILIO_ACCOUNT_SID = "ACtest";
    process.env.TWILIO_AUTH_TOKEN = "secret";
    process.env.TWILIO_FROM = "+15145550000";
    process.env.SMS_TO = "5147756790";
  });

  afterEach(() => {
    process.env.TWILIO_ACCOUNT_SID = "";
    process.env.TWILIO_AUTH_TOKEN = "";
    process.env.TWILIO_FROM = "";
    process.env.SMS_TO = "";
  });

  it("texts the dispatch phone with the lead", async () => {
    await post(validLead);

    expect(smsCalls()).toHaveLength(1);
    expect(smsBody().get("To")).toBe("+15147756790");
    const text = String(smsBody().get("Body"));
    expect(text).toContain("Jean Tremblay");
    expect(text).toContain("2011 Honda Civic");
  });

  /* The SMS banner is English; the WhatsApp template above stays French. */
  it("marks an abandoned form as one, so it is not worked as a consented call", async () => {
    await post({ phone: "(514) 623-2787", partial: true, source: "hero_form" });
    expect(String(smsBody().get("Body")).split("\n")[0]).toBe("ABANDONED FORM");
  });

  /*
    The whole reason this sink exists alongside WhatsApp. WhatsApp needs Meta
    to have approved a sender and a template; SMS needs neither, so during the
    weeks that approval is pending this is the only thing that buzzes.
  */
  it("still fires when WhatsApp is unconfigured and the webhook is down", async () => {
    process.env.WHATSAPP_TOKEN = "";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "";
    webhook.mockImplementation(async (url: string) =>
      String(url).includes(TWILIO)
        ? new Response("{}", { status: 201 })
        : Promise.reject(new Error("webhook is down"))
    );

    const res = await post(validLead);

    expect(res.status).toBe(200);
    expect(smsCalls()).toHaveLength(1);
  });

  /*
    The text is the only copy of the lead in this case, so it has to say so —
    whoever reads it needs to know that dismissing the notification loses it.
  */
  it("tells the owner when the text in their hand is the only copy", async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "";
    await post(validLead);
    expect(String(smsBody().get("Body"))).toContain("THE ONLY COPY");
  });

  it("does not refuse the lead when only Twilio is down", async () => {
    webhook.mockImplementation(async (url: string) =>
      String(url).includes(TWILIO)
        ? Promise.reject(new Error("twilio is down"))
        : new Response("{}", { status: 200 })
    );

    const res = await post(validLead);
    expect(res.status).toBe(200);
  });
});
