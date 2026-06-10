"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

const PRODUCT_TYPES = [
  { value: "single_flower", label: "Single Flower" },
  { value: "mini_bouquet", label: "Mini Bouquet" },
  { value: "premium_bouquet", label: "Premium Bouquet" },
  { value: "luxury_bouquet", label: "Luxury Bouquet" },
  { value: "custom_bouquet", label: "Custom Bouquet" },
  { value: "gift_bundle", label: "Gift Bundle" },
];

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
  { value: "archived", label: "Archived" },
];

type Props = {
  initialData?: any;
  productId?: string;
};

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);
  const isEdit = !!productId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      short_description: initialData?.short_description ?? "",
      product_type: initialData?.product_type ?? "premium_bouquet",
      status: initialData?.status ?? "draft",
      category_id: initialData?.category_id ?? null,
      base_price: initialData?.base_price ?? 0,
      compare_at_price: initialData?.compare_at_price ?? null,
      cost_price: initialData?.cost_price ?? null,
      sku: initialData?.sku ?? "",
      tags: initialData?.tags?.join(", ") ?? "",
      is_featured: initialData?.is_featured ?? false,
      is_bestseller: initialData?.is_bestseller ?? false,
      is_new_arrival: initialData?.is_new_arrival ?? false,
      meta_title: initialData?.meta_title ?? "",
      meta_description: initialData?.meta_description ?? "",
    },
  });

  const nameValue = watch("name");

  const autoSlug = () => {
    if (nameValue) setValue("slug", slugify(nameValue));
  };

  const onSubmit = async (data: ProductFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      compare_at_price: data.compare_at_price || null,
      cost_price: data.cost_price || null,
      sku: data.sku || null,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      short_description: data.short_description || null,
      description: data.description || null,
    };

    if (isEdit) {
      await sb.from("products").update(payload).eq("id", productId);
    } else {
      await sb.from("products").insert(payload);
    }
    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!productId || !confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("products").delete().eq("id", productId);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register("name")} onBlur={autoSlug} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Product Type</Label>
            <Select
              defaultValue={watch("product_type")}
              onValueChange={(v) => setValue("product_type", v as any)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue={watch("status")}
              onValueChange={(v) => setValue("status", v as any)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input id="short_description" {...register("short_description")} maxLength={300} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="base_price">Price (₹)</Label>
            <Input id="base_price" type="number" step="1" {...register("base_price")} />
            {errors.base_price && <p className="text-xs text-red-600">{errors.base_price.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="compare_at_price">Compare At Price (₹)</Label>
            <Input id="compare_at_price" type="number" step="1" {...register("compare_at_price")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost_price">Cost Price (₹)</Label>
            <Input id="cost_price" type="number" step="1" {...register("cost_price")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} placeholder="LUN-001" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" {...register("tags")} placeholder="birthday, roses, pink" />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Visibility</h2>
        <div className="space-y-4">
          {[
            { field: "is_featured" as const, label: "Featured Product", desc: "Show on homepage" },
            { field: "is_bestseller" as const, label: "Best Seller", desc: "Show bestseller badge" },
            { field: "is_new_arrival" as const, label: "New Arrival", desc: "Show new badge" },
          ].map((item) => (
            <div key={item.field} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Switch
                checked={watch(item.field)}
                onCheckedChange={(v) => setValue(item.field, v)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">SEO</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title (max 70 chars)</Label>
            <Input id="meta_title" {...register("meta_title")} maxLength={70} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description (max 160 chars)</Label>
            <Textarea id="meta_description" {...register("meta_description")} rows={2} maxLength={160} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer bg-gray-900 hover:bg-gray-800">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
