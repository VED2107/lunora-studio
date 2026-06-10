import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Ticket, Percent, IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Coupons — Admin — Lunora Studio",
};

function couponState(c: any): { label: string; className: string } {
  const now = new Date();
  if (!c.is_active)
    return { label: "Inactive", className: "border-charcoal/10 bg-charcoal/5 text-charcoal/40" };
  if (c.expires_at && new Date(c.expires_at) < now)
    return { label: "Expired", className: "border-red-200 bg-red-50 text-red-600" };
  if (c.starts_at && new Date(c.starts_at) > now)
    return { label: "Scheduled", className: "border-blue-200 bg-blue-50 text-blue-600" };
  if (c.usage_limit && c.used_count >= c.usage_limit)
    return { label: "Exhausted", className: "border-gold/20 bg-gold/10 text-gold" };
  return { label: "Active", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
}

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await (supabase as any)
    .from("coupons")
    .select("id, code, description, discount_type, discount_value, min_order_amount, usage_limit, used_count, is_active, starts_at, expires_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <Ticket className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-light text-charcoal">Coupons</h1>
            <p className="text-[11px] font-light text-muted">{coupons?.length ?? 0} coupons</p>
          </div>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="cursor-pointer rounded-full bg-charcoal text-cream hover:bg-charcoal/90 text-[10px] uppercase tracking-[0.15em] px-6 h-10">
            <Plus className="h-3.5 w-3.5 mr-2" /> Add Coupon
          </Button>
        </Link>
      </div>

      {!coupons?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/10 bg-warm-white/50 py-24">
          <Ticket className="h-10 w-10 text-charcoal/15 mb-3" />
          <p className="text-sm text-muted">No coupons yet.</p>
          <Link href="/admin/coupons/new" className="mt-3 text-xs font-medium text-dusty-rose hover:text-charcoal transition-colors">
            Create your first coupon
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c: any) => {
            const state = couponState(c);
            return (
              <Link
                key={c.id}
                href={`/admin/coupons/${c.id}`}
                className="group cursor-pointer rounded-2xl border border-charcoal/5 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-dusty-rose/8 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                      {c.discount_type === "percentage" ? (
                        <Percent className="h-4 w-4 text-gold" strokeWidth={1.5} />
                      ) : (
                        <IndianRupee className="h-4 w-4 text-gold" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-semibold tracking-wider text-charcoal">{c.code}</p>
                      <p className="text-[11px] text-muted">
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}% off`
                          : `₹${c.discount_value} off`}
                        {c.min_order_amount > 0 && ` · min ₹${c.min_order_amount}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`shrink-0 rounded-full border text-[9px] ${state.className}`}>
                    {state.label}
                  </Badge>
                </div>

                {c.description && (
                  <p className="mt-3 text-xs text-muted line-clamp-2">{c.description}</p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-3 text-[10px] uppercase tracking-wider text-muted">
                  <span>
                    Used {c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}
                  </span>
                  <span>
                    {c.expires_at
                      ? `Expires ${new Date(c.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                      : "No expiry"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
