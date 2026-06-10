import type { Metadata } from "next";
import StoreSettings from "@/components/admin/StoreSettings";

export const metadata: Metadata = {
  title: "Settings — Admin — Lunora Studio",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-light text-charcoal">Store Settings</h1>
        <p className="mt-1 text-sm text-muted">Configure your store details and preferences.</p>
      </div>
      <StoreSettings />
    </div>
  );
}
