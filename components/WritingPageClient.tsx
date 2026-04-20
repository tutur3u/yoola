"use client";

import MarkdownContent from "@/components/MarkdownContent";
import type { ArchiveArtwork, LoreCapsule, YoolaPageSection } from "@/lib/archive-data";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getSectionPanels(section: YoolaPageSection | null) {
  const profileData = asRecord(section?.profileData);
  const panels = Array.isArray(profileData.panels) ? profileData.panels : [];

  return panels
    .map((panel) => asRecord(panel))
    .map((panel) => {
      const title = typeof panel.title === "string" ? panel.title.trim() : null;
      const body = typeof panel.body === "string" ? panel.body.trim() : null;
      if (!title || !body) {
        return null;
      }

      return { title, body };
    })
    .filter((panel): panel is { title: string; body: string } => Boolean(panel));
}

type WritingPageClientProps = {
  artworks: ArchiveArtwork[];
  loreCapsules: LoreCapsule[];
  section: YoolaPageSection | null;
};

export default function WritingPageClient({
  artworks,
  loreCapsules,
  section,
}: WritingPageClientProps) {
  const artworkById = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  const featuredCapsule = loreCapsules[0] ?? null;
  const featuredArtwork = featuredCapsule?.artworkId
    ? (artworkById.get(featuredCapsule.artworkId) ?? null)
    : null;
  const heroMarkdown = section?.bodyMarkdown ?? section?.summary ?? null;
  const calloutPanels = getSectionPanels(section);
  const uniqueTagCount = new Set(loreCapsules.flatMap((capsule) => capsule.tags)).size;
  const publishedCount = loreCapsules.filter(
    (capsule) => capsule.status.toLowerCase() === "published",
  ).length;

  return (
    <div className="bg-writing-folio relative isolate min-h-screen w-full overflow-hidden px-4 pt-32 pb-48 text-white md:px-8">
      <div className="pointer-events-none writing-manuscript-overlay absolute inset-0 opacity-80" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-28" />
      <div className="pointer-events-none page-vignette absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute top-24 left-[-8%] h-64 w-64 rotate-12 rounded-[2rem] border border-[#ffb985]/10 bg-[#ffb985]/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] bottom-16 h-48 w-80 -rotate-6 border border-white/6 bg-white/4 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
                {section?.subtitle ?? "Story archive"}
              </p>
              <h1 className="mt-4 font-display text-6xl font-black tracking-[-0.06em] text-white uppercase md:text-8xl">
                {section?.title ?? "[ Lore ]"}
              </h1>
              {heroMarkdown ? (
                <div className="mt-5 max-w-2xl">
                  <MarkdownContent compact markdown={heroMarkdown} />
                </div>
              ) : null}
            </div>

            <div className="clip-ticket bg-white px-6 py-6 text-black shadow-[16px_16px_0px_rgba(176,38,255,0.9)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/70">
                Archive status
              </p>
              <div className="mt-4 grid gap-3 font-mono text-xs uppercase tracking-[0.25em]">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span>Capsules</span>
                  <span>{loreCapsules.length}</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span>Published</span>
                  <span>{publishedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Signals</span>
                  <span>{uniqueTagCount}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {featuredCapsule ? (
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="file-frame relative overflow-hidden border border-white/10 bg-black/65 p-4 backdrop-blur">
              <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
              <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
                {featuredArtwork?.src ? (
                  <Image
                    src={featuredArtwork.src}
                    alt={featuredArtwork.alt || featuredCapsule.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.75))]" />
                )}
              </div>
              <div className="relative mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ff72c9]">
                    Priority draft / {featuredCapsule.channel}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase">
                    {featuredCapsule.title}
                  </h2>
                  {featuredCapsule.subtitle ? (
                    <p className="mt-3 font-mono text-sm uppercase tracking-[0.24em] text-white/55">
                      {featuredCapsule.subtitle}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/writing/${featuredCapsule.slug}`}
                  className="border border-white/20 bg-black/70 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
                >
                  Read dossier
                </Link>
              </div>
            </div>

            {calloutPanels.length > 0 ? (
              <div className="grid gap-4">
                {calloutPanels.slice(0, 3).map((panel, index) => (
                  <div
                    key={panel.title}
                    className={`file-frame border border-white/10 bg-black/55 p-5 backdrop-blur ${
                      index === 1 ? "md:translate-x-6" : ""
                    }`}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff72c9]">
                      {panel.title}
                    </p>
                    <p className="mt-3 font-mono text-sm leading-6 text-white/65">{panel.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {loreCapsules.length > 0 ? (
          <div className="flex flex-col border-t-2 border-white/10">
            {loreCapsules.map((post, index) => {
              const artwork = post.artworkId ? (artworkById.get(post.artworkId) ?? null) : null;

              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative flex flex-col items-start gap-6 border-b-2 border-white/10 px-4 py-8 transition-colors duration-300 hover:bg-[#b026ff]/18 md:flex-row md:items-center md:gap-12"
                >
                  <div className="flex w-36 shrink-0 flex-col gap-1 font-mono">
                    <span className="text-xl font-bold tracking-tighter">{post.channel}</span>
                    <span className="text-xs text-white/50 group-hover:text-white/80">
                      {post.date}
                    </span>
                  </div>

                  <div className="flex-grow space-y-3">
                    <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-4xl">
                      {post.title}
                    </h2>
                    {post.subtitle ? (
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                        {post.subtitle}
                      </p>
                    ) : null}
                    <p className="max-w-2xl font-sans text-sm leading-relaxed text-white/70 group-hover:text-white/90 md:text-base">
                      {post.teaser}
                    </p>

                    <div className="flex gap-2 pt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-widest group-hover:border-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 items-center gap-4 md:mt-0 md:w-auto">
                    {artwork?.src ? (
                      <div className="relative h-20 w-16 overflow-hidden border border-white/10">
                        <Image
                          src={artwork.src}
                          alt={artwork.alt || artwork.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-col items-start gap-3">
                      <div className="-rotate-3 border-2 border-[#b026ff] px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#b026ff] group-hover:border-white group-hover:text-white">
                        [ {post.status} ]
                      </div>
                      <Link
                        href={`/writing/${post.slug}`}
                        className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/65 transition-colors hover:text-[#ff72c9]"
                      >
                        Open dossier →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="file-frame border border-white/10 bg-black/55 p-10 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
              Lore Queue Empty
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white uppercase">
              No lore capsules are available yet.
            </h2>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-white/65">
              Publish or stage writings and they will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
