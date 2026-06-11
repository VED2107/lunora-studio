# User Experience (UX) Audit
## Phase 10: Landing, Navigation & Conversion Flows

### 1. Landing Page Narrative
**Observation:** The landing page follows a strong "Problem-Solution" framework.
**Impact:**
- High emotional resonance with the "Flowers Fade. Memories Don't." hook.
- The progression from the problem (temporary nature of real flowers) to the solution (everlasting handcrafted bouquets) is logical and persuasive.
**Recommendation:**
- Consider moving the `Collection` (Product) section higher up. Users currently have to scroll through `Problem`, `Solution`, and `Process` before seeing the actual products.

### 2. Navigation & Friction
**Observation:** Sticky navigation and Floating WhatsApp provide consistent exit points.
**Impact:**
- Reduced friction for customers who want to ask questions or start an order.
- **Friction Point:** The "Custom Order" flow is separate from the standard "Add to Cart" flow. While necessary for bespoke work, the distinction might be confusing for users who just want to "tweak" an existing product.
**Recommendation:**
- Add a "Customise this Bouquet" button on individual product pages that redirects to the Custom Order form with the product ID as a reference.

### 3. Conversion Funnel (Cart & Checkout)
**Observation:** The cart uses a side-drawer (Sheet) approach.
**Impact:**
- Excellent for maintaining context; users don't have to leave the product page to see their cart.
- **Friction Point:** The Checkout page is a long single-page form.
**Recommendation:**
- Implement a multi-step checkout (Information -> Shipping -> Payment) to reduce the "perceived effort" of completing the purchase.

### 4. Micro-interactions & Feedback
**Observation:** Heavy use of GSAP and custom cursor for "premium" feel.
**Impact:**
- High brand "wow" factor.
- **Risk:** Over-animation can lead to "interaction fatigue." For example, the preloader adds a 2-3 second delay on every hard refresh, which may frustrate returning users.
**Recommendation:**
- Implement a session-based check for the preloader. If a user has already seen it in the last 30 minutes, skip it or show a significantly shortened version.

### 5. Search & Discovery
**Observation:** No site-wide search functionality was found.
**Impact:**
- As the collection grows, users will find it difficult to locate specific flower types or colors.
**Recommendation:**
- Implement a simple client-side search or a Supabase-powered search in the navigation bar.
uquet" where applicable.
Android devices where the browser's native scroll is more performant.
- Floating WhatsApp button and Navigation are sticky, providing quick access to primary actions.
**Recommendation:**
- Detect device capabilities and disable `Lenis` smooth scrolling on lower-end mobile devices to preserve battery life and responsiveness.
