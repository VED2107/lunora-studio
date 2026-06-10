import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Lunora Studio",
  description: "Get in touch with Lunora Studio for orders, custom requests, and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-light tracking-tight text-[#2F2926]">
        Contact Us
      </h1>
    </div>
  );
}
