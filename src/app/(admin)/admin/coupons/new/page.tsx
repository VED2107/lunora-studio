import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CouponForm from "@/components/admin/CouponForm";

export const metadata: Metadata = {
  title: "New Coupon — Admin — Lunora Studio",
};

export default function NewCouponPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/coupons" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">New Coupon</h1>
          <p className="text-[11px] font-light text-muted">Create a discount code for your customers</p>
        </div>
      </div>
      <CouponForm />
    </div>
  );
}
