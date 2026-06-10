"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

type ProductImage = {
  id?: string;
  product_id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
};

export default function ProductImageUpload({
  productId,
  initialImages = [],
}: {
  productId: string;
  initialImages?: ProductImage[];
}) {
  const supabase = createClient() as any;
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file, "product-images", `products/${productId}`);
      if (!url) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const newImg = {
        product_id: productId,
        url,
        alt_text: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        is_primary: images.length === 0 && i === 0,
        sort_order: images.length + i,
      };

      const { data, error } = await supabase
        .from("product_images")
        .insert(newImg)
        .select("id")
        .single();

      if (error) {
        toast.error(`DB error: ${error.message}`);
        continue;
      }

      setImages((prev) => [...prev, { ...newImg, id: data.id }]);
    }
    setUploading(false);
    toast.success("Images uploaded");
  };

  const handleDelete = async (img: ProductImage) => {
    if (!img.id) return;
    await supabase.from("product_images").delete().eq("id", img.id);
    if (img.url.includes("supabase")) {
      await deleteImage(img.url, "product-images");
    }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    toast.success("Image removed");
  };

  const setPrimary = async (img: ProductImage) => {
    if (!img.id) return;
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
    await supabase.from("product_images").update({ is_primary: true }).eq("id", img.id);
    setImages((prev) =>
      prev.map((i) => ({ ...i, is_primary: i.id === img.id }))
    );
    toast.success("Primary image updated");
  };

  return (
    <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Product Images</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id || img.url} className="group relative aspect-square overflow-hidden rounded-lg border border-charcoal/8 bg-cream">
            <Image src={img.url} alt={img.alt_text} fill className="object-cover" sizes="200px" />
            {img.is_primary && (
              <div className="absolute top-1.5 left-1.5">
                <span className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[9px] font-medium text-white">
                  <Star className="h-2.5 w-2.5 fill-white" /> Primary
                </span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/50 opacity-0 transition-opacity group-hover:opacity-100">
              {!img.is_primary && (
                <button
                  type="button"
                  onClick={() => setPrimary(img)}
                  className="rounded-full bg-gold p-1.5 text-white"
                  title="Set as primary"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(img)}
                className="rounded-full bg-red-500 p-1.5 text-white"
                title="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-charcoal/15 bg-cream/50 text-muted transition-colors hover:border-dusty-rose/40 hover:text-dusty-rose">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {images.length === 0 && (
        <p className="mt-3 text-xs text-muted">No images yet. Upload product photos above.</p>
      )}
    </div>
  );
}
