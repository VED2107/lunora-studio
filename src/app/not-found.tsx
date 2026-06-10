import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Lunora Studio",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F4EF] px-4 text-center">
      <h1 className="font-heading text-7xl font-light text-[#2F2926]">404</h1>
      <p className="mt-4 text-lg text-[#6B6560]">
        This page has wilted away.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border border-[#2F2926] px-8 py-3 text-sm uppercase tracking-widest text-[#2F2926] transition-colors hover:bg-[#2F2926] hover:text-[#F8F4EF]"
      >
        Back to Home
      </Link>
    </div>
  );
}
