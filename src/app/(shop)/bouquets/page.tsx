import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "All Bouquets — Lunora Studio",
  description: "Browse our complete range of handcrafted pipe-cleaner flower bouquets.",
};

export default async function BouquetsPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data: products } = await sb
    .from("products")
    .select("id, name, slug, short_description, base_price, compare_at_price, product_type, is_featured, is_bestseller, is_new_arrival")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  // Fetch primary images
  const productIds = products?.map((p: any) => p.id) ?? [];
  const { data: images } = productIds.length
    ? await sb
        .from("product_images")
        .select("product_id, url, alt_text")
        .in("product_id", productIds)
        .eq("is_primary", true)
    : { data: [] };

  const imageMap = new Map<string, any>((images ?? []).map((img: any) => [img.product_id, img]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#B89A6A]">Shop</p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2F2926]">
          All Bouquets
        </h1>
        <p className="mt-3 text-sm text-[#7D7068] max-w-lg mx-auto">
          Each bouquet is handcrafted flower by flower, designed to last forever.
        </p>
      </div>

      {!products?.length ? (
        <p className="text-center text-[#7D7068] py-20">
          New bouquets coming soon. Stay tuned.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => {
            const img = imageMap.get(product.id);
            return (
              <Link
                key={product.id}
                href={`/bouquets/${product.slug}`}
                className="group cursor-pointer"
              >
                <div className="img-zoom aspect-[3/4] rounded-lg bg-[#F3E7E0] overflow-hidden">
                  {img ? (
                    <Image
                      src={img.url}
                      alt={img.alt_text || product.name}
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#7D7068] text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-2">
                    {product.is_new_arrival && (
                      <Badge className="bg-[#E8D2D9] text-[#2F2926] text-[10px] uppercase tracking-wider">New</Badge>
                    )}
                    {product.is_bestseller && (
                      <Badge className="bg-[#B89A6A]/10 text-[#B89A6A] text-[10px] uppercase tracking-wider">Bestseller</Badge>
                    )}
                  </div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-lg text-[#2F2926] group-hover:text-[#B89A6A] transition-colors">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-xs text-[#7D7068] line-clamp-2">{product.short_description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-medium text-[#2F2926]">
                      {formatPrice(product.base_price)}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-xs text-[#7D7068] line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
