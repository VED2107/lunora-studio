import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders — Lunora Studio",
};

const statusColors: Record<string, string> = {
  pending: "border-[#B89A6A]/20 bg-[#B89A6A]/10 text-[#B89A6A]",
  confirmed: "border-blue-200 bg-blue-50 text-blue-600",
  in_production: "border-[#CDA4B5]/20 bg-[#CDA4B5]/10 text-[#CDA4B5]",
  ready_to_ship: "border-emerald-200 bg-emerald-50 text-emerald-600",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-600",
  delivered: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-[rgba(47,41,38,0.1)] bg-[rgba(47,41,38,0.05)] text-[#2F2926]/40",
  refunded: "border-red-200 bg-red-50 text-red-600",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = user
    ? await (supabase as any)
        .from("orders")
        .select("id, order_number, status, total, created_at, order_items(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light text-[#2F2926]">My Orders</h1>
        <p className="mt-1 text-sm text-[#7D7068]">
          {orders?.length
            ? `${orders.length} order${orders.length !== 1 ? "s" : ""}`
            : "Track and review your past orders"}
        </p>
      </div>

      {!orders?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(47,41,38,0.1)] bg-white/50 py-20">
          <Package className="h-10 w-10 text-[rgba(47,41,38,0.15)] mb-3" />
          <p className="text-sm text-[#7D7068]">No orders yet.</p>
          <Link
            href="/bouquets"
            className="mt-3 text-xs font-medium text-[#CDA4B5] hover:text-[#2F2926] transition-colors"
          >
            Browse bouquets →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-center justify-between rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-4 transition-shadow hover:shadow-md cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#2F2926]">{o.order_number}</p>
                <p className="mt-0.5 text-xs text-[#7D7068]">
                  {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  {o.order_items?.length ? ` · ${o.order_items.length} item${o.order_items.length !== 1 ? "s" : ""}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-heading text-sm text-[#2F2926]">₹{o.total?.toLocaleString("en-IN")}</p>
                  <Badge variant="secondary" className={`mt-1 rounded-full border text-[9px] ${statusColors[o.status] ?? ""}`}>
                    {o.status?.replace(/_/g, " ")}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-[#7D7068]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
