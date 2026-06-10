import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Truck, CheckCircle2, XCircle, Package, CreditCard } from "lucide-react";
import Link from "next/link";
import OrderFilters from "@/components/admin/OrderFilters";

const MOCK_ORDERS = [
  { id: "m1", order_number: "LUN-1001", email: "priya.m@gmail.com", status: "delivered", total: 1299, payment_method: "razorpay", created_at: "2025-05-28T10:00:00Z" },
  { id: "m2", order_number: "LUN-1002", email: "ananya.s@gmail.com", status: "shipped", total: 1899, payment_method: "razorpay", created_at: "2025-06-01T14:30:00Z" },
  { id: "m3", order_number: "LUN-1003", email: "riya.k@outlook.com", status: "in_production", total: 2499, payment_method: "cod", created_at: "2025-06-04T09:15:00Z" },
  { id: "m4", order_number: "LUN-1004", email: "meera.d@yahoo.com", status: "confirmed", total: 999, payment_method: "razorpay", created_at: "2025-06-06T16:45:00Z" },
  { id: "m5", order_number: "LUN-1005", email: "aarav.p@gmail.com", status: "pending", total: 1599, payment_method: "razorpay", created_at: "2025-06-08T11:20:00Z" },
  { id: "m6", order_number: "LUN-1006", email: "neha.j@gmail.com", status: "delivered", total: 3499, payment_method: "razorpay", created_at: "2025-05-20T08:00:00Z" },
  { id: "m7", order_number: "LUN-1007", email: "kavya.r@hotmail.com", status: "cancelled", total: 799, payment_method: "cod", created_at: "2025-05-15T12:00:00Z" },
];

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: dbOrders } = await (supabase as any)
    .from("orders")
    .select("id, order_number, email, status, total, payment_method, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const orders = dbOrders?.length ? dbOrders : MOCK_ORDERS;
  const isDemo = !dbOrders?.length;

  const statusCounts: Record<string, number> = {};
  orders.forEach((o: any) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dusty-rose/10">
            <ShoppingCart className="h-5 w-5 text-dusty-rose" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-light text-charcoal">Orders</h1>
            <p className="text-[11px] font-light text-muted">
              {orders.length} orders{isDemo && " (demo data)"}
            </p>
          </div>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {[
          { key: "pending", label: "Pending", icon: Clock, color: "text-gold bg-gold/10" },
          { key: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-blue-600 bg-blue-50" },
          { key: "in_production", label: "In Production", icon: Package, color: "text-dusty-rose bg-dusty-rose/10" },
          { key: "shipped", label: "Shipped", icon: Truck, color: "text-indigo-600 bg-indigo-50" },
          { key: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { key: "cancelled", label: "Cancelled", icon: XCircle, color: "text-charcoal/40 bg-charcoal/5" },
        ].map((s) => (
          <div key={s.key} className="flex items-center gap-3 rounded-xl border border-charcoal/5 bg-white p-3 shadow-sm">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-heading text-lg font-light text-charcoal">{statusCounts[s.key] ?? 0}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <OrderFilters orders={orders} isDemo={isDemo} />
    </div>
  );
}
