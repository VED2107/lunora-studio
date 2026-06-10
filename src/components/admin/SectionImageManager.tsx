"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";

type SectionConfig = {
  key: string;
  label: string;
  description: string;
  slots: { id: string; label: string; fallback: string }[];
};

const SECTIONS: SectionConfig[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Main hero banner on the homepage",
    slots: [
      { id: "hero_main", label: "Hero Main Image", fallback: "/images/bouquets/hero-bouquet.png" },
    ],
  },
  {
    key: "collection",
    label: "Collection Section",
    description: "Featured bouquets bento grid (6 slots). Leave empty to use product images from database.",
    slots: [
      { id: "collection_1", label: "Slot 1 (Large)", fallback: "/images/bouquets/sunflower-styled.jpeg" },
      { id: "collection_2", label: "Slot 2", fallback: "/images/bouquets/blue-lily-branded.jpeg" },
      { id: "collection_3", label: "Slot 3 (Tall)", fallback: "/images/bouquets/purple-labeled.jpeg" },
      { id: "collection_4", label: "Slot 4", fallback: "/images/bouquets/pink-single-sunset.jpeg" },
      { id: "collection_5", label: "Slot 5", fallback: "/images/bouquets/colorful-celebration.png" },
      { id: "collection_6", label: "Slot 6", fallback: "/images/bouquets/blue-lily-sunset.jpeg" },
    ],
  },
  {
    key: "process",
    label: "Process Section",
    description: "The 5-step horizontal scroll cards. Leave empty to use product images.",
    slots: [
      { id: "process_1", label: "Step 1 — Design", fallback: "/images/bouquets/purple-collection.jpeg" },
      { id: "process_2", label: "Step 2 — Handcraft", fallback: "/images/bouquets/pink-lily.jpeg" },
      { id: "process_3", label: "Step 3 — Wrap", fallback: "/images/bouquets/blue-lily-closeup.jpeg" },
      { id: "process_4", label: "Step 4 — Gift", fallback: "/images/bouquets/blue-lily-birthday.jpeg" },
      { id: "process_5", label: "Step 5 — Keep Forever", fallback: "/images/bouquets/blue-lily-sunset-2.jpeg" },
    ],
  },
];

type ImageMap = Record<string, string>;

export default function SectionImageManager() {
  const supabase = createClient() as any;
  const [images, setImages] = useState<ImageMap>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "section_images")
        .single();
      if (data?.value && typeof data.value === "object") {
        setImages(data.value as ImageMap);
      }
      setLoaded(true);
    })();
  }, [supabase]);

  const handleUpload = async (slotId: string, file: File) => {
    setUploading(slotId);
    const url = await uploadImage(file, "site-images", "sections");
    if (url) {
      setImages((prev) => ({ ...prev, [slotId]: url }));
      toast.success(`Image uploaded for ${slotId}`);
    } else {
      toast.error("Upload failed — check Supabase storage bucket 'site-images' exists and is public");
    }
    setUploading(null);
  };

  const handleUrlPaste = (slotId: string, url: string) => {
    setImages((prev) => ({ ...prev, [slotId]: url }));
  };

  const handleClear = (slotId: string) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "section_images", value: images }, { onConflict: "key" });
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Section images saved! Changes appear on next page load.");
    }
    setSaving(false);
  };

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 py-12 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading section images...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {SECTIONS.map((section) => (
        <div key={section.key} className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-heading text-lg font-medium text-charcoal">{section.label}</h3>
            <p className="text-xs text-muted">{section.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slots.map((slot) => {
              const currentUrl = images[slot.id];
              const displayUrl = currentUrl || slot.fallback;

              return (
                <div key={slot.id} className="space-y-2">
                  <Label className="text-xs">{slot.label}</Label>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-charcoal/8 bg-cream">
                    <Image
                      src={displayUrl}
                      alt={slot.label}
                      fill
                      className="object-cover"
                      sizes="250px"
                    />
                    {!currentUrl && (
                      <div className="absolute top-2 left-2">
                        <span className="rounded-full bg-charcoal/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-cream">
                          Fallback
                        </span>
                      </div>
                    )}
                    {currentUrl && (
                      <button
                        type="button"
                        onClick={() => handleClear(slot.id)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileRefs.current[slot.id]?.click()}
                        className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-charcoal"
                        disabled={uploading === slot.id}
                      >
                        {uploading === slot.id ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="h-3.5 w-3.5" /> Upload</>
                        )}
                      </button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileRefs.current[slot.id] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(slot.id, file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <Input
                    placeholder="Or paste image URL..."
                    value={currentUrl || ""}
                    onChange={(e) => handleUrlPaste(slot.id, e.target.value)}
                    className="text-xs"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer bg-charcoal text-cream shadow-lg hover:bg-charcoal/90"
          size="lg"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
