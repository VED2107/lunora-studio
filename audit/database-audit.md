# Database Audit
## Phase 6: Database Audit

### Overview
Lunora Studio uses Supabase (PostgreSQL) as its primary datastore. The schema is currently managed via a single monolithic `setup.sql` file containing 31 tables, custom types, functions, triggers, and Row Level Security (RLS) policies.

### Schema Design & Normalization
**Grade:** A-
- The schema is highly normalized with dedicated tables for products, variants, categories, inventory, orders, and custom bouquets.
- Use of custom ENUMs (`product_status`, `order_status`, `payment_status`) ensures data integrity.
- Constraints like `quantity >= 0` and `price >= 0` protect against invalid data.
- The `inventory` table smartly supports either `product_id` or `variant_id` via a `CHECK` constraint.

### Indexing Strategy
**Grade:** B+
- Indexes are comprehensively applied to foreign keys and frequently filtered columns (e.g., `slug`, `status`).
- Composite indexes like `idx_products_status_sort` on `products(status, sort_order)` and `idx_orders_user_created` on `orders(user_id, created_at DESC)` demonstrate a strong understanding of query optimization.
- **Recommendation:** Monitor index usage in production to ensure writes aren't unnecessarily slowed down, though e-commerce workloads are typically read-heavy.

### Row Level Security (RLS)
**Grade:** A
- Every table has RLS explicitly enabled.
- The `is_admin()` function is marked as `SECURITY DEFINER STABLE`, which is crucial for performance as Postgres evaluates `STABLE` functions once per query (InitPlan) rather than once per row.
- Policies properly segregate user data (e.g., `user_id = auth.uid()`).

### Functions & Triggers
**Grade:** B
- `generate_order_number` correctly uses a sequence instead of `COUNT(*)` to prevent race conditions during concurrent checkouts.
- Automatic inventory decrement logic in `decrement_inventory` trigger is well-implemented.
- **Anti-Pattern:** Managing schema updates by dropping and recreating triggers and policies in `setup.sql` is risky. If this script is run on a live database, there is a brief microsecond window where policies are dropped before being recreated, potentially exposing data or causing failed writes.

### Recommendations
1. **Adopt Incremental Migrations:** Move away from the monolithic `setup.sql` to standard Supabase CLI incremental migrations (`00001_initial.sql`, `00002_add_table.sql`).
2. **Remove Drop/Recreate Pattern:** Do not use `DROP POLICY IF EXISTS` in a production environment script. Use migrations to alter existing policies.
3. **Database Backups:** Ensure PITR (Point-in-Time Recovery) is enabled on the Supabase project given the sensitive nature of order and payment data.