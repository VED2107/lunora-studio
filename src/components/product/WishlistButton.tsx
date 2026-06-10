"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/providers/wishlist-provider";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

type Props = {
  productId: string;
  variantId?: string | null;
  productName?: string;
};

export default function WishlistButton({ productId, variantId, productName }: Props) {
  const { user, signInWithGoogle } = useAuth();
  const { isInWishlist, toggleItem } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);

  const wishlisted = isInWishlist(productId, variantId);

  const handleToggle = async () => {
    if (!user) {
      toast.info("Sign in to save to wishlist");
      signInWithGoogle(window.location.pathname);
      return;
    }

    setIsToggling(true);
    try {
      const added = await toggleItem(productId, variantId);
      toast.success(
        added
          ? `${productName ?? "Item"} added to wishlist`
          : `${productName ?? "Item"} removed from wishlist`
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleToggle}
      disabled={isToggling}
      className="cursor-pointer border-[rgba(47,41,38,0.12)] transition-all"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 transition-colors ${
            wishlisted ? "fill-[#CDA4B5] text-[#CDA4B5]" : ""
          }`}
        />
      )}
    </Button>
  );
}
