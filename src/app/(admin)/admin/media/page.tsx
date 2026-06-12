import type { Metadata } from "next";
import MediaGallery from "@/components/admin/MediaGallery";

export const metadata: Metadata = {
  title: "Media Library — Admin — Lunora Studio",
};

const LOCAL_IMAGES = [
  "pink-lily.jpeg",
  "blue-lily-birthday.jpeg",
  "blue-lily-branded.jpeg",
  "two-bouquets-showcase.jpeg",
  "blue-lily-gifting.jpeg",
  "blue-lily-sunset.jpeg",
  "blue-lily-sunset-2.jpeg",
  "blue-lily-closeup.jpeg",
  "collection-flatlay.jpeg",
  "bouquet-menu.jpeg",
  "colorful-mixed-congrats.jpeg",
  "pink-lily-styled.jpeg",
  "three-varieties-hero.jpeg",
  "sunflower-styled.jpeg",
  "pink-single-sunset.jpeg",
  "purple-collection.jpeg",
  "purple-labeled.jpeg",
  "colorful-celebration.webp",
  "hero-bouquet.webp",
  "styled-congrats.webp",
];

export default function AdminMediaPage() {
  const images = LOCAL_IMAGES.map((filename) => ({
    filename,
    url: `/images/bouquets/${filename}`,
    alt: filename.replace(/\.(jpeg|jpg|png|webp)$/i, "").replace(/-/g, " "),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-light text-charcoal">Media Library</h1>
        <p className="mt-1 text-sm text-muted">{images.length} images available in /images/bouquets/</p>
      </div>
      <MediaGallery images={images} />
    </div>
  );
}
