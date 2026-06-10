import { createClient } from "@/lib/supabase/server";
import { Users, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

const MOCK_CUSTOMERS = [
  { id: "c1", full_name: "Priya Mehra", email: "priya.m@gmail.com", role: "customer", created_at: "2025-04-10T10:00:00Z" },
  { id: "c2", full_name: "Ananya Sharma", email: "ananya.s@gmail.com", role: "customer", created_at: "2025-04-15T14:30:00Z" },
  { id: "c3", full_name: "Riya Kapoor", email: "riya.k@outlook.com", role: "customer", created_at: "2025-05-01T09:15:00Z" },
  { id: "c4", full_name: "Meera Desai", email: "meera.d@yahoo.com", role: "customer", created_at: "2025-05-12T16:45:00Z" },
  { id: "c5", full_name: "Aarav Patel", email: "aarav.p@gmail.com", role: "customer", created_at: "2025-05-20T11:20:00Z" },
  { id: "c6", full_name: "Neha Joshi", email: "neha.j@gmail.com", role: "customer", created_at: "2025-05-28T08:00:00Z" },
];

const INITIALS_COLORS = [
  "bg-dusty-rose/15 text-dusty-rose",
  "bg-gold/15 text-gold",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-indigo-50 text-indigo-600",
  "bg-blush/20 text-charcoal/60",
];

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: dbCustomers } = await (supabase as any)
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(50);

  const customers = dbCustomers?.length ? dbCustomers : MOCK_CUSTOMERS;
  const isDemo = !dbCustomers?.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-dark">
          <Users className="h-5 w-5 text-muted" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Customers</h1>
          <p className="text-[11px] font-light text-muted">{customers.length} customers{isDemo && " (demo data)"}</p>
        </div>
      </div>

      <div className="space-y-2">
        {customers.map((c: any, i: number) => (
          <Link
            key={c.id}
            href={`/admin/customers/${c.id}`}
            className="group flex cursor-pointer items-center gap-4 rounded-xl border border-charcoal/5 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-charcoal/10"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${INITIALS_COLORS[i % INITIALS_COLORS.length]}`}>
              {getInitials(c.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-charcoal">{c.full_name ?? "—"}</p>
              <p className="truncate text-xs text-muted">{c.email}</p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-[10px] text-muted">
                Joined {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-charcoal/20 transition-transform group-hover:translate-x-0.5 group-hover:text-charcoal/40" />
          </Link>
        ))}
      </div>
    </div>
  );
}
