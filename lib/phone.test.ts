import { describe, expect, it } from "vitest";
import { digitsOf, formatPhone, normalizePhone, phoneIsValid, toE164 } from "@/lib/phone";

describe("phoneIsValid", () => {
  it("accepts a plain ten-digit number", () => {
    expect(phoneIsValid("5146232787")).toBe(true);
  });

  it("accepts the formatted shape a visitor actually sees", () => {
    expect(phoneIsValid("(514) 623-2787")).toBe(true);
  });

  it("accepts a leading country code", () => {
    expect(phoneIsValid("1 514 623 2787")).toBe(true);
    expect(phoneIsValid("+1 (514) 623-2787")).toBe(true);
  });

  it("rejects too few and too many digits", () => {
    expect(phoneIsValid("514623278")).toBe(false);
    expect(phoneIsValid("514623278712")).toBe(false);
  });

  /*
   * The bug this module exists to close: the API used to validate with
   * /^[+()\d\s.-]{10,20}$/, which is a length check over an alphabet that
   * happens to include digits — so punctuation alone passed and the lead
   * arrived with nothing dialable in it.
   */
  it("rejects punctuation with no digits, which the old server regex accepted", () => {
    expect(phoneIsValid("((((((((((")).toBe(false);
    expect(phoneIsValid("----------")).toBe(false);
    expect(phoneIsValid("          ")).toBe(false);
  });

  it("rejects empty and clearly non-numeric input", () => {
    expect(phoneIsValid("")).toBe(false);
    expect(phoneIsValid("call me")).toBe(false);
  });
});

describe("formatPhone", () => {
  it("formats progressively as digits arrive", () => {
    expect(formatPhone("5")).toBe("5");
    expect(formatPhone("514")).toBe("514");
    expect(formatPhone("5146")).toBe("(514) 6");
    expect(formatPhone("514623")).toBe("(514) 623");
    expect(formatPhone("5146232787")).toBe("(514) 623-2787");
  });

  it("is idempotent, so re-rendering a formatted value cannot corrupt it", () => {
    const once = formatPhone("5146232787");
    expect(formatPhone(once)).toBe(once);
  });

  it("strips a leading 1 rather than shifting every group", () => {
    expect(formatPhone("15146232787")).toBe("(514) 623-2787");
  });

  it("ignores letters instead of rejecting the keystroke", () => {
    expect(formatPhone("514abc6232787")).toBe("(514) 623-2787");
  });
});

describe("digitsOf / normalizePhone", () => {
  it("caps length so a pasted wall of text cannot grow unbounded", () => {
    expect(digitsOf("9".repeat(500))).toHaveLength(11);
  });

  it("keeps a leading 1 when it is not a country code", () => {
    // Ten digits starting with 1 is a real number, not 1 + ten.
    expect(normalizePhone("1514623278")).toBe("1514623278");
  });
});

describe("toE164", () => {
  it("produces a dialable value for valid input", () => {
    expect(toE164("(514) 623-2787")).toBe("+15146232787");
  });

  it("returns null rather than a malformed string", () => {
    expect(toE164("514")).toBeNull();
  });
});
