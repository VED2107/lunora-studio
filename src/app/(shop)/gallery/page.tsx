import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Lunora Studio",
  description: "A visual showcase of our handcrafted bouquets and arrangements.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Gallery
      </h1>
    </div>
  );
}
