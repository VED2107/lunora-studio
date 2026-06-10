import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const sb = supabase as any;

  const { data: product } = await sb.from("products").select("*").eq("id", id).single();
  if (!product) notFound();

  const { data: images } = await sb
    .from("product_images")
    .select("id, product_id, url, alt_text, is_primary, sort_order")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Edit Product</h1>
          <p className="text-[11px] font-light text-muted">{product.name}</p>
        </div>
      </div>
      <ProductImageUpload productId={id} initialImages={images ?? []} />
      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
