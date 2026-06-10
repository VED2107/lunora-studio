"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type StoreConfig = {
  store_name: string;
  whatsapp_number: string;
  instagram_url: string;
  /** When true, online cart/checkout is disabled and customers are
   *  directed to order via WhatsApp/Instagram instead. */
  social_orders_only: boolean;
  maintenance_mode: boolean;
};

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  store_name: "The Lunora Studio",
  whatsapp_number: "+918149102923",
  instagram_url: "https://www.instagram.com/thelunorastudio",
  social_orders_only: false,
  maintenance_mode: false,
};

/** Strips everything but digits so the number works in a wa.me link. */
export function waLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Module-level cache — config is fetched once per page load, every
// consumer after the first resolves from the same promise.
let configPromise: Promise<StoreConfig> | null = null;

async function fetchConfig(): Promise<StoreConfig> {
  try {
    const supabase = createClient() as any;
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "store_config")
      .single();
    if (data?.value && typeof data.value === "object") {
      const v = data.value as Partial<StoreConfig>;
      return {
        ...DEFAULT_STORE_CONFIG,
        ...v,
        // Empty strings in admin settings shouldn't wipe the brand defaults
        whatsapp_number: v.whatsapp_number || DEFAULT_STORE_CONFIG.whatsapp_number,
        instagram_url: v.instagram_url || DEFAULT_STORE_CONFIG.instagram_url,
      };
    }
  } catch {
    // fall through to defaults — storefront must never break on a config read
  }
  return DEFAULT_STORE_CONFIG;
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!configPromise) configPromise = fetchConfig();
    let active = true;
    configPromise.then((c) => {
      if (active) {
        setConfig(c);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { config, loaded };
}
