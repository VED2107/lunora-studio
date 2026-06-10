import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Paintbrush, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "border-gold/20 bg-gold/10 text-gold",
  reviewed: "border-blue-200 bg-blue-50 text-blue-600",
  in_progress: "border-dusty-rose/20 bg-dusty-rose/10 text-dusty-rose",
  in_production: "border-dusty-rose/20 bg-dusty-rose/10 text-dusty-rose",
  completed: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-charcoal/10 bg-charcoal/5 text-charcoal/40",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-600",
  priced: "border-indigo-200 bg-indigo-50 text-indigo-600",
};

const MOCK_REQUESTS = [
  { id: "cr1", name: "Priya Mehra", flowers: "Pink roses + white lilies", colors: "Blush pink & ivory", status: "pending", created_at: "2025-06-07T10:00:00Z" },
  { id: "cr2", name: "Aarav Patel", flowers: "Sunflowers + lavender", colors: "Yellow & purple", status: "in_production", created_at: "2025-06-05T14:30:00Z" },
  { id: "cr3", name: "Neha Joshi", flowers: "Blue lilies", colors: "Royal blue & gold", status: "completed", created_at: "2025-05-30T09:15:00Z" },
  { id: "cr4", name: "Riya Kapoor", flowers: "Mixed pastel bouquet", colors: "Pastel rainbow", status: "pending", created_at: "2025-06-08T16:45:00Z" },
];

export default async function AdminCustomOrdersPage() {
  const supabase = await createClient();
  const { data: dbRequests } = await (supabase as any)
    .from("custom_bouquet_requests")
    .select("id, customer_name, flower_types, colors, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const useMock = !dbRequests?.length;
  const requests = useMock ? MOCK_REQUESTS : dbRequests;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
          <Paintbrush className="h-5 w-5 text-gold" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Custom Orders</h1>
          <p className="text-[11px] font-light text-muted">{requests.length} requests{useMock && " (demo data)"}</p>
        </div>
      </div>

      <div className="space-y-2">
        {requests.map((r: any) => {
          const name = r.customer_name ?? r.name;
          const flowers = Array.isArray(r.flower_types) ? r.flower_types.join(", ") : r.flowers;
          const colors = Array.isArray(r.colors) ? r.colors.join(", ") : r.colors;

          return (
            <Link
              key={r.id}
              href={`/admin/custom-orders/${r.id}`}
              className="group flex cursor-pointer items-center gap-4 rounded-xl border border-charcoal/5 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-charcoal/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                <Paintbrush className="h-4 w-4 text-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-charcoal">{name}</p>
                  <Badge variant="secondary" className={`rounded-full border text-[9px] ${statusColors[r.status] ?? ""}`}>
                    {r.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span className="truncate">{flowers}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-charcoal/20 shrink-0" />
                  <span className="truncate">{colors}</span>
                </div>
              </div>
              <div className="hidden items-center gap-1 text-[10px] text-muted sm:flex">
                <Calendar className="h-3 w-3" />
                {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </div>
              <ChevronRight className="h-4 w-4 text-charcoal/20 transition-transform group-hover:translate-x-0.5 group-hover:text-charcoal/40" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
