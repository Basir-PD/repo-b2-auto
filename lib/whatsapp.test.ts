import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendLeadWhatsApp, whatsappIsConfigured, type LeadPing } from "./whatsapp";

/*
 * The Graph API is a bare `fetch`, so it is stubbed globally. Every spec asserts
 * on what we would have sent rather than on Meta's behaviour — the parts that go
 * wrong in production are the payload shape and the parameter contents, and both
 * fail as a flat 400 that tells you nothing from the outside.
 */
const graph = vi.fn(
  async (_url: string, _init: RequestInit) => new Response("{}", { status: 200 })
);
vi.stubGlobal("fetch", graph);

const lead: LeadPing = {
  name: "Jean Tremblay",
  phone: "(514) 623-2787",
  vehicle: "2011 Honda Civic",
  partial: false,
  source: "quote_page",
  postal: "J7L 2W3",
  stored: true,
};

/** The body of the nth request, parsed. */
function sent(n = 0) {
  return JSON.parse(String(graph.mock.calls[n][1].body));
}

/** The five template variables of the nth request, in order. */
function params(n = 0): string[] {
  return sent(n).template.components[0].parameters.map((p: { text: string }) => p.text);
}

beforeEach(() => {
  graph.mockClear();
  graph.mockImplementation(async () => new Response("{}", { status: 200 }));
  process.env.WHATSAPP_TOKEN = "test-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890";
  process.env.WHATSAPP_TO = "5146232787";
  process.env.WHATSAPP_TEMPLATE = "nouveau_lead";
  process.env.WHATSAPP_TEMPLATE_LANG = "fr";
});

afterEach(() => {
  for (const key of [
    "WHATSAPP_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_TO",
    "WHATSAPP_TEMPLATE",
    "WHATSAPP_TEMPLATE_LANG",
    "WHATSAPP_API_VERSION",
  ]) {
    process.env[key] = "";
  }
});

describe("whatsappIsConfigured", () => {
  it("is true only when the token, the sender and a recipient are all present", () => {
    expect(whatsappIsConfigured()).toBe(true);
  });

  /*
   * `= ""` and not `delete`, for the reason the route specs give: Node coerces
   * an assigned undefined to the string "undefined", which is truthy.
   */
  it("is false without a token, which is the half-finished setup", () => {
    process.env.WHATSAPP_TOKEN = "";
    expect(whatsappIsConfigured()).toBe(false);
  });

  it("is false without a sender id", () => {
    process.env.WHATSAPP_PHONE_NUMBER_ID = "";
    expect(whatsappIsConfigured()).toBe(false);
  });

  /* The recipient has a committed default, so it cannot be the missing piece. */
  it("is true with no WHATSAPP_TO, falling back to the dispatch phone", () => {
    process.env.WHATSAPP_TO = "";
    expect(whatsappIsConfigured()).toBe(true);
  });

  it("is false when the only recipient given is not a dialable number", () => {
    process.env.WHATSAPP_TO = "call the office";
    expect(whatsappIsConfigured()).toBe(false);
  });
});

describe("sendLeadWhatsApp — when Meta is not wired up", () => {
  it("does nothing at all rather than failing loudly", async () => {
    process.env.WHATSAPP_TOKEN = "";
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(false);
    expect(graph).not.toHaveBeenCalled();
  });
});

describe("sendLeadWhatsApp — the request", () => {
  it("posts a template message to the sender's messages endpoint", async () => {
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);

    expect(graph).toHaveBeenCalledTimes(1);
    const [url, init] = graph.mock.calls[0];
    expect(url).toBe("https://graph.facebook.com/v21.0/1234567890/messages");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-token");

    const body = sent();
    expect(body.messaging_product).toBe("whatsapp");
    expect(body.type).toBe("template");
    expect(body.template.name).toBe("nouveau_lead");
    expect(body.template.language.code).toBe("fr");
    expect(params()).toHaveLength(5);
  });

  it("gives a ten-digit recipient the country code Meta requires", async () => {
    await sendLeadWhatsApp(lead);
    expect(sent().to).toBe("15146232787");
  });

  it("leaves a number that already carries a country code alone", async () => {
    process.env.WHATSAPP_TO = "+1 514 623 2787";
    await sendLeadWhatsApp(lead);
    expect(sent().to).toBe("15146232787");
  });

  it("pings every recipient, so a second phone can be added without a deploy", async () => {
    process.env.WHATSAPP_TO = "5146232787, 4389998888";
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);

    expect(graph).toHaveBeenCalledTimes(2);
    expect([sent(0).to, sent(1).to].sort()).toEqual(["14389998888", "15146232787"]);
  });

  it("honours a pinned Graph version", async () => {
    process.env.WHATSAPP_API_VERSION = "v22.0";
    await sendLeadWhatsApp(lead);
    expect(String(graph.mock.calls[0][0])).toContain("/v22.0/");
  });
});

