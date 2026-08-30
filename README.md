This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend and admin (Convex)

Quote requests are stored in [Convex](https://convex.dev), which also sends the
notification emails. The lead is written **before** the email is attempted, so a
mail outage costs a notification and never a lead — failures show up as an
"Email failed" badge in the admin instead.

### First-time setup

```bash
npm install

# 1. Create the deployment and generate convex/_generated.
#    Choose "cloud" when asked — a local deployment only exists on this machine.
npx convex dev

# 2. Generate the auth signing keys (JWT_PRIVATE_KEY, JWKS, SITE_URL).
npx @convex-dev/auth --web-server-url http://localhost:3000

# 3. Decide who can sign in at /admin.
npx convex env set ADMIN_EMAILS "you@b2autos.com"

# 4. Wire up outgoing email.
npx convex env set RESEND_API_KEY  re_xxxxxxxx
npx convex env set QUOTE_FROM      "B2 Autos <quotes@b2autos.com>"
npx convex env set QUOTE_INBOX     admin@b2autos.com
```

Then run `npx convex dev` and `npm run dev` side by side, open `/admin`, and use
**First time? Create your account** with an address from `ADMIN_EMAILS`.

### Going live

```bash
npx convex deploy                                   # push functions to production
npx @convex-dev/auth --prod --web-server-url https://b2autos.com
npx convex env set --prod ADMIN_EMAILS   "you@b2autos.com"
npx convex env set --prod RESEND_API_KEY re_xxxxxxxx
npx convex env set --prod QUOTE_FROM     "B2 Autos <quotes@b2autos.com>"
npx convex env set --prod QUOTE_INBOX    admin@b2autos.com
```

### Email deliverability (why notifications land in spam)

Sending is only half the job — the receiving mail server has to believe the
message really came from you. That is decided by DNS records on `b2autos.com`,
not by anything in this repo. Without them Gmail files new-lead notifications
as spam even though Resend reports them as sent.

DNS is at Namecheap (`dns1/dns2.registrar-servers.com`). Three records matter:

| Record | Host | Value | Why |
|---|---|---|---|
| `TXT` | `@` | `v=spf1 include:_spf.google.com ~all` | Authorises Google Workspace to send as `b2autos.com`. **Missing entirely** — this affects all outgoing company mail, not just this site. |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@b2autos.com` | Tells receivers what to do when checks fail, and sends you reports. Start at `p=none`. |
| — | — | whatever resend.com/domains generates | Resend's own DKIM + SPF, added when you verify the domain there. |

Google Workspace DKIM (`google._domainkey`) is already published — good.

Verify a **subdomain** (`send.b2autos.com`) rather than the root in Resend, so
automated mail can never damage the reputation of the domain your real
Workspace mail goes out on. Then point the sender at it:

```bash
npx convex env set QUOTE_FROM "B2 Autos <quotes@send.b2autos.com>"
```

Until DNS is in place, add a Gmail filter on `admin@b2autos.com`
(from `resend.dev` → **Never send it to Spam**) so leads stay visible. Every
lead is in `/admin` regardless — email is a notification, never the record.

Environment variables live in two separate places and are not interchangeable:
anything the browser needs goes in the Next app (`.env.local`), while secrets the
backend uses go on the Convex deployment via `npx convex env set`. See
`.env.example`.

### Authorisation

`ADMIN_EMAILS` is the whole access model. It is checked when an account is
created, and again inside every admin query and mutation in `convex/quotes.ts`
— so the data is safe even if someone calls the backend directly, and removing
an address revokes access immediately.
