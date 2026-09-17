import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { siteConfig } from "@/config/site";
import { NO_SWAP } from "@/lib/tracking";
import WhatsAppLink from "./WhatsAppLink";
import WhatsAppFloat from "./WhatsAppFloat";
import MobileContactBar from "./MobileContactBar";

/*
 * Every anchor whose href carries the WhatsApp number has to opt out of
 * call-tracking number swapping.
 *
 * WhatConverts rewrites numbers it finds into a rented tracking line, which is
 * right for `tel:` and catastrophic for wa.me: the tracking number is an
 * ordinary phone line with no WhatsApp account, so the button opens WhatsApp
 * only to be told the number "isn't on WhatsApp". Nothing about the page looks
 * broken, no error is logged, and the lead is simply gone.
 *
 * These specs exist because that failure is invisible. A future edit that
 * rebuilds one of these buttons and drops the class would cost WhatsApp leads
 * silently for as long as it took somebody to click their own button.
 */

// The bar hides itself on the homepage, so the specs run it on another route.
vi.mock("next/navigation", () => ({ usePathname: () => "/fr/vendre-mon-auto/" }));

const waPath = siteConfig.whatsapp.clickPath;

describe("WhatsApp links opt out of call-tracking number swapping", () => {
  it("marks the inline WhatsApp button", () => {
    render(<WhatsAppLink source="hero" label="WhatsApp" />);

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveClass(NO_SWAP);
    expect(link).toHaveAttribute("href", expect.stringContaining(waPath));
  });

  it("marks the button even when a prefill is seeded into the chat", () => {
    render(<WhatsAppLink source="hero" label="WhatsApp" prefill="Bonjour, j'ai une auto" />);

    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveClass(NO_SWAP);
    expect(link.getAttribute("href")).toContain(waPath);
  });

  it("marks the desktop floating button", () => {
    render(<WhatsAppFloat ariaLabel="Nous écrire sur WhatsApp" />);

    const link = screen.getByRole("link", { name: "Nous écrire sur WhatsApp" });
    expect(link).toHaveClass(NO_SWAP);
    expect(link).toHaveAttribute("href", expect.stringContaining(waPath));
  });

  it("marks the WhatsApp half of the mobile bar and leaves the call half swappable", () => {
    /*
      The bar parks itself off-screen behind aria-hidden and inert until the
      visitor is 150px down, and a hidden element is not in the accessibility
      tree, so it has to be scrolled into existence before it can be queried.
    */
    Object.defineProperty(window, "scrollY", { value: 200, configurable: true });

    render(<MobileContactBar callLabel="Appeler" whatsappLabel="WhatsApp" prefill="Bonjour" />);

    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsapp).toHaveClass(NO_SWAP);
    expect(whatsapp.getAttribute("href")).toContain(waPath);

    /*
      The other half of the bar is a tel: link and MUST stay swappable — if
      this ever picks up the class, call tracking silently measures nothing.
    */
    const call = screen.getByRole("link", { name: /appeler/i });
    expect(call).not.toHaveClass(NO_SWAP);
    expect(call.getAttribute("href")).toMatch(/^tel:/);
  });
});

/*
 * The invariant that actually matters, and the reason the `no-swap` class was
 * not enough: a call-tracking script cannot rewrite a number that is not there.
 * If any of these buttons ever renders the raw wa.me URL again, the swapper
 * gets something to match and the button dies silently.
 */
describe("the WhatsApp number never reaches the DOM", () => {
  const digits = siteConfig.whatsapp.number;

  it("keeps the number out of the inline button", () => {
    const { container } = render(<WhatsAppLink source="hero" label="WhatsApp" prefill="Bonjour" />);
    expect(container.innerHTML).not.toContain(digits);
    expect(container.innerHTML).not.toContain("wa.me");
  });

  it("keeps the number out of the floating button", () => {
    const { container } = render(<WhatsAppFloat ariaLabel="WhatsApp" />);
    expect(container.innerHTML).not.toContain(digits);
    expect(container.innerHTML).not.toContain("wa.me");
  });

  it("keeps the number out of the mobile bar", () => {
    Object.defineProperty(window, "scrollY", { value: 200, configurable: true });
    const { container } = render(
      <MobileContactBar callLabel="Appeler" whatsappLabel="WhatsApp" prefill="Bonjour" />
    );
    expect(container.innerHTML).not.toContain("wa.me");
  });
});
