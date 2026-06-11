import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://thelunorastudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [{ data: products }, { data: collections }] = await Promise.all([
    sb.from("products").select("slug, updated_at").eq("status", "active"),
    sb.from("collections").select("slug, updated_at").eq("is_active", true),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productUrls = (products ?? []).map((p: any) => ({
    url: `${BASE_URL}/bouquets/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionUrls = (collections ?? []).map((c: any) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/bouquets`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/custom-orders`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/gift-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...productUrls,
    ...collectionUrls,
  ];
}
