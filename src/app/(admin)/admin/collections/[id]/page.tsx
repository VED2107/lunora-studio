import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CollectionForm from "@/components/admin/CollectionForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: collection } = await (supabase as any)
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/collections" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Edit Collection</h1>
          <p className="text-[11px] font-light text-muted">{collection.name}</p>
        </div>
      </div>
      <CollectionForm initialData={collection} collectionId={id} />
    </div>
  );
}
