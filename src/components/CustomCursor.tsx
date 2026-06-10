"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], .cursor-pointer, input, textarea, select, label";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const pos = { x: -100, y: -100 };
    const trailPos = { x: -100, y: -100 };
    let hovering = false;
    let raf = 0;

    function animate() {
      const cursor = cursorRef.current;
      const trail = trailRef.current;
      if (!cursor || !trail) return;

      trailPos.x += (pos.x - trailPos.x) * 0.12;
      trailPos.y += (pos.y - trailPos.y) * 0.12;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${hovering ? "45deg" : "0deg"}) scale(${hovering ? 1.3 : 1})`;
      trail.style.transform = `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) scale(${hovering ? 0.6 : 1})`;

      raf = requestAnimationFrame(animate);
    }

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) hovering = true;
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) hovering = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Flower cursor — 5-petal shape */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[200] hidden lg:block"
        style={{
          marginLeft: "-16px",
          marginTop: "-16px",
          willChange: "transform",
          transition: "filter 0.3s",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 5 petals */}
          <ellipse cx="16" cy="8" rx="5" ry="7" fill="rgba(205,164,181,0.7)" transform="rotate(0 16 16)" />
          <ellipse cx="16" cy="8" rx="5" ry="7" fill="rgba(232,210,217,0.6)" transform="rotate(72 16 16)" />
          <ellipse cx="16" cy="8" rx="5" ry="7" fill="rgba(205,164,181,0.7)" transform="rotate(144 16 16)" />
          <ellipse cx="16" cy="8" rx="5" ry="7" fill="rgba(232,210,217,0.6)" transform="rotate(216 16 16)" />
          <ellipse cx="16" cy="8" rx="5" ry="7" fill="rgba(205,164,181,0.7)" transform="rotate(288 16 16)" />
          {/* Center */}
          <circle cx="16" cy="16" r="4" fill="rgba(184,154,106,0.9)" />
          <circle cx="16" cy="16" r="2" fill="rgba(248,244,239,0.8)" />
        </svg>
      </div>
      {/* Trail — soft glow that follows */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[199] hidden lg:block"
        style={{
          width: "48px",
          height: "48px",
          marginLeft: "-24px",
          marginTop: "-24px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(205,164,181,0.15) 0%, rgba(184,154,106,0.08) 50%, transparent 70%)",
          willChange: "transform",
          transition: "opacity 0.3s",
        }}
      />
    </>
  );
}
