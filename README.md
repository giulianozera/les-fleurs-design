# Les Fleurs Design

Luxury eternal roses e-commerce — [lesfleursdesign.com](https://lesfleursdesign.com)

**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · Sanity CMS · Supabase · Stripe · EasyPost · Cal.com · Resend · Vercel

---

## Phase 1 — Setup complete ✓

Project scaffold, design system, layout (Header + Footer), homepage skeleton.

### Prerequisites

- Node.js 18+
- npm 9+

### Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in .env.local — see comments in .env.example

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, Header, Footer)
│   ├── page.tsx            # Homepage
│   ├── shop/               # Product catalog (Phase 2)
│   ├── cart/               # Cart (Phase 3)
│   ├── checkout/           # Stripe Checkout (Phase 3)
│   ├── wholesale/          # B2B inquiry (Phase 5)
│   └── ...                 # About, Contact, FAQ, Shipping (Phase 6)
├── components/
│   ├── layout/             # Header, Footer
│   ├── home/               # Homepage section components
│   └── ui/                 # Shared UI primitives
└── lib/
    └── utils.ts            # cn() classname helper
```

### Design tokens (Tailwind 4 — globals.css)

| Token | Value | Utility class |
|---|---|---|
| Ivory | `#FAF7F2` | `bg-ivory` / `text-ivory` |
| Charcoal | `#1A1A1A` | `bg-charcoal` / `text-charcoal` |
| Blush | `#E8C5C0` | `bg-blush` / `text-blush` |
| Gold | `#B8935A` | `bg-gold` / `text-gold` |
| Display font | Cormorant Garamond | `font-display` |
| Body font | Inter | `font-body` |

---

## Build phases

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Done | Scaffold, design system, layout, homepage skeleton |
| 2 | 🔜 Next | Sanity CMS, product schemas, shop + product detail pages |
| 3 | ⏳ | Supabase, cart (Zustand), Stripe Checkout + webhooks |
| 4 | ⏳ | EasyPost shipping estimate + label generation |
| 5 | ⏳ | B2B page, Cal.com embed, Resend notifications |
| 6 | ⏳ | All remaining pages, SEO, sitemap, accessibility pass |
| 7 | ⏳ | Vercel deployment + GoDaddy DNS configuration |

---

## Environment variables

See `.env.example` for all required variables with documentation.
Each phase introduces new variables — the example file is updated accordingly.

---

## Deployment (Phase 7)

Step-by-step Vercel + GoDaddy DNS instructions will be added in Phase 7.
DNS stays on GoDaddy (no Cloudflare migration needed).
