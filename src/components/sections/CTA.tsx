"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const TRUST_ITEMS = [
  "Handmade with Love",
  "Premium Materials",
  "Custom Designs",
  "Pan-India Delivery",
  "Gift-Ready Packaging",
];

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, yPercent: 20 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".trust-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, yPercent: 10 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.4,
            delay: 0.5 + i * 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-cream py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blush/10 blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-cream-dark/50 blur-[80px]" />
      </div>

      <div className="cta-content relative z-10 mx-auto max-w-3xl px-6 text-center opacity-0">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gold/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/70">
            Get Yours
          </span>
          <span className="h-px w-12 bg-gold/40" />
        </div>

        <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
          Create a gift
          <br />
          they&apos;ll <em className="italic text-dusty-rose">never forget.</em>
        </h2>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed font-light text-muted lg:text-base">
          Handcrafted keepsakes made for birthdays, anniversaries, celebrations,
          and the moments that matter most. Choose your colors, flowers, and
          style — we&apos;ll bring your vision to life.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://www.instagram.com/thelunorastudio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow group inline-flex h-14 items-center gap-3 rounded-full bg-charcoal px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-all duration-300 hover:bg-charcoal/90 hover:shadow-xl"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Order on Instagram
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

          <a
            href="https://wa.me/918149102923?text=Hi!%20I%27d%20love%20to%20order%20a%20custom%20bouquet%20%F0%9F%92%90"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full border border-charcoal/15 px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:border-dusty-rose hover:text-dusty-rose"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        <div className="mx-auto mt-8 flex items-center justify-center">
          <a
            href="mailto:lunorastudio.blooms@gmail.com"
            className="inline-flex items-center gap-2 text-[11px] font-light text-muted transition-colors hover:text-charcoal"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            lunorastudio.blooms@gmail.com
          </a>
          <span className="mx-4 text-charcoal/10">|</span>
          <a
            href="tel:+918149102923"
            className="inline-flex items-center gap-2 text-[11px] font-light text-muted transition-colors hover:text-charcoal"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            +91 81491 02923
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST_ITEMS.map((item, i) => (
            <div key={item} className="trust-item flex items-center gap-2 opacity-0">
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-gold/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[10px] font-light uppercase tracking-[0.15em] text-muted/70">
                {item}
              </span>
              {i < TRUST_ITEMS.length - 1 && (
                <span className="ml-4 h-3 w-px bg-charcoal/8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
