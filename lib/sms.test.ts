import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSmsBody, type LeadSms, sendLeadSms, smsIsConfigured } from "./sms";

/*
 * Twilio is a bare `fetch`, so it is stubbed globally. Every spec asserts on
 * what we would have sent rather than on Twilio's behaviour — the things that
 * actually go wrong here are the encoding, the auth header and the recipient
 * parsing, and all three fail as an opaque 400 from the outside.
 */
const twilio = vi.fn(
  async (_url: string, _init: RequestInit) => new Response("{}", { status: 201 })
);
vi.stubGlobal("fetch", twilio);

const lead: LeadSms = {
  name: "Jean Tremblay",
  phone: "(514) 623-2787",
  vehicle: "2011 Honda Civic",
  partial: false,
  source: "quote_page",
  postal: "J7L 2W3",
  stored: true,
};

/** The form-encoded body of the nth request, parsed back into params. */
function sent(n = 0) {
  return new URLSearchParams(String(twilio.mock.calls[n][1].body));
}

const ENV_KEYS = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM", "SMS_TO"] as const;

beforeEach(() => {
  twilio.mockClear();
  twilio.mockImplementation(async () => new Response("{}", { status: 201 }));
  process.env.TWILIO_ACCOUNT_SID = "ACtest";
  process.env.TWILIO_AUTH_TOKEN = "secret";
  process.env.TWILIO_FROM = "+15145550000";
  process.env.SMS_TO = "5147756790";
});

afterEach(() => {
  // Emptied rather than deleted, matching lib/whatsapp.test.ts — `env()`
  // trims, so "" reads as unset everywhere it matters.
  for (const key of ENV_KEYS) process.env[key] = "";
  vi.restoreAllMocks();
});

describe("smsIsConfigured", () => {
  it.each(ENV_KEYS.filter((k) => k !== "SMS_TO"))("is false without %s", async (key) => {
    process.env[key] = "";
    expect(smsIsConfigured()).toBe(false);
  });

  it("is true with the three Twilio values, since the recipient has a default", () => {
    process.env.SMS_TO = "";
    expect(smsIsConfigured()).toBe(true);
  });
});

describe("sendLeadSms — when Twilio is not configured", () => {
  /*
    The site has to run unchanged before Twilio exists. A module that threw,
    or even logged, on every submission would turn "not set up yet" into noise
    that hides the failures that matter.
  */
  it("sends nothing and reports false rather than throwing", async () => {
    process.env.TWILIO_ACCOUNT_SID = "";
    await expect(sendLeadSms(lead)).resolves.toBe(false);
    expect(twilio).not.toHaveBeenCalled();
  });
});

describe("sendLeadSms — the request", () => {
  it("posts form-encoded, not JSON — Twilio rejects JSON on this endpoint", async () => {
    await sendLeadSms(lead);
    const init = twilio.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );
    expect(String(init.body)).not.toMatch(/^\{/);
  });

  it("authenticates with Basic auth, SID as the username", async () => {
    await sendLeadSms(lead);
    const init = twilio.mock.calls[0][1] as RequestInit;
    const header = (init.headers as Record<string, string>).Authorization;
    expect(header.startsWith("Basic ")).toBe(true);
    expect(Buffer.from(header.slice(6), "base64").toString()).toBe("ACtest:secret");
  });

  it("posts to the account's Messages endpoint", async () => {
    await sendLeadSms(lead);
    expect(String(twilio.mock.calls[0][0])).toBe(
      "https://api.twilio.com/2010-04-01/Accounts/ACtest/Messages.json"
    );
  });

  it("sends From and To in E.164", async () => {
    await sendLeadSms(lead);
    expect(sent().get("From")).toBe("+15145550000");
    expect(sent().get("To")).toBe("+15147756790");
  });
});

