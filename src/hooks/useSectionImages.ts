"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageMap = Record<string, string>;

let cachedImages: ImageMap | null = null;

export function useSectionImages() {
  const [images, setImages] = useState<ImageMap>(cachedImages ?? {});

  useEffect(() => {
    if (cachedImages) return;
    const supabase = createClient() as any;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "section_images")
        .single();
      if (data?.value && typeof data.value === "object") {
        cachedImages = data.value as ImageMap;
        setImages(cachedImages);
      }
    })();
  }, []);

  return images;
}

export function getSectionImage(images: ImageMap, slotId: string, fallback: string): string {
  return images[slotId] || fallback;
}
