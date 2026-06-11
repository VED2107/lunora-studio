# Optimization & Scaling Roadmap
## Phases 12-15: DevOps, CTO Scale Review & Competitive Strategy

### 1. Infrastructure & DevOps (Phase 12)
**Current State:** Vercel deployment with Supabase.
**Problems:** 
- No automated testing in the CI/CD pipeline (GitHub Actions).
- No staging environment for database migrations.
**Roadmap:**
- **Short Term:** Integrate `playwright` or `cypress` into `.github/workflows/ci.yml` to test critical checkout flows.
- **Medium Term:** Set up Supabase "Branching" or a dedicated staging project to test SQL migrations before applying to production.

### 2. CTO Scale Review (Phase 13)
**Analysis:** The architecture is "Client-Heavy."
**Problems:** 
- GSAP and `"use client"` everywhere will limit performance as the page complexity grows.
- Supabase RLS is the only line of defense for data security.
**Roadmap:**
- **Refactor:** Shift from "Client-Side Fetching" in providers to "Server-Side Fetching" in layouts.
- **Security:** Conduct a full RLS audit (Phase 7 was started, but needs ongoing monitoring). Ensure no `service_role` keys are exposed in client-side code (Verified: safe for now).

### 3. Competitor Benchmarking (Phase 14)
**Analysis:** Lunora competes with luxury flower delivery (Ferns N Petals, Interflora) and handmade marketplaces (Etsy, Itokri).
**Advantage:** "Keepsake" value proposition is unique.
**Roadmap:**
- **Product:** Implement "Gifting Bundles" (e.g., Bouquet + Handwritten Note + Premium Box) as a single SKU.
- **Experience:** Add "Live Order Tracking" for the handcrafted process (e.g., "Your bouquet is being assembled").

### 4. Hidden Technical Debt (Phase 15)
**Identification:**
- **Asset Management:** High-resolution images in `public/` are not managed via a CDN or Image Proxy (other than Vercel's built-in).
- **Hard-coded Content:** Much of the marketing copy is hard-coded in React components rather than a CMS.
**Roadmap:**
- **CMS Integration:** Migrate landing page sections to a headless CMS (like Sanity or even a Supabase-backed custom admin) to allow the marketing team to update copy without developer intervention.
- **Global Store:** Centralize all business logic (pricing, discounts, tax) into a dedicated `lib/logic` directory to ensure consistency between the Shop and Admin panels.
