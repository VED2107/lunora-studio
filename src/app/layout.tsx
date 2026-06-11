import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/providers/cart-provider";
import { WishlistProvider } from "@/providers/wishlist-provider";
import { Toaster } from "sonner";
import "./globals.css";

import CursorProvider from "@/components/CursorProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Lunora Studio — Handcrafted Bouquets That Last Forever",
  description:
    "Flowers fade. Memories don't. Every Lunora bouquet is handcrafted flower by flower from premium materials, designed to become a keepsake rather than a temporary gift. Order custom bouquets for birthdays, anniversaries, weddings & more.",
  keywords: [
    "handmade bouquets",
    "pipe cleaner flowers",
    "handcrafted gifts",
    "lasting flowers",
    "keepsake bouquets",
    "luxury handmade gifts",
    "The Lunora Studio",
    "custom bouquets India",
    "everlasting flowers",
    "handmade flower bouquet",
    "gift for birthday",
    "anniversary gift ideas",
    "unique handmade gifts",
    "pipe cleaner bouquet",
    "artificial flower bouquet",
  ],
  openGraph: {
    title: "The Lunora Studio — Flowers Fade. Memories Don't.",
    description:
      "Handcrafted bouquets designed to be treasured long after the moment has passed. Custom colors, flowers, and packaging. Delivering across India.",
    type: "website",
    locale: "en_IN",
    siteName: "The Lunora Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lunora Studio — Handcrafted Bouquets That Last Forever",
    description:
      "Flowers fade. Memories don't. Handcrafted bouquets made to last a lifetime.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://thelunorastudio.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#F8F4EF" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The Lunora Studio",
              url: "https://thelunorastudio.com",
              logo: "https://thelunorastudio.com/images/brand/logo.jpeg",
              description: "Handcrafted pipe-cleaner bouquets that last forever. Custom colors, flowers, and packaging. Delivering across India.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-81491-02923",
                email: "lunorastudio.blooms@gmail.com",
                contactType: "customer service",
              },
              sameAs: ["https://www.instagram.com/thelunorastudio"],
            }),
          }}
        />
      </head>
      <body className="antialiased">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CursorProvider />
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: "#F8F4EF",
                      border: "1px solid rgba(47,41,38,0.08)",
                      color: "#2F2926",
                      fontSize: "13px",
                    },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </body>
    </html>
  );
}
