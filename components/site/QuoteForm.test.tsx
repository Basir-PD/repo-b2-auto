import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuoteForm from "@/components/site/QuoteForm";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

/** A filled-in, valid submission. */
async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/year, make and model/i), "2011 Honda Civic");
  await user.type(screen.getByLabelText(/first and last name/i), "Jean Tremblay");
  await user.type(screen.getByLabelText(/^phone$/i), "5146232787");
  await user.type(screen.getByLabelText(/postal code or city/i), "J7L 2W3");
}

const submit = () => screen.getByRole("button", { name: /get my quote/i });

beforeEach(() => {
  push.mockReset();
  window.dataLayer = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
  );
});

describe("QuoteForm — accessibility", () => {
  it("gives every input a real label, not just a placeholder", () => {
    render(<QuoteForm lang="en" />);
    // The labels float visually, but they must stay labels: a placeholder
    // disappears the moment someone types, taking the field's name with it.
    for (const name of [
      /year, make and model/i,
      /first and last name/i,
      /^phone$/i,
      /postal code or city/i,
    ]) {
      expect(screen.getByLabelText(name)).toBeInTheDocument();
    }
  });

  it("exposes the form for GTM and anchor links", () => {
    const { container } = render(<QuoteForm lang="en" source="hero_form" />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("id", "hero_form-form");
    // One stable selector so a single GTM trigger covers every page.
    expect(form).toHaveAttribute("data-quote-form", "hero_form");
    expect(container.querySelector("#quote-form")).toBeInTheDocument();
  });
});

describe("QuoteForm — validation", () => {
  it("blocks an empty submit and does not call the API", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await user.click(submit());

    // Every field is flagged. Asserting aria-invalid rather than counting
    // error text, because the text intentionally appears twice: once beside
    // the field and once in the aria-live region that announces it.
    await waitFor(() => {
      for (const name of [
        /year, make and model/i,
        /first and last name/i,
        /^phone$/i,
        /postal code or city/i,
      ]) {
        expect(screen.getByLabelText(name)).toHaveAttribute("aria-invalid", "true");
      }
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("rejects a phone number that is not ten digits", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await user.type(screen.getByLabelText(/year, make and model/i), "Civic");
    await user.type(screen.getByLabelText(/first and last name/i), "Jean");
    await user.type(screen.getByLabelText(/^phone$/i), "514623");
    await user.type(screen.getByLabelText(/postal code or city/i), "J7L");
    await user.click(submit());

    await waitFor(() => {
      expect(screen.getByLabelText(/^phone$/i)).toHaveAttribute("aria-invalid", "true");
    });
    expect(screen.getAllByText(/enter a valid phone number/i).length).toBeGreaterThan(0);
    // The other three were filled, so only the phone should be flagged.
    expect(screen.getByLabelText(/first and last name/i)).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("formats the phone number as it is typed", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    const phone = screen.getByLabelText(/^phone$/i);
    await user.type(phone, "5146232787");
    expect(phone).toHaveValue("(514) 623-2787");
  });

  it("announces errors to assistive tech", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuoteForm lang="en" />);
    await user.click(submit());

    const live = container.querySelector("[aria-live=polite]");
    await waitFor(() => expect(live?.textContent).toMatch(/required/i));
  });
});

describe("QuoteForm — successful submission", () => {
  it("posts the lead and redirects to the thank-you page", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" source="quote_page" />);

    await fillValid(user);
    await user.click(submit());

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    // Trailing slash matters: without it Next 308-redirects and sendBeacon,
    // which shares this endpoint, does not survive the hop.
    expect(url).toBe("/api/quote/");

    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({
      vehicle: "2011 Honda Civic",
      name: "Jean Tremblay",
      phone: "(514) 623-2787",
      postal: "J7L 2W3",
      partial: false,
      locale: "en",
      source: "quote_page",
    });

    // The thank-you page IS the conversion, so the navigation must happen.
    await waitFor(() => expect(push).toHaveBeenCalledWith("/en/thank-you/"));
  });

  it("sends French leads to the French thank-you page", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="fr" />);

    await user.type(screen.getByLabelText(/année, marque et modèle/i), "2011 Honda Civic");
    await user.type(screen.getByLabelText(/prénom et nom/i), "Jean Tremblay");
    await user.type(screen.getByLabelText(/téléphone/i), "5146232787");
    await user.type(screen.getByLabelText(/code postal ou ville/i), "J7L 2W3");
    await user.click(screen.getByRole("button", { name: /obtenir mon estimation/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/fr/merci/"));
  });

  it("fires generate_lead only after the API confirms", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" source="hero_form" />);

    await fillValid(user);
    expect(window.dataLayer?.some((e) => (e as { event?: string }).event === "generate_lead")).toBe(
      false
    );

    await user.click(submit());

    await waitFor(() => {
      const lead = window.dataLayer?.find(
        (e) => (e as { event?: string }).event === "generate_lead"
      );
      expect(lead).toMatchObject({ event: "generate_lead", source: "hero_form", currency: "CAD" });
    });
  });

  it("fires form_start once, on the first keystroke", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await user.type(screen.getByLabelText(/first and last name/i), "Jean");
    await user.type(screen.getByLabelText(/^phone$/i), "514");

    const starts = window.dataLayer?.filter(
      (e) => (e as { event?: string }).event === "form_start"
    );
    expect(starts).toHaveLength(1);
  });
});

