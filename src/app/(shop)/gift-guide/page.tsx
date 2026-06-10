import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Guide — Lunora Studio",
  description: "Find the perfect handcrafted bouquet for every occasion and recipient.",
};

export default function GiftGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Gift Guide
      </h1>
    </div>
  );
}
