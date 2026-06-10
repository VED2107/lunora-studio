"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const STATS = [
  {
    value: "150+",
    label: "Bouquets Crafted",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37" />
      </svg>
    ),
  },
  {
    value: "100+",
    label: "Happy Customers",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    value: "20+",
    label: "Unique Designs",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    value: "4.9",
    label: "Average Rating",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

function AnimatedValue({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
    const hasDecimal = value.includes(".");

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        hasAnimated.current = true;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: numericPart,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const formatted = hasDecimal
              ? counter.val.toFixed(1)
              : Math.round(counter.val).toString();
            setDisplayed(formatted + suffix);
          },
        });
      },
    });

    return () => trigger.kill();
  }, [value, suffix]);

  return <span ref={ref}>{displayed}</span>;
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, yPercent: 30 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.6,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="absolute top-1/2 left-1/4 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-blush/10 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-[200px] w-[200px] -translate-y-1/2 rounded-full bg-dusty-rose/8 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/30" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/60">
              Our Journey So Far
            </span>
            <span className="h-px w-8 bg-gold/30" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item group flex flex-col items-center rounded-2xl border border-charcoal/5 bg-warm-white/60 px-6 py-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-dusty-rose/15 hover:bg-warm-white hover:shadow-lg hover:shadow-dusty-rose/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blush/20 text-dusty-rose/70 transition-colors duration-300 group-hover:bg-dusty-rose/15 group-hover:text-dusty-rose">
                {stat.icon}
              </div>
              <span className="gold-gradient font-heading text-4xl font-light lg:text-5xl">
                <AnimatedValue
                  value={stat.value}
                  suffix={stat.value.includes("+") ? "+" : ""}
                />
              </span>
              <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
