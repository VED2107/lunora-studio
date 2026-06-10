"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";
import { useSectionImages, getSectionImage } from "@/hooks/useSectionImages";

export default function Hero({ loaded = false }: { loaded?: boolean }) {
  const sectionImages = useSectionImages();
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const floatCard1 = useRef<HTMLDivElement>(null);
  const floatCard2 = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;

    const magneticCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        tagRef.current,
        { autoAlpha: 0, yPercent: 30 },
        { autoAlpha: 1, yPercent: 0, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          line1Ref.current,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1 },
          "-=0.4"
        )
        .fromTo(
          line2Ref.current,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1 },
          "-=0.7"
        )
        .fromTo(
          imgRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.4,
            ease: "power4.inOut",
          },
          "-=0.8"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, yPercent: 20 },
          { opacity: 1, yPercent: 0, duration: 0.7 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, yPercent: 15 },
          { opacity: 1, yPercent: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          floatCard1.current,
          { opacity: 0, scale: 0.8, x: -20 },
          { opacity: 1, scale: 1, x: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          floatCard2.current,
          { opacity: 0, scale: 0.8, x: 20 },
          { opacity: 1, scale: 1, x: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          marqueeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Perpetual gentle float — the bouquet feels presented, never static
        gsap.to(imgRef.current, {
          y: -12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.8,
        });
      }

      // Magnetic CTAs — buttons subtly follow the cursor
      if (window.matchMedia("(pointer: fine)").matches && ctaRef.current) {
        const buttons = Array.from(ctaRef.current.querySelectorAll("a"));
        buttons.forEach((btn) => {
          const strength = 8;
          const move = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(btn, { x: x * strength * 2, y: y * strength, duration: 0.4, ease: "power2.out" });
          };
          const leave = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
          };
          btn.addEventListener("mousemove", move);
          btn.addEventListener("mouseleave", leave);
          magneticCleanups.push(() => {
            btn.removeEventListener("mousemove", move);
            btn.removeEventListener("mouseleave", leave);
          });
        });
      }
    }, sectionRef);

    return () => {
      magneticCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-cream"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-blush/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cream-dark/60 blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-dusty-rose/5 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 pt-28 lg:px-12 lg:pt-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col justify-center lg:col-span-7">
            <div ref={tagRef} className="mb-6 flex items-center gap-3" style={{ visibility: "hidden" }}>
              <span className="h-px w-10 bg-gold" />
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
                The Lunora Studio
              </span>
            </div>

            <h1>
              <span className="overflow-hidden block">
                <span
                  ref={line1Ref}
                  className="block font-heading text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] font-light tracking-tight text-charcoal"
                  style={{ visibility: "hidden" }}
                >
                  Flowers
                  <em className="ml-3 font-medium italic text-dusty-rose lg:ml-4">Fade.</em>
                </span>
              </span>
              <span className="mt-1 overflow-hidden block lg:mt-2">
                <span
                  ref={line2Ref}
                  className="block font-heading text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] font-light tracking-tight text-charcoal"
                  style={{ visibility: "hidden" }}
                >
                  Memories
                  <em className="gold-gradient ml-3 font-medium italic lg:ml-4">Don&apos;t.</em>
                </span>
              </span>
            </h1>

            <p
              ref={subRef}
              className="mt-8 max-w-md text-base leading-relaxed font-light text-muted opacity-0 lg:text-lg"
            >
              Handcrafted bouquets that don&apos;t wilt, don&apos;t fade, and
              never need water. Designed to become a keepsake, not a memory.
            </p>

            <div
              ref={ctaRef}
              className="mt-8 flex flex-col items-start gap-4 opacity-0 sm:flex-row sm:items-center"
            >
              <Link
                href="/collections"
                className="btn-glow group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-charcoal px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-all duration-300 hover:bg-charcoal/90 hover:shadow-xl"
              >
                <span className="relative z-10">View Collection</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
              </Link>

              <Link
                href="/custom-orders"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-charcoal/12 px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:border-dusty-rose hover:text-dusty-rose"
              >
                Order Now
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="absolute -inset-12 rounded-full bg-gradient-to-br from-blush/20 via-dusty-rose/8 to-cream-dark/25 blur-[60px]" />

            <div
              ref={imgRef}
              className="relative aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-[2rem] shadow-2xl shadow-charcoal/10 ring-1 ring-charcoal/5 opacity-0 lg:max-w-[420px]"
            >
              <Image
                src={getSectionImage(sectionImages, "hero_main", "/images/bouquets/hero-bouquet.png")}
                alt="Handcrafted bouquet by The Lunora Studio"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 90vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent" />
            </div>

            <div
              ref={floatCard1}
              className="absolute -bottom-3 -left-3 rounded-2xl border border-charcoal/5 bg-warm-white/90 p-4 shadow-lg backdrop-blur-md opacity-0 lg:-bottom-5 lg:-left-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10">
                  <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-charcoal">150+ Crafted</p>
                  <p className="text-[9px] font-light text-muted">& counting</p>
                </div>
              </div>
            </div>

            <div
              ref={floatCard2}
              className="absolute -top-2 -right-2 rounded-2xl border border-charcoal/5 bg-warm-white/90 p-3.5 shadow-lg backdrop-blur-md opacity-0 lg:-top-4 lg:-right-8"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 fill-gold" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] font-medium text-charcoal/70">4.9</span>
              </div>
              <p className="mt-1 text-[9px] font-light text-muted">Loved by 100+</p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={marqueeRef}
        className="relative z-10 overflow-hidden border-t border-charcoal/5 bg-cream-dark/40 py-4 opacity-0"
      >
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0 items-center">
              {[
                "Handcrafted with Love",
                "Lasts Forever",
                "Fully Customisable",
                "Premium Materials",
                "Pan-India Delivery",
                "Gift-Ready Packaging",
              ].map((text, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center">
                  <span className="mx-6 text-[10px] font-light uppercase tracking-[0.25em] text-muted/50 lg:mx-10">
                    {text}
                  </span>
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="animate-particle absolute rounded-full"
            style={{
              left: `${10 + (i * 47) % 80}%`,
              bottom: "-10px",
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              backgroundColor:
                i % 3 === 0
                  ? "rgba(184,154,106,0.4)"
                  : i % 3 === 1
                  ? "rgba(205,164,181,0.35)"
                  : "rgba(232,210,217,0.3)",
              animationDuration: `${6 + (i % 5) * 2}s`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 lg:bottom-20">
        <div className="h-8 w-px animate-pulse bg-gradient-to-b from-gold/30 to-transparent" />
      </div>
    </section>
  );
}
