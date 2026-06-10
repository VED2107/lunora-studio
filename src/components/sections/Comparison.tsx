"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const FEATURES = [
  { label: "Lasting Memories", traditional: false, lunora: true },
  { label: "Handmade Craftsmanship", traditional: false, lunora: true },
  { label: "Fully Customisable", traditional: false, lunora: true },
  { label: "Keepsake Value", traditional: false, lunora: true },
  { label: "Photo-Worthy Gifting", traditional: true, lunora: true },
  { label: "Longevity", traditional: false, lunora: true },
  { label: "Premium Presentation", traditional: true, lunora: true },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".comparison-header",
        { opacity: 0, yPercent: 20 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".comparison-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, xPercent: -10 },
          {
            opacity: 1,
            xPercent: 0,
            duration: 0.5,
            delay: i * 0.08,
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
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
      className="relative bg-cream-dark py-24 lg:py-32"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="comparison-header mb-16 text-center opacity-0">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-dusty-rose/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-dusty-rose/70">
              Why Lunora
            </span>
            <span className="h-px w-12 bg-dusty-rose/40" />
          </div>
          <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
            Why People
            <br />
            <em className="italic text-dusty-rose">Love Them</em>
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-charcoal/5 bg-warm-white">
          <div className="grid grid-cols-[1fr_100px_100px] items-center border-b border-charcoal/5 px-6 py-4 sm:grid-cols-[1fr_140px_140px] lg:px-8">
            <span />
            <span className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              Traditional
            </span>
            <span className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
              Lunora
            </span>
          </div>

          {FEATURES.map((feature, i) => (
            <div
              key={feature.label}
              className={`comparison-row grid grid-cols-[1fr_100px_100px] items-center px-6 py-5 sm:grid-cols-[1fr_140px_140px] lg:px-8 ${
                i < FEATURES.length - 1 ? "border-b border-charcoal/5" : ""
              }`}
            >
              <span className="text-sm font-light text-charcoal lg:text-base">
                {feature.label}
              </span>
              <div className="flex justify-center">
                {feature.traditional ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blush/30">
                    <svg
                      className="h-3 w-3 text-dusty-rose/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/5">
                    <svg
                      className="h-3 w-3 text-charcoal/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15">
                  <svg
                    className="h-3 w-3 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
