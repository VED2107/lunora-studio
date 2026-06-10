# Lunora Studio — Codebase Map

**Brand:** The Lunora Studio — Handmade pipe-cleaner bouquets
**Tagline:** "Flowers Fade. Memories Don't."
**Stack:** Next.js 16.2.7 · React 19 · TypeScript · TailwindCSS 4 · GSAP 3 + ScrollTrigger · Lenis · SplitType

---

## Project Root

```
lunora-studio/
├── CLAUDE.md              # Points to AGENTS.md
├── AGENTS.md              # Dev instructions (Next.js 16 breaking changes warning)
├── CODEBASE.md            # This file
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
├── postcss.config.mjs     # PostCSS + Tailwind
├── eslint.config.mjs      # ESLint config
├── public/                # Static assets
└── src/                   # Source code
```

## Scripts

| Command         | Purpose                    |
|-----------------|----------------------------|
| `npm run dev`   | Dev server (Turbopack)     |
| `npm run build` | Production build           |
| `npm run start` | Serve production build     |
| `npm run lint`  | ESLint                     |

---

## Source Tree

```
src/
├── app/
│   ├── layout.tsx         # Root layout — fonts (Cormorant Garamond + Inter), metadata, SEO
│   ├── page.tsx           # Main page — "use client", imports all sections
│   ├── globals.css        # Theme colors, animations, utility classes
│   └── favicon.ico        # Generated from brand logo
│
├── components/
│   ├── SmoothScroll.tsx   # Lenis wrapper with GSAP ticker integration
│   ├── FloatingWhatsApp.tsx  # Fixed WhatsApp button (bottom-right), appears on scroll
│   │
│   ├── layout/
│   │   ├── Navigation.tsx # Fixed nav — logo, links, social icons, "Order Now" CTA, mobile menu (GSAP clip-path)
│   │   └── Footer.tsx     # 4-column footer — brand, links, occasions, contact info
│   │
│   └── sections/          # Page sections in scroll order ↓
│       ├── Hero.tsx       # Full-screen hero — heading, subtitle, CTA buttons, bouquet image, particles
│       ├── Problem.tsx    # Pinned scroll — "flowers fade" storytelling with falling petals (GSAP)
│       ├── Solution.tsx   # Pinned scroll — "handcrafted to last" reveal with stem animation (GSAP)
│       ├── Process.tsx    # Horizontal scroll — 5 steps: Design → Handcraft → Wrap → Gift → Keep Forever
│       ├── Collection.tsx # 2-col grid — 6 bouquets with names, stories, occasions
│       ├── Stats.tsx      # Dark strip — 4 numbers (150+ bouquets, 100+ customers, etc.)
│       ├── Comparison.tsx # Feature table — Traditional flowers vs Lunora (7 features)
│       ├── Testimonials.tsx # 2-col grid — 4 customer testimonials with ratings
│       ├── Custom.tsx     # 3-col grid — 6 customisation options (colors, flowers, notes, etc.)
│       ├── Instagram.tsx  # 3-col gallery — AI-generated images, links to @thelunorastudio
│       ├── FAQ.tsx        # Accordion — 6 common questions with GSAP height animation
│       ├── Finale.tsx     # Pinned scroll — cinematic text sequence ending with "Flowers Fade. Memories Don't."
│       └── CTA.tsx        # Final CTA — Instagram, WhatsApp, email buttons + trust strip
│
└── hooks/
    ├── useGsap.ts         # GSAP + ScrollTrigger + SplitType registration & export
    └── useLenis.ts        # Lenis hook (unused — SmoothScroll.tsx handles it)
```

---

## Section Flow (scroll order)

```
Hero → Problem → Solution → Process → Collection → Stats → Comparison → Testimonials → Custom → Instagram → FAQ → Finale → CTA
```

**Pinned sections** (GSAP ScrollTrigger pin): Problem, Solution, Finale
**Horizontal scroll**: Process
**Standard scroll**: All others

---

## Color System

| Token         | Hex       | Usage                    |
|---------------|-----------|--------------------------|
| `cream`       | `#F8F4EF` | Primary background       |
| `cream-dark`  | `#F3E7E0` | Alternate section bg     |
| `blush`       | `#E8D2D9` | Soft accent              |
| `dusty-rose`  | `#CDA4B5` | Primary accent           |
| `gold`        | `#B89A6A` | Luxury accent            |
| `gold-light`  | `#D4B98A` | Gold highlight           |
| `charcoal`    | `#2F2926` | Primary text             |
| `muted`       | `#7D7068` | Secondary text           |
| `warm-white`  | `#FFFBF7` | Card backgrounds         |
| `ivory`       | `#FAF6F1` | Subtle bg                |

## Typography

| Role    | Font              | Weights         |
|---------|-------------------|-----------------|
| Heading | Cormorant Garamond| 300, 400, 500, 600, 700 |
| Body    | Inter             | 300, 400, 500, 600      |

---

## Images

### AI-Generated (3)
| File                    | Used In              |
|-------------------------|----------------------|
| `hero-bouquet.png`      | Hero, Instagram      |
| `colorful-celebration.png` | Collection, Instagram |
| `styled-congrats.png`   | Solution, Finale, Instagram |

### Real Photos (17) — used only in Process & Collection
| File                        | Used In    |
|-----------------------------|------------|
| `purple-collection.jpeg`    | Process    |
| `pink-lily.jpeg`            | Process    |
| `blue-lily-closeup.jpeg`    | Process    |
| `blue-lily-birthday.jpeg`   | Process    |
| `blue-lily-sunset-2.jpeg`   | Process    |
| `sunflower-styled.jpeg`     | Collection |
| `blue-lily-branded.jpeg`    | Collection |
| `purple-labeled.jpeg`       | Collection |
| `pink-single-sunset.jpeg`   | Collection |
| `blue-lily-sunset.jpeg`     | Collection |
| `three-varieties-hero.jpeg` | —          |
| `pink-lily-styled.jpeg`     | —          |
| `collection-flatlay.jpeg`   | —          |
| `blue-lily-gifting.jpeg`    | —          |
| `two-bouquets-showcase.jpeg`| —          |
| `bouquet-menu.jpeg`         | —          |
| `colorful-mixed-congrats.jpeg` | —       |

### Brand
| File        | Used In           |
|-------------|-------------------|
| `logo.jpeg` | Navigation, Footer|

---

## Key CSS Classes (globals.css)

| Class              | Purpose                                    |
|--------------------|--------------------------------------------|
| `.gold-gradient`   | Gold gradient text fill                    |
| `.luxury-divider`  | Subtle gold horizontal line                |
| `.img-zoom`        | Hover zoom on images (scale 1.04)          |
| `.btn-glow`        | Hover glow effect on buttons               |
| `.section-grain`   | Noise texture overlay                      |
| `.glass-card`      | Frosted glass card style                   |
| `.link-underline`  | Animated underline on hover                |
| `.animate-float`   | Gentle floating animation                  |
| `.animate-particle`| Particle rise animation (Hero)             |
| `.animate-shimmer` | Shimmer gradient animation                 |
| `.animate-pulse-soft` | Soft opacity pulse                      |

---

## Contact Info

- **Instagram:** [@thelunorastudio](https://www.instagram.com/thelunorastudio)
- **WhatsApp:** +91 81491 02923
- **Email:** lunorastudio.blooms@gmail.com
