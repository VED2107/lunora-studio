"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { gsap } from "@/hooks/useGsap";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Bouquets", href: "/bouquets" },
  { label: "Collections", href: "/collections" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Contact", href: "/contact" },
];

// `loaded` gates the entrance animation behind the landing preloader.
// Layouts without a preloader omit the prop, so it must default to true —
// otherwise the nav stays at opacity-0 forever on those pages.
export default function Navigation({ loaded = true }: { loaded?: boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // -- Scroll detection --
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -- Entrance animation --
  useEffect(() => {
    if (!loaded || !navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );

      // Stagger the nav links
      const links = navRef.current?.querySelectorAll(".nav-link-item");
      if (links) {
        gsap.fromTo(
          links,
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.6 }
        );
      }

      // Accent line grows in
      if (accentLineRef.current) {
        gsap.fromTo(
          accentLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut", delay: 0.5 }
        );
      }
    });
    return () => ctx.revert();
  }, [loaded]);

  // -- Mobile menu GSAP timeline --
  useEffect(() => {
    if (!menuRef.current) return;
    const tl = gsap.timeline({ paused: true });
    const links = menuRef.current.querySelectorAll(".mobile-link");
    const decorLines = menuRef.current.querySelectorAll(".mobile-decor-line");

    tl.to(menuRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.7,
      ease: "power4.inOut",
    })
      .fromTo(
        decorLines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, stagger: 0.05, ease: "power2.inOut" },
        "-=0.3"
      )
      .fromTo(
        links,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
        },
        "-=0.3"
      );

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    if (tlRef.current) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        tlRef.current.play();
        // Move focus to first link in menu after animation starts
        setTimeout(() => {
          const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>(".mobile-link");
          firstLink?.focus();
        }, 400);
      } else {
        document.body.style.overflow = "";
        tlRef.current.reverse();
      }
    }
  }, [isOpen]);

  // ESC key closes mobile menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // -- Magnetic hover indicator --
  const moveIndicator = useCallback((target: HTMLElement) => {
    if (!indicatorRef.current || !linksContainerRef.current) return;
    const containerRect = linksContainerRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    gsap.to(indicatorRef.current, {
      x: targetRect.left - containerRect.left + targetRect.width / 2 - 16,
      width: 32,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  const resetIndicator = useCallback(() => {
    if (!indicatorRef.current) return;
    gsap.to(indicatorRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  const handleHomeClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      event.preventDefault();
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname]
  );

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 opacity-0"
        style={{
          padding: isScrolled ? "8px 16px" : "0px",
        }}
      >
        {/* Accent line at the very top — visible only before scrolling */}
        <div
          ref={accentLineRef}
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
          style={{
            transformOrigin: "left",
            background: "linear-gradient(90deg, transparent, rgba(184,154,106,0.35) 20%, rgba(205,164,181,0.25) 50%, rgba(184,154,106,0.35) 80%, transparent)",
            opacity: isScrolled ? 0 : 1,
          }}
        />

        <div
          ref={navInnerRef}
          className="transition-all duration-700"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            maxWidth: isScrolled ? "820px" : "100%",
            margin: "0 auto",
            borderRadius: isScrolled ? "60px" : "0px",
            background: isScrolled
              ? "rgba(248, 244, 239, 0.72)"
              : "rgba(248, 244, 239, 0)",
            backdropFilter: isScrolled ? "blur(24px) saturate(1.4)" : "none",
            boxShadow: isScrolled
              ? "0 4px 32px rgba(47,41,38,0.06), 0 1px 0 rgba(184,154,106,0.12) inset, 0 -1px 0 rgba(47,41,38,0.03) inset"
              : "none",
            border: isScrolled
              ? "1px solid rgba(184,154,106,0.1)"
              : "1px solid transparent",
            padding: isScrolled ? "0 8px" : "0 24px",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div
              className="flex items-center justify-between transition-all duration-700"
              style={{ height: isScrolled ? "52px" : "76px" }}
            >
              {/* Logo */}
              <Link
                href="/"
                onClick={handleHomeClick}
                className="relative z-50 flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className="relative overflow-hidden rounded-full transition-all duration-500 ring-1 ring-charcoal/8 group-hover:ring-gold/30"
                  style={{
                    height: isScrolled ? "32px" : "40px",
                    width: isScrolled ? "32px" : "40px",
                  }}
                >
                  <Image
                    src="/images/brand/logo.jpeg"
                    alt="The Lunora Studio"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span
                    className="font-heading font-light tracking-[0.2em] text-charcoal transition-all duration-500"
                    style={{
                      fontSize: isScrolled ? "16px" : "20px",
                    }}
                  >
                    LUNORA
                  </span>
                  <span
                    className="text-[7px] font-light uppercase tracking-[0.35em] text-muted transition-all duration-500 hidden sm:block"
                    style={{
                      opacity: isScrolled ? 0 : 1,
                      maxHeight: isScrolled ? 0 : "20px",
                      marginTop: isScrolled ? 0 : "1px",
                    }}
                  >
                    Studio
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div
                ref={linksContainerRef}
                className="hidden items-center gap-1 lg:flex relative"
              >
                {/* Magnetic hover glow indicator */}
                <span
                  ref={indicatorRef}
                  className="absolute bottom-1 h-[2px] rounded-full opacity-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(184,154,106,0), rgba(184,154,106,0.6), rgba(184,154,106,0))",
                    filter: "blur(0.5px)",
                  }}
                />

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={link.href === "/" ? handleHomeClick : undefined}
                    onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                    onMouseLeave={resetIndicator}
                    className={`nav-link-item relative px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer rounded-full
                      ${
                        pathname === link.href
                          ? "text-charcoal"
                          : "text-charcoal/55 hover:text-charcoal/90"
                      }
                    `}
                  >
                    {link.label}
                    {/* Active dot */}
                    {pathname === link.href && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-gold animate-pulse-soft" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Right side actions */}
              <div className="hidden items-center gap-2 lg:flex">
                <a
                  href="https://www.instagram.com/thelunorastudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/40 transition-all duration-300 hover:text-dusty-rose hover:bg-dusty-rose/8 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <Link
                  href="/cart"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full text-charcoal/40 transition-all duration-300 hover:text-charcoal hover:bg-charcoal/5 cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[14px] w-[14px]" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#CDA4B5] text-[8px] font-semibold text-white">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>

                {/* Divider */}
                <div
                  className="h-4 w-px mx-1 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(47,41,38,0.12), transparent)",
                    opacity: isScrolled ? 0.6 : 1,
                  }}
                />

                <UserMenu />

                <Link
                  href="/custom-orders"
                  className="group relative inline-flex items-center overflow-hidden rounded-full bg-charcoal cursor-pointer transition-all duration-300 hover:shadow-[0_4px_20px_rgba(47,41,38,0.15)]"
                  style={{
                    height: isScrolled ? "34px" : "36px",
                    padding: isScrolled ? "0 18px" : "0 22px",
                  }}
                >
                  <span className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
                  <span className="relative text-[9.5px] font-medium uppercase tracking-[0.22em] text-cream">
                    Order Now
                  </span>
                </Link>
              </div>

              {/* Mobile actions */}
              <div className="flex items-center gap-1 lg:hidden">
                {/* Mobile cart icon */}
                <Link
                  href="/cart"
                  className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:text-charcoal"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-dusty-rose text-[8px] font-semibold text-white">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>

                {/* Hamburger */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 cursor-pointer"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                >
                  <span
                    className="block h-px w-5 bg-charcoal transition-all duration-500 origin-center"
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      ...(isOpen ? { transform: "translateY(3.5px) rotate(45deg)", width: "24px" } : {}),
                    }}
                  />
                  <span
                    className="block h-px w-5 bg-charcoal transition-all duration-500 origin-center"
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      ...(isOpen ? { transform: "translateY(-2.5px) rotate(-45deg)", width: "24px" } : {}),
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* === Mobile Menu Overlay === */}
      <div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center lg:hidden overflow-hidden"
        style={{
          clipPath: "inset(0% 0% 100% 0%)",
          background: "linear-gradient(180deg, #F8F4EF 0%, #F3E7E0 50%, #F8F4EF 100%)",
        }}
      >
        {/* Decorative circles in background */}
        <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #B89A6A, transparent)" }}
        />
        <div className="absolute bottom-[20%] left-[5%] w-64 h-64 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #CDA4B5, transparent)" }}
        />

        <div className="flex flex-col items-center gap-1 w-full max-w-xs">
          {/* Top decorative line */}
          <div className="mobile-decor-line w-12 h-px bg-gold/20 mb-8 origin-center" />

          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={
                link.href === "/"
                  ? handleHomeClick
                  : () => setIsOpen(false)
              }
              className="mobile-link group relative w-full text-center py-3 cursor-pointer"
            >
              <span className="font-heading text-3xl font-light tracking-wide text-charcoal transition-colors duration-300 group-hover:text-dusty-rose">
                {link.label}
              </span>
              {/* Decorative hover line behind text */}
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: "rgba(184,154,106,0.15)" }} />
            </Link>
          ))}

          {/* Bottom decorative line */}
          <div className="mobile-decor-line w-12 h-px bg-gold/20 mt-4 mb-6 origin-center" />

          <Link
            href="/custom-orders"
            onClick={() => setIsOpen(false)}
            className="mobile-link group relative inline-flex h-12 items-center justify-center rounded-full bg-charcoal px-10 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
            <span className="relative text-[10px] font-medium uppercase tracking-[0.22em] text-cream">
              Order Now
            </span>
          </Link>

          {/* Auth link */}
          <Link
            href={user ? "/account" : "/login"}
            onClick={() => setIsOpen(false)}
            className="mobile-link text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/50 transition-colors duration-300 hover:text-charcoal mt-2"
          >
            {user ? "My Account" : "Sign In"}
          </Link>

          <div className="mobile-link mt-6 flex items-center gap-6">
            <a
              href="https://www.instagram.com/thelunorastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors duration-300 hover:text-dusty-rose cursor-pointer"
              aria-label="Instagram"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://wa.me/918149102923"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors duration-300 hover:text-green-700 cursor-pointer"
              aria-label="WhatsApp"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
