"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/hooks/useGsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Counter from 0 to 100
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.val)}`;
          }
        },
      });

      // Line grows
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.8, ease: "power2.inOut" },
        0
      );

      // Logo text reveal
      tl.fromTo(
        logoTextRef.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.3
      );

      // Tagline
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, yPercent: 20 },
        { opacity: 1, yPercent: 0, duration: 0.6, ease: "power2.out" },
        0.7
      );

      // Hold
      tl.to({}, { duration: 0.4 });

      // Fade everything out
      tl.to(
        [logoTextRef.current, taglineRef.current, lineRef.current, counterRef.current],
        { opacity: 0, yPercent: -20, duration: 0.4, stagger: 0.05 }
      );

      // Curtain reveal — split top/bottom
      tl.to(overlayRef.current, {
        clipPath: "inset(50% 0% 50% 0%)",
        duration: 0.8,
        ease: "power4.inOut",
      });

      tl.set(overlayRef.current, { display: "none" });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="relative flex flex-col items-center">
        <div ref={logoTextRef} className="opacity-0">
          <span className="font-heading text-4xl font-light tracking-[0.3em] text-charcoal sm:text-5xl">
            LUNORA
          </span>
        </div>

        <div
          ref={lineRef}
          className="mt-4 h-px w-24 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(184,154,106,0.6), transparent)",
          }}
        />

        <div ref={taglineRef} className="mt-4 opacity-0">
          <span className="text-[10px] font-light uppercase tracking-[0.35em] text-muted">
            Flowers Fade. Memories Don&apos;t.
          </span>
        </div>

        <span
          ref={counterRef}
          className="absolute -bottom-12 text-[10px] font-light tracking-[0.3em] text-gold/40"
        >
          0
        </span>
      </div>
    </div>
  );
}
