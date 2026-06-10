"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Clock } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useStoreConfig, waLink } from "@/hooks/useStoreConfig";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#B89A6A] hover:text-[#2F2926] transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Back to Cart
      </Link>

      <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light tracking-tight text-[#2F2926]">
        Checkout
      </h1>

      <div className="mt-8 rounded-2xl border border-[rgba(47,41,38,0.08)] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B89A6A]/10">
          {config.social_orders_only ? (
            <MessageCircle className="h-5 w-5 text-[#B89A6A]" strokeWidth={1.5} />
          ) : (
            <Clock className="h-5 w-5 text-[#B89A6A]" strokeWidth={1.5} />
          )}
        </div>

        <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926]">
          {config.social_orders_only
            ? "We take orders personally"
            : "Online checkout is launching soon"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#7D7068]">
          {config.social_orders_only
            ? "Every Lunora bouquet is handcrafted to order, so we confirm details, delivery and payment over chat. Send us your cart on WhatsApp or Instagram and we'll take it from there."
            : "Until then, we're happily taking orders over WhatsApp and Instagram. Send us your cart and we'll confirm details, delivery and payment over chat."}
        </p>

        {itemCount > 0 && (
          <p className="mt-4 text-xs text-[#7D7068]">
            Your cart: {itemCount} item{itemCount !== 1 ? "s" : ""} · {formatPrice(total)}
          </p>
        )}

        <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
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
      </div>
    </div>
  );
}
