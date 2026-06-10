"use client";

import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Bouquets", href: "/bouquets" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Contact", href: "/contact" },
];

const OCCASIONS = [
  "Birthdays",
  "Anniversaries",
  "Weddings",
  "Graduations",
  "Thank You",
  "Just Because",
];

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/5 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-charcoal/10 transition-all duration-300 group-hover:ring-gold/30">
                <Image
                  src="/images/brand/logo.jpeg"
                  alt="The Lunora Studio"
                  width={80}
                  height={80}
                  quality={100}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-light tracking-[0.2em] text-charcoal">
                  LUNORA
                </span>
                <span className="text-[8px] font-light uppercase tracking-[0.35em] text-muted">
                  Studio
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed font-light text-muted">
              Handcrafted bouquets made from premium materials, designed to
              become lasting keepsakes for life&apos;s most precious moments.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/thelunorastudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/8 text-muted transition-all hover:border-dusty-rose/30 hover:text-dusty-rose"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://wa.me/918149102923"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/8 text-muted transition-all hover:border-dusty-rose/30 hover:text-dusty-rose"
                aria-label="WhatsApp"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="mailto:lunorastudio.blooms@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/8 text-muted transition-all hover:border-dusty-rose/30 hover:text-dusty-rose"
                aria-label="Email"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-charcoal">
              Quick Links
            </h4>
            <nav className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="cursor-pointer text-sm font-light text-muted transition-colors hover:text-charcoal"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-charcoal">
              Perfect For
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {OCCASIONS.map((o) => (
                <li key={o} className="text-sm font-light text-muted">
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-charcoal">
              Get in Touch
            </h4>
            <div className="mt-5 flex flex-col gap-4">
              <a
                href="tel:+918149102923"
                className="flex items-center gap-3 text-sm font-light text-muted transition-colors hover:text-charcoal"
              >
                <svg className="h-4 w-4 shrink-0 text-dusty-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +91 81491 02923
              </a>
              <a
                href="mailto:lunorastudio.blooms@gmail.com"
                className="flex items-center gap-3 text-sm font-light text-muted transition-colors hover:text-charcoal"
              >
                <svg className="h-4 w-4 shrink-0 text-dusty-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                lunorastudio.blooms@gmail.com
              </a>
              <div className="flex items-start gap-3 text-sm font-light text-muted">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-dusty-rose/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                India — Delivering Nationwide
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(47,41,38,0.08), transparent)" }} />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] font-light uppercase tracking-[0.2em] text-muted/40">
            &copy; {new Date().getFullYear()} The Lunora Studio. All rights
            reserved.
          </p>
          <p className="font-heading text-xs font-light italic text-muted/40">
            Handcrafted with love. Made to last.
          </p>
        </div>
      </div>
    </footer>
  );
}
