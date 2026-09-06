import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mutate = vi.fn();
vi.mock("convex/react", () => ({ useMutation: () => mutate }));
vi.mock("@/convex/_generated/api", () => ({ api: { quotes: { create: "c", update: "u" } } }));

const { default: QuoteEditor } = await import("./QuoteEditor");

/*
 * These specs exist because an earlier fix was cosmetic: onKeyDown was bound
 * to the backdrop <div>, which is not focusable, so Escape did nothing until
 * focus was already inside. It satisfied the linter and left the dialog a
 * keyboard trap in exactly the state it opens in.
 */
describe("QuoteEditor — keyboard access", () => {
  it("closes on Escape when focus is still on body, as it is on open", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<QuoteEditor quote={null} onClose={onClose} />);

    document.body.focus();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape when focus is inside the form", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<QuoteEditor quote={null} onClose={onClose} />);

    await user.click(screen.getByLabelText(/name/i));
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog so the next Tab stays inside it", () => {
    render(<QuoteEditor quote={null} onClose={vi.fn()} />);
    // Otherwise a keyboard user tabs on through the page behind the overlay.
    expect(document.activeElement).toBe(screen.getByRole("dialog"));
  });

  it("hands focus back to whatever opened it", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = render(<QuoteEditor quote={null} onClose={vi.fn()} />);
    expect(document.activeElement).not.toBe(opener);

    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("stops listening once unmounted", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(<QuoteEditor quote={null} onClose={onClose} />);
    unmount();

    await user.keyboard("{Escape}");
    // A leaked document listener would keep firing for every later dialog.
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("QuoteEditor — dialog semantics", () => {
  it("announces itself as a modal dialog with a name", () => {
    render(<QuoteEditor quote={null} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName(/add a quote/i);
  });

  it("closes on a backdrop click but not on a click inside", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<QuoteEditor quote={null} onClose={onClose} />);

    await user.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(container.querySelector("[role=presentation]") as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
