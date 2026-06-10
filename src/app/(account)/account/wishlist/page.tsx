"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/providers/wishlist-provider";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, isLoading, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = async (item: (typeof items)[0]) => {
    const variant = item.variant
      ? { id: item.variant_id!, name: item.variant.name, price: item.variant.price }
      : null;

    await addItem(
      {
        id: item.product_id,
        name: item.product.name,
        slug: item.product.slug,
        base_price: item.product.base_price,
        image_url: item.product.image_url,
      },
      variant,
      1
    );
    await removeItem(item.id);
    toast.success(`${item.product.name} moved to cart`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#7D7068]" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926] mb-8">
        My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#F3E7E0] flex items-center justify-center">
            <Heart className="h-6 w-6 text-[#7D7068]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#2F2926] mb-1">
              Your wishlist is empty
            </p>
            <p className="text-sm text-[#7D7068]">
              Save bouquets you love for later.
            </p>
          </div>
          <Link
            href="/bouquets"
            className={cn(
              buttonVariants(),
              "cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
            )}
          >
            Browse Bouquets
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const price = item.variant?.price ?? item.product.base_price;
            const unavailable = item.product.status !== "active";
            return (
              <div
                key={item.id}
                className={`group rounded-xl border border-[rgba(47,41,38,0.08)] bg-white overflow-hidden transition-shadow hover:shadow-md ${
                  unavailable ? "opacity-60" : ""
                }`}
              >
                <Link
                  href={`/bouquets/${item.product.slug}`}
                  className="block aspect-[3/4] overflow-hidden bg-[#F3E7E0] relative"
                >
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={400}
                      height={533}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-[#7D7068]">
                      No image
                    </div>
                  )}
                  {unavailable && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#7D7068]">Unavailable</span>
                    </div>
                  )}
                </Link>

                <div className="p-4 space-y-3">
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
                    <p className="text-sm font-medium text-[#2F2926] mt-1">
                      {formatPrice(price)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleMoveToCart(item)}
                      disabled={unavailable}
                      className="flex-1 cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 text-xs"
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                      Move to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Removed from wishlist");
                      }}
                      className="cursor-pointer border-[rgba(47,41,38,0.12)] text-[#7D7068] hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
