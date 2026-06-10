import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CouponForm from "@/components/admin/CouponForm";

export const metadata: Metadata = {
  title: "Edit Coupon — Admin — Lunora Studio",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: coupon } = await (supabase as any)
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (!coupon) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/coupons" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Edit Coupon</h1>
          <p className="text-[11px] font-light text-muted">
            <span className="font-mono tracking-wider">{coupon.code}</span> · used {coupon.used_count} time{coupon.used_count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <CouponForm initialData={coupon} couponId={id} />
    </div>
  );
}
