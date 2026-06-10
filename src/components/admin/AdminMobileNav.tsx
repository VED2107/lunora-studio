"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { adminNavItems, isAdminNavActive } from "@/components/admin/admin-nav";

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-charcoal/6 bg-warm-white px-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-charcoal/8">
          <Image src="/images/brand/logo.jpeg" alt="Lunora" width={56} height={56} className="object-cover w-full h-full" />
        </div>
        <span className="font-heading text-base font-light tracking-[0.2em] text-charcoal">
          LUNORA
        </span>
        <span className="ml-1 rounded-full bg-charcoal/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-muted">
          Admin
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Open admin menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-charcoal transition-colors hover:bg-cream-dark"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-warm-white p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-14 items-center border-b border-charcoal/5 px-5">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="font-heading text-base font-light tracking-[0.2em] text-charcoal">
                LUNORA
              </span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-0.5">
              {adminNavItems.map((item) => {
                const isActive = isAdminNavActive(item, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200",
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
        </SheetContent>
      </Sheet>
    </header>
  );
}
