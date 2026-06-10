-- ============================================================
-- LUNORA STUDIO — Complete Database Setup (single file)
--
-- RE-RUNNABLE: safe to execute repeatedly in the Supabase SQL
-- editor. Tables/indexes use IF NOT EXISTS, enums use guarded
-- DO blocks, functions use CREATE OR REPLACE, triggers and
-- policies are dropped before re-creation, seeds use ON CONFLICT.
--
-- Replaces the old migrations:
--   00001_initial_schema.sql, 00002_rls_policies.sql, 00003_storage.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('customer', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE product_status AS ENUM ('draft', 'active', 'hidden', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE product_type AS ENUM (
  'single_flower', 'mini_bouquet', 'premium_bouquet',
  'luxury_bouquet', 'custom_bouquet', 'gift_bundle'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'in_production', 'ready_to_ship',
  'shipped', 'delivered', 'cancelled', 'refunded'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE payment_status AS ENUM (
  'pending', 'authorized', 'captured', 'failed', 'refunded'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('razorpay', 'stripe', 'cod'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE discount_type AS ENUM ('percentage', 'fixed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE custom_request_status AS ENUM (
  'pending', 'reviewed', 'approved', 'rejected',
  'priced', 'converted', 'in_production', 'completed'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE notification_type AS ENUM (
  'order_update', 'custom_bouquet', 'promotion', 'system'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone_number TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- 3. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON product_categories(parent_id);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  product_type product_type NOT NULL DEFAULT 'premium_bouquet',
  status product_status NOT NULL DEFAULT 'draft',
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  compare_at_price DECIMAL(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
  sku TEXT UNIQUE,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
-- Composite covers the storefront's "active products ordered by sort"
-- listing and replaces the old single-column status index
DROP INDEX IF EXISTS idx_products_status;
CREATE INDEX IF NOT EXISTS idx_products_status_sort ON products(status, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
-- Fast primary-image lookups (used on every product card)
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id) WHERE is_primary = true;

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10,2),
  options JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- 7. INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  track_inventory BOOLEAN NOT NULL DEFAULT true,
  allow_backorder BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT inventory_product_or_variant CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR
    (product_id IS NULL AND variant_id IS NOT NULL)
  ),
  CONSTRAINT inventory_unique_product UNIQUE (product_id),
  CONSTRAINT inventory_unique_variant UNIQUE (variant_id)
);

-- 8. COLLECTIONS
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- 9. COLLECTION PRODUCTS (junction)
CREATE TABLE IF NOT EXISTS collection_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(collection_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON collection_products(product_id);

-- 10. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. WISHLIST ITEMS
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, product_id, variant_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);

-- 12. CARTS
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  coupon_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cart_user_or_session CHECK (
    user_id IS NOT NULL OR session_id IS NOT NULL
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id) WHERE session_id IS NOT NULL;

-- 13. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  custom_request_id UUID,
  gift_note TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- 14. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  applicable_products UUID[],
  applicable_collections UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- 15. COUPON USAGE
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- 16. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method payment_method,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  coupon_code TEXT,
  gift_note TEXT,
  internal_notes TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  estimated_delivery DATE,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
-- Composite covers the account "My Orders" query (filter by user,
-- newest first) and replaces the old single-column user index
DROP INDEX IF EXISTS idx_orders_user;
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);

-- 17. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  custom_request_id UUID,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  product_image TEXT,
  sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 18. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_history_order ON order_status_history(order_id);

-- 19. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  provider_payment_id TEXT,
  provider_order_id TEXT,
  provider_signature TEXT,
  provider_data JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider_payment_id);

-- 20. CUSTOM BOUQUET REQUESTS
CREATE TABLE IF NOT EXISTS custom_bouquet_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  flower_types TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  bouquet_size TEXT NOT NULL DEFAULT 'medium',
  wrapping_style TEXT,
  ribbon_style TEXT,
  greeting_card BOOLEAN NOT NULL DEFAULT false,
  card_message TEXT,
  special_notes TEXT,
  delivery_date DATE,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  status custom_request_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  rejection_reason TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_custom_requests_user ON custom_bouquet_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_bouquet_requests(status);

-- 21. CUSTOM BOUQUET IMAGES
CREATE TABLE IF NOT EXISTS custom_bouquet_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES custom_bouquet_requests(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'inspiration',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_custom_images_request ON custom_bouquet_images(request_id);

-- 22. SAVED DESIGNS
CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Design',
  config JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  estimated_price DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_designs_user ON saved_designs(user_id);

-- 23. SHIPPING RATES
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_order_amount DECIMAL(10,2),
  rate DECIMAL(10,2) NOT NULL CHECK (rate >= 0),
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  zones TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- 25. FAQ
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 26. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 27. GALLERY ITEMS
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 28. HERO SECTIONS
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 29. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 30. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_activity_logs(created_at DESC);

-- 31. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Helper: check if current user is admin (used by RLS everywhere)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Order numbers: LUN-YYYYMMDD-XXXX backed by a sequence.
-- The old COUNT(*)-based version could generate duplicate numbers
-- under concurrent inserts; a sequence is collision-free.
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'LUN-' || to_char(now(), 'YYYYMMDD') || '-' ||
    LPAD((nextval('order_number_seq') % 100000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on signup (idempotent: refreshes name/avatar on conflict)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), profiles.avatar_url);
  RETURN NEW;
END;
$$;

-- Auto-create wishlist for new profile
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wishlists (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't block profile creation if wishlists table has issues
  RETURN NEW;
END;
$$;

-- Track order status changes: history row + lifecycle timestamps
CREATE OR REPLACE FUNCTION track_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());

    CASE NEW.status
      WHEN 'confirmed' THEN NEW.confirmed_at = COALESCE(NEW.confirmed_at, now());
      WHEN 'shipped' THEN NEW.shipped_at = COALESCE(NEW.shipped_at, now());
      WHEN 'delivered' THEN NEW.delivered_at = COALESCE(NEW.delivered_at, now());
      WHEN 'cancelled' THEN NEW.cancelled_at = COALESCE(NEW.cancelled_at, now());
      ELSE NULL;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement inventory on order confirm
CREATE OR REPLACE FUNCTION decrement_inventory()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE inventory i
    SET quantity = GREATEST(i.quantity - oi.quantity, 0)
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND (
        (oi.variant_id IS NOT NULL AND i.variant_id = oi.variant_id) OR
        (oi.variant_id IS NULL AND i.product_id = oi.product_id)
      )
      AND i.track_inventory = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment coupon used_count
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Drop legacy trigger names from the old migrations (they used
-- abbreviated names; the loop below uses full table names)
DROP TRIGGER IF EXISTS set_updated_at_variants ON product_variants;
DROP TRIGGER IF EXISTS set_updated_at_categories ON product_categories;
DROP TRIGGER IF EXISTS set_updated_at_custom_requests ON custom_bouquet_requests;
DROP TRIGGER IF EXISTS set_updated_at_shipping ON shipping_rates;
DROP TRIGGER IF EXISTS set_updated_at_hero ON hero_sections;

-- updated_at triggers (one per table that has updated_at)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'addresses', 'product_categories', 'products',
    'product_variants', 'inventory', 'collections', 'carts',
    'cart_items', 'coupons', 'orders', 'payments',
    'custom_bouquet_requests', 'saved_designs', 'shipping_rates',
    'faq', 'hero_sections'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at_%I ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- Auto-create profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create wishlist on profile creation
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Generate order number
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Track order status changes + set timestamps
DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION track_order_status();

-- Decrement inventory on order confirmation
DROP TRIGGER IF EXISTS on_order_confirmed ON orders;
CREATE TRIGGER on_order_confirmed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION decrement_inventory();

-- Track coupon usage
DROP TRIGGER IF EXISTS on_coupon_used ON coupon_usage;
CREATE TRIGGER on_coupon_used
  AFTER INSERT ON coupon_usage
  FOR EACH ROW EXECUTE FUNCTION increment_coupon_usage();

-- ============================================================
-- ROW LEVEL SECURITY
--
-- Optimization note: auth.uid() and is_admin() are wrapped in
-- scalar subselects — Postgres evaluates them once per query
-- (InitPlan) instead of once per row. This is the documented
-- Supabase RLS performance pattern.
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_bouquet_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_bouquet_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()) AND role = 'customer');

DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;
CREATE POLICY "Admin full access to profiles"
  ON profiles FOR ALL
  USING ((SELECT is_admin()));

-- ADDRESSES
DROP POLICY IF EXISTS "Users manage own addresses" ON addresses;
CREATE POLICY "Users manage own addresses"
  ON addresses FOR ALL
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin full access to addresses" ON addresses;
CREATE POLICY "Admin full access to addresses"
  ON addresses FOR ALL
  USING ((SELECT is_admin()));

-- PRODUCT CATEGORIES
DROP POLICY IF EXISTS "Public read active categories" ON product_categories;
CREATE POLICY "Public read active categories"
  ON product_categories FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to categories" ON product_categories;
CREATE POLICY "Admin full access to categories"
  ON product_categories FOR ALL
  USING ((SELECT is_admin()));

-- PRODUCTS
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Admin full access to products" ON products;
CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING ((SELECT is_admin()));

-- PRODUCT IMAGES
DROP POLICY IF EXISTS "Public read product images" ON product_images;
CREATE POLICY "Public read product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE id = product_images.product_id AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admin full access to product images" ON product_images;
CREATE POLICY "Admin full access to product images"
  ON product_images FOR ALL
  USING ((SELECT is_admin()));

-- PRODUCT VARIANTS
DROP POLICY IF EXISTS "Public read active variants" ON product_variants;
CREATE POLICY "Public read active variants"
  ON product_variants FOR SELECT
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM products WHERE id = product_variants.product_id AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admin full access to variants" ON product_variants;
CREATE POLICY "Admin full access to variants"
  ON product_variants FOR ALL
  USING ((SELECT is_admin()));

-- INVENTORY
DROP POLICY IF EXISTS "Admin full access to inventory" ON inventory;
CREATE POLICY "Admin full access to inventory"
  ON inventory FOR ALL
  USING ((SELECT is_admin()));

-- COLLECTIONS
DROP POLICY IF EXISTS "Public read active collections" ON collections;
CREATE POLICY "Public read active collections"
  ON collections FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to collections" ON collections;
CREATE POLICY "Admin full access to collections"
  ON collections FOR ALL
  USING ((SELECT is_admin()));

-- COLLECTION PRODUCTS
DROP POLICY IF EXISTS "Public read collection products" ON collection_products;
CREATE POLICY "Public read collection products"
  ON collection_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections WHERE id = collection_products.collection_id AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admin full access to collection products" ON collection_products;
CREATE POLICY "Admin full access to collection products"
  ON collection_products FOR ALL
  USING ((SELECT is_admin()));

-- WISHLISTS
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlists;
CREATE POLICY "Users manage own wishlist"
  ON wishlists FOR ALL
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin read wishlists" ON wishlists;
CREATE POLICY "Admin read wishlists"
  ON wishlists FOR SELECT
  USING ((SELECT is_admin()));

-- WISHLIST ITEMS
DROP POLICY IF EXISTS "Users manage own wishlist items" ON wishlist_items;
CREATE POLICY "Users manage own wishlist items"
  ON wishlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM wishlists WHERE id = wishlist_items.wishlist_id AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin read wishlist items" ON wishlist_items;
CREATE POLICY "Admin read wishlist items"
  ON wishlist_items FOR SELECT
  USING ((SELECT is_admin()));

-- CARTS
DROP POLICY IF EXISTS "Users manage own cart" ON carts;
CREATE POLICY "Users manage own cart"
  ON carts FOR ALL
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Guest cart by session" ON carts;
CREATE POLICY "Guest cart by session"
  ON carts FOR ALL
  USING (user_id IS NULL AND session_id IS NOT NULL)
  WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

DROP POLICY IF EXISTS "Admin full access to carts" ON carts;
CREATE POLICY "Admin full access to carts"
  ON carts FOR ALL
  USING ((SELECT is_admin()));

-- CART ITEMS
DROP POLICY IF EXISTS "Users manage own cart items" ON cart_items;
CREATE POLICY "Users manage own cart items"
  ON cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM carts WHERE id = cart_items.cart_id AND (user_id = (SELECT auth.uid()) OR user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Admin full access to cart items" ON cart_items;
CREATE POLICY "Admin full access to cart items"
  ON cart_items FOR ALL
  USING ((SELECT is_admin()));

-- COUPONS
DROP POLICY IF EXISTS "Public read active coupons" ON coupons;
CREATE POLICY "Public read active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to coupons" ON coupons;
CREATE POLICY "Admin full access to coupons"
  ON coupons FOR ALL
  USING ((SELECT is_admin()));

-- COUPON USAGE
DROP POLICY IF EXISTS "Users read own coupon usage" ON coupon_usage;
CREATE POLICY "Users read own coupon usage"
  ON coupon_usage FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users insert own coupon usage" ON coupon_usage;
CREATE POLICY "Users insert own coupon usage"
  ON coupon_usage FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin full access to coupon usage" ON coupon_usage;
CREATE POLICY "Admin full access to coupon usage"
  ON coupon_usage FOR ALL
  USING ((SELECT is_admin()));

-- ORDERS
DROP POLICY IF EXISTS "Users read own orders" ON orders;
CREATE POLICY "Users read own orders"
  ON orders FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders"
  ON orders FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()) OR user_id IS NULL);

DROP POLICY IF EXISTS "Admin full access to orders" ON orders;
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING ((SELECT is_admin()));

-- ORDER ITEMS
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
CREATE POLICY "Users read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users create own order items" ON order_items;
CREATE POLICY "Users create own order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_items.order_id
        AND (user_id = (SELECT auth.uid()) OR user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Admin full access to order items" ON order_items;
CREATE POLICY "Admin full access to order items"
  ON order_items FOR ALL
  USING ((SELECT is_admin()));

-- ORDER STATUS HISTORY
DROP POLICY IF EXISTS "Users read own order history" ON order_status_history;
CREATE POLICY "Users read own order history"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_status_history.order_id AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin full access to order history" ON order_status_history;
CREATE POLICY "Admin full access to order history"
  ON order_status_history FOR ALL
  USING ((SELECT is_admin()));

-- PAYMENTS
DROP POLICY IF EXISTS "Users read own payments" ON payments;
CREATE POLICY "Users read own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = payments.order_id AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
CREATE POLICY "Admin full access to payments"
  ON payments FOR ALL
  USING ((SELECT is_admin()));

-- CUSTOM BOUQUET REQUESTS
DROP POLICY IF EXISTS "Users manage own custom requests" ON custom_bouquet_requests;
CREATE POLICY "Users manage own custom requests"
  ON custom_bouquet_requests FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can create custom request" ON custom_bouquet_requests;
CREATE POLICY "Anyone can create custom request"
  ON custom_bouquet_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access to custom requests" ON custom_bouquet_requests;
CREATE POLICY "Admin full access to custom requests"
  ON custom_bouquet_requests FOR ALL
  USING ((SELECT is_admin()));

-- CUSTOM BOUQUET IMAGES
DROP POLICY IF EXISTS "Users read own custom images" ON custom_bouquet_images;
CREATE POLICY "Users read own custom images"
  ON custom_bouquet_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_bouquet_requests
      WHERE id = custom_bouquet_images.request_id AND user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Anyone can upload custom images" ON custom_bouquet_images;
CREATE POLICY "Anyone can upload custom images"
  ON custom_bouquet_images FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access to custom images" ON custom_bouquet_images;
CREATE POLICY "Admin full access to custom images"
  ON custom_bouquet_images FOR ALL
  USING ((SELECT is_admin()));

-- SAVED DESIGNS
DROP POLICY IF EXISTS "Users manage own saved designs" ON saved_designs;
CREATE POLICY "Users manage own saved designs"
  ON saved_designs FOR ALL
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin read saved designs" ON saved_designs;
CREATE POLICY "Admin read saved designs"
  ON saved_designs FOR SELECT
  USING ((SELECT is_admin()));

-- SHIPPING RATES
DROP POLICY IF EXISTS "Public read active shipping rates" ON shipping_rates;
CREATE POLICY "Public read active shipping rates"
  ON shipping_rates FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to shipping rates" ON shipping_rates;
CREATE POLICY "Admin full access to shipping rates"
  ON shipping_rates FOR ALL
  USING ((SELECT is_admin()));

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications"
  ON notifications FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admin full access to notifications" ON notifications;
CREATE POLICY "Admin full access to notifications"
  ON notifications FOR ALL
  USING ((SELECT is_admin()));

-- FAQ
DROP POLICY IF EXISTS "Public read active FAQ" ON faq;
CREATE POLICY "Public read active FAQ"
  ON faq FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to FAQ" ON faq;
CREATE POLICY "Admin full access to FAQ"
  ON faq FOR ALL
  USING ((SELECT is_admin()));

-- TESTIMONIALS
DROP POLICY IF EXISTS "Public read active testimonials" ON testimonials;
CREATE POLICY "Public read active testimonials"
  ON testimonials FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to testimonials" ON testimonials;
CREATE POLICY "Admin full access to testimonials"
  ON testimonials FOR ALL
  USING ((SELECT is_admin()));

-- GALLERY ITEMS
DROP POLICY IF EXISTS "Public read active gallery" ON gallery_items;
CREATE POLICY "Public read active gallery"
  ON gallery_items FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to gallery" ON gallery_items;
CREATE POLICY "Admin full access to gallery"
  ON gallery_items FOR ALL
  USING ((SELECT is_admin()));

-- HERO SECTIONS
DROP POLICY IF EXISTS "Public read active hero sections" ON hero_sections;
CREATE POLICY "Public read active hero sections"
  ON hero_sections FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to hero sections" ON hero_sections;
CREATE POLICY "Admin full access to hero sections"
  ON hero_sections FOR ALL
  USING ((SELECT is_admin()));

-- SITE SETTINGS
DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
CREATE POLICY "Public read site settings"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin full access to site settings" ON site_settings;
CREATE POLICY "Admin full access to site settings"
  ON site_settings FOR ALL
  USING ((SELECT is_admin()));

-- ADMIN ACTIVITY LOGS
DROP POLICY IF EXISTS "Admin full access to activity logs" ON admin_activity_logs;
CREATE POLICY "Admin full access to activity logs"
  ON admin_activity_logs FOR ALL
  USING ((SELECT is_admin()));

-- AUDIT LOGS
DROP POLICY IF EXISTS "Admin read audit logs" ON audit_logs;
CREATE POLICY "Admin read audit logs"
  ON audit_logs FOR SELECT
  USING ((SELECT is_admin()));

-- ============================================================
-- STORAGE BUCKETS & POLICIES
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('product-videos', 'product-videos', true, 52428800, ARRAY['video/mp4', 'video/webm']),
  ('custom-orders', 'custom-orders', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('site-assets', 'site-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif', 'application/pdf']),
  ('site-images', 'site-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

-- PRODUCT IMAGES bucket
DROP POLICY IF EXISTS "Public read product images bucket" ON storage.objects;
CREATE POLICY "Public read product images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND (SELECT is_admin()));

-- PRODUCT VIDEOS bucket
DROP POLICY IF EXISTS "Public read product videos" ON storage.objects;
CREATE POLICY "Public read product videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-videos');

DROP POLICY IF EXISTS "Admin upload product videos" ON storage.objects;
CREATE POLICY "Admin upload product videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-videos' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete product videos" ON storage.objects;
CREATE POLICY "Admin delete product videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-videos' AND (SELECT is_admin()));

-- CUSTOM ORDERS bucket (private: users access own folder, admin reads all)
DROP POLICY IF EXISTS "Users upload custom order images" ON storage.objects;
CREATE POLICY "Users upload custom order images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'custom-orders' AND
    ((SELECT auth.uid()))::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users read own custom order images" ON storage.objects;
CREATE POLICY "Users read own custom order images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'custom-orders' AND
    ((SELECT auth.uid()))::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Admin read all custom order images" ON storage.objects;
CREATE POLICY "Admin read all custom order images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'custom-orders' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete custom order images" ON storage.objects;
CREATE POLICY "Admin delete custom order images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'custom-orders' AND (SELECT is_admin()));

-- AVATARS bucket
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    ((SELECT auth.uid()))::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    ((SELECT auth.uid()))::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    ((SELECT auth.uid()))::text = (storage.foldername(name))[1]
  );

-- GALLERY bucket
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admin upload gallery" ON storage.objects;
CREATE POLICY "Admin upload gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete gallery" ON storage.objects;
CREATE POLICY "Admin delete gallery"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND (SELECT is_admin()));

-- SITE ASSETS bucket
DROP POLICY IF EXISTS "Public read site assets" ON storage.objects;
CREATE POLICY "Public read site assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin upload site assets" ON storage.objects;
CREATE POLICY "Admin upload site assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete site assets" ON storage.objects;
CREATE POLICY "Admin delete site assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND (SELECT is_admin()));

-- SITE IMAGES bucket (homepage section images)
DROP POLICY IF EXISTS "Public read site images" ON storage.objects;
CREATE POLICY "Public read site images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admin upload site images" ON storage.objects;
CREATE POLICY "Admin upload site images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin update site images" ON storage.objects;
CREATE POLICY "Admin update site images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images' AND (SELECT is_admin()));

DROP POLICY IF EXISTS "Admin delete site images" ON storage.objects;
CREATE POLICY "Admin delete site images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images' AND (SELECT is_admin()));

-- Old policy name from 00003 (renamed above to avoid clashing with
-- the table policy of the same name) — drop if it still exists
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;

-- ============================================================
-- SEEDS (ON CONFLICT DO NOTHING — never overwrite live settings)
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  -- The admin Settings page and the storefront read THIS key.
  -- social_orders_only=true disables cart/checkout in favour of
  -- WhatsApp/Instagram ordering; flip it off in Admin → Settings.
  ('store_config', '{
    "store_name": "The Lunora Studio",
    "tagline": "Flowers Fade. Memories Don''t.",
    "contact_email": "lunorastudio.blooms@gmail.com",
    "contact_phone": "+91 81491 02923",
    "instagram_url": "https://www.instagram.com/thelunorastudio",
    "whatsapp_number": "+918149102923",
    "shipping_note": "Free shipping on orders above ₹999",
    "free_shipping_threshold": 999,
    "social_orders_only": false,
    "maintenance_mode": false
  }'),
  -- Homepage section image overrides (Admin → Content writes here)
  ('section_images', '{}'),
  -- Legacy/reference keys kept for compatibility
  ('store', '{"name": "Lunora Studio", "tagline": "Handmade With Love", "email": "lunorastudio.blooms@gmail.com", "phone": "+91 81491 02923", "currency": "INR", "currency_symbol": "₹"}'),
  ('social', '{"instagram": "https://instagram.com/thelunorastudio"}'),
  ('shipping', '{"free_shipping_threshold": 999, "default_rate": 99}'),
  ('tax', '{"gst_rate": 0, "inclusive": true}'),
  ('seo', '{"title": "Lunora Studio — Handcrafted Bouquets That Last Forever", "description": "Flowers fade. Memories don''t."}')
ON CONFLICT (key) DO NOTHING;

-- Default shipping rates (only if none exist yet)
INSERT INTO shipping_rates (name, description, min_order_amount, max_order_amount, rate, estimated_days_min, estimated_days_max)
SELECT 'Standard Delivery', 'Pan-India delivery', 0, 998.99, 99, 4, 7
WHERE NOT EXISTS (SELECT 1 FROM shipping_rates);

INSERT INTO shipping_rates (name, description, min_order_amount, rate, estimated_days_min, estimated_days_max)
SELECT 'Free Delivery', 'Free shipping on orders above ₹999', 999, 0, 4, 7
WHERE NOT EXISTS (SELECT 1 FROM shipping_rates WHERE rate = 0);

-- ============================================================
-- DONE. To make yourself admin, run (replace the email):
--   UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
-- ============================================================
