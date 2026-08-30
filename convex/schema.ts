import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Where a lead came from. Quotes typed by hand in the admin are "admin";
 * everything else arrives from the public site.
 */
export const sourceValidator = v.union(
  v.literal("website"),
  v.literal("phone"),
  v.literal("whatsapp"),
  v.literal("walk_in"),
  v.literal("admin")
);

/** Pipeline stage. Ordered from first contact to closed. */
export const statusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("quoted"),
  v.literal("scheduled"),
  v.literal("won"),
  v.literal("lost")
);

export default defineSchema({
  ...authTables,

  quotes: defineTable({
    // What the customer told us
    name: v.string(),
    phone: v.string(),
    /** Optional: the hero form asks for phone only — email is friction on a
     *  page whose job is getting the call. */
    email: v.optional(v.string()),
    vehicle: v.string(),
    condition: v.optional(v.string()),
    message: v.optional(v.string()),

    // How we're handling it
    status: statusValidator,
    source: sourceValidator,
    /** Amount offered, in CAD dollars. Set once we've quoted. */
    offerAmount: v.optional(v.number()),
    /** Internal notes — never shown to the customer. */
    notes: v.optional(v.string()),

    // Provenance
    /** "fr" or "en" — the language the customer used. */
    locale: v.optional(v.string()),
    /** Whether the notification email actually went out. */
    emailSent: v.optional(v.boolean()),
    emailError: v.optional(v.string()),

    archivedAt: v.optional(v.number()),
  })
    // The admin list is ordered by status, so index it.
    .index("by_status", ["status"])
    .index("by_archived", ["archivedAt"])
    // Lets us spot the same person submitting twice.
    .index("by_phone", ["phone"]),
});
