import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name required").max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().optional().default(""),
  short_description: z.string().max(300).optional().default(""),
  product_type: z.enum([
    "single_flower", "mini_bouquet", "premium_bouquet",
    "luxury_bouquet", "custom_bouquet", "gift_bundle",
  ]),
  status: z.enum(["draft", "active", "hidden", "archived"]),
  category_id: z.string().uuid().nullable().optional(),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  sku: z.string().max(100).optional().default(""),
  tags: z.string().optional().default(""),
  is_featured: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  meta_title: z.string().max(70).optional().default(""),
  meta_description: z.string().max(160).optional().default(""),
});

export type ProductFormData = z.infer<typeof productSchema>;
