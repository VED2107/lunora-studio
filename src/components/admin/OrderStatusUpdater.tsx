"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Info } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "pending", "confirmed", "in_production", "ready_to_ship",
  "shipped", "delivered", "cancelled", "refunded",
];

// Status → timestamp column to stamp when the order enters that status
const STATUS_TIMESTAMPS: Record<string, string> = {
  confirmed: "confirmed_at",
  shipped: "shipped_at",
  delivered: "delivered_at",
  cancelled: "cancelled_at",
};

type Props = {
  orderId: string;
  currentStatus: string;
  currentTrackingNumber?: string | null;
  currentTrackingUrl?: string | null;
  /** Demo orders aren't real DB rows — updates would fail with a uuid error */
  isDemo?: boolean;
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentTrackingNumber,
  currentTrackingUrl,
  isDemo = false,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  if (isDemo) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-gold/15 bg-gold/5 p-5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <div>
          <p className="text-sm font-medium text-charcoal">Demo order</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            This is sample data shown because there are no real orders yet.
            Status updates will work automatically once customers place real orders.
          </p>
        </div>
      </div>
    );
  }

  const hasChanges =
    status !== currentStatus ||
    trackingNumber !== (currentTrackingNumber ?? "") ||
    trackingUrl !== (currentTrackingUrl ?? "");

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient() as any;

    const payload: Record<string, unknown> = {
      status,
      tracking_number: trackingNumber.trim() || null,
      tracking_url: trackingUrl.trim() || null,
    };
    // Stamp the lifecycle timestamp only when the status actually changes
    const tsColumn = STATUS_TIMESTAMPS[status];
    if (tsColumn && status !== currentStatus) {
      payload[tsColumn] = new Date().toISOString();
    }

    const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
    setSaving(false);
    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success("Order updated");
      router.refresh();
    }
  };

  return (
    <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Update Order</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tracking_number">Tracking Number</Label>
            <Input
              id="tracking_number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. AWB12345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking_url">Tracking URL</Label>
            <Input
              id="tracking_url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://courier.com/track/..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="cursor-pointer bg-charcoal text-cream hover:bg-charcoal/90"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
