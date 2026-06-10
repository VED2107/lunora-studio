"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";

export type CartItemProduct = {
  name: string;
  slug: string;
  base_price: number;
  image_url: string | null;
};

export type CartItemVariant = {
  name: string;
  price: number;
} | null;

export type CartItem = {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  gift_note: string | null;
  product: CartItemProduct;
  variant: CartItemVariant;
};

type CouponInfo = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_discount_amount: number | null;
  min_order_amount: number;
} | null;

type CartContextType = {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: CouponInfo;
  addItem: (
    product: CartItemProduct & { id: string },
    variant?: { id: string; name: string; price: number } | null,
    quantity?: number
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<string | null>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = "lunora-cart";
const LOCAL_SESSION_KEY = "lunora-session-id";

function generateId() {
  return crypto.randomUUID();
}

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_CART_KEY);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState<CouponInfo>(null);
  const [dbCartId, setDbCartId] = useState<string | null>(null);
  const supabase = createClient();
  const prevUserRef = useRef<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const fetchDbCart = useCallback(async (userId: string) => {
    const { data: cart } = await sb
      .from("carts")
      .select("id, coupon_id")
      .eq("user_id", userId)
      .single();

    if (!cart) {
      const { data: newCart } = await sb
        .from("carts")
        .insert({ user_id: userId })
        .select("id")
        .single();
      setDbCartId(newCart?.id ?? null);
      return [];
    }

    setDbCartId(cart.id);

    const { data: cartItems } = await sb
      .from("cart_items")
      .select("id, product_id, variant_id, quantity, gift_note")
      .eq("cart_id", cart.id);

    if (!cartItems || cartItems.length === 0) return [];

    const productIds = [...new Set(cartItems.map((ci: any) => ci.product_id))];
    const variantIds = cartItems
      .map((ci: any) => ci.variant_id)
      .filter(Boolean);

    const { data: products } = await sb
      .from("products")
      .select("id, name, slug, base_price")
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

    return cartItems.map((ci: any) => {
      const prod = productMap.get(ci.product_id) as any;
      const vari = ci.variant_id ? variantMap.get(ci.variant_id) : null;
      return {
        id: ci.id,
        product_id: ci.product_id,
        variant_id: ci.variant_id,
        quantity: ci.quantity,
        gift_note: ci.gift_note,
        product: {
          name: prod?.name ?? "Unknown Product",
          slug: prod?.slug ?? "",
          base_price: prod?.base_price ?? 0,
          image_url: imageMap.get(ci.product_id) ?? null,
        },
        variant: vari ? { name: vari.name, price: vari.price } : null,
      } as CartItem;
    });
  }, [sb]);

  const mergeLocalCartToDb = useCallback(
    async (userId: string, existingDbItems: CartItem[]) => {
      const localItems = getLocalCart();
      if (localItems.length === 0) return existingDbItems;

      let cartId = dbCartId;
      if (!cartId) {
        const { data: cart } = await sb
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .single();
        cartId = cart?.id;
        if (!cartId) {
          const { data: newCart } = await sb
            .from("carts")
            .insert({ user_id: userId })
            .select("id")
            .single();
          cartId = newCart?.id;
        }
        setDbCartId(cartId);
      }

      const merged = [...existingDbItems];
      for (const localItem of localItems) {
        const existing = merged.find(
          (m) =>
            m.product_id === localItem.product_id &&
            m.variant_id === localItem.variant_id
        );
        if (existing) {
          const newQty = existing.quantity + localItem.quantity;
          await sb
            .from("cart_items")
            .update({ quantity: newQty })
            .eq("id", existing.id);
          existing.quantity = newQty;
        } else {
          const { data: inserted } = await sb
            .from("cart_items")
            .insert({
              cart_id: cartId,
              product_id: localItem.product_id,
              variant_id: localItem.variant_id,
              quantity: localItem.quantity,
              gift_note: localItem.gift_note,
            })
            .select("id")
            .single();
          merged.push({ ...localItem, id: inserted?.id ?? localItem.id });
        }
      }

      clearLocalCart();
      return merged;
    },
    [sb, dbCartId]
  );

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (user) {
        const dbItems = await fetchDbCart(user.id);
        const wasGuest = prevUserRef.current === null && getLocalCart().length > 0;
        if (wasGuest) {
          const merged = await mergeLocalCartToDb(user.id, dbItems);
          setItems(merged);
        } else {
          setItems(dbItems);
        }
      } else {
        setItems(getLocalCart());
      }
      prevUserRef.current = user?.id ?? null;
      setIsLoading(false);
    };
    init();
  }, [user, fetchDbCart, mergeLocalCartToDb]);

  const addItem = useCallback(
    async (
      product: CartItemProduct & { id: string },
      variant?: { id: string; name: string; price: number } | null,
      quantity = 1
    ) => {
      const newItem: CartItem = {
        id: generateId(),
        product_id: product.id,
        variant_id: variant?.id ?? null,
        quantity,
        gift_note: null,
        product: {
          name: product.name,
          slug: product.slug,
          base_price: product.base_price,
          image_url: product.image_url,
        },
        variant: variant ? { name: variant.name, price: variant.price } : null,
      };

      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.product_id === newItem.product_id &&
            i.variant_id === newItem.variant_id
        );
        let updated: CartItem[];
        if (existing) {
          updated = prev.map((i) =>
            i.id === existing.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          updated = [...prev, newItem];
        }

        if (!user) setLocalCart(updated);
        return updated;
      });

      if (user && dbCartId) {
        const { data: existing } = await sb
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", dbCartId)
          .eq("product_id", product.id)
          .eq("variant_id", variant?.id ?? null)
          .maybeSingle();

        if (existing) {
          await sb
            .from("cart_items")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id);
        } else {
          await sb.from("cart_items").insert({
            cart_id: dbCartId,
            product_id: product.id,
            variant_id: variant?.id ?? null,
            quantity,
          });
        }
      }
    },
    [user, dbCartId, sb]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== itemId);
        if (!user) setLocalCart(updated);
        return updated;
      });

      if (user) {
        await sb.from("cart_items").delete().eq("id", itemId);
      }
    },
    [user, sb]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (quantity < 1) return removeItem(itemId);

      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        if (!user) setLocalCart(updated);
        return updated;
      });

      if (user) {
        await sb
          .from("cart_items")
          .update({ quantity })
          .eq("id", itemId);
      }
    },
    [user, sb, removeItem]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setCoupon(null);

    if (user && dbCartId) {
      await sb.from("cart_items").delete().eq("cart_id", dbCartId);
      await sb.from("carts").update({ coupon_id: null }).eq("id", dbCartId);
    } else {
      clearLocalCart();
    }
  }, [user, dbCartId, sb]);

  const applyCoupon = useCallback(
    async (code: string): Promise<string | null> => {
      const { data: c } = await sb
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      if (!c) return "Invalid coupon code";

      const now = new Date().toISOString();
      if (c.starts_at && c.starts_at > now) return "Coupon not yet active";
      if (c.expires_at && c.expires_at < now) return "Coupon has expired";
      if (c.usage_limit && c.used_count >= c.usage_limit) return "Coupon usage limit reached";

      const sub = items.reduce((sum, item) => {
        const price = item.variant?.price ?? item.product.base_price;
        return sum + price * item.quantity;
      }, 0);
      if (sub < c.min_order_amount) {
        return `Minimum order of ${c.min_order_amount} required`;
      }

      setCoupon({
        id: c.id,
        code: c.code,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
        max_discount_amount: c.max_discount_amount,
        min_order_amount: c.min_order_amount,
      });

      if (user && dbCartId) {
        await sb.from("carts").update({ coupon_id: c.id }).eq("id", dbCartId);
      }

      return null;
    },
    [sb, items, user, dbCartId]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    if (user && dbCartId) {
      sb.from("carts").update({ coupon_id: null }).eq("id", dbCartId);
    }
  }, [user, dbCartId, sb]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product.base_price;
    return sum + price * item.quantity;
  }, 0);

  const discount = coupon
    ? coupon.discount_type === "percentage"
      ? Math.min(
          (subtotal * coupon.discount_value) / 100,
          coupon.max_discount_amount ?? Infinity
        )
      : Math.min(coupon.discount_value, subtotal)
    : 0;

  const total = subtotal - discount;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        itemCount,
        subtotal,
        discount,
        total,
        coupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
