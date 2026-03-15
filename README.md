# Alimony Sites Platform
**NoAlimony.com & KnowAlimony.com — Dual-brand legal marketing platform**

> Built by Kodi 💻 for Tommy Morgado | Atticus Legal Team

## Overview

Single Next.js 14 codebase powering two opposing legal marketing sites. Environment variable switches brand, tone, colors, and copy.

| Site | Brand | Audience | Tone |
|------|-------|----------|------|
| noalimony.com | Blues/Greens | Alimony payors | Defensive / Strategic |
| knowalimony.com | Purples/Golds | Alimony recipients | Empowering / Advocacy |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_BRAND to "noalimony" or "knowalimony"

# 3. Seed database (3 attorneys, 9 zip codes, 3 sample leads)
npm run seed

# 4. Start dev server
npm run dev

# 5. Production build
npm run build && npm start
```

## Brand Switching

```bash
# noalimony.com (blues/greens, defensive tone)
NEXT_PUBLIC_BRAND=noalimony npm run dev

# knowalimony.com (purples/golds, empowering tone)
NEXT_PUBLIC_BRAND=knowalimony npm run dev
```

## Seeded Demo Data

| Attorney | Zip Codes | Login |
|----------|-----------|-------|
| Jennifer M. Hayes, Esq. — Hayes Law Group (CA) | 90210, 90024, 90067 | jennifer.hayes@hayeslawgroup.com / attorney123 |
| Michael A. Torres — Torres Divorce & Family Law (NY) | 10001, 10019, 10036 | michael.torres@torresdivorce.com / attorney123 |
| Sarah L. Chen, J.D. — Chen Family Law (IL) | 60601, 60614, 60657 | sarah.chen@chenfamilylaw.com / attorney123 |

Admin login: `admin@noalimony.com` / `changeme123`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with geo-fenced attorney widget |
| `/calculator` | Interactive alimony estimator (50 states) |
| `/alimony-laws/[state]` | SEO pages for all 50 states |
| `/contact` | Lead capture + attorney widget |
| `/about` | About + disclosures |
| `/dashboard` | Attorney portal (login required) |
| `/dashboard/login` | Attorney login |

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/geo-attorney` | GET | Geolocate IP → match attorney by zip |
| `/api/leads` | POST | Submit contact form lead |
| `/api/auth/login` | POST | Attorney login |
| `/api/auth/logout` | POST | Logout |
| `/api/dashboard/attorney` | GET/PUT | Attorney profile CRUD |
| `/api/dashboard/zips` | GET/POST/DELETE | Zip code subscriptions |
| `/api/dashboard/leads` | GET | View incoming leads |

## Architecture

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── calculator/         # Alimony calculator
│   ├── alimony-laws/[state]/ # 50 state SEO pages
│   ├── dashboard/          # Attorney portal
│   ├── contact/            # Lead capture
│   ├── about/
│   └── api/                # API routes
├── components/             # Shared React components
│   ├── Header.tsx          # Brand-aware header
│   ├── Footer.tsx          # Footer w/ disclaimers
│   ├── AttorneyWidget.tsx  # Geofenced attorney card
│   ├── GeoAttorneyLoader.tsx # Client-side geo loader
│   └── LeadForm.tsx        # Contact/lead form
├── lib/
│   ├── brands.ts           # Dual-brand configuration
│   ├── db.ts               # SQLite (better-sqlite3)
│   ├── geo.ts              # IP geolocation (ipapi.co)
│   ├── auth.ts             # JWT session management
│   ├── states.ts           # All 50 states data
│   └── calculator.ts       # Alimony formula engine
├── data/
│   └── alimony.db          # SQLite database (git-ignored)
└── scripts/
    └── seed.js             # Database seeder
```

## Business Model

- Law firms pay monthly subscription for zip code ownership
- **Exclusive** tier: $99/mo — one firm per zip code
- **Shared** tier: $49/mo — multiple firms (random rotation)
- Metropolitan zips priced higher (configurable)
- Lead capture forms route directly to subscribed attorney

## Legal Notes

All pages include:
- UPL (Unauthorized Practice of Law) disclaimers
- "Not legal advice" disclaimers
- FTC paid placement disclosures
- Attorney advertising compliance notices
- "Powered by LegalLeads Platform" attribution

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite via better-sqlite3
- **Auth:** JWT via jose + httpOnly cookies
- **Geolocation:** ipapi.co (free: 1000/day)
- **Language:** TypeScript
