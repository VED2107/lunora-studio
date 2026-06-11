"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const PETAL_DATA = [
  { l: 37, t: 14, w: 16, h: 19, r: 274 },
  { l: 47, t: 15, w: 27, h: 22, r: 202 },
  { l: 85, t: 29, w: 21, h: 18, r: 211 },
  { l: 37, t: 25, w: 16, h: 22, r: 284 },
  { l: 82, t: 19, w: 17, h: 20, r: 340 },
  { l: 32, t: 39, w: 16, h: 29, r: 89 },
  { l: 67, t: 19, w: 28, h: 25, r: 81 },
  { l: 22, t: 31, w: 16, h: 34, r: 120 },
  { l: 37, t: 21, w: 25, h: 34, r: 288 },
  { l: 85, t: 21, w: 18, h: 32, r: 139 },
  { l: 17, t: 30, w: 24, h: 17, r: 265 },
  { l: 28, t: 25, w: 20, h: 22, r: 303 },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(pointer: coarse)").matches;

      if (isMobile) {
        // Mobile: simple staggered entrance, no fades — all text stays visible
        const lines = [".problem-line-1", ".problem-line-2", ".problem-line-3", ".problem-final"];
        lines.forEach((sel, i) => {
          gsap.fromTo(
            sel,
            { opacity: 0, yPercent: 20 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.7,
              delay: i * 0.15,
              ease: "power2.out",
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
            }
          );
        });
        return;
      }

      // Desktop: scrub-driven cinematic sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.8,
          onLeave: () => gsap.set(sectionRef.current, { autoAlpha: 0 }),
          onEnterBack: () => gsap.set(sectionRef.current, { autoAlpha: 1 }),
        },
      });

      tl.fromTo(
        ".problem-line-1",
        { opacity: 0, yPercent: 30 },
        { opacity: 1, yPercent: 0, duration: 1 }
      )
        .to(".problem-line-1", { opacity: 0.3, duration: 0.5 }, "+=0.5")
        .fromTo(
          ".problem-line-2",
          { opacity: 0, yPercent: 30 },
          { opacity: 1, yPercent: 0, duration: 1 }
        )
        .to(".problem-line-2", { opacity: 0.3, duration: 0.5 }, "+=0.5")
        .fromTo(
          ".problem-line-3",
          { opacity: 0, yPercent: 30 },
          { opacity: 1, yPercent: 0, duration: 1 }
        )
        .to(
          [".problem-line-1", ".problem-line-2", ".problem-line-3"],
          { opacity: 0.1, duration: 0.5 },
          "+=0.5"
        )
        .fromTo(
          ".petal",
          { opacity: 0, y: -20, rotation: 0 },
          {
            opacity: 0.4,
            y: 100,
            rotation: () => Math.random() * 180 - 90,
            duration: 2,
            stagger: 0.1,
          },
          "-=1"
        )
        .fromTo(
          ".problem-final",
          { opacity: 0, yPercent: 20, scale: 0.95 },
          { opacity: 1, yPercent: 0, scale: 1, duration: 1.5 }
        )
        .to(".problem-overlay", { opacity: 0.15, duration: 1 }, "<");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="section-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-cream"
    >
      <div className="problem-overlay absolute inset-0 bg-charcoal/0" />

      <div className="pointer-events-none absolute inset-0">
        {PETAL_DATA.map((p, i) => (
          <div
            key={i}
            className="petal absolute opacity-0"
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              borderRadius: "50% 50% 50% 0",
              backgroundColor:
                i % 3 === 0
                  ? "rgba(205,164,181,0.5)"
                  : i % 3 === 1
                  ? "rgba(232,210,217,0.5)"
                  : "rgba(184,154,106,0.3)",
              transform: `rotate(${p.r}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="sr-only">The Problem With Real Flowers</h2>
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-dusty-rose/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-dusty-rose/60">
            Chapter One
          </span>
          <span className="h-px w-12 bg-dusty-rose/40" />
        </div>

        <div className="space-y-4">
          <p className="problem-line-1 font-heading text-3xl leading-snug font-light text-charcoal opacity-0 sm:text-4xl lg:text-5xl">
            Most flowers are beautiful
            <br />
            <em className="italic text-dusty-rose">for a moment.</em>
          </p>

          <p className="problem-line-2 font-heading text-3xl leading-snug font-light text-charcoal/80 opacity-0 sm:text-4xl lg:text-5xl">
            Then they <em className="italic">fade.</em>
          </p>

          <p className="problem-line-3 font-heading text-3xl leading-snug font-light text-charcoal/60 opacity-0 sm:text-4xl lg:text-5xl">
            Then they <em className="italic">disappear.</em>
          </p>
        </div>

        <div className="problem-final mt-16 opacity-0">
          <p className="font-heading text-4xl leading-tight font-medium text-charcoal sm:text-5xl lg:text-6xl">
            But memories
            <br />
            deserve <em className="gold-gradient italic">better.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
