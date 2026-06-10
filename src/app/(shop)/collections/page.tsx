import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Collections — Lunora Studio",
  description: "Explore our curated collections of handcrafted bouquets for every occasion.",
};

export default async function CollectionsPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: collections } = await (supabase as any)
    .from("collections")
    .select("id, name, slug, description, image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#B89A6A]">Curated</p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2F2926]">
          Our Collections
        </h1>
      </div>

      {!collections?.length ? (
        <p className="text-center text-[#7D7068] py-20">Collections coming soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c: any) => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="group cursor-pointer">
              <div className="img-zoom aspect-[4/5] overflow-hidden rounded-lg bg-[#F3E7E0]">
                {c.image_url ? (
                  <Image src={c.image_url} alt={c.name} width={600} height={750} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#7D7068] text-sm">No image</div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[#2F2926] group-hover:text-[#B89A6A] transition-colors">
                  {c.name}
                </h3>
                {c.description && <p className="mt-1 text-sm text-[#7D7068] line-clamp-2">{c.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
