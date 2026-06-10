import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from("collections")
    .select("name, description")
    .eq("slug", slug)
    .single();

  return {
    title: data ? `${data.name} — Lunora Studio` : "Collection — Lunora Studio",
    description: data?.description ?? undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const sb = supabase as any;

  const { data: collection } = await sb
    .from("collections")
    .select("id, name, slug, description, image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!collection) notFound();

  const { data: products } = await sb
    .from("products")
    .select("id, name, slug, short_description, base_price, compare_at_price, is_featured, is_bestseller, is_new_arrival")
    .eq("status", "active")
    .eq("category_id", collection.id)
    .order("sort_order", { ascending: true });

  const productIds = products?.map((p: any) => p.id) ?? [];
  const { data: images } = productIds.length
    ? await sb
        .from("product_images")
        .select("product_id, url, alt_text")
        .in("product_id", productIds)
        .eq("is_primary", true)
    : { data: [] };

  const imageMap = new Map<string, { url: string; alt_text: string | null }>(
    (images ?? []).map((img: any) => [img.product_id, img])
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Collection header */}
      <div className="mb-12">
        <Link href="/collections" className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B89A6A] hover:text-[#2F2926] transition-colors">
          ← All Collections
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2F2926] sm:text-5xl">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7D7068]">{collection.description}</p>
        )}
      </div>

      {/* Products grid */}
      {!products?.length ? (
        <div className="py-20 text-center">
          <p className="text-[#7D7068]">No bouquets in this collection yet.</p>
          <Link href="/bouquets" className="mt-3 inline-block text-sm font-medium text-[#B89A6A] hover:text-[#2F2926] transition-colors">
            Browse all bouquets →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => {
            const img = imageMap.get(product.id);
            return (
              <Link key={product.id} href={`/bouquets/${product.slug}`} className="group cursor-pointer">
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
                    <div className="flex h-full items-center justify-center text-[#7D7068] text-sm">No image</div>
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
                    <span className="text-sm font-medium text-[#2F2926]">{formatPrice(product.base_price)}</span>
                    {product.compare_at_price && (
                      <span className="text-xs text-[#7D7068] line-through">{formatPrice(product.compare_at_price)}</span>
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
