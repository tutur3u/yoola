"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLightbox } from "@/components/LightboxContext";
import type { ArchiveArtwork } from "@/lib/archive-data";

type GalleryLightboxProps = {
  artworks: ArchiveArtwork[];
  activeIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function GalleryLightbox({
  artworks,
  activeIndex,
  onClose,
  onSelect,
}: GalleryLightboxProps) {
  const { close, open } = useLightbox();
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    translateX: 0,
    translateY: 0,
  });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activeArtwork = activeIndex === null ? null : (artworks[activeIndex] ?? null);
  const currentIndex = activeIndex ?? 0;
  const isOpen = activeIndex !== null;

  const handleClose = useCallback(() => {
    close();
    onClose();
  }, [close, onClose]);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      close();
      return;
    }

    open();

    return () => {
      close();
    };
  }, [close, isOpen, open]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    resetView();
  }, [activeArtwork?.id, activeIndex, resetView]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "ArrowRight") {
        onSelect((activeIndex + 1) % artworks.length);
        return;
      }

      if (event.key === "ArrowLeft") {
        onSelect((activeIndex - 1 + artworks.length) % artworks.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, artworks.length, handleClose, onSelect]);

  if (!activeArtwork) {
    return null;
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextScale = clamp(scale * 1.1 ** (-event.deltaY / 100), MIN_ZOOM, MAX_ZOOM);

    if (nextScale === scale) {
      return;
    }

    if (!viewportRef.current) {
      setScale(nextScale);
      return;
    }

    const bounds = viewportRef.current.getBoundingClientRect();
    const cursorX = event.clientX - (bounds.left + bounds.width / 2);
    const cursorY = event.clientY - (bounds.top + bounds.height / 2);

    if (nextScale <= 1) {
      setScale(nextScale);
      setTranslate({ x: 0, y: 0 });
      return;
    }

    const relativeX = (cursorX - translate.x) / scale;
    const relativeY = (cursorY - translate.y) / scale;

    setScale(nextScale);
    setTranslate({
      x: cursorX - relativeX * nextScale,
      y: cursorY - relativeY * nextScale,
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      translateX: translate.x,
      translateY: translate.y,
    };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    setTranslate({
      x: dragStartRef.current.translateX + (event.clientX - dragStartRef.current.pointerX),
      y: dragStartRef.current.translateY + (event.clientY - dragStartRef.current.pointerY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (scale <= 1) {
      setTranslate({ x: 0, y: 0 });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 p-4 backdrop-blur-xl md:p-8"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={handleClose}
        role="dialog"
        aria-label={`Fullscreen artwork viewer for ${activeArtwork.title}`}
        aria-modal="true"
      >
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-60" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-35" />

        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative flex h-full max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden border border-white/15 bg-[#090909] shadow-[0_0_120px_rgba(176,38,255,0.25)]"
          exit={{ opacity: 0, scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          onClick={(event) => event.stopPropagation()}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="relative z-20 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-[linear-gradient(180deg,rgba(19,8,25,0.96),rgba(9,9,9,0.88))] p-4 md:p-6">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((current) => clamp(current - 0.3, MIN_ZOOM, MAX_ZOOM))}
                className="border border-white/20 bg-black/65 px-3 py-2 font-mono text-[11px] tracking-[0.3em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Zoom Out
              </button>
              <button
                type="button"
                onClick={resetView}
                className="border border-white/20 bg-black/65 px-3 py-2 font-mono text-[11px] tracking-[0.3em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setScale((current) => clamp(current + 0.3, MIN_ZOOM, MAX_ZOOM))}
                className="border border-white/20 bg-black/65 px-3 py-2 font-mono text-[11px] tracking-[0.3em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Zoom In
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="border border-white/20 bg-black/65 px-4 py-2 font-mono text-xs tracking-[0.3em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
              >
                Close
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-4 md:px-6 md:py-6"
            onDoubleClick={resetView}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          >
            <div className="spotlight-violet pointer-events-none absolute inset-0 opacity-75" />
            <button
              type="button"
              onClick={() => onSelect((currentIndex - 1 + artworks.length) % artworks.length)}
              className="absolute left-3 z-20 border border-white/20 bg-black/65 px-3 py-3 font-mono text-[11px] tracking-[0.35em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9] md:left-6"
              aria-label="Previous artwork"
            >
              Prev
            </button>
            <div
              className="relative h-full w-full transition-transform duration-150 ease-out"
              style={{
                cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "zoom-in",
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {activeArtwork.src ? (
                // biome-ignore lint/performance/noImgElement: fullscreen viewer needs direct transforms without Next image wrappers
                <img
                  src={activeArtwork.src}
                  alt={activeArtwork.alt || activeArtwork.title}
                  className="h-full w-full select-none object-contain"
                  draggable={false}
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-3 py-3 md:px-6 md:py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
              Scroll to zoom. Drag to pan.
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {artworks.map((artwork, index) => (
                <button
                  key={artwork.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group relative h-20 w-16 shrink-0 overflow-hidden border md:h-24 md:w-20 ${
                    index === currentIndex
                      ? "border-[#ff72c9] shadow-[0_0_24px_rgba(255,114,201,0.45)]"
                      : "border-white/10 hover:border-white/35"
                  }`}
                  aria-label={`View ${artwork.title}`}
                >
                  {artwork.src ? (
                    // biome-ignore lint/performance/noImgElement: thumbnail strip should stay lightweight in the fullscreen viewer
                    <img
                      src={artwork.src}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      draggable={false}
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
    </AnimatePresence>
  );
}
