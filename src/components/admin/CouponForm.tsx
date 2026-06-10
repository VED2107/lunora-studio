"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

type FormData = {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: string;
  usage_limit: string;
  per_user_limit: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
};

type Props = {
  initialData?: any;
  couponId?: string;
};

const toDateInput = (iso: string | null | undefined) =>
  iso ? iso.slice(0, 10) : "";

export default function CouponForm({ initialData, couponId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!couponId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      code: initialData?.code ?? "",
      description: initialData?.description ?? "",
      discount_type: initialData?.discount_type ?? "percentage",
      discount_value: initialData?.discount_value ?? 10,
      min_order_amount: initialData?.min_order_amount ?? 0,
      max_discount_amount: initialData?.max_discount_amount?.toString() ?? "",
      usage_limit: initialData?.usage_limit?.toString() ?? "",
      per_user_limit: initialData?.per_user_limit ?? 1,
      is_active: initialData?.is_active ?? true,
      starts_at: toDateInput(initialData?.starts_at),
      expires_at: toDateInput(initialData?.expires_at),
    },
  });

  const discountType = watch("discount_type");

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const sb = supabase as any;
    const payload = {
      code: data.code.trim().toUpperCase(),
      description: data.description || null,
      discount_type: data.discount_type,
      discount_value: Number(data.discount_value),
      min_order_amount: Number(data.min_order_amount) || 0,
      max_discount_amount: data.max_discount_amount
        ? Number(data.max_discount_amount)
        : null,
      usage_limit: data.usage_limit ? Number(data.usage_limit) : null,
      per_user_limit: Number(data.per_user_limit) || 1,
      is_active: data.is_active,
      starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : null,
      expires_at: data.expires_at
        ? new Date(`${data.expires_at}T23:59:59`).toISOString()
        : null,
    };

    const { error } = isEdit
      ? await sb.from("coupons").update(payload).eq("id", couponId)
      : await sb.from("coupons").insert(payload);

    if (error) {
      setServerError(
        error.code === "23505"
          ? "A coupon with this code already exists."
          : error.message
      );
      return;
    }
    router.push("/admin/coupons");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!couponId || !confirm("Delete this coupon? This cannot be undone.")) return;
    setDeleting(true);
    await (supabase as any).from("coupons").delete().eq("id", couponId);
    router.push("/admin/coupons");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Coupon Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              {...register("code", { required: "Code is required" })}
              placeholder="e.g. WELCOME10"
              className="uppercase tracking-wider"
            />
            {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <Select
              value={discountType}
              onValueChange={(v) => setValue("discount_type", v as "percentage" | "fixed")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_value">
              Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
            </Label>
            <Input
              id="discount_value"
              type="number"
              step="1"
              min="1"
              {...register("discount_value", {
                required: "Value is required",
                min: { value: 1, message: "Must be at least 1" },
                ...(discountType === "percentage" && {
                  max: { value: 100, message: "Percentage cannot exceed 100" },
                }),
              })}
            />
            {errors.discount_value && (
              <p className="text-xs text-red-600">{errors.discount_value.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="min_order_amount">Minimum Order Amount (₹)</Label>
            <Input id="min_order_amount" type="number" min="0" {...register("min_order_amount")} />
          </div>
          {discountType === "percentage" && (
            <div className="space-y-2">
              <Label htmlFor="max_discount_amount">Max Discount Cap (₹)</Label>
              <Input
                id="max_discount_amount"
                type="number"
                min="0"
                {...register("max_discount_amount")}
                placeholder="No cap"
              />
              <p className="text-xs text-muted">Leave empty for no cap</p>
            </div>
          )}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={2}
              placeholder="Internal note, e.g. First-order welcome discount"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Usage Limits</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Total Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              {...register("usage_limit")}
              placeholder="Unlimited"
            />
            <p className="text-xs text-muted">Leave empty for unlimited uses</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="per_user_limit">Per-Customer Limit</Label>
            <Input id="per_user_limit" type="number" min="1" {...register("per_user_limit")} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Schedule & Visibility</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="starts_at">Starts On</Label>
            <Input id="starts_at" type="date" {...register("starts_at")} />
            <p className="text-xs text-muted">Leave empty to start immediately</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires_at">Expires On</Label>
            <Input id="expires_at" type="date" {...register("expires_at")} />
            <p className="text-xs text-muted">Leave empty for no expiry</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-charcoal/5 pt-5">
          <div>
            <p className="text-sm font-medium text-charcoal">Active</p>
            <p className="text-xs text-muted">Customers can apply this coupon at checkout</p>
          </div>
          <Switch checked={watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} />
        </div>
      </div>

      {serverError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

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
            {isEdit ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </div>
    </form>
  );
}
