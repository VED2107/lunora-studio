"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Package,
  Heart,
  Palette,
  MapPin,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function UserMenu() {
  const { user, profile, isLoading, isAdmin, signInWithGoogle, signOut } =
    useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-[rgba(47,41,38,0.06)]" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="cursor-pointer text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/55 transition-colors duration-300 hover:text-charcoal/90"
      >
        Sign In
      </Link>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="cursor-pointer rounded-full ring-1 ring-transparent transition-all hover:ring-[rgba(47,41,38,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDA4B5]">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile?.avatar_url ?? undefined}
              alt={profile?.full_name ?? "Account"}
            />
            <AvatarFallback className="bg-[#F3E7E0] text-xs font-medium text-[#2F2926]">
              {initials ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 border-[rgba(47,41,38,0.08)] bg-[#FFFBF7]"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-[#2F2926]">
            {profile?.full_name ?? "No name"}
          </p>
          <p className="text-xs text-[#7D7068]">{profile?.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-[rgba(47,41,38,0.06)]" />
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/account")}>
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/account/orders")}>
          <Package className="h-4 w-4" />
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/account/wishlist")}>
          <Heart className="h-4 w-4" />
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/account/saved-designs")}>
          <Palette className="h-4 w-4" />
          Saved Designs
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/account/addresses")}>
          <MapPin className="h-4 w-4" />
          Addresses
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-[rgba(47,41,38,0.06)]" />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin")}>
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-[rgba(47,41,38,0.06)]" />
        <DropdownMenuItem
          onClick={signOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

