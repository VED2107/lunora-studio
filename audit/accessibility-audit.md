# Accessibility (A11y) Audit
## Phase 9: Standards & Inclusive Design

### 1. Keyboard Navigation & Focus Management
**Observation:** The custom cursor implementation (`CustomCursor.tsx`) masks focus states.
**Impact:**
- Users navigating via keyboard (TAB key) cannot see the native focus rings on many elements because they are suppressed or hidden by custom styling.
- **Critical Issue:** The mobile navigation menu and the search/cart sheets do not properly trap focus when open. Users can "TAB" into the background content while the menu is active.
**Recommendation:**
- Ensure all interactive elements have a visible `:focus-visible` state.
- Use a library like `focus-trap-react` or ensure Radix UI (which `shadcn/ui` uses) is properly configured for all modal/drawer components.

### 2. ARIA Labels & Roles
**Observation:** Basic ARIA support in navigation and some buttons (e.g., `aria-label="Toggle menu"`).
**Impact:**
- Screen readers can identify primary navigation actions.
- **Gap:** Many purely decorative icons (SVGs) are not marked with `aria-hidden="true"`, causing screen readers to announce them as "image" or reading out the raw SVG paths.
- **Gap:** Status updates (e.g., "Item added to cart") are only communicated via `sonner` toasts. These should be announced to screen readers using an `aria-live` region.
**Recommendation:**
- Add `aria-hidden="true"` to all decorative icons.
- Verify `sonner` is configured with the correct ARIA roles for accessibility.

### 3. Color Contrast & Legibility
**Observation:** The color palette (Cream, Charcoal, Dusty Rose) is elegant but has contrast issues.
**Impact:**
- Text in `muted` gray on `cream` backgrounds often fails the WCAG AA contrast ratio of 4.5:1.
- Specifically, the "Handcrafted with Love" marquee and some footer links are difficult to read for users with low vision.
**Recommendation:**
- Darken the `muted` color variable or increase the font-weight for text using these colors on light backgrounds.

### 4. Form Accessibility
**Observation:** Forms in `Checkout` and `Account` settings use standard `shadcn/ui` labels.
**Impact:**
- Generally good accessibility as labels are correctly associated with inputs.
- **Gap:** Error messages (e.g., "Required field") are not always linked to the input via `aria-describedby`.
**Recommendation:**
- Ensure all form validation errors are programmatically associated with their respective input fields.
