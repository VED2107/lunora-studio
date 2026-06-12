"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";
import { createClient } from "@/lib/supabase/client";
import { useSectionImages, getSectionImage } from "@/hooks/useSectionImages";

const STATIC_BOUQUETS = [
  { name: "Sunlit Promise", story: "A warm reminder that joy lives in the little things.", occasion: "Birthdays & Celebrations", image: "/images/bouquets/sunflower-styled.jpeg" },
  { name: "Blue Elegance", story: "A touch of calm, a whole lot of love.", occasion: "Thank You & Appreciation", image: "/images/bouquets/blue-lily-branded.jpeg" },
  { name: "Lavender Dreams", story: "Soft, serene, and full of tender meaning.", occasion: "Anniversaries & Romance", image: "/images/bouquets/purple-labeled.jpeg" },
  { name: "Blushing Petals", story: "Delicate as a whisper, bold as a declaration.", occasion: "Just Because", image: "/images/bouquets/pink-single-sunset.jpeg" },
  { name: "Celebration Bloom", story: "Every color tells a story of love and togetherness.", occasion: "Congratulations & Milestones", image: "/images/bouquets/colorful-celebration.webp" },
  { name: "Golden Hour", story: "Catching the warmth of golden light in every petal.", occasion: "Graduations & Achievements", image: "/images/bouquets/blue-lily-sunset.jpeg" },
];

const BENTO_CLASSES = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-2",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
  "lg:col-span-1 lg:row-span-1",
];

type Bouquet = { name: string; story: string; occasion: string; image: string; slug?: string };

export default function Collection() {
  const sectionImages = useSectionImages();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const [bouquets, setBouquets] = useState<Bouquet[]>(STATIC_BOUQUETS);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: products } = await sb
        .from("products")
        .select("name, slug, short_description, tags, product_images(url, is_primary)")
        .eq("status", "active")
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .limit(6);

      if (products?.length >= 3) {
        setBouquets(
          products.map((p: any) => ({
            name: p.name,
            story: p.short_description ?? "",
            occasion: p.tags?.[0] ?? "",
            image: p.product_images?.find((img: any) => img.is_primary)?.url ?? p.product_images?.[0]?.url ?? STATIC_BOUQUETS[0].image,
            slug: p.slug,
          }))
        );
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bloom reveal — cards open like petals instead of fading in
      gsap.utils.toArray<HTMLElement>(".collection-item").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, scale: 0.82, rotate: i % 2 === 0 ? -2.5 : 2.5, y: 36, transformOrigin: "center bottom" }, {
          opacity: 1, scale: 1, rotate: 0, y: 0, duration: 1, delay: (i % 3) * 0.12, ease: "back.out(1.4)",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
      });
    }, sectionRef);

    const cards = cardsRef.current.filter(Boolean);
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];
    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 800, duration: 0.4, ease: "power2.out" });
      };
      const leave = () => { gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" }); };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      handlers.push({ el: card, move, leave });
    });

    return () => {
      ctx.revert();
      handlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); });
    };
  }, [bouquets]);

  return (
    <section ref={sectionRef} id="collection" className="section-grain relative bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 text-center lg:mb-24">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/70">The Collection</span>
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <h2 className="font-heading text-4xl leading-tight font-light text-charcoal sm:text-5xl lg:text-6xl">
            Every Bouquet Tells<br /><em className="italic text-dusty-rose">a Story</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[220px] lg:gap-5">
          {bouquets.map((bouquet, i) => (
            <Link
              key={bouquet.name}
              href={bouquet.slug ? `/bouquets/${bouquet.slug}` : "/bouquets"}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className={`collection-item group cursor-pointer aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto ${BENTO_CLASSES[i] ?? ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-cream-dark shadow-lg shadow-charcoal/5 ring-1 ring-charcoal/5 transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-dusty-rose/10">
                <Image src={getSectionImage(sectionImages, `collection_${i + 1}`, bouquet.image)} alt={`Handcrafted pipe-cleaner flower bouquet — ${bouquet.name} by The Lunora Studio`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                  <h3 className="font-heading text-2xl font-light text-cream lg:text-3xl">{bouquet.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed font-light text-cream/75 lg:text-base">{bouquet.story}</p>
                  {bouquet.occasion && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gold-light">Perfect for</span>
                      <span className="h-px w-3 bg-gold-light/50" />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-cream/60">{bouquet.occasion}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/bouquets" className="btn-glow group inline-flex h-14 items-center gap-3 rounded-full border border-charcoal/12 px-10 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:border-charcoal hover:bg-charcoal hover:text-cream">
            View All Bouquets
            <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
