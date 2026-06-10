import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const { data: cols, error: e1 } = await sb
    .from("collections")
    .select("id, name, slug, description, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  console.log("Collections (anon):", cols?.length ?? 0, e1?.message || "OK");

  const { data: prods, error: e2 } = await sb
    .from("products")
    .select("id, name, slug")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  console.log("Products (anon):", prods?.length ?? 0, e2?.message || "OK");

  const ids = prods?.map((p: any) => p.id) ?? [];
  if (ids.length) {
    const { data: imgs, error: e3 } = await sb
      .from("product_images")
      .select("product_id, url, alt_text")
      .in("product_id", ids)
      .eq("is_primary", true);
    console.log("Images (anon):", imgs?.length ?? 0, e3?.message || "OK");
  }
}

test().then(() => process.exit(0));
