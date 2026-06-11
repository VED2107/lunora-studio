"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Palette, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

type SavedDesign = {
  id: string;
  name: string;
  config: Record<string, unknown>;
  preview_url: string | null;
  estimated_price: number | null;
  created_at: string;
};

export default function SavedDesignsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("saved_designs")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setDesigns(data ?? []);
    setLoading(false);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("saved_designs").delete().eq("id", id);
    toast.success("Design removed");
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#7D7068]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926]">
          Saved Designs
        </h2>
        <p className="mt-1 text-sm text-[#7D7068]">
          Custom bouquets you&apos;ve designed and saved
        </p>
      </div>

      {designs.length === 0 ? (
        <div className="text-center py-16 space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#F3E7E0] flex items-center justify-center">
            <Palette className="h-6 w-6 text-[#7D7068]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#2F2926] mb-1">
              No saved designs yet
            </p>
            <p className="text-sm text-[#7D7068] max-w-xs mx-auto">
              Use the Custom Bouquet Builder to design your dream bouquet, then
              save it here for later.
            </p>
          </div>
          <Link href="/custom-orders">
            <Button className="cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 gap-2">
              Start Designing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <div
              key={design.id}
              className="group rounded-xl border border-[rgba(47,41,38,0.08)] bg-white overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-[#F3E7E0] overflow-hidden relative">
                {design.preview_url ? (
                  <Image
                    src={design.preview_url}
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Palette className="h-10 w-10 text-[#CDA4B5]/40" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="font-[family-name:var(--font-cormorant)] text-lg font-medium text-[#2F2926]">
                    {design.name || "Untitled Design"}
                  </p>
                  <p className="text-xs text-[#7D7068] mt-0.5">
                    {new Date(design.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {design.estimated_price != null && (
                    <p className="text-sm font-medium text-[#2F2926] mt-1">
                      Est. {formatPrice(design.estimated_price)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/custom-orders?design=${design.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 text-xs gap-1.5"
                    >
                      <Palette className="h-3.5 w-3.5" />
                      Edit Design
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(design.id)}
                    className="cursor-pointer border-[rgba(47,41,38,0.12)] text-[#7D7068] hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
