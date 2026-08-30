import { v, ConvexError } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { isAdminEmail } from "./auth";
import { sourceValidator, statusValidator } from "./schema";

const MAX_FIELD = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{10,20}$/;

/**
 * Every admin function funnels through here. Being signed in is not
 * enough — the account's email must still be on the ADMIN_EMAILS
 * allowlist, so removing an address revokes access immediately even
 * if the user holds a valid session.
 */
async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Not signed in.");
  }

  const user = await ctx.db.get(userId);
  if (!user || !isAdminEmail((user as { email?: string }).email)) {
    throw new ConvexError("Not authorised.");
  }

  return { userId, user };
}

function clean(value: string | undefined, max = MAX_FIELD) {
  return (value ?? "").trim().slice(0, max);
}

/* ══════════════════════════════════════════════════════════════════
   PUBLIC — called by the website's quote form via /api/quote
   ══════════════════════════════════════════════════════════════════ */

/**
 * Records a quote request and schedules the notification email.
 *
 * The write happens first and the email second, so a mail outage can
 * never lose a lead — it lands in the admin either way, flagged with
 * whatever the mail provider said.
 *
 * Set INGEST_SECRET on the Convex deployment to require a shared
 * secret here (`npx convex env set INGEST_SECRET "<random>"`, and the
 * same value as INGEST_SECRET in the Next app). While it is unset the
 * endpoint accepts anonymous writes, which is enough to invite spam.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    vehicle: v.string(),
    condition: v.optional(v.string()),
    message: v.optional(v.string()),
    locale: v.optional(v.string()),
    secret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expectedSecret = process.env.INGEST_SECRET;
    if (expectedSecret && args.secret !== expectedSecret) {
      throw new ConvexError("Not authorised.");
    }

    const name = clean(args.name, 200);
    const phone = clean(args.phone, 40);
    const email = clean(args.email, 200).toLowerCase() || undefined;
    const vehicle = clean(args.vehicle, 300);

    if (!name) throw new ConvexError("Name is required.");
    if (!PHONE_RE.test(phone)) throw new ConvexError("A valid phone number is required.");
    // Email is optional, but a malformed one is still worth rejecting.
    if (email && !EMAIL_RE.test(email)) throw new ConvexError("That email address doesn't look valid.");
    if (!vehicle) throw new ConvexError("Vehicle details are required.");

    const quoteId = await ctx.db.insert("quotes", {
      name,
      phone,
      email,
      vehicle,
      condition: clean(args.condition, 200) || undefined,
      message: clean(args.message) || undefined,
      locale: args.locale === "en" ? "en" : "fr",
      status: "new",
      source: "website",
    });

    // Fire-and-forget: a mail failure is recorded on the quote, not thrown.
    await ctx.scheduler.runAfter(0, internal.emails.sendQuoteNotification, { quoteId });

    return { quoteId };
  },
});

/** Loads a quote for the email action. Internal only. */
export const loadQuote = internalQuery({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }) => await ctx.db.get(quoteId),
});

/** Records the outcome of the notification email. Internal only. */
export const recordEmailResult = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    emailSent: v.boolean(),
    emailError: v.optional(v.string()),
  },
  handler: async (ctx, { quoteId, emailSent, emailError }) => {
    await ctx.db.patch(quoteId, { emailSent, emailError });
  },
});

/* ══════════════════════════════════════════════════════════════════
   ADMIN — every function below requires an allowlisted account
   ══════════════════════════════════════════════════════════════════ */

