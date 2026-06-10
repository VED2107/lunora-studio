"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import CartItemRow from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, isLoading, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#7D7068]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light tracking-tight text-[#2F2926] sm:text-4xl">
          Your Cart
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearCart()}
            className="text-xs text-[#7D7068] hover:text-red-600 cursor-pointer uppercase tracking-wider"
          >
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#F3E7E0] flex items-center justify-center">
            <ShoppingBag className="h-7 w-7 text-[#7D7068]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2F2926] mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-[#7D7068]">
              Discover our handcrafted bouquets and find something special.
            </p>
          </div>
          <Link
            href="/bouquets"
            className={cn(
              buttonVariants(),
              "cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white px-5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/bouquets"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "cursor-pointer text-[#7D7068] hover:text-[#2F2926]"
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
