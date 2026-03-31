'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { useState } from 'react';
import GalleryLightbox from '@/components/GalleryLightbox';
import { archiveArtworks } from '@/lib/archive-data';

const filters = ['ALL', 'SPEED', 'STAMINA', 'POWER', 'GUTS', 'WISDOM'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeArtworkId, setActiveArtworkId] = useState<number | null>(null);

  const visibleArtworks =
    activeFilter === 'ALL'
      ? archiveArtworks
      : archiveArtworks.filter((art) => art.category === activeFilter);

  const activeLightboxIndex =
    activeArtworkId === null
      ? null
      : visibleArtworks.findIndex((artwork) => artwork.id === activeArtworkId);

  const featuredArtwork = archiveArtworks[0];

  return (
    <div className="bg-gallery-vault relative isolate min-h-screen w-full overflow-hidden px-4 pt-32 pb-48 text-white md:px-8">
      <div className="pointer-events-none gallery-spectrum-overlay absolute inset-0 opacity-90" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-40" />
      <div className="pointer-events-none scanlines absolute inset-0 opacity-10" />
      <div className="pointer-events-none page-vignette absolute inset-0 opacity-90" />
      <div className="pointer-events-none absolute top-20 right-[-10%] h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-16"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
              Visual Data Repository / Local Vault
            </p>
            <h1 className="mt-4 font-display text-6xl font-black tracking-[-0.06em] text-white uppercase md:text-8xl">
              [ Archive ]
            </h1>
            <p className="mt-5 max-w-lg font-mono text-sm leading-7 text-white/68">
              Ten local works, indexed as collectible case files. Open any frame and
              the page flips into a full-screen viewing deck with keyboard navigation,
              thumbnails, and hard-cut overlays.
            </p>
          </div>

          <div className="file-frame relative overflow-hidden border border-white/10 bg-black/65 p-3 backdrop-blur">
            <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
            <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
              <Image
                src={featuredArtwork.src}
                alt={featuredArtwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.34em] text-[#ff72c9] uppercase">
                  Featured File / {featuredArtwork.label}
                </p>
                <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white uppercase">
                  {featuredArtwork.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveArtworkId(featuredArtwork.id)}
                className="border border-white/20 bg-black/65 px-4 py-3 font-mono text-[11px] tracking-[0.32em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Fullscreen View
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 flex flex-wrap gap-4"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`border-2 px-6 py-2 font-mono text-sm font-bold tracking-widest uppercase transition-all ${
              activeFilter === filter
                ? 'border-[#b026ff] bg-[#b026ff] text-white'
                : 'border-white/20 bg-black/45 text-white hover:border-[#b026ff] hover:text-[#b026ff]'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {visibleArtworks.map((art, index) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`group ${
              art.orientation === 'landscape'
                ? 'md:col-span-7'
                : art.orientation === 'square'
                  ? 'md:col-span-5'
                  : 'md:col-span-4'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveArtworkId(art.id)}
              className="file-frame relative block w-full overflow-hidden border border-white/10 bg-black/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#b026ff] hover:shadow-[0_20px_70px_rgba(176,38,255,0.2)]"
            >
              <div className="spotlight-violet absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

              <div
                className={`relative mb-4 overflow-hidden border border-white/10 ${
                  art.orientation === 'landscape'
                    ? 'aspect-[16/10]'
                    : art.orientation === 'square'
                      ? 'aspect-square'
                      : 'aspect-[4/5]'
                }`}
              >
                <Image
                  src={art.src}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover grayscale-[0.15] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                <div className="absolute top-4 left-4 border border-white/20 bg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.28em] text-white uppercase transition-colors group-hover:border-[#ff72c9] group-hover:text-[#ff72c9]">
                  {art.label}
                </div>
                <div className="absolute right-4 bottom-4 border border-white/20 bg-black/70 px-3 py-2 font-mono text-[10px] tracking-[0.28em] text-white/75 uppercase">
                  Expand
                </div>
              </div>

              <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.32em] text-[#ff72c9] uppercase">
                      {art.category} / {art.rarity}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-[#ff72c9]">
                      {art.title}
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.28em] text-white/45 uppercase">
                    {art.year}
                  </span>
                </div>

                <p className="max-w-2xl font-mono text-xs leading-6 text-white/62">
                  {art.note}
                </p>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      </div>

      <GalleryLightbox
        artworks={visibleArtworks}
        activeIndex={
          activeLightboxIndex !== null && activeLightboxIndex >= 0
            ? activeLightboxIndex
            : null
        }
        onClose={() => setActiveArtworkId(null)}
        onSelect={(index) => setActiveArtworkId(visibleArtworks[index]?.id ?? null)}
      />
    </div>
  );
}
