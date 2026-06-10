"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { adminNavItems, isAdminNavActive } from "@/components/admin/admin-nav";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-charcoal/6 bg-warm-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-charcoal/5 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-sm text-muted hover:text-charcoal transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-charcoal/8">
            <Image src="/images/brand/logo.jpeg" alt="Lunora" width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <span className="font-heading text-lg font-light tracking-[0.2em] text-charcoal">
            LUNORA
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-3 px-3 pt-2">
          <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-muted/50">
            Manage
          </span>
        </div>
        <div className="space-y-0.5">
          {adminNavItems.map((item) => {
            const isActive = isAdminNavActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200",
                  isActive
                    ? "bg-charcoal text-cream font-medium shadow-sm"
                    : "text-muted hover:bg-cream-dark hover:text-charcoal"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-charcoal/5 p-4">
        <p className="text-[10px] font-light uppercase tracking-[0.2em] text-muted/40">
          Lunora Studio Admin
        </p>
      </div>
    </aside>
  );
}
