"use client";

import MarkdownContent from "@/components/MarkdownContent";
import type {
  ArchiveArtwork,
  YoolaPageSection,
  YoolaProfile,
  YoolaSocialLink,
} from "@/lib/archive-data";
import { motion } from "motion/react";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLink, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

const iconMap: Record<string, IconType> = {
  email: HiOutlineMail,
  github: FaGithub,
  instagram: FaInstagram,
  link: FaLink,
  mail: HiOutlineMail,
  twitter: FaXTwitter,
  x: FaXTwitter,
  youtube: FaYoutube,
};

function resolveArtwork(
  artworks: ArchiveArtwork[],
  profileData: Record<string, unknown>,
  key: "primaryArtworkSlug" | "secondaryArtworkSlug",
  fallbackIndex: number,
) {
  const configuredSlug = profileData[key];
  if (typeof configuredSlug === "string") {
    const matchedArtwork = artworks.find((artwork) => artwork.slug === configuredSlug);
    if (matchedArtwork) {
      return matchedArtwork;
    }
  }

  return artworks[fallbackIndex] ?? artworks[0] ?? null;
}

function resolveSocialIcon(link: YoolaSocialLink) {
  const normalizedKey = link.icon.trim().toLowerCase();
  return iconMap[normalizedKey] ?? FaLink;
}

type AboutPageClientProps = {
  artworks: ArchiveArtwork[];
  profile: YoolaProfile;
  section: YoolaPageSection | null;
};

export default function AboutPageClient({ artworks, profile, section }: AboutPageClientProps) {
  const sectionProfileData = section?.profileData ?? {};
  const profileArtwork = resolveArtwork(artworks, sectionProfileData, "primaryArtworkSlug", 0);
  const sideArtwork = resolveArtwork(artworks, sectionProfileData, "secondaryArtworkSlug", 1);
  const profileMarkdown = section?.bodyMarkdown ?? section?.summary ?? null;

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

          <div className="relative z-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="group relative aspect-square w-full border-2 border-white/20 p-2">
                <div className="spotlight-violet animate-spotlight absolute -inset-5 opacity-90" />
                <div className="relative h-full w-full overflow-hidden bg-black">
                  {profileArtwork?.src ? (
                    <Image
                      src={profileArtwork.src}
                      alt={profileArtwork.alt || profileArtwork.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                      Awaiting Portrait
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#b026ff] opacity-20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0" />
                  <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:4px_4px]" />
                </div>
                {profile.rank ? (
                  <div className="absolute -right-4 -bottom-4 border-2 border-black bg-[#b026ff] px-4 py-2 font-mono text-xl font-black text-white shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                    {profile.rank}
                  </div>
                ) : null}
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#b026ff]">
                  {section?.subtitle ?? section?.title ?? "Profile dossier"}
                </p>
                <h1 className="mt-3 font-display text-5xl font-black tracking-tighter uppercase">
                  {profile.name}
                </h1>
                <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-white/55">
                  {profile.role}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.entityId ? (
                    <span className="border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.26em] text-white/60">
                      {profile.entityId}
                    </span>
                  ) : null}
                  {profile.statusLabel ? (
                    <span className="border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.26em] text-[#ff72c9]">
                      {profile.statusLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              {profile.socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.map((social) => {
                    const Icon = resolveSocialIcon(social);
                    return (
                      <motion.a
                        key={`${social.label}-${social.href}`}
                        href={social.href}
                        whileHover={{ y: -4 }}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black transition-colors hover:border-[#b026ff] hover:text-[#b026ff]"
                        title={social.label}
                      >
                        <Icon size={20} />
                      </motion.a>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="space-y-8">
              {profileMarkdown ? (
                <div className="border-l-2 border-white/20 pl-4">
                  <MarkdownContent compact markdown={profileMarkdown} />
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                {sideArtwork ? (
                  <div className="file-frame relative overflow-hidden border border-white/10 bg-black/50 p-4">
                    <div className="spotlight-violet absolute inset-0 opacity-70" />
                    <div className="relative flex flex-col gap-4 md:flex-row">
                      <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 md:max-w-[18rem]">
                        {sideArtwork.src ? (
                          <Image
                            src={sideArtwork.src}
                            alt={sideArtwork.alt || sideArtwork.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 18rem"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/5 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                            Awaiting Visual
                          </div>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#ff72c9]">
                          Supporting visual / {sideArtwork.label}
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white uppercase">
                          {sideArtwork.title}
                        </h2>
                        <p className="mt-3 font-mono text-sm leading-6 text-white/65">
                          {sideArtwork.caption ?? sideArtwork.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {profile.markers.length > 0 ? (
                  <div className="clip-ticket border border-white/10 bg-white px-5 py-6 text-black shadow-[12px_12px_0px_rgba(176,38,255,0.8)]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/70">
                      Personal markers
                    </p>
                    <div className="mt-4 space-y-3 font-mono text-xs uppercase tracking-[0.22em] text-black/75">
                      {profile.markers.map((marker) => (
                        <div
                          key={`${marker.label}-${marker.value}`}
                          className="flex justify-between border-black/15 pb-2 not-last:border-b"
                        >
                          <span>{marker.label}</span>
                          <span>{marker.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {profile.stats.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="flex items-center gap-4 font-mono text-xl font-bold uppercase tracking-widest text-[#b026ff]">
                    <span className="h-[2px] w-8 bg-[#b026ff]" />
                    System parameters
                  </h2>
                  <div className="grid gap-4 font-mono text-sm">
                    {profile.stats.map((stat, index) => {
                      const numericValue = typeof stat.value === "number" ? stat.value : null;
                      const percentage =
                        numericValue !== null && stat.max && stat.max > 0
                          ? Math.min(100, (numericValue / stat.max) * 100)
                          : null;
                      const blocks = percentage !== null ? Math.floor(percentage / 5) : 0;
                      const emptyBlocks = 20 - blocks;

                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.08 }}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
                        >
                          <div className="w-24 shrink-0 text-white/60">{stat.label}</div>
                          <div className="flex flex-grow items-center gap-2 text-[#b026ff]">
                            <span>[</span>
                            <span className="tracking-tighter">
                              {percentage !== null ? (
                                <>
                                  {"█".repeat(blocks)}
                                  <span className="text-white/20">{"█".repeat(emptyBlocks)}</span>
                                </>
                              ) : (
                                <span className="text-white/35">DATA</span>
                              )}
                            </span>
                            <span>]</span>
                          </div>
                          <div className="w-16 shrink-0 text-right">{stat.value}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
