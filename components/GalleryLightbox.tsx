'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import type { ArchiveArtwork } from '@/lib/archive-data';

type GalleryLightboxProps = {
  artworks: ArchiveArtwork[];
  activeIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export default function GalleryLightbox({
  artworks,
  activeIndex,
  onClose,
  onSelect,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowRight') {
        onSelect((activeIndex + 1) % artworks.length);
        return;
      }

      if (event.key === 'ArrowLeft') {
        onSelect((activeIndex - 1 + artworks.length) % artworks.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, artworks.length, onClose, onSelect]);

  const activeArtwork = activeIndex === null ? null : artworks[activeIndex];
  const currentIndex = activeIndex ?? 0;

  return (
    <AnimatePresence>
      {activeArtwork ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen artwork viewer for ${activeArtwork.title}`}
          onClick={onClose}
        >
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-60" />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-35" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden border border-white/15 bg-[#090909] shadow-[0_0_120px_rgba(176,38,255,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
                  {activeArtwork.label} / {currentIndex + 1}
                  <span className="text-white/45"> / {artworks.length}</span>
                </p>
                <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white uppercase md:text-4xl">
                  {activeArtwork.title}
                </h2>
                <p className="mt-2 max-w-lg font-mono text-xs leading-relaxed text-white/65 md:text-sm">
                  {activeArtwork.note}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="border border-white/20 bg-black/65 px-4 py-2 font-mono text-xs tracking-[0.3em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Close
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pt-24 pb-4 md:px-6 md:pt-28 md:pb-6">
              <div className="spotlight-violet pointer-events-none absolute inset-0 opacity-75" />
              <button
                type="button"
                onClick={() => onSelect((currentIndex - 1 + artworks.length) % artworks.length)}
                className="absolute left-3 z-20 border border-white/20 bg-black/65 px-3 py-3 font-mono text-[11px] tracking-[0.35em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9] md:left-6"
                aria-label="Previous artwork"
              >
                Prev
              </button>
              <div className="relative h-full w-full">
                {activeArtwork.src ? (
                  <Image
                    src={activeArtwork.src}
                    alt={activeArtwork.alt || activeArtwork.title}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.75))] font-mono text-[11px] tracking-[0.35em] text-white/40 uppercase">
                    No Visual Yet
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onSelect((currentIndex + 1) % artworks.length)}
                className="absolute right-3 z-20 border border-white/20 bg-black/65 px-3 py-3 font-mono text-[11px] tracking-[0.35em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9] md:right-6"
                aria-label="Next artwork"
              >
                Next
              </button>
            </div>

            <div className="border-t border-white/10 bg-black/70 px-3 py-3 md:px-6 md:py-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {artworks.map((artwork, index) => (
                  <button
                    key={artwork.id}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`group relative h-20 w-16 shrink-0 overflow-hidden border md:h-24 md:w-20 ${
                      index === currentIndex
                        ? 'border-[#ff72c9] shadow-[0_0_24px_rgba(255,114,201,0.45)]'
                        : 'border-white/10 hover:border-white/35'
                    }`}
                    aria-label={`View ${artwork.title}`}
                  >
                    {artwork.src ? (
                      <Image
                        src={artwork.src}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/5" />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-1 font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                      {artwork.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
