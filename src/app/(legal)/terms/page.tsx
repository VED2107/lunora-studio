import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Lunora Studio",
};

export default function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="font-heading text-4xl font-light text-[#2F2926]">
        Terms & Conditions
      </h1>
    </article>
  );
}
