"use client";

import FeaturedArtworkCarousel from "@/components/FeaturedArtworkCarousel";
import GalleryLightbox from "@/components/GalleryLightbox";
import MarkdownContent from "@/components/MarkdownContent";
import { useInfiniteVisibleCount } from "@/hooks/use-infinite-visible-count";
import type { ArchiveArtwork, YoolaPageSection } from "@/lib/archive-data";
import { useYoolaArchiveDataQuery } from "@/lib/yoola-query";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function ArtworkMasonryImage({ artwork }: { artwork: ArchiveArtwork }) {
  if (!artwork.src) {
    return (
      <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.03]">
        <div
          className={`${
            artwork.orientation === "landscape"
              ? "aspect-[16/10]"
              : artwork.orientation === "square"
                ? "aspect-square"
                : "aspect-[4/5]"
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,106,255,0.16),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(11,5,16,0.82))]" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.28em] text-white/45 uppercase">
          No Preview
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-black/50">
      <Image
        src={artwork.src}
        alt={artwork.alt || artwork.title}
        width={artwork.width}
        height={artwork.height}
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ArchiveFilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.24em] uppercase transition-all ${
        active
          ? "border-[#f36aff] bg-[#f36aff] text-[#180c1f]"
          : "border-white/12 bg-white/[0.03] text-white/72 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function GalleryPageClient() {
  const archiveQuery = useYoolaArchiveDataQuery();
  const artworks: ArchiveArtwork[] = archiveQuery.data?.archiveArtworks ?? [];
  const categories = archiveQuery.data?.artworkCategories ?? [];
  const section: YoolaPageSection | null = archiveQuery.data?.sections.gallery ?? null;
  const filters = ["ALL", ...categories.filter((category) => category !== "ALL")];
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
  const showFeaturedRotation = activeFilter === "ALL" && featuredArtworks.length > 0;

  const activeLightboxIndex =
    activeArtworkId === null
      ? null
      : viewerArtworks.findIndex((artwork) => artwork.id === activeArtworkId);

  const openViewer = (artworkList: ArchiveArtwork[], artworkId: string) => {
    setViewerArtworks(artworkList);
    setActiveArtworkId(artworkId);
  };

  return (
    <div className="bg-artwork-archive relative isolate min-h-screen w-full overflow-hidden px-4 pt-28 pb-40 text-white md:px-8">
      <div className="pointer-events-none artwork-grid-overlay absolute inset-0 opacity-90" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-35" />
      <div className="pointer-events-none page-vignette absolute inset-0 opacity-90" />

      <div className="relative z-10 mx-auto max-w-[96rem]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#120a16]/90 shadow-[0_24px_90px_rgba(8,3,15,0.5)]"
        >
          <div className="border-b border-white/10 px-5 py-5 md:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="font-mono text-[11px] tracking-[0.34em] text-[#f36aff] uppercase">
                  {section?.subtitle ?? "Portfolio Index"}
                </p>
                <h1 className="mt-4 font-display text-4xl font-black tracking-[-0.08em] text-white uppercase sm:text-5xl md:text-6xl">
                  Artwork
                </h1>
                {heroMarkdown ? (
                  <div className="mt-4 max-w-2xl text-white/76">
                    <MarkdownContent compact markdown={heroMarkdown} />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-white/45 uppercase">
                    Works
                  </p>
                  <p className="mt-2 font-display text-3xl font-black tracking-tight text-white">
                    {artworks.length}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-white/45 uppercase">
                    Categories
                  </p>
                  <p className="mt-2 font-display text-3xl font-black tracking-tight text-white">
                    {categories.length}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-white/45 uppercase">
                    Featured
                  </p>
                  <p className="mt-2 font-display text-3xl font-black tracking-tight text-white">
                    {featuredArtworks.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 bg-black/16 px-3 py-3 md:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/artwork"
                className="rounded-[0.95rem] border border-[#f36aff]/60 bg-[#f36aff]/14 px-4 py-2 font-display text-sm font-black tracking-[0.12em] text-white uppercase shadow-[inset_0_-3px_0_#f36aff] transition-colors hover:bg-[#f36aff]/18"
              >
                Artwork
              </Link>
              <Link
                href="/writing"
                className="rounded-[0.95rem] border border-white/10 bg-white/[0.03] px-4 py-2 font-display text-sm font-black tracking-[0.12em] text-white/72 uppercase transition-colors hover:border-white/25 hover:text-white"
              >
                Writing
              </Link>
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <ArchiveFilterButton
                  key={filter}
                  active={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </ArchiveFilterButton>
              ))}
            </div>
          </div>

          <div className="space-y-8 px-4 py-5 md:px-6 md:py-6">
            {showFeaturedRotation ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/24 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-white/45 uppercase">
                      Featured Rotation
                    </p>
                    <p className="mt-1 font-display text-2xl font-black tracking-tight text-white uppercase">
                      Selected Works
                    </p>
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
                    Click any frame to expand
                  </p>
                </div>
                <FeaturedArtworkCarousel
                  artworks={featuredArtworks}
                  onOpenFullscreen={(artworkId) => openViewer(featuredArtworks, artworkId)}
                />
              </div>
            ) : null}

            {visibleArtworks.length > 0 ? (
              <>
                <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4 [column-fill:_balance]">
                  {displayedArtworks.map((art, index) => (
                    <motion.div
                      key={art.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.32, delay: (index % 6) * 0.04 }}
                      className="mb-5 break-inside-avoid"
                    >
                      <button
                        type="button"
                        onClick={() => openViewer(visibleArtworks, art.id)}
                        className="group w-full rounded-[1.4rem] border border-white/10 bg-black/24 p-3 text-left transition-transform duration-300 hover:-translate-y-1 hover:border-[#f36aff]/50 hover:bg-black/32"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] tracking-[0.3em] text-white/48 uppercase">
                            {art.label}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.28em] text-white/38 uppercase">
                            {art.year}
                          </span>
                        </div>

                        <ArtworkMasonryImage artwork={art} />

                        <div className="mt-4 space-y-3">
                          <div>
                            <h2 className="font-display text-2xl font-black tracking-[-0.05em] text-white uppercase transition-colors group-hover:text-[#ffb3f0]">
                              {art.title}
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.24em] text-white/58 uppercase">
                                {art.category}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.24em] text-white/58 uppercase">
                                {art.rarity}
                              </span>
                            </div>
                          </div>
                          <p className="font-mono text-xs leading-6 text-white/62">
                            {art.caption ?? art.note}
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
                {hasMore ? (
                  <div
                    ref={sentinelRef}
                    aria-hidden="true"
                    className="h-16 rounded-[1rem] border border-white/10 border-dashed bg-white/[0.03]"
                  />
                ) : null}
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/24 p-8">
                <p className="font-mono text-[11px] tracking-[0.34em] text-[#f36aff] uppercase">
                  Archive Empty
                </p>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white uppercase">
                  Nothing matches this filter yet.
                </h2>
                <p className="mt-3 max-w-2xl font-mono text-sm leading-7 text-white/62">
                  Publish or categorize more visuals and they will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </motion.section>
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
