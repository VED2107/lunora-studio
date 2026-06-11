# SEO & Discoverability Audit
## Phase 8: Metadata, Semantics & Indexing

### 1. Metadata Management
**Observation:** The application uses the `Metadata` API in `src/app/layout.tsx`.
**Impact:**
- Strong static metadata for Title, Description, and Keywords.
- OG (OpenGraph) and Twitter cards are properly configured for social sharing.
- **Gap:** Dynamic metadata is missing for individual product pages (`/bouquets/[slug]`). Currently, all pages inherit the same generic description and title.
**Recommendation:**
- Implement `generateMetadata` in `src/app/(shop)/bouquets/[slug]/page.tsx` to fetch the product title and description from Supabase and populate the tags dynamically.

### 2. Semantic HTML & Document Structure
**Observation:** Usage of semantic tags like `<main>`, `<section>`, `<h1>`-`<h5>`, and `<footer>`.
**Impact:**
- Search engines can easily understand the hierarchy of the page.
- **Gap:** The `Hero` component uses `<h1>` effectively, but subsequent sections (e.g., `Problem`, `Solution`) often use `div` or generic classes for section headers instead of `<h2>`.
**Recommendation:**
- Audit all section components (`src/components/sections/`) and ensure each has a clear `<h2>` for its heading to improve document outline.

### 3. Structured Data (JSON-LD)
**Observation:** No JSON-LD structured data was found in the codebase.
**Impact:**
- Missing out on "Rich Results" in Google (e.g., Product prices, ratings, and availability showing directly in search results).
**Recommendation:**
- Inject JSON-LD into the `head` of product pages and the home page. 
- Specifically: `Product` schema for bouquets and `Organization` schema for the brand.

### 4. Indexing & Sitemaps
**Observation:** No `robots.txt` or `sitemap.xml` found in the public directory or as dynamic routes.
**Impact:**
- Search engines may struggle to find all product pages efficiently.
- No instructions for crawlers on which paths to avoid (e.g., `/admin`, `/account`).
**Recommendation:**
- Add `next-sitemap` or create dynamic `sitemap.ts` and `robots.ts` in the `src/app` directory.

### 5. Image SEO
**Observation:** `next/image` is used throughout the project.
**Impact:**
- Images are automatically optimized (WebP/AVIF) and lazy-loaded.
- **Gap:** Many images in the `Collection` and `Hero` sections have generic `alt` text or missing specific descriptors.
**Recommendation:**
- Standardize `alt` text to include keywords like "Handcrafted Pipe Cleaner Flower Bouquet" where applicable.
