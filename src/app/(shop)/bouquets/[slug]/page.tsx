import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ProductActions from "@/components/product/ProductActions";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("products")
    .select("name, meta_title, meta_description, short_description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!data) return { title: "Product Not Found" };
  return {
    title: data.meta_title || `${data.name} — Lunora Studio`,
    description: data.meta_description || data.short_description || "",
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const { data: product } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) notFound();

  const { data: images } = await sb
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const { data: variants } = await sb
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const primaryImage = images?.find((i: any) => i.is_primary) ?? images?.[0];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description || "",
    image: primaryImage?.url,
    brand: { "@type": "Brand", name: "The Lunora Studio" },
    offers: {
      "@type": "Offer",
      price: product.base_price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://thelunorastudio.com/bouquets/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#F3E7E0]">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt_text || product.name}
                width={800}
                height={1066}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                No image available
              </div>
            )}
          </div>
          {images && images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img: any) => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-[#F3E7E0]">
                  <Image
                    src={img.url}
                    alt={img.alt_text || ""}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.is_new_arrival && (
                <Badge className="bg-[#E8D2D9] text-[#2F2926] text-[10px]">New Arrival</Badge>
              )}
              {product.is_bestseller && (
                <Badge className="bg-[#B89A6A]/10 text-[#B89A6A] text-[10px]">Bestseller</Badge>
              )}
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {product.product_type.replace(/_/g, " ")}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926] lg:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-[#2F2926]">
              {formatPrice(product.base_price)}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {product.short_description && (
            <p className="text-sm leading-relaxed text-muted">
              {product.short_description}
            </p>
          )}

          {/* Variants + Actions */}
          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              base_price: product.base_price,
              image_url: primaryImage?.url ?? null,
            }}
            variants={
              variants?.map((v: any) => ({
                id: v.id,
                name: v.name,
                price: v.price,
              })) ?? []
            }
          />

          {/* Customise CTA */}
          <Link
            href={`/custom-orders?product=${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(47,41,38,0.12)] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#2F2926] transition-all hover:border-[#CDA4B5] hover:text-[#CDA4B5]"
          >
            Customise this Bouquet
          </Link>

          {/* Description */}
          {product.description && (
            <div className="border-t border-[rgba(47,41,38,0.08)] pt-6">
              <h2 className="text-sm font-medium text-[#2F2926] mb-3">Description</h2>
              <div className="text-sm leading-relaxed text-muted whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
