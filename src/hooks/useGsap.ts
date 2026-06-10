"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapContext(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {}, ref.current);
    return () => ctx.revert();
  }, deps);

  return ref;
}

export function useSplitTextReveal(
  selector: string,
  triggerSelector?: string
) {
  useEffect(() => {
    const loadAndAnimate = async () => {
      const SplitType = (await import("split-type")).default;
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        const split = new SplitType(el as HTMLElement, {
          types: "lines,words",
          lineClass: "split-line",
        });

        if (split.words) {
          gsap.set(split.words, { yPercent: 110, opacity: 0 });

          gsap.to(split.words, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.03,
            scrollTrigger: {
              trigger: triggerSelector
                ? document.querySelector(triggerSelector)
                : el,
              start: "top 85%",
              once: true,
            },
          });
        }
      });
    };

    const timer = setTimeout(loadAndAnimate, 100);
    return () => clearTimeout(timer);
  }, [selector, triggerSelector]);
}

export { gsap, ScrollTrigger };
