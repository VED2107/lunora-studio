import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, Pencil } from "lucide-react";

export default async function AdminCollectionsPage() {
  const supabase = await createClient();
  const sb = supabase as any;

  const { data: collections } = await sb
    .from("collections")
    .select("id, name, slug, description, image_url, is_active, sort_order, created_at")
    .order("sort_order", { ascending: true });

  const { data: productCounts } = await sb
    .from("products")
    .select("category_id")
    .eq("status", "active");

  const countMap = new Map<string, number>();
  productCounts?.forEach((p: any) => {
    if (p.category_id) countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush/20">
            <FolderOpen className="h-5 w-5 text-dusty-rose" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-light text-charcoal">Collections</h1>
            <p className="text-[11px] font-light text-muted">{collections?.length ?? 0} collections</p>
          </div>
        </div>
        <Link href="/admin/collections/new">
          <Button className="cursor-pointer rounded-full bg-charcoal text-cream hover:bg-charcoal/90 text-[10px] uppercase tracking-[0.15em] px-6 h-10">
            <Plus className="h-3.5 w-3.5 mr-2" /> Add Collection
          </Button>
        </Link>
      </div>

      {!collections?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/10 bg-warm-white/50 py-24">
          <FolderOpen className="h-10 w-10 text-charcoal/15 mb-3" />
          <p className="text-sm text-muted">No collections yet.</p>
          <Link href="/admin/collections/new" className="mt-3 text-xs font-medium text-dusty-rose hover:text-charcoal transition-colors">
            Create your first collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c: any) => {
            const count = countMap.get(c.id) ?? 0;
            return (
              <Link
                key={c.id}
                href={`/admin/collections/${c.id}`}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-dusty-rose/8 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-cream">
                  {c.image_url ? (
                    <Image src={c.image_url} alt={c.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen className="h-8 w-8 text-charcoal/10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className={`rounded-full border text-[9px] backdrop-blur-sm ${c.is_active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-charcoal/10 bg-charcoal/5 text-charcoal/40"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-charcoal">
                      <Pencil className="h-3 w-3" /> Edit
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-charcoal">{c.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-muted">{c.slug}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-charcoal/20" />
                    <span className="text-[10px] text-muted">{count} product{count !== 1 ? "s" : ""}</span>
                  </div>
                  {c.description && (
                    <p className="mt-2 text-xs text-muted line-clamp-2">{c.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
