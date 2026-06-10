"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Settings = {
  store_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  instagram_url: string;
  whatsapp_number: string;
  shipping_note: string;
  free_shipping_threshold: number;
  social_orders_only: boolean;
  maintenance_mode: boolean;
};

const DEFAULTS: Settings = {
  store_name: "The Lunora Studio",
  tagline: "Flowers Fade. Memories Don't.",
  contact_email: "",
  contact_phone: "",
  instagram_url: "",
  whatsapp_number: "",
  shipping_note: "Free shipping on orders above ₹999",
  free_shipping_threshold: 999,
  social_orders_only: false,
  maintenance_mode: false,
};

export default function StoreSettings() {
  const supabase = createClient() as any;
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "store_config")
        .single();
      if (data?.value && typeof data.value === "object") {
        setSettings({ ...DEFAULTS, ...(data.value as Partial<Settings>) });
      }
      setLoaded(true);
    })();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "store_config", value: settings }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Settings saved");
  };

  const update = (key: keyof Settings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 py-12 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">General</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input value={settings.store_name} onChange={(e) => update("store_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={settings.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="hello@thelunorastudio.com" />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input value={settings.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} placeholder="+91 xxxxx xxxxx" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Social & Messaging</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input value={settings.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} placeholder="https://instagram.com/thelunorastudio" />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input value={settings.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} placeholder="+919876543210" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Shipping</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Shipping Note (shown at checkout)</Label>
            <Textarea value={settings.shipping_note} onChange={(e) => update("shipping_note", e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Free Shipping Threshold (₹)</Label>
            <Input type="number" value={settings.free_shipping_threshold} onChange={(e) => update("free_shipping_threshold", Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Ordering</h2>
        <div className="flex items-center justify-between">
          <div className="pr-6">
            <p className="text-sm font-medium text-charcoal">WhatsApp / Instagram Orders Only</p>
            <p className="text-xs text-muted">
              Turns off online cart &amp; checkout. Customers see &ldquo;Order on WhatsApp&rdquo; buttons instead.
              Turn off to re-activate normal e-commerce shopping.
            </p>
          </div>
          <Switch checked={settings.social_orders_only} onCheckedChange={(v) => update("social_orders_only", v)} />
        </div>
      </div>

      <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Maintenance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">Maintenance Mode</p>
            <p className="text-xs text-muted">Temporarily disable the storefront for visitors</p>
          </div>
          <Switch checked={settings.maintenance_mode} onCheckedChange={(v) => update("maintenance_mode", v)} />
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer bg-charcoal text-cream shadow-lg hover:bg-charcoal/90"
          size="lg"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
