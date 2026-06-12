"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(pointer: coarse)").matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 80%" : "top top",
          end: isMobile ? "bottom 20%" : "+=250%",
          pin: !isMobile,
          scrub: isMobile ? false : 1,
          ...(isMobile
            ? {}
            : {
                onLeave: () => gsap.set(sectionRef.current, { autoAlpha: 0 }),
                onEnterBack: () =>
                  gsap.set(sectionRef.current, { autoAlpha: 1 }),
              }),
        },
      });

      tl.fromTo(
        ".solution-chapter",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      )
        .fromTo(
          ".stem-line",
          { scaleY: 0, transformOrigin: "bottom" },
          { scaleY: 1, duration: 1.5, ease: "power2.inOut" }
        )
        .fromTo(
          ".solution-image",
          { scale: 0.3, opacity: 0, rotate: -10 },
          { scale: 1, opacity: 1, rotate: 0, duration: 2, ease: "power2.out" },
          "-=1"
        )
        .fromTo(
          ".solution-text-1",
          { opacity: 0, xPercent: -20 },
          { opacity: 1, xPercent: 0, duration: 1 },
          "-=1.5"
        )
        .fromTo(
          ".solution-text-2",
          { opacity: 0, yPercent: 20 },
          { opacity: 1, yPercent: 0, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".solution-text-3",
          { opacity: 0, yPercent: 20 },
          { opacity: 1, yPercent: 0, duration: 1 }
        )
        .fromTo(
          ".solution-glow",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.2, duration: 1.5 },
          "-=1"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-dark"
    >
      <div className="solution-glow pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blush/20 via-transparent to-dusty-rose/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="solution-chapter mb-4 flex items-center justify-center gap-3 opacity-0">
          <span className="h-px w-12 bg-gold/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/70">
            Chapter Two
          </span>
          <span className="h-px w-12 bg-gold/40" />
        </div>

        <h2 className="sr-only">Our Solution: Bouquets That Last Forever</h2>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative flex items-center justify-center">
            <div className="stem-line absolute bottom-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-t from-gold/30 to-transparent" />
            <div className="solution-image relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] opacity-0">
              <Image
                src="/images/bouquets/styled-congrats.webp"
                alt="Handcrafted sunflower bouquet forming petal by petal"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="solution-text-1 font-heading text-3xl leading-snug font-light text-charcoal opacity-0 sm:text-4xl lg:text-5xl">
              Every Lunora bouquet is{" "}
              <em className="font-medium italic text-dusty-rose">
                handcrafted
              </em>
              <br />
              flower by flower.
            </p>

            <p className="solution-text-2 mt-6 font-heading text-2xl font-light text-muted opacity-0 sm:text-3xl lg:text-4xl">
              Made to <em className="italic">last.</em>
            </p>

            <p className="solution-text-3 mt-4 font-heading text-2xl font-light text-muted opacity-0 sm:text-3xl lg:text-4xl">
              Made to be{" "}
              <em className="gold-gradient font-medium italic">remembered.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
