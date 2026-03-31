'use client';

import Image from 'next/image';
import { Github, Link as LinkIcon, Mail, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import { archiveArtworks } from '@/lib/archive-data';

const stats = [
  { label: 'SPEED', value: 1200, max: 1200 },
  { label: 'STAMINA', value: 850, max: 1200 },
  { label: 'POWER', value: 1050, max: 1200 },
  { label: 'GUTS', value: 600, max: 1200 },
  { label: 'WISDOM', value: 950, max: 1200 },
];

export default function About() {
  const profileArtwork = archiveArtworks[0];
  const sideArtwork = archiveArtworks[7];

  return (
    <div className="bg-about-dossier relative isolate min-h-screen w-full overflow-hidden px-4 pt-32 pb-48 text-white md:px-8">
      <div className="pointer-events-none about-signal-overlay absolute inset-0 opacity-85" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-42" />
      <div className="pointer-events-none scanlines absolute inset-0 opacity-14" />
      <div className="pointer-events-none page-vignette absolute inset-0 opacity-85" />
      <div className="pointer-events-none absolute top-10 left-[8%] h-56 w-56 rounded-full border border-cyan-300/12 bg-cyan-300/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[2%] bottom-12 h-72 w-72 rounded-full border border-[#b026ff]/10 bg-[#b026ff]/8 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="file-frame relative border-2 border-white/10 bg-black/85 p-6 backdrop-blur-sm md:p-12"
      >
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[#b026ff]" />
        <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[#b026ff]" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#b026ff]" />
        <div className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-[#b026ff]" />

        <div className="relative z-10 flex flex-col items-start gap-12 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-80">
            <div className="group relative aspect-square w-full border-2 border-white/20 p-2">
              <div className="spotlight-violet animate-spotlight absolute -inset-5 opacity-90" />
              <div className="relative h-full w-full overflow-hidden bg-black">
                <Image
                  src={profileArtwork.src}
                  alt={profileArtwork.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-[#b026ff] opacity-20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0" />
                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiPjwvcmVjdD4KPC9zdmc+')] " />
              </div>

              <div className="absolute -right-4 -bottom-4 border-2 border-black bg-[#b026ff] px-4 py-2 font-mono text-xl font-black text-white shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                RANK: UG
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 font-mono text-xs tracking-widest text-[#b026ff] uppercase">
                {'// ENTITY_ID: 987-654-321'}
              </div>
              <h1 className="font-display text-5xl font-black tracking-tighter uppercase">
                Yol Yoola
              </h1>
              <p className="mt-2 font-mono text-sm tracking-widest text-white/50 uppercase">
                Creator {'//'} Artist
              </p>
            </div>

            <div className="mt-4 flex gap-4">
              {[
                { icon: Twitter, label: 'TWITTER' },
                { icon: Github, label: 'GITHUB' },
                { icon: Mail, label: 'COMM' },
                { icon: LinkIcon, label: 'LINK' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ y: -4 }}
                  className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black transition-colors hover:border-[#b026ff] hover:text-[#b026ff]"
                  title={social.label}
                >
                  <social.icon size={20} strokeWidth={2} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="w-full flex-grow space-y-12">
            <div className="space-y-4">
              <h2 className="flex items-center gap-4 font-mono text-xl font-bold tracking-widest text-[#b026ff] uppercase">
                <span className="h-[2px] w-8 bg-[#b026ff]" />
                Profile_Data
              </h2>
              <div className="space-y-4 border-l-2 border-white/20 pl-4 font-mono text-sm leading-relaxed text-white/80">
                <p>&gt; INITIALIZING PROFILE SEQUENCE...</p>
                <p>
                  &gt; Passionate creator blending the thrill of the race with
                  brutalist artistic expression. Specializing in high-contrast
                  character illustrations and compelling, glitch-ridden
                  narratives.
                </p>
                <p>
                  &gt; Always aiming for the top spot on the podium. Let&apos;s create
                  something legendary together.
                </p>
                <p className="animate-pulse text-[#b026ff]">&gt; STATUS: ONLINE _</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="file-frame relative overflow-hidden border border-white/10 bg-black/50 p-4">
                <div className="spotlight-violet absolute inset-0 opacity-70" />
                <div className="relative flex flex-col gap-4 md:flex-row">
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 md:max-w-[18rem]">
                    <Image
                      src={sideArtwork.src}
                      alt={sideArtwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 18rem"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex-1">
                    <p className="font-mono text-[11px] tracking-[0.32em] text-[#ff72c9] uppercase">
                      Supporting Visual / {sideArtwork.label}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-black tracking-tight text-white uppercase">
                      {sideArtwork.title}
                    </h3>
                    <p className="mt-3 font-mono text-sm leading-6 text-white/65">
                      {sideArtwork.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="clip-ticket border border-white/10 bg-white px-5 py-6 text-black shadow-[12px_12px_0px_rgba(176,38,255,0.8)]">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
                  Personal Markers
                </p>
                <div className="mt-4 space-y-3 font-mono text-xs tracking-[0.22em] uppercase text-black/75">
                  <div className="flex justify-between border-b border-black/15 pb-2">
                    <span>Primary lane</span>
                    <span>Visual archive</span>
                  </div>
                  <div className="flex justify-between border-b border-black/15 pb-2">
                    <span>Current phase</span>
                    <span>World building</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal style</span>
                    <span>Brutalist neon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="flex items-center gap-4 font-mono text-xl font-bold tracking-widest text-[#b026ff] uppercase">
                <span className="h-[2px] w-8 bg-[#b026ff]" />
                System_Parameters
              </h2>

              <div className="grid gap-4 font-mono text-sm">
                {stats.map((stat, index) => {
                  const percentage = (stat.value / stat.max) * 100;
                  const blocks = Math.floor(percentage / 5);
                  const emptyBlocks = 20 - blocks;

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="w-24 shrink-0 text-white/60">{stat.label}</div>

                      <div className="flex flex-grow items-center gap-2 text-[#b026ff]">
                        <span>[</span>
                        <span className="tracking-tighter">
                          {'█'.repeat(blocks)}
                          <span className="text-white/20">
                            {'█'.repeat(emptyBlocks)}
                          </span>
                        </span>
                        <span>]</span>
                      </div>

                      <div className="w-16 shrink-0 text-right">{stat.value}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
