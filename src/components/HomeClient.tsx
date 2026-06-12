"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";

const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const Problem = dynamic(() => import("@/components/sections/Problem"));
const Solution = dynamic(() => import("@/components/sections/Solution"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Collection = dynamic(() => import("@/components/sections/Collection"));
const Stats = dynamic(() => import("@/components/sections/Stats"));
const Comparison = dynamic(() => import("@/components/sections/Comparison"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Custom = dynamic(() => import("@/components/sections/Custom"));
const Instagram = dynamic(() => import("@/components/sections/Instagram"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Finale = dynamic(() => import("@/components/sections/Finale"));
const CTA = dynamic(() => import("@/components/sections/CTA"));
const FloatingWhatsApp = dynamic(() => import("@/components/FloatingWhatsApp"));

export default function HomeClient() {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobile);

    if (mobile) {
      // Mobile: skip preloader entirely — content shows immediately
      sessionStorage.setItem("lunora_preloader", "1");
      setLoaded(true);
      return;
    }

    if (sessionStorage.getItem("lunora_preloader")) {
      setLoaded(true);
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem("lunora_preloader", "1");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || isMobile) return;
    // Only refresh ScrollTrigger on desktop where it's actually used
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      setTimeout(() => ScrollTrigger.refresh(), 150);
    });
  }, [loaded, isMobile]);

  return (
    <>
      {!loaded && !isMobile && <Preloader onComplete={handlePreloaderComplete} />}
      <SmoothScroll>
        <Navigation loaded={loaded} />
        <main>
          <Hero loaded={loaded} isMobile={isMobile} />
          <Problem />
          <Solution />
          <Process />
          <Collection />
          <Stats />
          <Comparison />
          <Testimonials />
          <Custom />
          <Instagram />
          <FAQ />
          <Finale />
          <CTA />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </SmoothScroll>
    </>
  );
}
