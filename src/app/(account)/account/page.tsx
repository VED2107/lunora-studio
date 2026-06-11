"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2, Package, Heart, Calendar } from "lucide-react";

export default function AccountPage() {
  const { profile, user, refreshProfile } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [saved, setSaved] = useState(false);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase as any)
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (active) setOrderCount(count ?? 0);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      phone_number: profile?.phone_number ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone_number: data.phone_number || null,
      })
      .eq("id", user.id);

    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926]">
          Profile
        </h2>
        <p className="mt-1 text-sm text-[#7D7068]">
          Manage your personal information
        </p>
      </div>

      <Separator className="bg-[rgba(47,41,38,0.08)]" />

      {/* Avatar + Email (read-only from Google) */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Avatar"} />
          <AvatarFallback className="bg-[#F3E7E0] text-[#2F2926] font-medium">
            {initials ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-[#2F2926]">
            {profile?.full_name ?? "No name set"}
          </p>
          <p className="text-sm text-[#7D7068]">{profile?.email}</p>
        </div>
      </div>

      {/* Account overview */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="group flex items-center gap-3 rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-4 transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#CDA4B5]/10">
            <Package className="h-4 w-4 text-[#CDA4B5]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[#2F2926]">
              {orderCount ?? "—"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#7D7068]">Orders</p>
          </div>
        </Link>
        <Link
          href="/account/wishlist"
          className="group flex items-center gap-3 rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-4 transition-shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B89A6A]/10">
            <Heart className="h-4 w-4 text-[#B89A6A]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[#2F2926]">
              {wishlistItems.length}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#7D7068]">Wishlist</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8D2D9]/30">
            <Calendar className="h-4 w-4 text-[#CDA4B5]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-light text-[#2F2926]">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                : "—"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#7D7068]">Member since</p>
          </div>
        </div>
      </div>

      <Separator className="bg-[rgba(47,41,38,0.08)]" />

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-[#2F2926]">
            Full Name
          </Label>
          <Input
            id="full_name"
            {...register("full_name")}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            aria-invalid={!!errors.full_name}
            className="border-[rgba(47,41,38,0.12)] bg-white focus-visible:ring-[#CDA4B5]"
          />
          {errors.full_name && (
            <p id="full_name-error" role="alert" className="text-xs text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-[#2F2926]">
            Phone Number
            <span className="ml-1 text-xs text-[#7D7068]">(optional)</span>
          </Label>
          <Input
            id="phone_number"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone_number")}
            aria-describedby={errors.phone_number ? "phone_number-error" : "phone_number-hint"}
            aria-invalid={!!errors.phone_number}
            className="border-[rgba(47,41,38,0.12)] bg-white focus-visible:ring-[#CDA4B5]"
          />
          {errors.phone_number && (
            <p id="phone_number-error" role="alert" className="text-xs text-red-600">
              {errors.phone_number.message}
            </p>
          )}
          <p id="phone_number-hint" className="text-xs text-[#7D7068]">
            Used for order delivery coordination only
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2F2926]">Email</Label>
          <Input
            value={profile?.email ?? ""}
            disabled
            className="border-[rgba(47,41,38,0.12)] bg-[#F3E7E0]/50 text-[#7D7068]"
          />
          <p className="text-xs text-[#7D7068]">
            Managed by Google. Cannot be changed here.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