describe("QuoteForm — failure handling", () => {
  it("tells a throttled visitor to call instead of claiming it broke", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 429 }))
    );
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await fillValid(user);
    await user.click(submit());

    expect(await screen.findByText(/too many attempts/i)).toBeInTheDocument();
    // A throttled person is still a lead: never send them away.
    expect(screen.getByRole("alert")).toHaveTextContent(/623-2787/);
    expect(push).not.toHaveBeenCalled();
  });

  it("shows the error state on a server failure and keeps the data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 502 }))
    );
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await fillValid(user);
    await user.click(submit());

    expect(await screen.findByRole("alert")).toHaveTextContent(/didn't go through/i);
    // Nothing typed is lost, so the visitor can retry without re-entering.
    expect(screen.getByLabelText(/first and last name/i)).toHaveValue("Jean Tremblay");
    expect(push).not.toHaveBeenCalled();
  });

  it("does not fire generate_lead when the API rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 502 }))
    );
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await fillValid(user);
    await user.click(submit());

    await screen.findByRole("alert");
    // A conversion that did not happen must never be reported to Ads.
    expect(window.dataLayer?.some((e) => (e as { event?: string }).event === "generate_lead")).toBe(
      false
    );
  });

  it("re-enables the button after a failure so the visitor can retry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 502 }))
    );
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await fillValid(user);
    await user.click(submit());

    await screen.findByRole("alert");
    expect(submit()).toBeEnabled();
  });
});

describe("QuoteForm — partial capture", () => {
  it("beacons an abandoned lead once a valid phone number exists", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" source="hero_form" />);

    await user.type(screen.getByLabelText(/^phone$/i), "5146232787");
    window.dispatchEvent(new Event("pagehide"));

    await waitFor(() => expect(navigator.sendBeacon).toHaveBeenCalledTimes(1));
    const [url] = (navigator.sendBeacon as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/quote/");
  });

  it("does not beacon an incomplete phone number", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await user.type(screen.getByLabelText(/^phone$/i), "514");
    window.dispatchEvent(new Event("pagehide"));

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });

  it("does not beacon after a successful submit", async () => {
    const user = userEvent.setup();
    render(<QuoteForm lang="en" />);

    await fillValid(user);
    await user.click(submit());
    await waitFor(() => expect(push).toHaveBeenCalled());

    window.dispatchEvent(new Event("pagehide"));
    // Otherwise every conversion arrives twice, once flagged as abandoned.
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
});
