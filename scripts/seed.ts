/**
 * Seed script — populates Supabase with demo collections, products, and images.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const COLLECTIONS = [
  { name: "Birthday Bouquets", slug: "birthday-bouquets", description: "Handcrafted bouquets to make birthdays unforgettable.", image_url: "/images/bouquets/pink-lily.jpeg", sort_order: 1 },
  { name: "Anniversary Collection", slug: "anniversary-collection", description: "Celebrate love with bouquets that last as long as your memories.", image_url: "/images/bouquets/purple-labeled.jpeg", sort_order: 2 },
  { name: "Congratulations", slug: "congratulations", description: "Mark milestones with flowers that never fade.", image_url: "/images/bouquets/colorful-celebration.png", sort_order: 3 },
  { name: "Just Because", slug: "just-because", description: "No reason needed — sometimes love is the reason.", image_url: "/images/bouquets/pink-single-sunset.jpeg", sort_order: 4 },
];

const PRODUCTS = [
  {
    name: "Sunlit Promise",
    slug: "sunlit-promise",
    description: "A warm sunflower bouquet that captures golden summer mornings. Each petal is individually shaped to mimic the natural curl of a sunflower, wrapped in kraft paper with a satin gold ribbon.",
    short_description: "A warm reminder that joy lives in the little things.",
    product_type: "premium_bouquet",
    base_price: 1299,
    compare_at_price: 1599,
    tags: ["Birthdays & Celebrations", "Sunflower"],
    is_featured: true,
    is_new_arrival: true,
    sort_order: 1,
    image: "/images/bouquets/sunflower-styled.jpeg",
  },
  {
    name: "Blue Elegance",
    slug: "blue-elegance",
    description: "Cool blue lilies arranged with delicate precision. This bouquet brings a sense of calm and sophistication, perfect for expressing gratitude.",
    short_description: "A touch of calm, a whole lot of love.",
    product_type: "premium_bouquet",
    base_price: 1499,
    tags: ["Thank You & Appreciation", "Lily"],
    is_featured: true,
    is_bestseller: true,
    sort_order: 2,
    image: "/images/bouquets/blue-lily-branded.jpeg",
  },
  {
    name: "Lavender Dreams",
    slug: "lavender-dreams",
    description: "Soft purple hues woven together in a dreamy arrangement. Each lavender stem is handcrafted to capture the romance of twilight gardens.",
    short_description: "Soft, serene, and full of tender meaning.",
    product_type: "luxury_bouquet",
    base_price: 1899,
    compare_at_price: 2299,
    tags: ["Anniversaries & Romance", "Lavender"],
    is_featured: true,
    sort_order: 3,
    image: "/images/bouquets/purple-labeled.jpeg",
  },
  {
    name: "Blushing Petals",
    slug: "blushing-petals",
    description: "A single statement bloom in soft pink, wrapped minimally for maximum impact. Sometimes less is more.",
    short_description: "Delicate as a whisper, bold as a declaration.",
    product_type: "single_flower",
    base_price: 599,
    tags: ["Just Because", "Rose"],
    is_featured: true,
    sort_order: 4,
    image: "/images/bouquets/pink-single-sunset.jpeg",
  },
  {
    name: "Celebration Bloom",
    slug: "celebration-bloom",
    description: "A vibrant mixed bouquet bursting with color and energy. Every flower represents a different wish for the recipient — joy, love, success.",
    short_description: "Every color tells a story of love and togetherness.",
    product_type: "premium_bouquet",
    base_price: 1699,
    tags: ["Congratulations & Milestones", "Mixed"],
    is_featured: true,
    is_new_arrival: true,
    sort_order: 5,
    image: "/images/bouquets/colorful-celebration.png",
  },
  {
    name: "Golden Hour",
    slug: "golden-hour",
    description: "Blue lilies catching the warmth of sunset. This bouquet transitions from cool blues to warm golds, symbolizing the golden moments in life.",
    short_description: "Catching the warmth of golden light in every petal.",
    product_type: "premium_bouquet",
    base_price: 1599,
    tags: ["Graduations & Achievements", "Lily"],
    is_featured: true,
    is_bestseller: true,
    sort_order: 6,
    image: "/images/bouquets/blue-lily-sunset.jpeg",
  },
  {
    name: "Royal Purple",
    slug: "royal-purple",
    description: "A collection of rich purple blooms arranged in a cascading style. Premium materials with a velvet touch finish.",
    short_description: "For those who appreciate the finer things.",
    product_type: "luxury_bouquet",
    base_price: 2499,
    compare_at_price: 2999,
    tags: ["Wedding Decor", "Purple"],
    is_featured: false,
    sort_order: 7,
    image: "/images/bouquets/purple-collection.jpeg",
  },
  {
    name: "Pink Lily Single",
    slug: "pink-lily-single",
    description: "One perfect pink lily, handcrafted with extraordinary detail. Each petal curves naturally, creating a stunning single-stem keepsake.",
    short_description: "Simplicity at its finest.",
    product_type: "single_flower",
    base_price: 499,
    tags: ["Just Because", "Lily"],
    is_featured: false,
    is_new_arrival: true,
    sort_order: 8,
    image: "/images/bouquets/pink-lily.jpeg",
  },
];

async function seed() {
  console.log("🌸 Seeding Lunora Studio database...\n");

  // 1. Insert collections
  console.log("📂 Creating collections...");
  for (const col of COLLECTIONS) {
    const { error } = await supabase
      .from("collections")
      .upsert({ ...col, is_active: true }, { onConflict: "slug" });
    if (error) console.error(`  ✗ ${col.name}: ${error.message}`);
    else console.log(`  ✓ ${col.name}`);
  }

  // 2. Insert products
  console.log("\n💐 Creating products...");
  for (const prod of PRODUCTS) {
    const { image, ...productData } = prod;
    const { data, error } = await supabase
      .from("products")
      .upsert(
        { ...productData, status: "active" as const },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      console.error(`  ✗ ${prod.name}: ${error.message}`);
      continue;
    }
    console.log(`  ✓ ${prod.name} (${data.id})`);

    // 3. Insert primary image (delete existing first to avoid duplicates on re-run)
    await supabase.from("product_images").delete().eq("product_id", data.id);
    const { error: imgError } = await supabase
      .from("product_images")
      .insert({
        product_id: data.id,
        url: image,
        alt_text: prod.name,
        is_primary: true,
        sort_order: 0,
      });

    if (imgError) console.error(`    ✗ Image: ${imgError.message}`);
    else console.log(`    ✓ Image added`);
  }

  // 4. Link products to collections
  console.log("\n🔗 Linking products to collections...");
  const { data: allCollections } = await supabase.from("collections").select("id, slug");
  const { data: allProducts } = await supabase.from("products").select("id, tags");

  if (allCollections && allProducts) {
    const colMap = new Map(allCollections.map((c: any) => [c.slug, c.id]));

    // Simple tag → collection mapping
    const tagToCol: Record<string, string> = {
      "Birthdays & Celebrations": "birthday-bouquets",
      "Anniversaries & Romance": "anniversary-collection",
      "Congratulations & Milestones": "congratulations",
      "Graduations & Achievements": "congratulations",
      "Just Because": "just-because",
      "Thank You & Appreciation": "just-because",
      "Wedding Decor": "anniversary-collection",
    };

    for (const prod of allProducts) {
      const firstTag = (prod as any).tags?.[0];
      const colSlug = tagToCol[firstTag];
      const colId = colSlug ? colMap.get(colSlug) : undefined;
      if (colId) {
        await supabase
          .from("products")
          .update({ category_id: colId })
          .eq("id", prod.id);
      }
    }
    console.log("  ✓ Products linked to collections");
  }

  console.log("\n✅ Seed complete! Refresh your site to see the data.");
}

seed().catch(console.error);
