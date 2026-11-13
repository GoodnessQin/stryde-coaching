# Stryde Coaching: React site + referrals + admin dashboard

Vite + React + React Router, with Supabase (database, auth, storage, edge functions) and Resend (email).

## What's in here

| Route | What it is |
|---|---|
| `/`, `/about`, `/services`, `/testimonials`, `/contact` | The original pages, converted to React. The UI is unchanged. |
| `/refer` | Refer Someone: enter an email to get a referral link |
| `/refer/confirmation?code=…` | "You're In!" page with a Share button. The same content is emailed to the referrer. |
| `/contact?ref=CODE` | Where referral links point. The visit is counted, and a booking made through it is credited to the referrer for 60 days. (`/r/CODE` also works as a short link.) |
| `/admin` | Admin dashboard: Overview, Bookings, Referrals, Testimonials (CMS with photo upload) |

Old `*.html` URLs (e.g. `/contact.html`) redirect to the new routes.

### How the UI was preserved
The original CSS files in `src/styles/legacy/` are **unmodified**. Each route injects exactly the
stylesheets its old HTML page loaded, **in the same order**, so the cascade is identical
(see `src/components/PageStyles.jsx`). The behaviour in `js/stryde.js` and `js/form.js` (loader,
scroll animations, carousel, counters, services slider, mobile menu, contact form + confetti modal)
was ported to React components and hooks.

Small, intentional changes:
- A **REFER SOMEONE** link in the nav. `src/styles/nav-addon.css` keeps the nav on one line at 769–1100px.
- `contact.html` had broken nav markup (a missing `nav-right` wrapper). All pages now share one nav.
- The contact form saves to Supabase instead of Google Sheets, and each new request emails the admin.

## 1. Supabase setup

1. Create a project at supabase.com.
2. **SQL Editor →** run `supabase/migrations/20261112000000_stryde_init.sql`, then `supabase/seed.sql`
   (this imports the current 7 testimonials).
3. **Authentication → Users → Add user.** Create the admin login (email + password). Then in SQL:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'hello@strydecoachings.com';
   ```
   Repeat for each admin.
4. **Authentication → URL Configuration:** set the Site URL to your domain and add `https://YOURDOMAIN/admin`
   to the redirect URLs (used by "Forgot password").

## 2. Resend setup
1. At resend.com, add and verify the domain `strydecoachings.com` (DNS records).
2. Create an API key.

## 3. Deploy the edge functions
```bash
npm i -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF

supabase secrets set \
  RESEND_API_KEY=re_xxxxxxxx \
  RESEND_FROM="Stryde Coaching <hello@strydecoachings.com>" \
  ADMIN_NOTIFY_EMAIL=hello@strydecoachings.com \
  SITE_URL=https://strydecoachings.com

supabase functions deploy create-referral
supabase functions deploy submit-contact
```
`ADMIN_NOTIFY_EMAIL` can be a comma-separated list. Supabase provides `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` to functions automatically.

## 4. Run / build the website
```bash
cp .env.example .env    # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SITE_URL
npm install
npm run dev             # http://localhost:5173
npm run build           # output in dist/
```
Deploy `dist/` to Vercel, Netlify or any static host. SPA rewrites are included
(`vercel.json`, `public/_redirects`). Set the same `VITE_*` variables in the host's settings.

## Data model
- **testimonials**: name, credentials, body (blank line = new paragraph), optional homepage excerpt,
  photo, `featured` (homepage, first 3), `published`, `sort_order`.
- **referrers**: email, unique code, link-visit count.
- **bookings**: every contact-form submission, with optional `referrer_id`, plus `status`
  (new / scheduled / completed / cancelled) and private admin notes.

A referred person counts as **booked** when they submit the contact form through a referral link.
Set the booking to *Call scheduled* or *Completed* in the admin to track successful referrals.
Self-referrals (same email as the referrer) aren't credited.

Security: Row Level Security is on for every table. The public site can only read published
testimonials. All public writes go through the edge functions (service role), and only users listed
in `admins` can read or modify referrals, bookings and testimonials.

## Referral page photo
The design's hero photo (dark room, plant by the window) wasn't in the project's assets.
Save it as `public/assets/images/referbg.jpg`. Until then the page falls back to an existing background.
