"use client";

import { useState } from "react";
import { ShoppingBag, Check, Loader2, MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart, type CartItemProduct } from "@/providers/cart-provider";
import { useStoreConfig, waLink } from "@/hooks/useStoreConfig";
import { toast } from "sonner";

type Props = {
  product: CartItemProduct & { id: string };
  variants?: { id: string; name: string; price: number }[];
  selectedVariantId?: string | null;
};

export default function AddToCartButton({
  product,
  variants,
  selectedVariantId,
}: Props) {
  const { addItem } = useCart();
  const { config } = useStoreConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (config.social_orders_only) {
    const variant =
      selectedVariantId && variants
        ? variants.find((v) => v.id === selectedVariantId) ?? null
        : null;
    const message = `Hi! I'd like to order "${product.name}"${variant ? ` (${variant.name})` : ""} from The Lunora Studio.`;
    return (
      <a
        href={waLink(config.whatsapp_number, message)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "lg" }),
          "flex-1 cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 transition-all"
        )}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Order on WhatsApp
      </a>
    );
  }

  const handleAdd = async () => {
    const variant =
      selectedVariantId && variants
        ? variants.find((v) => v.id === selectedVariantId) ?? null
        : null;

    setIsAdding(true);
    try {
      await addItem(product, variant, 1);
      setAdded(true);
      toast.success(`${product.name} added to cart`);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleAdd}
      disabled={isAdding}
      className="flex-1 cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 transition-all"
    >
      {isAdding ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : added ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingBag className="mr-2 h-4 w-4" />
      )}
      {added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
