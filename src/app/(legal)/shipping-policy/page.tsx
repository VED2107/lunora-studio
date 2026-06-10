import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy — Lunora Studio",
};

export default function ShippingPolicyPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="font-heading text-4xl font-light text-[#2F2926]">
        Shipping Policy
      </h1>
    </article>
  );
}