/** The signed-in admin, or null. Used to decide what the page renders. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const user = await ctx.db.get(userId);
    const email = (user as { email?: string } | null)?.email;
    if (!isAdminEmail(email)) return null;

    return { email: email ?? null };
  },
});

export const list = query({
  args: {
    status: v.optional(statusValidator),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, { status, includeArchived }) => {
    await requireAdmin(ctx);

    const rows = status
      ? await ctx.db.query("quotes").withIndex("by_status", (q) => q.eq("status", status)).collect()
      : await ctx.db.query("quotes").collect();

    return rows
      .filter((row) => (includeArchived ? true : row.archivedAt === undefined))
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }) => {
    await requireAdmin(ctx);
    return await ctx.db.get(quoteId);
  },
});

/** Counts per pipeline stage, for the dashboard header. */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const rows = await ctx.db.query("quotes").collect();
    const live = rows.filter((r) => r.archivedAt === undefined);

    const byStatus: Record<string, number> = {
      new: 0, contacted: 0, quoted: 0, scheduled: 0, won: 0, lost: 0,
    };
    for (const row of live) byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;

    const wonValue = live
      .filter((r) => r.status === "won")
      .reduce((sum, r) => sum + (r.offerAmount ?? 0), 0);

    return {
      total: live.length,
      archived: rows.length - live.length,
      byStatus,
      wonValue,
      emailFailures: live.filter((r) => r.emailSent === false).length,
    };
  },
});

/** Adds a quote by hand — a phone or walk-in lead. */
export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    vehicle: v.string(),
    condition: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.optional(sourceValidator),
    status: v.optional(statusValidator),
    offerAmount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const name = clean(args.name, 200);
    const phone = clean(args.phone, 40);
    const vehicle = clean(args.vehicle, 300);

    if (!name) throw new ConvexError("Name is required.");
    if (!phone) throw new ConvexError("Phone number is required.");
    if (!vehicle) throw new ConvexError("Vehicle details are required.");

    return await ctx.db.insert("quotes", {
      name,
      phone,
      // Typed-in leads often have no email; the field stays empty rather than fake.
      email: clean(args.email, 200).toLowerCase() || undefined,
      vehicle,
      condition: clean(args.condition, 200) || undefined,
      message: clean(args.message) || undefined,
      notes: clean(args.notes) || undefined,
      offerAmount: args.offerAmount,
      status: args.status ?? "new",
      source: args.source ?? "phone",
    });
  },
});

export const update = mutation({
  args: {
    quoteId: v.id("quotes"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    condition: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.optional(statusValidator),
    source: v.optional(sourceValidator),
    offerAmount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { quoteId, ...fields }) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(quoteId);
    if (!existing) throw new ConvexError("That quote no longer exists.");

    // Only patch what was actually sent, so a partial edit can't blank a field.
    const patch: Record<string, unknown> = {};
    if (fields.name !== undefined) patch.name = clean(fields.name, 200);
    if (fields.phone !== undefined) patch.phone = clean(fields.phone, 40);
    if (fields.email !== undefined) patch.email = clean(fields.email, 200).toLowerCase();
    if (fields.vehicle !== undefined) patch.vehicle = clean(fields.vehicle, 300);
    if (fields.condition !== undefined) patch.condition = clean(fields.condition, 200) || undefined;
    if (fields.message !== undefined) patch.message = clean(fields.message) || undefined;
    if (fields.notes !== undefined) patch.notes = clean(fields.notes) || undefined;
    if (fields.status !== undefined) patch.status = fields.status;
    if (fields.source !== undefined) patch.source = fields.source;
    if (fields.offerAmount !== undefined) {
      patch.offerAmount = Number.isFinite(fields.offerAmount) ? fields.offerAmount : undefined;
    }

    await ctx.db.patch(quoteId, patch);
    return quoteId;
  },
});

/** Shortcut used by the status dropdown on each row. */
export const setStatus = mutation({
  args: { quoteId: v.id("quotes"), status: statusValidator },
  handler: async (ctx, { quoteId, status }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(quoteId, { status });
  },
});

/** Hides a quote without destroying it. Reversible. */
export const setArchived = mutation({
  args: { quoteId: v.id("quotes"), archived: v.boolean() },
  handler: async (ctx, { quoteId, archived }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(quoteId, { archivedAt: archived ? Date.now() : undefined });
  },
});

/** Permanent. The admin UI asks for confirmation before calling this. */
export const remove = mutation({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, { quoteId }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(quoteId);
  },
});
