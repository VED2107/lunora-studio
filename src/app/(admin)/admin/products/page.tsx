import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Star, Eye, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-cream-dark text-muted border-charcoal/8",
  hidden: "bg-blush/20 text-dusty-rose border-dusty-rose/20",
  archived: "bg-charcoal/5 text-charcoal/40 border-charcoal/10",
};

const typeLabels: Record<string, string> = {
  single_flower: "Single",
  mini_bouquet: "Mini",
  premium_bouquet: "Premium",
  luxury_bouquet: "Luxury",
  custom_bouquet: "Custom",
  gift_bundle: "Bundle",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const sb = supabase as any;

  const { data: products } = await sb
    .from("products")
    .select("id, name, slug, product_type, status, base_price, compare_at_price, is_featured, is_bestseller, is_new_arrival, created_at, product_images(url, is_primary)")
    .order("created_at", { ascending: false });

  const getImage = (p: any) =>
    p.product_images?.find((i: any) => i.is_primary)?.url ??
    p.product_images?.[0]?.url ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dusty-rose/10">
            <Package className="h-5 w-5 text-dusty-rose" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-light text-charcoal">Products</h1>
            <p className="text-[11px] font-light text-muted">{products?.length ?? 0} products</p>
          </div>
        </div>
        <Link href="/admin/products/new">
          <Button className="cursor-pointer rounded-full bg-charcoal text-cream hover:bg-charcoal/90 text-[10px] uppercase tracking-[0.15em] px-6 h-10">
            <Plus className="h-3.5 w-3.5 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      {!products?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/10 bg-warm-white/50 py-24">
          <Package className="h-10 w-10 text-charcoal/15 mb-3" />
          <p className="text-sm text-muted">No products yet.</p>
          <Link href="/admin/products/new" className="mt-3 text-xs font-medium text-dusty-rose hover:text-charcoal transition-colors">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p: any) => {
            const img = getImage(p);
            return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-dusty-rose/8 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                  {img ? (
                    <Image src={img} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-charcoal/10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge variant="secondary" className={`rounded-full border text-[9px] backdrop-blur-sm ${statusColors[p.status] ?? ""}`}>
                      {p.status}
                    </Badge>
                    {p.is_new_arrival && (
                      <Badge variant="secondary" className="rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-[9px]">New</Badge>
                    )}
                  </div>
                  {p.is_featured && (
                    <div className="absolute top-2 right-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/90 shadow-sm">
                        <Star className="h-3 w-3 fill-white text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-charcoal">
                      <Pencil className="h-3 w-3" /> Edit
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-charcoal">{p.name}</h3>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted">
                        {typeLabels[p.product_type] ?? p.product_type}
                        {p.is_bestseller && <span className="ml-1.5 text-gold">· Bestseller</span>}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-sm font-medium text-charcoal">{formatPrice(p.base_price)}</p>
                      {p.compare_at_price && (
                        <p className="text-[10px] text-muted line-through">{formatPrice(p.compare_at_price)}</p>
                      )}
                    </div>
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
