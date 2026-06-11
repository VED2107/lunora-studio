"use client";

import { useState, useCallback, useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Process from "@/components/sections/Process";
import Collection from "@/components/sections/Collection";
import Stats from "@/components/sections/Stats";
import Comparison from "@/components/sections/Comparison";
import Testimonials from "@/components/sections/Testimonials";
import Custom from "@/components/sections/Custom";
import Instagram from "@/components/sections/Instagram";
import FAQ from "@/components/sections/FAQ";
import Finale from "@/components/sections/Finale";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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
