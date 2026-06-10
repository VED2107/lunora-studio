import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cream overflow-hidden">
      {/* Subtle background grain */}
      <div className="section-grain absolute inset-0" />

      {/* Decorative radial glows */}
      <div
        className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #CDA4B5, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #B89A6A, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #E8D2D9, transparent 70%)" }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Glass card container */}
      <div className="relative z-10 w-full max-w-[420px] px-6">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="group flex flex-col items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-charcoal/6 transition-all duration-700 group-hover:ring-gold/30 group-hover:shadow-lg group-hover:shadow-dusty-rose/10">
              <Image
                src="/images/brand/logo.jpeg"
                alt="Lunora Studio"
                width={128}
                height={128}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl font-light tracking-[0.25em] text-charcoal">
                LUNORA
              </span>
              <span className="mt-0.5 text-[8px] font-light uppercase tracking-[0.4em] text-muted">
                Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Inner glass card */}
        <div className="rounded-2xl border border-charcoal/[0.04] bg-warm-white/60 px-8 py-10 shadow-xl shadow-charcoal/[0.03] backdrop-blur-sm sm:px-10">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted/60 transition-colors duration-300 hover:text-charcoal/70"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Store
          </Link>

          {/* Decorative element */}
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold/15" />
            <span className="text-[8px] tracking-[0.3em] text-muted/30 uppercase">
              Handcrafted with love
            </span>
            <span className="h-px w-6 bg-gold/15" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dusty-rose/15 to-transparent" />
    </div>
  );
}
