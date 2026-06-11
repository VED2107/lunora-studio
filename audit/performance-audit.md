# Performance Audit
## Phase 5 & 11: Performance & Animation Audit

### Executive Summary
The Lunora Studio application focuses heavily on high-end aesthetics, employing GSAP, Framer Motion, Lenis, and custom cursors. While visually striking, these choices introduce severe performance penalties, particularly on mobile devices and slower networks.

### Bundle Size & React Rendering
**Severity:** High
- **Issue:** The root `page.tsx` is marked as `"use client"`. This opts the entire landing page out of React Server Components (RSC).
- **Impact:** The browser must download the entire component tree, GSAP, Lenis, and React DOM before rendering the page. This will drastically negatively impact First Contentful Paint (FCP) and Time to Interactive (TTI).
- **Fix:** Remove `"use client"` from `page.tsx`. Isolate animations into small client components (e.g., `<HeroAnimationWrapper>`) that wrap server-rendered static content.

### Animation Performance (GSAP & Lenis)
**Severity:** Medium
- **Issue:** Lenis (smooth scrolling) and GSAP are running globally.
- **Impact:** Continuous recalculation of scroll positions and DOM manipulations on scroll can cause layout thrashing and dropped frames on low-end mobile devices.
- **Fix:** 
  - Ensure GSAP animations use `will-change: transform, opacity` and animate only compositor properties (transforms and opacities).
  - Use `matchMedia` in GSAP to disable complex animations on mobile.
  - Evaluate if CSS animations can replace simpler GSAP timelines.

### Images & Assets
**Severity:** Low
- **Observation:** `next/image` is utilized correctly (e.g., `width`, `height`, `priority` where appropriate). 
- **Observation:** Storage buckets in Supabase allow `webp` and `avif`, which is excellent.
- **Recommendation:** Ensure all user-uploaded images (especially admin uploads) are compressed before upload or served via an image optimization CDN (Next.js Image component handles this locally, but Supabase Storage doesn't do transformation natively without Pro plan).

### Core Web Vitals Projection
- **LCP (Largest Contentful Paint):** At risk due to client-side rendering of the Hero section.
- **FID (First Input Delay):** At risk due to the heavy JavaScript bundle parsing.
- **CLS (Cumulative Layout Shift):** Low risk, as `next/image` requires width/height and layouts appear stable.

### Recommendations
1. SSR the homepage.
2. Lazy load GSAP and Lenis, or conditionally load them only on desktop viewports.
3. Use Next.js `dynamic` imports for heavy components below the fold (e.g., `Instagram`, `Testimonials`).