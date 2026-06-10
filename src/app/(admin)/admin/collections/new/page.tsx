import type { Metadata } from "next";
import CollectionForm from "@/components/admin/CollectionForm";

export const metadata: Metadata = {
  title: "New Collection — Admin — Lunora Studio",
};

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-light text-charcoal">New Collection</h1>
        <p className="mt-1 text-sm text-muted">Create a new collection to group your bouquets.</p>
      </div>
      <CollectionForm />
    </div>
  );
}
