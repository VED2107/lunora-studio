"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";

export type WishlistItem = {
  id: string;
  product_id: string;
  variant_id: string | null;
  added_at: string;
  product: {
    name: string;
    slug: string;
    base_price: number;
    image_url: string | null;
    status: string;
  };
  variant: {
    name: string;
    price: number;
  } | null;
};

type WishlistContextType = {
  items: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  addItem: (productId: string, variantId?: string | null) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleItem: (productId: string, variantId?: string | null) => Promise<boolean>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const fetchWishlist = useCallback(async (userId: string) => {
    let { data: wishlist } = await sb
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!wishlist) {
      const { data: created } = await sb
        .from("wishlists")
        .insert({ user_id: userId })
        .select("id")
        .single();
      wishlist = created;
    }

    if (!wishlist) return;
    setWishlistId(wishlist.id);

    const { data: wishlistItems } = await sb
      .from("wishlist_items")
      .select("id, product_id, variant_id, added_at")
      .eq("wishlist_id", wishlist.id);

    if (!wishlistItems || wishlistItems.length === 0) {
      setItems([]);
      return;
    }

    const productIds = [...new Set(wishlistItems.map((wi: any) => wi.product_id))];
    const variantIds = wishlistItems.map((wi: any) => wi.variant_id).filter(Boolean);

    const { data: products } = await sb
      .from("products")
      .select("id, name, slug, base_price, status")
      .in("id", productIds);

    const { data: images } = await sb
      .from("product_images")
      .select("product_id, url")
      .in("product_id", productIds)
      .eq("is_primary", true);

    let variants: any[] = [];
    if (variantIds.length > 0) {
      const { data: v } = await sb
        .from("product_variants")
        .select("id, name, price")
        .in("id", variantIds);
      variants = v || [];
    }

    const productMap = new Map(products?.map((p: any) => [p.id, p]) ?? []);
    const imageMap = new Map(images?.map((i: any) => [i.product_id, i.url]) ?? []);
    const variantMap = new Map(variants.map((v: any) => [v.id, v]));

    setItems(
      wishlistItems.map((wi: any) => {
        const prod = productMap.get(wi.product_id) as any;
        const vari = wi.variant_id ? variantMap.get(wi.variant_id) : null;
        return {
          id: wi.id,
          product_id: wi.product_id,
          variant_id: wi.variant_id,
          added_at: wi.added_at,
          product: {
            name: prod?.name ?? "Unknown Product",
            slug: prod?.slug ?? "",
            base_price: prod?.base_price ?? 0,
            image_url: imageMap.get(wi.product_id) ?? null,
            status: prod?.status ?? "archived",
          },
          variant: vari ? { name: vari.name, price: vari.price } : null,
        } as WishlistItem;
      })
    );
  }, [sb]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (user) {
        await fetchWishlist(user.id);
      } else {
        setItems([]);
        setWishlistId(null);
      }
      setIsLoading(false);
    };
    init();
  }, [user, fetchWishlist]);

  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      return items.some(
        (i) =>
          i.product_id === productId &&
          (variantId === undefined || i.variant_id === (variantId ?? null))
      );
    },
    [items]
  );

  const addItem = useCallback(
    async (productId: string, variantId?: string | null) => {
      if (!user || !wishlistId) return;

      const { data: inserted } = await sb
        .from("wishlist_items")
        .insert({
          wishlist_id: wishlistId,
          product_id: productId,
          variant_id: variantId ?? null,
        })
        .select("id, product_id, variant_id, added_at")
        .single();

      if (inserted) {
        const { data: prod } = await sb
          .from("products")
          .select("name, slug, base_price, status")
          .eq("id", productId)
          .single();

        const { data: img } = await sb
          .from("product_images")
          .select("url")
          .eq("product_id", productId)
          .eq("is_primary", true)
          .maybeSingle();

        let variant = null;
        if (variantId) {
          const { data: v } = await sb
            .from("product_variants")
            .select("name, price")
            .eq("id", variantId)
            .single();
          variant = v;
        }

        setItems((prev) => [
          ...prev,
          {
            id: inserted.id,
            product_id: inserted.product_id,
            variant_id: inserted.variant_id,
            added_at: inserted.added_at,
            product: {
              name: prod?.name ?? "Unknown",
              slug: prod?.slug ?? "",
              base_price: prod?.base_price ?? 0,
              image_url: img?.url ?? null,
              status: prod?.status ?? "active",
            },
            variant,
          },
        ]);
      }
    },
    [user, wishlistId, sb]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      await sb.from("wishlist_items").delete().eq("id", itemId);
    },
    [sb]
  );

  const toggleItem = useCallback(
    async (productId: string, variantId?: string | null): Promise<boolean> => {
      const existing = items.find(
        (i) =>
          i.product_id === productId &&
          i.variant_id === (variantId ?? null)
      );
      if (existing) {
        await removeItem(existing.id);
        return false;
      } else {
        await addItem(productId, variantId);
        return true;
      }
    },
    [items, addItem, removeItem]
  );

  return (
    <WishlistContext.Provider
      value={{ items, isLoading, isInWishlist, addItem, removeItem, toggleItem }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