describe("sendLeadWhatsApp — what the parameters say", () => {
  it("leads with the lead's state, which is what shows in the notification", async () => {
    await sendLeadWhatsApp(lead);
    expect(params()[0]).toBe("Formulaire complété");

    graph.mockClear();
    await sendLeadWhatsApp({ ...lead, partial: true });
    expect(params()[0]).toContain("FORMULAIRE ABANDONNÉ");
  });

  it("carries the name, the number and the vehicle", async () => {
    await sendLeadWhatsApp(lead);
    expect(params().slice(1, 4)).toEqual(["Jean Tremblay", "(514) 623-2787", "2011 Honda Civic"]);
  });

  it("says whether /admin also has the lead or whether this is the only copy", async () => {
    await sendLeadWhatsApp(lead);
    expect(params()[4]).toContain("copie dans /admin");
    expect(params()[4]).toContain("secteur J7L 2W3");
    expect(params()[4]).toContain("source quote_page");

    graph.mockClear();
    await sendLeadWhatsApp({ ...lead, stored: false });
    expect(params()[4]).toContain("seule copie");
  });

  /*
   * The one that actually bites. Meta rejects a parameter containing a newline,
   * a tab, or four consecutive spaces, and it rejects the WHOLE message with a
   * 400 — so one pasted multi-line vehicle description would silence the ping
   * for that lead and look exactly like a config problem.
   */
  it("flattens whitespace, because a newline in one parameter 400s the send", async () => {
    await sendLeadWhatsApp({
      ...lead,
      vehicle: "2011 Honda Civic\nne démarre pas\t\tclé perdue",
      name: "Jean    Tremblay",
    });

    const [, name, , vehicle] = params();
    expect(vehicle).toBe("2011 Honda Civic ne démarre pas clé perdue");
    expect(name).toBe("Jean Tremblay");
    for (const value of params()) {
      expect(value).not.toMatch(/[\n\t]|\s{4}/);
    }
  });

  /* An empty parameter is refused too, so nothing may ever be blank. */
  it("never sends an empty parameter", async () => {
    await sendLeadWhatsApp({ ...lead, name: "", vehicle: "   ", postal: undefined });
    for (const value of params()) {
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe("sendLeadWhatsApp — when the template will not send", () => {
  /** Refuse the template, accept free text. The state during setup. */
  function templateRefused() {
    graph.mockImplementation(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      return body.type === "template"
        ? new Response('{"error":{"message":"template name does not exist"}}', { status: 404 })
        : new Response("{}", { status: 200 });
    });
  }

  it("falls back to free text so the wiring can be proven before Meta approves", async () => {
    templateRefused();
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);

    expect(graph).toHaveBeenCalledTimes(2);
    const fallback = sent(1);
    expect(fallback.type).toBe("text");
    expect(fallback.text.body).toContain("Jean Tremblay");
    expect(fallback.text.body).toContain("(514) 623-2787");
    expect(fallback.text.body).toContain("2011 Honda Civic");
  });

  it("reports failure once neither shape is accepted", async () => {
    graph.mockImplementation(async () => new Response('{"error":{}}', { status: 400 }));
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(false);
  });

  it("swallows a network error instead of throwing at the route", async () => {
    graph.mockImplementation(async () => {
      throw new Error("socket hang up");
    });
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(false);
  });

  it("counts the ping as delivered when one of two phones accepted it", async () => {
    process.env.WHATSAPP_TO = "5146232787, 4389998888";
    let call = 0;
    graph.mockImplementation(async () => {
      call += 1;
      return call === 1 ? new Response("{}", { status: 500 }) : new Response("{}", { status: 200 });
    });

    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);
  });
});

describe("sendLeadWhatsApp — how WHATSAPP_TO is read", () => {
  /*
   * The number the shop actually dispatches from. Committed so that wiring
   * WhatsApp up cannot half-work: forget this variable and the ping still goes
   * to a real phone rather than nowhere.
   */
  it("pings the dispatch phone when WHATSAPP_TO is unset", async () => {
    process.env.WHATSAPP_TO = "";
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);
    expect(sent().to).toBe("15147756790");
  });

  it("lets WHATSAPP_TO override the default", async () => {
    process.env.WHATSAPP_TO = "4389998888";
    await sendLeadWhatsApp(lead);
    expect(sent().to).toBe("14389998888");
  });

  /*
   * Regression. The separator used to include \s, so the most natural way to
   * write the variable — "+1 514 623 2787" — parsed as four unusable fragments,
   * left no recipients, and produced neither a ping nor a complaint.
   */
  it("accepts a number written with spaces and brackets", async () => {
    process.env.WHATSAPP_TO = "+1 (514) 623-2787";
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);
    expect(sent().to).toBe("15146232787");
  });

  it("still pings the good number when another entry is a typo", async () => {
    process.env.WHATSAPP_TO = "5146232787, 51462";
    await expect(sendLeadWhatsApp(lead)).resolves.toBe(true);
    expect(graph).toHaveBeenCalledTimes(1);
    expect(sent().to).toBe("15146232787");
  });
});
