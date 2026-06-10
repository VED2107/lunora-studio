import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#F8F4EF]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
