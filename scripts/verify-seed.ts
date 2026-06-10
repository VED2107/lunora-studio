import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
  const { data: cols, error: e1 } = await sb.from("collections").select("name, is_active");
  console.log("Collections:", cols?.length ?? 0, e1?.message || "OK");
  cols?.forEach((c: any) => console.log("  -", c.name, c.is_active ? "(active)" : "(inactive)"));

  const { data: prods, error: e2 } = await sb.from("products").select("name, status");
  console.log("Products:", prods?.length ?? 0, e2?.message || "OK");
  prods?.forEach((p: any) => console.log("  -", p.name, `(${p.status})`));

  const { data: imgs, error: e3 } = await sb.from("product_images").select("product_id, url");
  console.log("Images:", imgs?.length ?? 0, e3?.message || "OK");
}

verify();
