"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useStoreConfig, waLink } from "@/hooks/useStoreConfig";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import CouponInput from "./CouponInput";

export default function CartSummary() {
  const { items, subtotal, discount, total, itemCount } = useCart();
  const { config } = useStoreConfig();

  const waMessage = [
    "Hi! I'd like to place an order from The Lunora Studio:",
    ...items.map(
      (item) =>
        `• ${item.product.name}${item.variant ? ` (${item.variant.name})` : ""} × ${item.quantity}`
    ),
    `Total: ${formatPrice(total)}`,
  ].join("\n");

  return (
    <div className="rounded-xl border border-[rgba(47,41,38,0.08)] bg-white p-6 space-y-5">
      <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-medium text-[#2F2926]">
        Order Summary
      </h2>

      <CouponInput />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[#7D7068]">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#CDA4B5]">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#7D7068]">
          <span>Shipping</span>
          <span className="text-xs italic">Calculated at checkout</span>
        </div>

        <div className="border-t border-[rgba(47,41,38,0.08)] pt-3 flex justify-between text-[#2F2926] font-medium text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {config.social_orders_only ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-[#B89A6A]/20 bg-[#B89A6A]/5 px-4 py-3">
            <p className="text-xs leading-relaxed text-[#2F2926]/80">
              We&apos;re currently taking orders personally on WhatsApp &amp; Instagram —
              send us your cart and we&apos;ll take it from there.
            </p>
          </div>
          <a
            href={waLink(config.whatsapp_number, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
            )}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Order on WhatsApp
          </a>
          <a
            href={config.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full cursor-pointer border-[rgba(47,41,38,0.12)] text-[#2F2926]"
            )}
          >
            <InstagramIcon className="mr-2 h-4 w-4" />
            DM us on Instagram
          </a>
        </div>
      ) : (
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
          )}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      )}

      <p className="text-[10px] text-center text-[#7D7068] leading-relaxed">
        {config.social_orders_only
          ? "All bouquets are handcrafted with care. We confirm details & payment over chat."
          : "Taxes and shipping calculated at checkout. All bouquets are handcrafted with care."}
      </p>
    </div>
  );
}
