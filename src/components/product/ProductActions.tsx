"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

type Variant = { id: string; name: string; price: number };

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    image_url: string | null;
  };
  variants: Variant[];
};

export default function ProductActions({ product, variants }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  );

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#2F2926]">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                  selectedVariantId === v.id
                    ? "border-[#2F2926] bg-[#2F2926] text-[#F8F4EF]"
                    : "border-[rgba(47,41,38,0.12)] text-[#2F2926] hover:border-[#2F2926]"
                }`}
              >
                {v.name} — {formatPrice(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <AddToCartButton
          product={product}
          variants={variants}
          selectedVariantId={selectedVariantId}
        />
        <WishlistButton
          productId={product.id}
          variantId={selectedVariantId}
          productName={product.name}
        />
      </div>
    </div>
  );
}
