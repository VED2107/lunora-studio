import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, CreditCard, Banknote, MapPin, Mail, Gift, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const statusColors: Record<string, string> = {
  pending: "border-gold/20 bg-gold/10 text-gold",
  confirmed: "border-blue-200 bg-blue-50 text-blue-600",
  in_production: "border-dusty-rose/20 bg-dusty-rose/10 text-dusty-rose",
  ready_to_ship: "border-emerald-200 bg-emerald-50 text-emerald-600",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-600",
  delivered: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-charcoal/10 bg-charcoal/5 text-charcoal/40",
  refunded: "border-red-200 bg-red-50 text-red-600",
};

const TIMELINE_STEPS = ["pending", "confirmed", "in_production", "ready_to_ship", "shipped", "delivered"];

const MOCK_ORDERS: Record<string, any> = {
  m1: { id: "m1", order_number: "LUN-1001", email: "priya.m@gmail.com", status: "delivered", total: 1299, created_at: "2025-05-28T10:00:00Z", shipping_address: { full_name: "Priya Mehra", address_line1: "42 MG Road", city: "Mumbai", state: "Maharashtra", postal_code: "400001", phone: "+91 98765 43210" }, payment_method: "razorpay" },
  m2: { id: "m2", order_number: "LUN-1002", email: "ananya.s@gmail.com", status: "shipped", total: 1899, created_at: "2025-06-01T14:30:00Z", shipping_address: { full_name: "Ananya Sharma", address_line1: "15 Sector 21", city: "Noida", state: "UP", postal_code: "201301", phone: "+91 87654 32109" }, payment_method: "razorpay" },
  m3: { id: "m3", order_number: "LUN-1003", email: "riya.k@outlook.com", status: "in_production", total: 2499, created_at: "2025-06-04T09:15:00Z", shipping_address: { full_name: "Riya Kapoor", address_line1: "88 Park Street", city: "Kolkata", state: "WB", postal_code: "700016" }, payment_method: "cod" },
  m4: { id: "m4", order_number: "LUN-1004", email: "meera.d@yahoo.com", status: "confirmed", total: 999, created_at: "2025-06-06T16:45:00Z", shipping_address: { full_name: "Meera Desai", address_line1: "7 Ashram Road", city: "Ahmedabad", state: "Gujarat", postal_code: "380009" }, payment_method: "razorpay" },
  m5: { id: "m5", order_number: "LUN-1005", email: "aarav.p@gmail.com", status: "pending", total: 1599, created_at: "2025-06-08T11:20:00Z", shipping_address: { full_name: "Aarav Patel", address_line1: "23 Brigade Road", city: "Bangalore", state: "Karnataka", postal_code: "560001" }, payment_method: "razorpay" },
  m6: { id: "m6", order_number: "LUN-1006", email: "neha.j@gmail.com", status: "delivered", total: 3499, created_at: "2025-05-20T08:00:00Z", shipping_address: { full_name: "Neha Joshi", address_line1: "56 FC Road", city: "Pune", state: "Maharashtra", postal_code: "411005" }, payment_method: "razorpay" },
  m7: { id: "m7", order_number: "LUN-1007", email: "kavya.r@hotmail.com", status: "cancelled", total: 799, created_at: "2025-05-15T12:00:00Z", shipping_address: { full_name: "Kavya Rao", address_line1: "3 Anna Salai", city: "Chennai", state: "TN", postal_code: "600002" }, payment_method: "cod" },
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: dbOrder } = await (supabase as any).from("orders").select("*").eq("id", id).single();

  const order = dbOrder ?? MOCK_ORDERS[id];
  if (!order) notFound();

  const { data: items } = dbOrder
    ? await (supabase as any)
        .from("order_items")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: true })
    : { data: null };

  const addr = order.shipping_address;
  const isCancelled = order.status === "cancelled" || order.status === "refunded";
  const currentStepIdx = TIMELINE_STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-light text-charcoal">{order.order_number}</h1>
            <p className="text-[11px] font-light text-muted">
              {new Date(order.created_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={`rounded-full border text-xs px-3 py-1 ${statusColors[order.status] ?? ""}`}>
          {order.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Order timeline */}
      {!isCancelled && (
        <div className="rounded-xl border border-charcoal/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            {TIMELINE_STEPS.map((step, i) => {
              const isCompleted = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              const icons = [Clock, CheckCircle2, Package, Package, Truck, CheckCircle2];
              const Icon = icons[i];
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      isCurrent ? "bg-charcoal text-cream shadow-md" :
                      isCompleted ? "bg-emerald-100 text-emerald-700" :
                      "bg-charcoal/5 text-charcoal/25"
                    }`}>
                      <Icon className="h-4 w-4" strokeWidth={isCurrent ? 2 : 1.5} />
                    </div>
                    <span className={`mt-1.5 text-[9px] uppercase tracking-wider ${
                      isCurrent ? "font-medium text-charcoal" :
                      isCompleted ? "text-emerald-700" :
                      "text-charcoal/30"
                    }`}>
                      {step.replace(/_/g, " ")}
                    </span>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={`mx-1 h-px flex-1 ${i < currentStepIdx ? "bg-emerald-300" : "bg-charcoal/8"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-medium text-charcoal mb-5">Items</h2>
            {items?.length ? (
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border border-charcoal/5 p-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {item.product_image ? (
                        <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-5 w-5 text-charcoal/15" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{item.product_name}</p>
                      <p className="text-[11px] text-muted">
                        {item.variant_name ? `${item.variant_name} · ` : ""}
                        {item.quantity} × ₹{item.unit_price?.toLocaleString("en-IN")}
                        {item.custom_request_id && " · Custom order"}
                      </p>
                    </div>
                    <p className="font-heading text-sm text-charcoal">₹{item.total_price?.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted">No line items recorded for this order</p>
            )}

            {/* Price breakdown */}
            {typeof order.subtotal === "number" && (
              <div className="mt-5 space-y-1.5 border-t border-charcoal/5 pt-4 text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span>−₹{order.discount_amount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span>{order.shipping_amount > 0 ? `₹${order.shipping_amount.toLocaleString("en-IN")}` : "Free"}</span>
                </div>
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-charcoal/70">
                    <span>Tax</span>
                    <span>₹{order.tax_amount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-charcoal/5 pt-2 font-medium text-charcoal">
                  <span>Total</span>
                  <span className="font-heading text-base">₹{order.total?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-medium text-charcoal mb-5">Order Summary</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                  <span className="font-heading text-sm text-gold">₹</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Total</p>
                  <p className="font-heading text-xl text-charcoal">₹{order.total?.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  {order.payment_method === "cod" ? (
                    <Banknote className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Payment</p>
                  <p className="text-sm capitalize text-charcoal">
                    {order.payment_method ?? "Not specified"}
                    {order.payment_status && (
                      <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted">· {order.payment_status}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dusty-rose/10">
                  <Mail className="h-4 w-4 text-dusty-rose" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Customer Email</p>
                  <p className="text-sm text-charcoal">{order.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-dark">
                  <Clock className="h-4 w-4 text-muted" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Placed</p>
                  <p className="text-sm text-charcoal">
                    {new Date(order.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OrderStatusUpdater
            orderId={id}
            currentStatus={order.status}
            currentTrackingNumber={order.tracking_number}
            currentTrackingUrl={order.tracking_url}
            isDemo={!dbOrder}
          />
        </div>

        <div className="space-y-6">
          {/* Shipping */}
          <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-dusty-rose" />
              <h2 className="font-heading text-lg font-medium text-charcoal">Shipping</h2>
            </div>
            {addr ? (
              <div className="space-y-1 text-sm leading-relaxed text-charcoal/80">
                <p className="font-medium text-charcoal">{addr.full_name}</p>
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                {addr.phone && (
                  <p className="mt-3 text-xs text-muted">{addr.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted">No address provided</p>
            )}
          </div>

          {/* Tracking */}
          {(order.tracking_number || order.estimated_delivery) && (
            <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-dusty-rose" />
                <h2 className="font-heading text-lg font-medium text-charcoal">Tracking</h2>
              </div>
              <div className="space-y-2 text-sm text-charcoal/80">
                {order.tracking_number && (
                  order.tracking_url ? (
                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-charcoal hover:text-dusty-rose transition-colors">
                      {order.tracking_number} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="font-medium text-charcoal">{order.tracking_number}</p>
                  )
                )}
                {order.estimated_delivery && (
                  <p className="text-xs text-muted">
                    Est. delivery {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gift note */}
          {order.gift_note && (
            <div className="rounded-xl border border-gold/15 bg-gold/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-gold" />
                <h2 className="font-heading text-lg font-medium text-charcoal">Gift Note</h2>
              </div>
              <p className="text-sm italic text-charcoal/80">&ldquo;{order.gift_note}&rdquo;</p>
            </div>
          )}

          {/* Internal notes */}
          {order.internal_notes && (
            <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-medium text-charcoal mb-2">Internal Notes</h2>
              <p className="text-sm text-charcoal/70">{order.internal_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
