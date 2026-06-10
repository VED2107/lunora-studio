import type { Metadata } from "next";
import SectionImageManager from "@/components/admin/SectionImageManager";

export const metadata: Metadata = {
  title: "Content — Admin — Lunora Studio",
};

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-light text-charcoal">Content Management</h1>
        <p className="mt-1 text-sm text-muted">
          Upload or change images for homepage sections. Changes apply after saving.
        </p>
      </div>
      <SectionImageManager />
    </div>
  );
}
