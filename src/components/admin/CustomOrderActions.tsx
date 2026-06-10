"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "pending", "reviewed", "approved", "rejected",
  "priced", "converted", "in_production", "completed",
];

export default function CustomOrderActions({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient() as any;
    const update: any = { status };
    if (price) update.estimated_price = Number(price);
    if (notes) update.admin_notes = notes;
    if (status === "reviewed" || status === "approved") {
      update.reviewed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("custom_bouquet_requests")
      .update(update)
      .eq("id", requestId);

    setSaving(false);
    if (error) {
      toast.error("Failed: " + error.message);
    } else {
      toast.success("Custom order updated");
      router.refresh();
    }
  };

  return (
    <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Actions</h2>
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Estimated Price (₹)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 1499" />
        </div>
        <div>
          <Label className="text-xs">Admin Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes about this request..." />
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full cursor-pointer bg-charcoal text-cream hover:bg-charcoal/90"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
