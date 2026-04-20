"use client";

import FeaturedArtworkCarousel from "@/components/FeaturedArtworkCarousel";
import GalleryLightbox from "@/components/GalleryLightbox";
import MarkdownContent from "@/components/MarkdownContent";
import { useInfiniteVisibleCount } from "@/hooks/use-infinite-visible-count";
import type { ArchiveArtwork, YoolaPageSection } from "@/lib/archive-data";
import { useYoolaArchiveDataQuery } from "@/lib/yoola-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";

function ArtworkCardImage({ artwork }: { artwork: ArchiveArtwork }) {
  if (!artwork.src) {
    return (
      <div
        className={`relative mb-4 overflow-hidden border border-white/10 ${
          artwork.orientation === "landscape"
            ? "aspect-[16/10]"
            : artwork.orientation === "square"
              ? "aspect-square"
              : "aspect-[4/5]"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.75))]" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
          No Visual Yet
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mb-4 overflow-hidden border border-white/10 ${
        artwork.orientation === "landscape"
          ? "aspect-[16/10]"
          : artwork.orientation === "square"
            ? "aspect-square"
            : "aspect-[4/5]"
      }`}
    >
      <Image
        src={artwork.src}
        alt={artwork.alt || artwork.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover grayscale-[0.15] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
    </div>
  );
}

export default function GalleryPageClient() {
  const archiveQuery = useYoolaArchiveDataQuery();
  const artworks: ArchiveArtwork[] = archiveQuery.data?.archiveArtworks ?? [];
  const categories = archiveQuery.data?.artworkCategories ?? [];
  const section: YoolaPageSection | null = archiveQuery.data?.sections.gallery ?? null;
  const filters = useMemo(
    () => ["ALL", ...categories.filter((category) => category !== "ALL")],
    [categories],
  );
  const [activeFilter, setActiveFilter] = useState(filters[0] ?? "ALL");
  const [activeArtworkId, setActiveArtworkId] = useState<string | null>(null);
  const [viewerArtworks, setViewerArtworks] = useState<ArchiveArtwork[]>([]);

  const visibleArtworks =
    activeFilter === "ALL" ? artworks : artworks.filter((art) => art.category === activeFilter);
  const { hasMore, sentinelRef, visibleCount } = useInfiniteVisibleCount({
    pageSize: 12,
    resetKey: activeFilter,
    totalCount: visibleArtworks.length,
  });
  const displayedArtworks = visibleArtworks.slice(0, visibleCount);
  const featuredArtworks = archiveQuery.data?.featuredArtworks ?? [];
  const heroMarkdown = section?.bodyMarkdown ?? section?.summary ?? null;

  const activeLightboxIndex =
    activeArtworkId === null
      ? null
      : viewerArtworks.findIndex((artwork) => artwork.id === activeArtworkId);

  const openViewer = (artworkList: ArchiveArtwork[], artworkId: string) => {
    setViewerArtworks(artworkList);
    setActiveArtworkId(artworkId);
  };

  return (
    <div className="bg-gallery-vault relative isolate min-h-screen w-full overflow-hidden px-4 pt-32 pb-48 text-white md:px-8">
      <div className="pointer-events-none gallery-spectrum-overlay absolute inset-0 opacity-90" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-40" />
      <div className="pointer-events-none scanlines absolute inset-0 opacity-10" />
      <div className="pointer-events-none page-vignette absolute inset-0 opacity-90" />
      <div className="pointer-events-none absolute top-20 right-[-10%] h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[90rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="lg:max-w-2xl xl:max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
                {section?.subtitle ?? "Visual archive"}
              </p>
              <h1 className="mt-4 font-display text-6xl font-black tracking-[-0.06em] text-white uppercase md:text-8xl">
                {section?.title ?? "[ Archive ]"}
              </h1>
              {heroMarkdown ? (
                <div className="mt-5 max-w-2xl">
                  <MarkdownContent compact markdown={heroMarkdown} />
                </div>
              ) : null}
            </div>

            {featuredArtworks.length > 0 ? (
              <FeaturedArtworkCarousel
                artworks={featuredArtworks}
                onOpenFullscreen={(artworkId) =>
                  openViewer(featuredArtworks, artworkId)
                }
              />
            ) : null}
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
              className={`border-2 px-6 py-2 font-mono text-sm font-bold uppercase tracking-widest transition-all ${
                activeFilter === filter
                  ? "border-[#b026ff] bg-[#b026ff] text-white"
                  : "border-white/20 bg-black/45 text-white hover:border-[#b026ff] hover:text-[#b026ff]"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {visibleArtworks.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {displayedArtworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group ${
                  art.orientation === "landscape"
                    ? "md:col-span-7"
                    : art.orientation === "square"
                      ? "md:col-span-5"
                      : "md:col-span-4"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openViewer(visibleArtworks, art.id)}
                  className="file-frame relative block w-full overflow-hidden border border-white/10 bg-black/70 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#b026ff] hover:shadow-[0_20px_70px_rgba(176,38,255,0.2)]"
                >
                  <div className="spotlight-violet absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                  <ArtworkCardImage artwork={art} />
                  <div className="absolute top-8 left-8 border border-white/20 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white transition-colors group-hover:border-[#ff72c9] group-hover:text-[#ff72c9]">
                    {art.label}
                  </div>
                  <div className="absolute right-8 bottom-[8.75rem] border border-white/20 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75">
                    Expand
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff72c9]">
                          {art.category} / {art.rarity}
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase transition-colors group-hover:text-[#ff72c9]">
                          {art.title}
                        </h2>
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                        {art.year}
                      </span>
                    </div>

                    <p className="max-w-2xl font-mono text-xs leading-6 text-white/62">
                      {art.caption ?? art.note}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
            {hasMore ? (
              <div
                ref={sentinelRef}
                aria-hidden="true"
                className="md:col-span-12 h-20 rounded-[1.2rem] border border-white/10 border-dashed bg-black/40"
              />
            ) : null}
          </div>
        ) : (
          <div className="file-frame border border-white/10 bg-black/55 p-10 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
              Archive Empty
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white uppercase">
              Nothing has been published to this collection yet.
            </h2>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-white/65">
              Publish new visuals and they will appear here automatically.
            </p>
          </div>
        )}
      </div>

      <GalleryLightbox
        artworks={viewerArtworks}
        activeIndex={
          activeLightboxIndex !== null && activeLightboxIndex >= 0 ? activeLightboxIndex : null
        }
        onClose={() => {
          setActiveArtworkId(null);
          setViewerArtworks([]);
        }}
        onSelect={(index) => setActiveArtworkId(viewerArtworks[index]?.id ?? null)}
      />
    </div>
  );
}
