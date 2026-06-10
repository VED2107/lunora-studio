import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Lunora Studio",
  description: "Frequently asked questions about Lunora Studio bouquets, ordering, and shipping.",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Frequently Asked Questions
      </h1>
    </div>
  );
}
