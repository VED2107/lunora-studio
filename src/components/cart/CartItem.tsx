"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem as CartItemType } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const price = item.variant?.price ?? item.product.base_price;

  return (
    <div className="flex gap-4 py-6 border-b border-[rgba(47,41,38,0.08)] last:border-0">
      <Link
        href={`/bouquets/${item.product.slug}`}
        className="shrink-0 overflow-hidden rounded-lg bg-[#F3E7E0] w-24 h-28 sm:w-28 sm:h-32"
      >
        {item.product.image_url ? (
          <Image
            src={item.product.image_url}
            alt={item.product.name}
            width={112}
            height={128}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-[#7D7068]">
            No image
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/bouquets/${item.product.slug}`}
              className="font-[family-name:var(--font-cormorant)] text-lg font-medium text-[#2F2926] hover:text-[#B89A6A] transition-colors"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-xs text-[#7D7068] mt-0.5">{item.variant.name}</p>
            )}
          </div>
          <span className="text-sm font-medium text-[#2F2926] whitespace-nowrap">
            {formatPrice(price * item.quantity)}
          </span>
        </div>

        {item.gift_note && (
          <p className="text-xs text-[#7D7068] mt-1 italic truncate">
            Gift note: {item.gift_note}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-0.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 cursor-pointer border-[rgba(47,41,38,0.1)]"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium text-[#2F2926]">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 cursor-pointer border-[rgba(47,41,38,0.1)]"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-[#7D7068] hover:text-red-600 cursor-pointer h-7 px-2"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
