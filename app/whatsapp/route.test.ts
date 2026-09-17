import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { siteConfig } from "@/config/site";

/*
 * This redirect exists so the WhatsApp number never appears in the page, where
 * the call-tracking script would rewrite it into a line that has no WhatsApp
 * account. These specs hold the contract: the number is resolved here, on the
 * server, and the prefill still survives the hop.
 */
const call = (url: string) => GET(new Request(url));

describe("GET /whatsapp", () => {
  it("redirects to the real chat link", () => {
    const res = call("http://localhost/whatsapp");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(`https://wa.me/${siteConfig.whatsapp.number}`);
  });

  it("carries the prefill through, so the first message is already written", () => {
    const res = call(
      `http://localhost/whatsapp?text=${encodeURIComponent("Bonjour, j'ai une auto")}`
    );
    const location = new URL(String(res.headers.get("location")));

    expect(location.hostname).toBe("wa.me");
    expect(location.searchParams.get("text")).toBe("Bonjour, j'ai une auto");
  });

  /*
    307 and not 308: the destination is fixed but the prefill differs per
    button, and a permanent redirect would be cached against /whatsapp itself
    and hand one button's message to every other one.
  */
  it("is a temporary redirect, so one button's prefill is not cached for all", () => {
    expect(call("http://localhost/whatsapp?text=a").status).toBe(307);
  });

  it("caps a long prefill rather than passing it straight through", () => {
    const res = call(`http://localhost/whatsapp?text=${"x".repeat(5000)}`);
    const text = new URL(String(res.headers.get("location"))).searchParams.get("text");
    expect(text).toHaveLength(1000);
  });

  it("never sends the visitor anywhere but wa.me", () => {
    const res = call("http://localhost/whatsapp?text=https://evil.example/");
    expect(new URL(String(res.headers.get("location"))).origin).toBe("https://wa.me");
  });
});
