import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process — Lunora Studio",
  description: "Every bouquet is handcrafted with care. See how we make them.",
};

export default function OurProcessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Our Process
      </h1>
    </div>
  );
}
