"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CreditCard, Banknote, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

const TABS = ["all", "pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"];

export default function OrderFilters({ orders, isDemo }: { orders: any[]; isDemo: boolean }) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = orders
    .filter((o) => activeTab === "all" || o.status === activeTab)
    .filter((o) =>
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-charcoal text-cream"
                  : "text-muted hover:bg-cream-dark hover:text-charcoal"
              }`}
            >
              {tab.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search order # or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-charcoal/10 bg-warm-white/50 py-16">
            <p className="text-sm text-muted">No orders match this filter.</p>
          </div>
        ) : (
          filtered.map((o: any) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="group flex cursor-pointer items-center gap-4 rounded-xl border border-charcoal/5 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-charcoal/10"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">{o.order_number}</span>
                  <Badge variant="secondary" className={`rounded-full border text-[9px] ${statusColors[o.status] ?? ""}`}>
                    {o.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted">{o.email}</p>
              </div>

              <div className="hidden items-center gap-1.5 sm:flex">
                {o.payment_method === "cod" ? (
                  <Banknote className="h-3.5 w-3.5 text-muted" />
                ) : (
                  <CreditCard className="h-3.5 w-3.5 text-muted" />
                )}
                <span className="text-[10px] uppercase text-muted">{o.payment_method ?? "—"}</span>
              </div>

              <div className="text-right shrink-0">
                <p className="font-heading text-sm font-medium text-charcoal">₹{o.total?.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-muted">
                  {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-charcoal/20 transition-transform group-hover:translate-x-0.5 group-hover:text-charcoal/40" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
