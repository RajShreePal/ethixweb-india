# Ethixweb India

A redesign of ethixweb.com for Indian businesses: a React marketing site with a database-backed enquiry form and a protected admin dashboard.

- **Live URL:** _add after deployment_ · **Repository:** _add after publishing_ · **Screenshots:** _add to `docs/` after running locally_

## Status (read first)
Nothing here has been built in a browser, deployed, or tested against a real Supabase project or Turnstile. See [Verification status](#verification-status).

## Features
- Public pages: Home, Services (8 services), About, Contact, custom 404.
- `POST /api/leads`: server-side validation, honeypot, Turnstile, rate limit, duplicate handling, saved to Supabase Postgres.
- `/admin/login` and `/admin`: Supabase Auth sign-in, paginated leads, search, status filter, detail view, status update.
- Per-page title, description, Open Graph, robots and canonical (when `VITE_SITE_URL` is set).

## Stack
React 18, Vite, Tailwind CSS 4, React Router 6, Lucide, Supabase (Postgres, Auth, RLS), Vercel Functions, Cloudflare Turnstile.

## Structure
```
api/leads.js            public enquiry endpoint
api/admin/leads.js      admin list (GET) and status update (PATCH)
api/_lib/               validation, Supabase server client, rate limit, admin check
supabase/migrations/    001_leads.sql (tables, constraints, RLS)
src/pages, components, lib   React app
scripts/generate-seo.mjs     writes sitemap.xml and robots.txt before build
tests/                  node:test unit and API-authorization tests
```

## Setup
1. Install Node 20+ and the Vercel CLI (`npm i -g vercel`).
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill it in (below).

### Environment variables
| Variable | Where | Notes |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | Public key only |
| `VITE_TURNSTILE_SITE_KEY` | browser | Public |
| `VITE_SITE_URL` | build | Production URL, no trailing slash |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | server only | Never prefix with `VITE_` |
| `TURNSTILE_SECRET_KEY` | server only | |
| `ALLOWED_ORIGIN` | server, optional | e.g. `https://your-domain.com` |

### Supabase
1. Create a project at supabase.com. Copy the project URL, publishable (anon) key and service-role key from Project Settings, API.
2. SQL Editor: paste and run `supabase/migrations/001_leads.sql`.
3. Authentication, Users: **Add user** with an email and strong password for the owner. Disable public sign-ups in Authentication settings.
4. Make that user an admin in the SQL Editor:
   `insert into public.admin_users (user_id) select id from auth.users where email = 'owner@example.com';`

**Security model:** RLS is on for both tables and anonymous users have no table privileges. Visitors insert only through `/api/leads`. Signed-in users in `admin_users` may read leads and update only `status`. The admin API uses the service-role key, which bypasses RLS, so it verifies the user's JWT and `admin_users` membership on every request.

### Turnstile
Create a widget in the Cloudflare dashboard (Turnstile) for your domain and copy the site and secret keys. For local development Cloudflare publishes dummy keys: site `1x00000000000000000000AA` with secret `1x0000000000000000000000000000000AA` (always passes); `2x00000000000000000000AB` with `2x0000000000000000000000000000000AA` (always fails). Confirm them against Cloudflare's current docs.

## Development
Run **`vercel dev`** (first time: `vercel login`, `vercel link`). It serves the app and `/api` together at http://localhost:3000. If the API cannot see your variables, copy `.env.local` to `.env` or use `vercel env pull`. `npm run dev` alone serves only the frontend; its `/api` proxy targets port 3000 for the case where `vercel dev` is already running.

Commands: `npm test` (10 tests), `npm run build` (generates SEO files, then builds), `npm run preview`. **No linter is configured.**

## Deploy to Vercel
1. Push to GitHub (`.env*` files are git-ignored except `.env.example`).
2. Import the repo in Vercel (framework: Vite). Add every variable above under Project Settings, Environment Variables, then deploy.
3. Set `VITE_SITE_URL` to the real URL and redeploy so canonical tags, sitemap and robots are correct. Add the domain to the Turnstile widget.

## Testing by hand
- **Enquiry:** submit the form with test Turnstile keys, then check the `leads` table. Re-submit identical text: it should confirm without a second row.
- **Failures:** empty or invalid fields show errors; the always-fail keys show a bot-check error; stop Supabase credentials to see the database-error message; more than 5 submissions in 10 minutes returns 429.
- **Admin:** sign in, filter, search, change a status and confirm it in Supabase. Open `/admin` signed out and expect a redirect. Sign in with a user not in `admin_users` and expect to be signed out with a message.
- Direct API check: `GET /api/admin/leads` with no token must return 401.

## Security and known limitations
- **Rate limiter is in-memory.** Counters live in one serverless instance, are not shared between instances and reset on cold starts, so it only slows casual abuse. Robust limiting needs a shared store such as Upstash Redis.
- Consent is validated but **not stored**; no consent timestamp exists. Add a column and migration if it must be auditable.
- The 16 KB size check uses the `content-length` header; field limits and Vercel's body limit back it up.
- No Content-Security-Policy yet. Basic headers (`nosniff`, frame deny, referrer policy) are set in `vercel.json`.
- `noindex` and `robots.txt` only discourage indexing. Admin security comes from Supabase Auth, `admin_users` and server checks.
- The favicon is a placeholder; the real Ethixweb logo and brand red are not yet applied (`--color-accent` is temporary).
- No automated browser tests.

## India-specific design rationale
Mobile-first layouts and large tap targets, because many enquiries start on phones. The form accepts Indian mobile numbers (`+91` and 10 digits starting 6-9) and international numbers, and budgets are in lakhs of INR. Copy avoids fixed prices and guarantees. Content states the company accurately: Ethixweb USA LLC, registered in Wyoming, with India as a hub. Concept projects are labelled as concepts, and reviews link to Trustpilot rather than being copied.

## Improvements over the current site
A single clear enquiry path, a validated and spam-protected form that saves to a database, an admin pipeline for follow-up, per-service pages sections with typical uses, accessible navigation and forms, and structured SEO metadata.

## PageSpeed Insights
After deploying, open pagespeed.web.dev, enter the live URL, run it, and record both the **Mobile** and **Desktop** tabs for `/`, `/services` and `/contact`. Fix anything below 90 and re-run. No score has been measured yet.

## Verification status
| Area | Status |
|---|---|
| Validation and API authorization logic | Locally tested (10 tests, stubbed Supabase package) |
| React pages, build, dashboard UI | Written, not built or viewed |
| Supabase insert, auth, RLS, admin PATCH | Not tested |
| Turnstile, Vercel deployment, PageSpeed | Not tested |

## Submission checklist
- [ ] `npm install`, `npm test` and `npm run build` pass on your machine
- [ ] SQL migration applied; admin user created and added to `admin_users`
- [ ] Enquiry saved and visible in Supabase; admin login, filter, search, status update work
- [ ] Deployed; env vars set; `VITE_SITE_URL` set; Turnstile domain added
- [ ] PageSpeed mobile and desktop recorded
- [ ] Brand red and logo applied; screenshots and URLs added to this README
- [ ] No `.env` committed (`git status` check)
