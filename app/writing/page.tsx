'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { getArtworkById, loreCapsules } from '@/lib/archive-data';

export default function Writing() {
  return (
    <div className="bg-yoola-grid relative min-h-screen max-w-6xl mx-auto overflow-hidden bg-[#050505] px-4 pt-32 pb-48 text-white md:px-8">
      <div className="noise-overlay absolute inset-0 opacity-45" />
      <div className="scanlines absolute inset-0 opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-16"
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
              Textual Data Records / Publishing Queue
            </p>
            <h1 className="mt-4 font-display text-6xl font-black tracking-[-0.06em] text-white uppercase md:text-8xl">
              [ Lore ]
            </h1>
            <p className="mt-5 max-w-xl font-mono text-sm leading-7 text-white/68">
              This wing is intentionally unfinished. The dossier queue is live, the
              narrative files are staged, and each capsule opens into a designed stub
              page instead of pretending the text is already published.
            </p>
          </div>

          <div className="clip-ticket bg-white px-6 py-6 text-black shadow-[16px_16px_0px_rgba(176,38,255,0.9)]">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
              Archive Status
            </p>
            <div className="mt-4 grid gap-3 font-mono text-xs tracking-[0.25em] uppercase">
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <span>Published</span>
                <span>00</span>
              </div>
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <span>Staged</span>
                <span>{loreCapsules.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mode</span>
                <span>Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="file-frame relative overflow-hidden border border-white/10 bg-black/65 p-4 backdrop-blur">
          <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
          <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
            <Image
              src={getArtworkById(loreCapsules[0].artworkId)?.src ?? '/artworks/10.png'}
              alt={loreCapsules[0].title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.34em] text-[#ff72c9] uppercase">
                Priority Draft / {loreCapsules[0].channel}
              </p>
              <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase">
                {loreCapsules[0].title}
              </h2>
            </div>
            <Link
              href={`/writing/${loreCapsules[0].slug}`}
              className="border border-white/20 bg-black/70 px-4 py-3 font-mono text-[11px] tracking-[0.32em] text-white uppercase transition-colors hover:border-[#b026ff] hover:text-[#ff72c9]"
            >
              Open Stub
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {['Case Files', 'Transmissions', 'Draft Capsules'].map((label, index) => (
            <div
              key={label}
              className={`file-frame border border-white/10 bg-black/55 p-5 backdrop-blur ${
                index === 1 ? 'md:translate-x-6' : ''
              }`}
            >
              <p className="font-mono text-[11px] tracking-[0.3em] text-[#ff72c9] uppercase">
                {label}
              </p>
              <p className="mt-3 font-mono text-sm leading-6 text-white/65">
                Structured placeholders with art pairings, stamped statuses, and routeable
                detail pages so the archive can grow without dead-end filler content.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col border-t-2 border-white/10">
        {loreCapsules.map((post, index) => {
          const artwork = getArtworkById(post.artworkId);

          return (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
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
                <p className="max-w-2xl font-sans text-sm leading-relaxed text-white/70 group-hover:text-white/90 md:text-base">
                  {post.teaser}
                </p>

                <div className="flex gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/20 px-2 py-1 font-mono text-[10px] tracking-widest uppercase group-hover:border-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full shrink-0 items-center gap-4 md:mt-0 md:w-auto">
                {artwork ? (
                  <div className="relative h-20 w-16 overflow-hidden border border-white/10">
                    <Image
                      src={artwork.src}
                      alt={artwork.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col items-start gap-3">
                  <div className="-rotate-3 border-2 border-[#b026ff] px-3 py-1 font-mono text-xs font-bold tracking-widest text-[#b026ff] uppercase group-hover:border-white group-hover:text-white">
                    [ {post.status} ]
                  </div>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="font-mono text-[11px] tracking-[0.28em] text-white/65 uppercase transition-colors hover:text-[#ff72c9]"
                  >
                    Open Stub →
                  </Link>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
