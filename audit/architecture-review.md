# Architecture Review
## Phases 1 & 3: Project Understanding & Next.js Audit

### Executive Summary
The Lunora Studio is built on a modern stack: Next.js App Router (React 19), Supabase (Auth, DB, Storage), Tailwind CSS (v4), GSAP, and Framer Motion. The application is logically structured with domain-driven route groups `(shop)`, `(admin)`, `(account)`, `(auth)`. However, there are significant anti-patterns regarding Next.js Server Components.

### 1. Next.js App Router & Rendering
**Observation:** The homepage (`src/app/page.tsx`) uses `"use client"` at the top level.
**Impact:** 
- The entire homepage, including all its sub-sections (Hero, Problem, Solution, Process, etc.), is rendered client-side.
- This results in a massive JavaScript bundle being shipped immediately.
- First Contentful Paint (FCP) and Largest Contentful Paint (LCP) will suffer severely because the browser must download, parse, and execute all component code and GSAP before rendering meaningful HTML.
**Recommendation:** 
- Refactor the homepage into a Server Component.
- Move `"use client"` directives down the tree, specifically to leaf components that require interactivity (e.g., animations, hooks). 
- GSAP animations should be wrapped in client boundary wrappers.

### 2. State Management & Providers
**Observation:** The root layout (`src/app/layout.tsx`) wraps the application in multiple context providers: `AuthProvider`, `CartProvider`, `WishlistProvider`, `CursorProvider`.
**Impact:** 
- Because these providers are client components, they enforce client-side hydration for the entire tree they wrap.
- `CartProvider` fetches data on mount via `useEffect`, leading to layout shifts or loading states even if the cart could theoretically be fetched server-side via cookies.
**Recommendation:**
- Evaluate if data can be fetched in the Server Layout and passed to Providers as `initialData`.

### 3. Database Management & Migrations
**Observation:** Database schema is managed via a single monolithic `setup.sql` file.
**Impact:**
- While it claims to be re-runnable (`IF NOT EXISTS`, `OR REPLACE`), dropping and recreating policies and triggers on every run is a dangerous pattern for a production CI/CD pipeline.
- If an enum needs to be changed or a column dropped, this approach fails.
**Recommendation:**
- Adopt standard incremental migrations using Supabase CLI (`supabase migration new`).

### 4. Supabase Client Usage
**Observation:** The application uses `@supabase/ssr` to create Browser and Server clients.
**Impact:**
- In `BouquetsPage`, a server client is created (`createClient()`). However, the `CartProvider` uses the browser client, causing double-fetching or mismatched states if not synchronized properly.

### 5. Code Organization
**Observation:** Good use of route groups. 
- `src/components/` is well-organized by feature (`admin`, `cart`, `layout`, `product`, `sections`, `ui`).
- `src/hooks/` and `src/lib/` encapsulate utility logic effectively.
**Recommendation:** 
- Continue this pattern, but consider extracting business logic (e.g., cart calculations) into pure functions that can be shared between Client and Server environments.