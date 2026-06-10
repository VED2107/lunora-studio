"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const GALLERY = [
  { src: "/images/bouquets/hero-bouquet.png", alt: "Handcrafted pink bouquet by The Lunora Studio" },
  { src: "/images/bouquets/colorful-celebration.png", alt: "Colorful celebration bouquet" },
  { src: "/images/bouquets/styled-congrats.png", alt: "Styled congratulations bouquet" },
];

export default function Instagram() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".insta-header",
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

      gsap.utils.toArray<HTMLElement>(".insta-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, yPercent: 15, scale: 0.97 },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
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
    <section ref={sectionRef} className="relative bg-cream-dark py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="insta-header mb-16 text-center opacity-0">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-dusty-rose/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-dusty-rose/70">
              @thelunorastudio
            </span>
            <span className="h-px w-12 bg-dusty-rose/40" />
          </div>
          <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
            Made for Moments
            <br />
            <em className="italic text-dusty-rose">Worth Remembering</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {GALLERY.map((item, i) => (
            <a
              key={i}
              href="https://www.instagram.com/thelunorastudio"
              target="_blank"
              rel="noopener noreferrer"
              className={`insta-item group relative cursor-pointer overflow-hidden rounded-2xl ${
                i === 0 ? "md:row-span-1" : ""
              }`}
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    className="h-8 w-8 text-cream"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/thelunorastudio"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:text-dusty-rose"
          >
            Follow our journey
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