describe("recipient parsing", () => {
  it("adds the country code to a ten-digit number", async () => {
    process.env.SMS_TO = "5147756790";
    await sendLeadSms(lead);
    expect(sent().get("To")).toBe("+15147756790");
  });

  /*
    The trap lib/whatsapp.ts documents, re-tested here because it is the one
    that fails silently: splitting on whitespace would tear a single spaced
    number into fragments, leaving no recipients, no text and no error.
  */
  it("keeps a spaced number whole instead of splitting it into fragments", async () => {
    process.env.SMS_TO = "+1 514 775 6790";
    await sendLeadSms(lead);
    expect(twilio).toHaveBeenCalledTimes(1);
    expect(sent().get("To")).toBe("+15147756790");
  });

  it("texts every recipient when several are listed", async () => {
    process.env.SMS_TO = "5147756790, +1 514 623 2787";
    await sendLeadSms(lead);
    expect(twilio).toHaveBeenCalledTimes(2);
    expect([sent(0).get("To"), sent(1).get("To")]).toEqual(["+15147756790", "+15146232787"]);
  });

  it("skips an unusable entry but still texts the good one", async () => {
    process.env.SMS_TO = "not-a-number, 5147756790";
    await expect(sendLeadSms(lead)).resolves.toBe(true);
    expect(twilio).toHaveBeenCalledTimes(1);
    expect(sent().get("To")).toBe("+15147756790");
  });

  it("falls back to the dispatch phone when SMS_TO is unset", async () => {
    process.env.SMS_TO = "";
    await sendLeadSms(lead);
    expect(sent().get("To")).toBe("+15147756790");
  });
});

describe("the message body", () => {
  it("leads with the name and the number, which is what a lock screen shows", () => {
    const body = buildSmsBody(lead);
    expect(body.split("\n")[0]).toContain("Jean Tremblay");
    expect(body.split("\n")[1]).toContain("514");
  });

  it("marks an abandoned form in the first line", () => {
    expect(buildSmsBody({ ...lead, partial: true }).split("\n")[0]).toContain("ABANDONNÉ");
  });

  /*
    The one case where the text is the only copy of the lead. Whoever reads it
    has to know that closing the notification loses it.
  */
  it("warns when the lead never reached /admin", () => {
    expect(buildSmsBody({ ...lead, stored: false })).toContain("seule copie");
  });

  it("says nothing about /admin when the lead is safely stored", () => {
    expect(buildSmsBody(lead)).not.toContain("seule copie");
  });

  it("collapses newlines out of the fields so one lead is one message", () => {
    const body = buildSmsBody({ ...lead, vehicle: "Civic\n\n2011\nrouge" });
    expect(body).toContain("Civic 2011 rouge");
  });

  it("stays within two SMS segments", () => {
    const body = buildSmsBody({
      ...lead,
      name: "X".repeat(200),
      vehicle: "Y".repeat(400),
      source: "Z".repeat(100),
    });
    expect(body.length).toBeLessThanOrEqual(320);
  });
});

describe("sendLeadSms — failure handling", () => {
  it("reports false when Twilio rejects it, instead of throwing at the route", async () => {
    twilio.mockImplementation(async () => new Response("bad number", { status: 400 }));
    await expect(sendLeadSms(lead)).resolves.toBe(false);
  });

  it("swallows a network error rather than failing the submission", async () => {
    twilio.mockImplementation(async () => {
      throw new Error("twilio is down");
    });
    await expect(sendLeadSms(lead)).resolves.toBe(false);
  });

  /*
    Two recipients, one rejected. The route reads this boolean to decide
    whether ANY human was paged, so a partial success has to read as success
    — otherwise a single stale number in SMS_TO would look like total silence.
  */
  it("is true when at least one recipient was accepted", async () => {
    process.env.SMS_TO = "5147756790, 5146232787";
    let call = 0;
    twilio.mockImplementation(async () => {
      call += 1;
      return call === 1
        ? new Response("nope", { status: 400 })
        : new Response("{}", { status: 201 });
    });
    await expect(sendLeadSms(lead)).resolves.toBe(true);
  });
});
