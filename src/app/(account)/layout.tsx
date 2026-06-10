"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  User,
  Package,
  Heart,
  Palette,
  MapPin,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const accountNav = [
  { href: "/account", label: "Profile", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/saved-designs", label: "Saved Designs", icon: Palette },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#F8F4EF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926]">
              My Account
            </h1>
            {profile?.full_name && (
              <p className="mt-1 text-sm text-[#7D7068]">
                Welcome back, {profile.full_name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full shrink-0 lg:w-56">
              <nav className="space-y-1">
                {accountNav.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[#F3E7E0] text-[#2F2926] font-medium"
                          : "text-[#7D7068] hover:bg-[#F3E7E0]/50 hover:text-[#2F2926]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={signOut}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-[#7D7068] transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
