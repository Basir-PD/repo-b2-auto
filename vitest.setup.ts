import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * jsdom does not implement these, and the quote form uses both: sendBeacon
 * for partial capture, matchMedia for the reduced-motion checks. Stubbing
 * them here keeps every spec from having to.
 */
Object.defineProperty(navigator, "sendBeacon", {
  writable: true,
  value: vi.fn(() => true),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
