import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Truck, MapPin, ExternalLink, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Details — Lunora Studio",
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

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: order } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!order) notFound();

  const { data: items } = await (supabase as any)
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  const addr = order.shipping_address;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#B89A6A] hover:text-[#2F2926] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> All Orders
          </Link>
          <h1 className="mt-2 font-heading text-3xl font-light text-[#2F2926]">
            {order.order_number}
          </h1>
          <p className="mt-1 text-xs text-[#7D7068]">
            Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Badge variant="secondary" className={`rounded-full border px-3 py-1 text-xs ${statusColors[order.status] ?? ""}`}>
          {order.status?.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-6">
        <h2 className="font-heading text-lg font-medium text-[#2F2926] mb-4">Items</h2>
        {items?.length ? (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border border-[rgba(47,41,38,0.05)] p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F3E7E0]">
                  {item.product_image ? (
                    <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-5 w-5 text-[rgba(47,41,38,0.15)]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#2F2926]">{item.product_name}</p>
                  <p className="text-[11px] text-[#7D7068]">
                    {item.variant_name ? `${item.variant_name} · ` : ""}
                    {item.quantity} × ₹{item.unit_price?.toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="font-heading text-sm text-[#2F2926]">₹{item.total_price?.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-[#7D7068]">No item details available</p>
        )}

        <div className="mt-5 space-y-1.5 border-t border-[rgba(47,41,38,0.05)] pt-4 text-sm">
          <div className="flex justify-between text-[#2F2926]/70">
            <span>Subtotal</span>
            <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
              <span>−₹{order.discount_amount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between text-[#2F2926]/70">
            <span>Shipping</span>
            <span>{order.shipping_amount > 0 ? `₹${order.shipping_amount.toLocaleString("en-IN")}` : "Free"}</span>
          </div>
          {order.tax_amount > 0 && (
            <div className="flex justify-between text-[#2F2926]/70">
              <span>Tax</span>
              <span>₹{order.tax_amount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[rgba(47,41,38,0.05)] pt-2 font-medium text-[#2F2926]">
            <span>Total</span>
            <span className="font-heading text-base">₹{order.total?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Shipping address */}
        {addr && (
          <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-[#CDA4B5]" />
              <h2 className="font-heading text-lg font-medium text-[#2F2926]">Delivery Address</h2>
            </div>
            <div className="space-y-1 text-sm leading-relaxed text-[#2F2926]/80">
              <p className="font-medium text-[#2F2926]">{addr.full_name}</p>
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>{addr.city}, {addr.state} {addr.postal_code}</p>
            </div>
          </div>
        )}

        {/* Tracking */}
        {(order.tracking_number || order.estimated_delivery) && (
          <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-[#CDA4B5]" />
              <h2 className="font-heading text-lg font-medium text-[#2F2926]">Tracking</h2>
            </div>
            <div className="space-y-2 text-sm text-[#2F2926]/80">
              {order.tracking_number &&
                (order.tracking_url ? (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[#2F2926] hover:text-[#CDA4B5] transition-colors"
                  >
                    {order.tracking_number} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="font-medium text-[#2F2926]">{order.tracking_number}</p>
                ))}
              {order.estimated_delivery && (
                <p className="text-xs text-[#7D7068]">
                  Estimated delivery{" "}
                  {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {order.gift_note && (
        <div className="rounded-xl border border-[#B89A6A]/15 bg-[#B89A6A]/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-[#B89A6A]" />
            <h2 className="font-heading text-lg font-medium text-[#2F2926]">Gift Note</h2>
          </div>
          <p className="text-sm italic text-[#2F2926]/80">&ldquo;{order.gift_note}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
