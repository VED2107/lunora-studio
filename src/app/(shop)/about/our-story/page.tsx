import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Lunora Studio",
  description: "How Lunora Studio was born from a love of handcrafted beauty.",
};

export default function OurStoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Our Story
      </h1>
    </div>
  );
}
