import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  file: File,
  bucket: string = "product-images",
  folder: string = "uploads"
): Promise<string | null> {
  const supabase = createClient() as any;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data?.publicUrl ?? null;
}

export async function deleteImage(url: string, bucket: string = "product-images"): Promise<boolean> {
  const supabase = createClient() as any;
  const bucketPrefix = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(bucketPrefix);
  const filePath = idx >= 0 ? url.slice(idx + bucketPrefix.length) : url;

  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  return !error;
}
