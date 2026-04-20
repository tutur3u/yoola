"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ArchiveArtwork } from "@/lib/archive-data";

export default function FeaturedArtworkCarousel({
  artworks,
  onOpenFullscreen,
}: {
  artworks: ArchiveArtwork[];
  onOpenFullscreen: (artworkId: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [artworks.map((artwork) => artwork.id).join(":")]);

  if (artworks.length === 0) {
    return null;
  }

  const activeArtwork = artworks[activeIndex] ?? artworks[0];

  return (
    <div className="file-frame relative overflow-hidden border border-white/10 bg-black/65 p-3 backdrop-blur lg:p-4">
      <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_19rem] lg:gap-4 xl:grid-cols-[minmax(0,1.16fr)_20rem] xl:gap-5">
        <div className="relative overflow-hidden border border-white/10">
          <div className="relative aspect-[16/10] min-h-[22rem] lg:min-h-[27rem] xl:min-h-[29rem]">
            {activeArtwork.src ? (
              <Image
                src={activeArtwork.src}
                alt={activeArtwork.alt || activeArtwork.title}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 56vw, 62vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.75))]" />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent px-4 py-4 lg:px-5 lg:py-5 xl:px-6 xl:py-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ff72c9]">
              Featured carousel / {activeArtwork.label}
            </p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white uppercase md:text-3xl xl:text-4xl">
              {activeArtwork.title}
            </h2>
            <p className="mt-3 max-w-2xl font-mono text-xs leading-6 text-white/70 md:text-sm xl:text-[0.95rem] xl:leading-7">
              {activeArtwork.caption ?? activeArtwork.note}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-between gap-4 border border-white/10 bg-black/50 p-4 xl:p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#ff72c9]">
                Slide {activeIndex + 1} / {artworks.length}
              </p>
              <span className="border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                {activeArtwork.category}
              </span>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) => (current - 1 + artworks.length) % artworks.length)
                }
                className="border border-white/20 bg-black/65 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current + 1) % artworks.length)}
                className="border border-white/20 bg-black/65 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => onOpenFullscreen(activeArtwork.id)}
                className="border border-white/20 bg-white px-4 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-black transition-colors hover:border-[#ff72c9] hover:text-[#b026ff]"
              >
                Fullscreen View
              </button>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            Scroll to zoom in fullscreen. Drag to pan.
          </p>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-5 lg:gap-4">
        {artworks.map((artwork, index) => (
          <button
            key={artwork.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative overflow-hidden border p-2 text-left transition-colors lg:p-2.5 ${
              index === activeIndex
                ? "border-[#ff72c9] bg-black/75"
                : "border-white/10 bg-black/45 hover:border-white/35"
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
              {artwork.src ? (
                <Image
                  src={artwork.src}
                  alt={artwork.alt || artwork.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5" />
              )}
            </div>
            <div className="mt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#ff72c9]">
                {artwork.label}
              </p>
              <h3 className="mt-2 line-clamp-2 font-display text-lg font-black tracking-tight text-white uppercase lg:text-xl">
                {artwork.title}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
