import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, IndianRupee, Package, Users, Paintbrush, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getDashboardData() {
  const supabase = await createClient();
  const sb = supabase as any;

  const [orders, allOrderTotals, products, customers, customRequests, recentProducts] = await Promise.all([
    sb.from("orders").select("id, order_number, email, total, status, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
    sb.from("orders").select("total").not("status", "in", "(cancelled,refunded)"),
    sb.from("products").select("id", { count: "exact" }),
    sb.from("profiles").select("id", { count: "exact" }).eq("role", "customer"),
    sb.from("custom_bouquet_requests").select("id", { count: "exact" }).eq("status", "pending"),
    sb.from("products").select("id, name, base_price, status, product_images(url, is_primary)").eq("status", "active").order("created_at", { ascending: false }).limit(4),
  ]);

  const revenue = allOrderTotals.data?.reduce(
    (sum: number, o: any) => sum + (o.total || 0), 0
  ) ?? 0;

  return {
    totalOrders: orders.count ?? 0,
    revenue,
    totalProducts: products.count ?? 0,
    totalCustomers: customers.count ?? 0,
    pendingCustomRequests: customRequests.count ?? 0,
    recentOrders: orders.data ?? [],
    recentProducts: recentProducts.data ?? [],
  };
}

const statusColors: Record<string, string> = {
  pending: "border-gold/20 bg-gold/10 text-gold",
  confirmed: "border-blue-200 bg-blue-50 text-blue-600",
  in_production: "border-dusty-rose/20 bg-dusty-rose/10 text-dusty-rose",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-600",
  delivered: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-charcoal/10 bg-charcoal/5 text-charcoal/40",
};

const iconBg: Record<string, string> = {
  orders: "bg-dusty-rose/10 text-dusty-rose",
  revenue: "bg-gold/10 text-gold",
  products: "bg-blush/20 text-charcoal/60",
  customers: "bg-cream-dark text-muted",
  custom: "bg-gold/10 text-gold",
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const cards = [
    { title: "Orders", value: data.totalOrders, icon: ShoppingCart, key: "orders" },
    { title: "Revenue", value: `₹${data.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, key: "revenue" },
    { title: "Products", value: data.totalProducts, icon: Package, key: "products" },
    { title: "Customers", value: data.totalCustomers, icon: Users, key: "customers" },
    { title: "Pending Custom", value: data.pendingCustomRequests, icon: Paintbrush, key: "custom" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
          <TrendingUp className="h-5 w-5 text-gold" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Dashboard</h1>
          <p className="text-[11px] font-light text-muted">Overview of your store</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title} className="border-charcoal/5 bg-warm-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-dusty-rose/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">{card.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg[card.key]}`}>
                <card.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-3xl font-light text-charcoal">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-dusty-rose hover:text-charcoal transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentOrders.length ? (
            <div className="space-y-3">
              {data.recentOrders.map((o: any) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-charcoal/5 p-3 transition-colors hover:bg-cream-dark/30 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{o.order_number}</p>
                    <p className="text-[10px] text-muted">{o.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-sm text-charcoal">₹{o.total?.toLocaleString("en-IN")}</p>
                    <Badge variant="secondary" className={`mt-0.5 rounded-full border text-[8px] ${statusColors[o.status] ?? ""}`}>
                      {o.status?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">No orders yet</p>
          )}
        </div>

        {/* Recent Products */}
        <div className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-medium text-charcoal">Recent Products</h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-dusty-rose hover:text-charcoal transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentProducts.length ? (
            <div className="grid grid-cols-2 gap-3">
              {data.recentProducts.map((p: any) => {
                const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url;
                return (
                  <Link key={p.id} href={`/admin/products/${p.id}`} className="group cursor-pointer overflow-hidden rounded-xl border border-charcoal/5 transition-shadow hover:shadow-md">
                    <div className="relative aspect-square bg-cream">
                      {img ? (
                        <Image src={img} alt={p.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
                      ) : (
                        <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-charcoal/10" /></div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-xs font-medium text-charcoal">{p.name}</p>
                      <p className="text-[10px] text-muted">₹{p.base_price?.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">No products yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
