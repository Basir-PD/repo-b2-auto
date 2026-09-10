import { beforeEach, describe, expect, it, vi } from "vitest";

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
