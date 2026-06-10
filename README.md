<div align="center">

# 🌸 The Lunora Studio

**Flowers Fade. Memories Don't.**

Luxury e-commerce platform for handmade pipe-cleaner bouquets — handcrafted keepsakes that never wilt.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

[Instagram](https://www.instagram.com/thelunorastudio) · [WhatsApp](https://wa.me/918149102923)

</div>

---

## ✨ Features

### Storefront
- **Cinematic landing page** — GSAP ScrollTrigger storytelling, pinned sections, horizontal-scroll process, Lenis smooth scroll, custom flower cursor
- **Shop** — bouquet listings, collections, product detail with variants & gallery
- **Cart & wishlist** — guest carts (localStorage + session) that merge on login, coupons
- **Custom bouquet requests** — customers describe their dream bouquet, admin reviews & prices
- **WhatsApp/Instagram order mode** — one admin toggle switches the whole store between online checkout and personal ordering over chat
- **Accounts** — Google OAuth, order history with live status & tracking, saved designs, addresses

### Admin Panel (`/admin`)
- Dashboard with live revenue, orders, customers & pending-request stats
- Product & collection CRUD with image uploads
- Order management — status pipeline, lifecycle timestamps, tracking numbers
- Custom order review workflow
- Coupon engine — percentage/fixed, caps, usage limits, scheduling
- Homepage content manager — swap section images without deploying
- Store settings — contact details, shipping, ordering mode, maintenance mode

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| Styling | Tailwind CSS 4 · shadcn/ui (Base UI) · Cormorant Garamond + Inter |
| Animation | GSAP 3 + ScrollTrigger · Lenis · SplitType |
| Backend | Supabase — Postgres, Auth (Google OAuth), Storage, RLS |
| Forms | React Hook Form + Zod |

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Environment
cp .env.local.example .env.local
#    → fill in your Supabase URL + anon key

# 3. Database — paste supabase/setup.sql into the Supabase SQL editor.
#    It's idempotent: safe to re-run anytime. Then make yourself admin:
#    UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';

# 4. Run
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Cinematic landing page
│   ├── (shop)/            # Storefront — bouquets, collections, cart, checkout
│   ├── (auth)/            # Google OAuth login
│   ├── (account)/         # Customer dashboard — orders, wishlist, addresses
│   ├── (admin)/           # Admin panel
│   └── (legal)/           # Policies
├── components/            # Sections, layout, ui (shadcn), admin, product, cart
├── hooks/                 # useGsap, useStoreConfig, useSectionImages
├── lib/supabase/          # Client/server/middleware + generated types
└── providers/             # Auth, cart, wishlist contexts
supabase/
└── setup.sql              # Complete DB setup — single re-runnable file
```

## 📜 Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

<div align="center">
Handcrafted with ❤️ by The Lunora Studio
</div>
