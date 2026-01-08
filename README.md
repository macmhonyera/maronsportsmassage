# Sports Massage Website (Next.js) — Launch-Ready Starter

This is a complete, mobile-responsive Next.js website for a sports massage business with:

- Home, About, Services, Therapists, Contact, Terms
- SEO basics (metadata, sitemap, robots)
- Google Maps embed
- Social links
- Google Reviews (via Google Places API, optional)
- Online booking
- Public booking calendar that shows already-booked time slots
- Admin login + bookings list + add booking (for WhatsApp/manual)

## 1) Prerequisites

- Node.js 18+ installed
- PostgreSQL installed (local) OR a hosted Postgres (Neon/Supabase/Render/etc.)

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

- `DATABASE_URL` — your Postgres connection string
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `NEXTAUTH_SECRET` — long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login credentials
- Optional:
  - `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_QUERY`
  - `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` (for reviews)
  - Twilio WhatsApp variables (if you want WhatsApp sending)

## 4) Create database + run migrations

```bash
npx prisma migrate dev --name init
npm run seed
```

Optional: open Prisma Studio (view database records)

```bash
npm run prisma:studio
```

## 5) Run the site

```bash
npm run dev
```

Open: http://localhost:3000

## 6) Booking calendar behavior (important)

- `/book` shows time slots for the selected date.
- Booked slots are disabled and labeled as “booked”.
- Bookings created by:
  - Website (`/book`)
  - Admin (`/admin/bookings/new`) including WhatsApp/manual
  all block the calendar.

### Time slots
The starter uses hourly time slots: 08:00 to 17:00 (last start at 17:00).
You can change this in:
- `app/book/page.jsx` (client)
- `app/api/bookings/availability/route.js` (server availability logic)

## 7) Admin usage

- Go to: `/admin`
- If not logged in, you are redirected to `/admin/login`
- Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- View bookings: `/admin/bookings`
- Add booking (WhatsApp/manual): `/admin/bookings/new`

## 8) Google Maps

The Contact page uses a lightweight embed.

Set:
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_QUERY="Your Business Name, City"`

## 9) Google Reviews (optional)

This project uses the newer Places API endpoint:
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

If not set, the site shows a friendly placeholder.

## 10) WhatsApp integration (optional)

This starter includes a Twilio WhatsApp endpoint:

- `POST /api/whatsapp/send`
- Body:
  - `to`: `"whatsapp:+27XXXXXXXXX"`
  - `body`: `"Your message"`

Set env:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

Note: Real “reminders” to past clients typically require WhatsApp templates and opt-in compliance.

## 11) Deployment (website hosting)

### Option A: Vercel (recommended)
1. Push this project to GitHub
2. Import into Vercel
3. Add environment variables in Vercel dashboard
4. Add a hosted Postgres DATABASE_URL (Neon/Supabase/etc.)
5. Deploy

### Option B: VPS + Nginx
1. Build:
   ```bash
   npm run build
   npm run start
   ```
2. Use PM2 for process management and Nginx as reverse proxy
3. Ensure environment variables are present on server

## 12) Next steps (production hardening)

- Add a real availability model (per-therapist calendars, breaks, durations)
- Add booking status management UI (confirm/cancel)
- Add WhatsApp reminder scheduler (cron + templates)
- Add privacy policy page if you store client details and send marketing messages
