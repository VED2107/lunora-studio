"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const FRAMES = [
  "Someone smiles.",
  "A memory is created.",
  "Time passes.",
  "The flowers stay.",
  "The memory stays too.",
];

export default function Finale() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(pointer: coarse)").matches;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 80%" : "top top",
          end: isMobile ? "bottom 20%" : "+=300%",
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

      FRAMES.forEach((_, i) => {
        tl.fromTo(
          `.finale-frame-${i}`,
          { opacity: 0, yPercent: 15 },
          { opacity: 1, yPercent: 0, duration: 1 }
        );
        if (i < FRAMES.length - 1) {
          tl.to(`.finale-frame-${i}`, { opacity: 0, duration: 0.5 }, "+=0.8");
        }
      });

      tl.to(`.finale-frame-${FRAMES.length - 1}`, { opacity: 0, duration: 0.5 }, "+=0.8")
        .fromTo(
          ".finale-reveal",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
        )
        .fromTo(
          ".finale-glow",
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=1"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal"
    >
      <div className="finale-glow pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dusty-rose/10 blur-[100px]" />
      </div>

      <div className="finale-bg-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[300px] w-[220px] overflow-hidden rounded-2xl opacity-20 sm:h-[400px] sm:w-[280px]">
          <Image
            src="/images/bouquets/styled-congrats.webp"
            alt="Lunora bouquet"
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {FRAMES.map((frame, i) => (
          <p
            key={i}
            className={`finale-frame-${i} absolute inset-0 flex items-center justify-center font-heading text-3xl font-light text-cream/80 opacity-0 sm:text-4xl lg:text-5xl`}
          >
            <em className="italic">{frame}</em>
          </p>
        ))}

        <div className="finale-reveal opacity-0">
          <h2 className="font-heading text-5xl leading-tight font-light text-cream sm:text-6xl lg:text-7xl xl:text-8xl">
            Flowers{" "}
            <em className="italic text-dusty-rose">Fade.</em>
            <br />
            Memories{" "}
            <em className="gold-gradient italic">Don&apos;t.</em>
          </h2>
        </div>
      </div>
    </section>
  );
}
