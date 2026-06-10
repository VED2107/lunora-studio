"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type MediaImage = {
  filename: string;
  url: string;
  alt: string;
};

export default function MediaGallery({ images }: { images: MediaImage[] }) {
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const filtered = images.filter((img) =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((img) => (
          <div
            key={img.filename}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-charcoal/8 bg-white shadow-sm transition-shadow hover:shadow-md"
            onClick={() => copyToClipboard(img.url)}
          >
            <div className="aspect-square overflow-hidden bg-cream">
              <Image
                src={img.url}
                alt={img.alt}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60 opacity-0 transition-opacity group-hover:opacity-100">
              {copiedUrl === img.url ? (
                <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                  <Check className="h-3.5 w-3.5" /> Copied!
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-charcoal">
                  <Copy className="h-3.5 w-3.5" /> Copy Path
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-xs text-muted">{img.filename}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">No images match &quot;{search}&quot;</p>
      )}
    </div>
  );
}
