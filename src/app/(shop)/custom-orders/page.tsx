import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom Bouquets — Lunora Studio",
  description:
    "Design your dream bouquet with Lunora Studio. Choose flowers, colors, wrapping, polaroids, and more. Chat with us on WhatsApp or Instagram to get started.",
};

const CUSTOMIZATIONS = [
  {
    title: "Custom Colors",
    description: "Match any theme, palette, or personality — from soft pastels to bold jewel tones.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    title: "Flower Selection",
    description: "Roses, lilies, sunflowers, tulips, lavender — pick the blooms that speak to you.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37" />
      </svg>
    ),
  },
  {
    title: "Personal Notes",
    description: "Handwritten-style message cards to make every gift deeply personal.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "Polaroids",
    description: "Mini polaroid photos attached to your bouquet — a keepsake within a keepsake.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
  {
    title: "Gift Tags",
    description: "Beautiful branded tags that complete the luxury unboxing experience.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    title: "Custom Packaging",
    description: "Special wrapping, ribbons, and box styles tailored to any occasion.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

const STEPS = [
  { number: "01", title: "Tell Us Your Vision", description: "Share your ideas, occasion, colors, and budget via WhatsApp or Instagram." },
  { number: "02", title: "We Design Together", description: "We'll suggest flower combinations, wrapping styles, and add-ons that match your vision." },
  { number: "03", title: "Handcrafted For You", description: "Your bouquet is meticulously crafted by hand — flower by flower, detail by detail." },
  { number: "04", title: "Delivered With Love", description: "Beautifully packaged and delivered, ready to become a lasting memory." },
];

const WHATSAPP_URL = "https://wa.me/918149102923?text=Hi%20Lunora!%20I%27d%20like%20to%20create%20a%20custom%20bouquet.%20%F0%9F%8C%B8";
const INSTAGRAM_URL = "https://www.instagram.com/thelunorastudio";

export default function CustomOrdersPage() {
  return (
    <div className="bg-[#F8F4EF]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: "radial-gradient(circle at 30% 40%, #CDA4B5, transparent 60%), radial-gradient(circle at 70% 60%, #B89A6A, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[#B89A6A]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#B89A6A]/70">
                Custom Orders
              </span>
              <span className="h-px w-12 bg-[#B89A6A]/40" />
            </div>
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[#2F2926] sm:text-5xl lg:text-6xl">
              Your Dream Bouquet,
              <br />
              <em className="italic text-[#CDA4B5]">Crafted Together</em>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[#7D7068] sm:text-base">
              Have something specific in mind? Tell us your vision and we&apos;ll bring
              it to life — every flower, every color, every detail, handcrafted just for you.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "cursor-pointer bg-[#25D366] text-white hover:bg-[#22c55e] gap-2 px-6 h-12 text-sm"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "cursor-pointer border-[rgba(47,41,38,0.12)] gap-2 px-6 h-12 text-sm hover:border-[#E1306C]/30 hover:text-[#E1306C]"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                DM on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Customize */}
      <section className="border-t border-[rgba(47,41,38,0.06)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-14 text-center">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926] sm:text-4xl">
              Everything Is Customisable
            </h2>
            <p className="mt-3 text-sm text-[#7D7068]">
              Tell us what you want — we&apos;ll make it happen.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CUSTOMIZATIONS.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-[rgba(47,41,38,0.05)] bg-white p-7 transition-all duration-300 hover:border-[#CDA4B5]/20 hover:shadow-lg hover:shadow-[#CDA4B5]/5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8D2D9]/20 text-[#CDA4B5] transition-colors duration-300 group-hover:bg-[#CDA4B5] group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-medium text-[#2F2926]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#7D7068]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[rgba(47,41,38,0.06)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-14 text-center">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926] sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-sm text-[#7D7068]">
              From your vision to a handcrafted keepsake — in four simple steps.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <span className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-[#B89A6A]/15">
                  {step.number}
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-lg font-medium text-[#2F2926]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7D7068]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[rgba(47,41,38,0.06)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-[#CDA4B5] mb-5" />
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2F2926] sm:text-4xl">
              Ready to Create Something Special?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#7D7068]">
              Send us a message with your ideas — occasion, colors, budget, anything.
              We typically respond within a few hours.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "cursor-pointer bg-[#25D366] text-white hover:bg-[#22c55e] gap-2 px-6 h-12 text-sm"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "cursor-pointer border-[rgba(47,41,38,0.12)] gap-2 px-6 h-12 text-sm hover:border-[#E1306C]/30 hover:text-[#E1306C]"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                DM on Instagram
              </a>
            </div>

            <p className="mt-6 text-xs text-[#7D7068]/60">
              +91 81491 02923 &middot; @thelunorastudio
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
