import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_CUSTOMERS: Record<string, any> = {
  c1: { id: "c1", full_name: "Priya Mehra", email: "priya.m@gmail.com", phone_number: "+91 98765 43210", role: "customer", created_at: "2025-04-10T10:00:00Z" },
  c2: { id: "c2", full_name: "Ananya Sharma", email: "ananya.s@gmail.com", phone_number: "+91 87654 32109", role: "customer", created_at: "2025-04-15T14:30:00Z" },
  c3: { id: "c3", full_name: "Riya Kapoor", email: "riya.k@outlook.com", phone_number: null, role: "customer", created_at: "2025-05-01T09:15:00Z" },
  c4: { id: "c4", full_name: "Meera Desai", email: "meera.d@yahoo.com", phone_number: "+91 76543 21098", role: "customer", created_at: "2025-05-12T16:45:00Z" },
  c5: { id: "c5", full_name: "Aarav Patel", email: "aarav.p@gmail.com", phone_number: "+91 65432 10987", role: "customer", created_at: "2025-05-20T11:20:00Z" },
  c6: { id: "c6", full_name: "Neha Joshi", email: "neha.j@gmail.com", phone_number: "+91 54321 09876", role: "customer", created_at: "2025-05-28T08:00:00Z" },
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: dbCustomer } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const customer = dbCustomer ?? MOCK_CUSTOMERS[id];
  if (!customer) notFound();

  const { data: orders } = dbCustomer
    ? await (supabase as any)
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("email", customer.email)
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: null };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">{customer.full_name ?? "Customer"}</h1>
          <p className="text-[11px] font-light text-muted">{customer.email}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted" />
              <span className="text-charcoal">{customer.email}</span>
            </div>
            {customer.phone_number && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted" />
                <span className="text-charcoal">{customer.phone_number}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted" />
              <span className="text-charcoal">
                Joined {new Date(customer.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="pt-2">
              <Badge variant="secondary" className="rounded-full border border-gold/20 bg-gold/10 text-gold text-[10px]">
                {customer.role}
              </Badge>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Order History</h2>
          {orders?.length ? (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-charcoal/5 p-3 transition-colors hover:bg-cream-dark/30">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{o.order_number}</p>
                    <p className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-sm text-charcoal">₹{o.total?.toLocaleString("en-IN")}</p>
                    <Badge variant="secondary" className="mt-1 rounded-full text-[9px]">{o.status?.replace(/_/g, " ")}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
