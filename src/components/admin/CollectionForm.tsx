"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";

type FormData = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

type Props = {
  initialData?: any;
  collectionId?: string;
};

export default function CollectionForm({ initialData, collectionId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);
  const isEdit = !!collectionId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      image_url: initialData?.image_url ?? "",
      is_active: initialData?.is_active ?? true,
      sort_order: initialData?.sort_order ?? 0,
    },
  });

  const nameValue = watch("name");

  const autoSlug = () => {
    if (nameValue) setValue("slug", slugify(nameValue));
  };

  const onSubmit = async (data: FormData) => {
    const sb = supabase as any;
    const payload = {
      ...data,
      sort_order: Number(data.sort_order) || 0,
    };

    if (isEdit) {
      await sb.from("collections").update(payload).eq("id", collectionId);
    } else {
      await sb.from("collections").insert(payload);
    }
    router.push("/admin/collections");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!collectionId || !confirm("Delete this collection? This cannot be undone.")) return;
    setDeleting(true);
    await (supabase as any).from("collections").delete().eq("id", collectionId);
    router.push("/admin/collections");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Collection Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              onBlur={autoSlug}
              placeholder="e.g. Birthday Bouquets"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" {...register("slug", { required: "Slug is required" })} placeholder="birthday-bouquets" />
            {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} placeholder="A short description of this collection..." />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" {...register("image_url")} placeholder="/images/bouquets/example.jpeg or https://..." />
            <p className="text-xs text-muted">Use a path from /images/bouquets/ or an external URL</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input id="sort_order" type="number" {...register("sort_order")} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Visibility</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">Active</p>
            <p className="text-xs text-muted">Show this collection on the shop</p>
          </div>
          <Switch checked={watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {isEdit && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting} className="cursor-pointer">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer bg-charcoal hover:bg-charcoal/90 text-cream">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Save Changes" : "Create Collection"}
          </Button>
        </div>
      </div>
    </form>
  );
}
