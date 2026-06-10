import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Lunora Studio",
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Thank You For Your Order
      </h1>
      <p className="mt-4 text-lg text-[#6B6560]">
        Your handcrafted bouquet is being prepared with love.
      </p>
    </div>
  );
}
