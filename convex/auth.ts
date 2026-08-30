import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

/**
 * ============================================================
 * ADMIN AUTHENTICATION
 * ============================================================
 * Email + password, restricted to an allowlist. There is no
 * public sign-up: an account can only be created for an address
 * listed in the ADMIN_EMAILS environment variable.
 *
 * Set it on the Convex deployment (not in .env.local):
 *   npx convex env set ADMIN_EMAILS "you@b2autos.com,boss@b2autos.com"
 *
 * The allowlist is enforced twice on purpose — here, so no
 * unwanted account can ever be created, and again in
 * convex/admin.ts on every read and write, so revoking access is
 * a matter of editing this one variable.
 * ============================================================
 */

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "").trim().toLowerCase();

        if (!isAdminEmail(email)) {
          // Deliberately vague: don't confirm which addresses are admins.
          throw new ConvexError("This email address cannot access the admin area.");
        }

        return { email };
      },
      validatePasswordRequirements: (password: string) => {
        if (password.length < 12) {
          throw new ConvexError("Password must be at least 12 characters.");
        }
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
          throw new ConvexError(
            "Password must include an uppercase letter, a lowercase letter and a number."
          );
        }
      },
    }),
  ],
});
