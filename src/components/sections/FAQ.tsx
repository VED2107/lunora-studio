"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const FAQS = [
  {
    q: "What are Lunora bouquets made of?",
    a: "Our bouquets are handcrafted from premium pipe cleaners and craft materials. Each petal is individually shaped by hand, giving every flower a unique, artisan quality that lasts for years.",
  },
  {
    q: "How long do the bouquets last?",
    a: "Unlike real flowers, Lunora bouquets are designed to last indefinitely. With basic care — keeping them away from direct sunlight and moisture — they'll stay beautiful for years.",
  },
  {
    q: "Can I customise the colors and flower types?",
    a: "Absolutely! We offer full customisation — choose your colors, flower types, bouquet size, wrapping style, and even add personal notes or polaroid photos. Every bouquet is made to order.",
  },
  {
    q: "How do I place an order?",
    a: "You can order through our Instagram DM (@thelunorastudio), WhatsApp (+91 81491 02923), or email us at lunorastudio.blooms@gmail.com. We'll guide you through the customisation process.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes! We deliver pan-India through trusted courier services. Local orders in select cities may qualify for hand delivery. Shipping charges vary by location.",
  },
  {
    q: "How long does it take to make a bouquet?",
    a: "Each bouquet is handcrafted with care, so please allow 3-7 days for creation. Rush orders may be accommodated — just let us know when you reach out!",
  },
];

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: isOpen ? contentRef.current.scrollHeight : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="faq-item border-b border-charcoal/5 last:border-b-0">
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between py-6 text-left transition-colors hover:text-dusty-rose"
      >
        <span className="pr-8 font-heading text-lg font-medium text-charcoal lg:text-xl">
          {q}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-charcoal/10 transition-all duration-300 ${
            isOpen ? "rotate-45 border-dusty-rose/30 bg-dusty-rose/10" : ""
          }`}
        >
          <svg
            className={`h-4 w-4 transition-colors ${isOpen ? "text-dusty-rose" : "text-charcoal/40"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="pb-6 text-sm leading-relaxed font-light text-muted lg:text-base">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-header",
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

      gsap.utils.toArray<HTMLElement>(".faq-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, xPercent: -5 },
          {
            opacity: 1,
            xPercent: 0,
            duration: 0.5,
            delay: i * 0.06,
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
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
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <div className="faq-header mb-14 text-center opacity-0">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-dusty-rose/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-dusty-rose/70">
              Common Questions
            </span>
            <span className="h-px w-12 bg-dusty-rose/40" />
          </div>
          <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
            Frequently
            <br />
            <em className="italic text-dusty-rose">Asked</em>
          </h2>
        </div>

        <div className="rounded-2xl border border-charcoal/5 bg-warm-white px-6 lg:px-10">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
