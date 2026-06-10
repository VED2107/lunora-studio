"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const TESTIMONIALS = [
  {
    name: "Priya M.",
    location: "Mumbai",
    text: "I gifted a Lunora bouquet to my mother on her birthday. She cried happy tears and keeps it on her bedside table. It still looks beautiful months later.",
    occasion: "Birthday Gift",
    rating: 5,
  },
  {
    name: "Ananya S.",
    location: "Pune",
    text: "The attention to detail is unreal. Every single petal looks handcrafted with so much love. My best friend absolutely adored her anniversary bouquet.",
    occasion: "Anniversary",
    rating: 5,
  },
  {
    name: "Riya K.",
    location: "Delhi",
    text: "I was tired of flowers that die in two days. Lunora gave me something that lasts forever. The custom colors matched my wedding theme perfectly.",
    occasion: "Wedding Decor",
    rating: 5,
  },
  {
    name: "Meera D.",
    location: "Bangalore",
    text: "Ordered a congratulations bouquet for my sister's graduation. The packaging was so premium, she thought it was from a luxury brand. Well, it is!",
    occasion: "Graduation",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setActive(idx);
      if (intervalRef.current) clearInterval(intervalRef.current);
      startAutoPlay();
    },
    [startAutoPlay]
  );

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate card transition
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, yPercent: 8 },
        { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [active]);

  const t = TESTIMONIALS[active];

  return (
    <section ref={sectionRef} className="relative bg-cream py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-blush/10 blur-[120px]" />
        <div className="absolute right-0 bottom-1/4 h-[300px] w-[300px] rounded-full bg-cream-dark/50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="testimonial-header mb-16 text-center opacity-0 lg:mb-20">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/70">
              Love Letters
            </span>
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
            Words That
            <br />
            <em className="italic text-dusty-rose">Warm Our Hearts</em>
          </h2>
        </div>

        {/* Desktop: 2-col grid always visible */}
        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="testimonial-card group rounded-2xl border border-charcoal/5 bg-warm-white p-8 transition-all duration-500 hover:border-dusty-rose/15 hover:shadow-xl hover:shadow-dusty-rose/5 lg:p-10"
            >
              <div className="mb-6 flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-gold" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="font-heading text-lg leading-relaxed font-light text-charcoal/90 italic lg:text-xl">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">{item.name}</p>
                  <p className="mt-0.5 text-[11px] font-light text-muted">{item.location}</p>
                </div>
                <span className="rounded-full bg-blush/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-dusty-rose">
                  {item.occasion}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel with auto-slide */}
        <div className="md:hidden">
          <div
            ref={cardRef}
            key={active}
            className="rounded-2xl border border-charcoal/5 bg-warm-white p-8"
          >
            <div className="mb-6 flex gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <svg key={i} className="h-4 w-4 fill-gold" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="font-heading text-lg leading-relaxed font-light text-charcoal/90 italic">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">{t.name}</p>
                <p className="mt-0.5 text-[11px] font-light text-muted">{t.location}</p>
              </div>
              <span className="rounded-full bg-blush/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-dusty-rose">
                {t.occasion}
              </span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === active
                    ? "w-6 bg-gold"
                    : "w-2 bg-charcoal/15 hover:bg-charcoal/25"
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
