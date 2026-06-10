"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";
import { createClient } from "@/lib/supabase/client";
import { useSectionImages, getSectionImage } from "@/hooks/useSectionImages";

const STATIC_STEPS = [
  { num: "01", title: "Design", description: "Each bouquet begins as a vision — colors, shapes, and emotions carefully chosen.", image: "/images/bouquets/purple-collection.jpeg" },
  { num: "02", title: "Handcraft", description: "Every petal is shaped by hand, one by one, with patience and love.", image: "/images/bouquets/pink-lily.jpeg" },
  { num: "03", title: "Wrap", description: "Premium wrapping and ribbons transform each bouquet into a gift worth giving.", image: "/images/bouquets/blue-lily-closeup.jpeg" },
  { num: "04", title: "Gift", description: "A moment of joy — watching someone unwrap something made just for them.", image: "/images/bouquets/blue-lily-birthday.jpeg" },
  { num: "05", title: "Keep Forever", description: "Unlike real flowers, a Lunora bouquet stays beautiful for years to come.", image: "/images/bouquets/blue-lily-sunset-2.jpeg" },
];

type Step = { num: string; title: string; description: string; image: string };

export default function Process() {
  const sectionImages = useSectionImages();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<Step[]>(STATIC_STEPS);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: products } = await sb
        .from("products")
        .select("name, short_description, product_images(url, is_primary)")
        .eq("status", "active")
        .order("sort_order", { ascending: true })
        .limit(5);

      if (products?.length >= 5) {
        setSteps(products.map((p: any, i: number) => ({
          num: String(i + 1).padStart(2, "0"),
          title: STATIC_STEPS[i]?.title ?? p.name,
          description: STATIC_STEPS[i]?.description ?? p.short_description ?? "",
          image: p.product_images?.find((img: any) => img.is_primary)?.url ?? p.product_images?.[0]?.url ?? STATIC_STEPS[i]?.image,
        })));
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current || !sectionRef.current) return;
      const track = trackRef.current;
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: `+=${scrollWidth}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });

      gsap.utils.toArray<HTMLElement>(".process-card").forEach((card) => {
        gsap.fromTo(card, { opacity: 0, yPercent: 20 }, {
          opacity: 1, yPercent: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "left 80%", toggleActions: "play none none none", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [steps]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream">
      <div className="flex min-h-screen items-center">
        <div ref={trackRef} className="flex items-center gap-8 pl-12 pr-[30vw] lg:gap-12 lg:pl-24">
          <div className="flex w-[300px] shrink-0 flex-col pr-8 lg:w-[400px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-gold/50" />
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/70">Our Process</span>
            </div>
            <h2 className="font-heading text-4xl leading-tight font-light text-charcoal lg:text-6xl">
              From Heart<br />to <em className="italic text-dusty-rose">Hand</em>
            </h2>
            <p className="mt-4 text-sm leading-relaxed font-light text-muted lg:text-base">Every bouquet follows a journey of careful craftsmanship.</p>
          </div>

          {steps.map((step, i) => (
            <div key={step.num} className="process-card group flex w-[320px] shrink-0 flex-col lg:w-[400px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-dark">
                <Image src={getSectionImage(sectionImages, `process_${i + 1}`, step.image)} alt={step.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-heading text-5xl font-light text-cream/30">{step.num}</span>
                  <h3 className="mt-1 font-heading text-2xl font-light text-cream lg:text-3xl">{step.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed font-light text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
