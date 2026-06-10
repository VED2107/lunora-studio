import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Addresses — Lunora Studio",
};

export default function AddressesPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-light text-[#2F2926]">
        My Addresses
      </h1>
    </div>
  );
}
