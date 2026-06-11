"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollTrigger } from "@/hooks/useGsap";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";

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

  // After hydration: skip preloader if already seen this session
  useEffect(() => {
    if (sessionStorage.getItem("lunora_preloader")) {
      setLoaded(true);
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem("lunora_preloader", "1");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(id);
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <SmoothScroll>
        <Navigation loaded={loaded} />
        <main>
          <Hero loaded={loaded} />
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
