import {
  Archive,
  ArrowUpRight,
  Eye,
  LayoutDashboard,
  LibraryBig,
  LockKeyhole,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  buildYoolaAdminLinks,
  getYoolaCmsBaseUrl,
  getYoolaWebAppUrl,
  type YoolaAdminTargetKey,
} from "@/lib/admin-links";
import { getYoolaArchiveData, getYoolaWorkspaceId, type ArchiveArtwork } from "@/lib/archive-data";

type AdminVisualArtwork = ArchiveArtwork & { src: string };

export const metadata: Metadata = {
  title: "Yoola Admin Dashboard",
  description: "Admin entrypoint for managing Yol Yoola archive content through Tuturuuu CMS.",
};

const targetIcons: Record<YoolaAdminTargetKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  library: LibraryBig,
  members: UsersRound,
  preview: Eye,
  settings: Settings,
};

function stripProtocol(value: string) {
  return value.replace(/^https?:\/\//, "");
}

function getFeaturedVisuals(artworks: ArchiveArtwork[], featuredArtwork: ArchiveArtwork | null) {
  const visuals = new Map<string, AdminVisualArtwork>();

  for (const artwork of [featuredArtwork, ...artworks]) {
    if (artwork?.src) {
      visuals.set(artwork.id, { ...artwork, src: artwork.src });
    }

    if (visuals.size >= 4) {
      break;
    }
  }

  return [...visuals.values()];
}

function AdminStat({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: number | string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur">
      <p className="font-mono text-[10px] tracking-[0.24em] text-white/45 uppercase">{label}</p>
      <p className={`mt-3 font-display text-4xl font-black tracking-[-0.06em] ${tone}`}>{value}</p>
    </div>
  );
}

function VisualStack({ artworks }: { artworks: AdminVisualArtwork[] }) {
  return (
    <div className="grid min-h-[24rem] gap-3 sm:grid-cols-2">
      {artworks.length > 0 ? (
        artworks.map((artwork, index) => (
          <div
            className={`relative overflow-hidden border border-white/10 bg-white/[0.04] ${
              index === 0 ? "sm:row-span-2" : ""
            }`}
            key={artwork.id}
          >
            <Image
              alt={artwork.alt || artwork.title}
              className="object-cover saturate-[1.08]"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 34vw"
              src={artwork.src}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,2,10,0.02),rgba(5,2,10,0.72))]" />
            <div className="absolute right-3 bottom-3 left-3">
              <p className="font-mono text-[10px] tracking-[0.22em] text-white/58 uppercase">
                {artwork.category}
              </p>
              <p className="mt-1 line-clamp-2 font-display text-xl leading-none font-black tracking-[-0.02em] text-white">
                {artwork.title}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex min-h-[24rem] items-center justify-center border border-white/10 bg-white/[0.04] font-mono text-xs tracking-[0.28em] text-white/45 uppercase sm:col-span-2">
          Awaiting Visuals
        </div>
      )}
    </div>
  );
}

export default async function AdminPage() {
  const workspaceId = getYoolaWorkspaceId();
  const archiveData = await getYoolaArchiveData();
  const adminLinks = buildYoolaAdminLinks(workspaceId);
  const cmsBaseUrl = getYoolaCmsBaseUrl();
  const webAppUrl = getYoolaWebAppUrl();
  const visuals = getFeaturedVisuals(archiveData.archiveArtworks, archiveData.featuredArtwork);
  const primaryLink = adminLinks.find((link) => link.key === "library") ?? adminLinks[0];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#06040a] px-4 pt-28 pb-24 text-white md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,114,201,0.2),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(94,234,212,0.14),transparent_24%),linear-gradient(180deg,rgba(176,38,255,0.14),rgba(6,4,10,0.96)_40%,#06040a)]" />
      <div className="pointer-events-none bg-yoola-grid absolute inset-0 opacity-45" />
      <div className="pointer-events-none noise-overlay absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.82fr)] lg:items-stretch">
          <div className="flex min-h-[28rem] flex-col justify-between border border-white/10 bg-black/36 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-8">
            <div>
              <div className="flex w-fit items-center gap-2 border border-[#5eead4]/25 bg-[#5eead4]/10 px-3 py-2 font-mono text-[10px] tracking-[0.24em] text-[#a8fff1] uppercase">
                <LockKeyhole className="size-3.5" />
                Platform centralized login
              </div>
              <h1 className="mt-8 max-w-4xl font-display text-5xl leading-[0.9] font-black tracking-[-0.045em] text-white uppercase md:text-7xl">
                <span className="block">
                  Yoola <span className="ml-[0.12em]">Admin</span>
                </span>
                <span className="block">Dashboard</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
                Manage the archive through Tuturuuu CMS with the same workspace, permissions, and
                cross-app login flow used by the platform.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="group inline-flex items-center justify-center gap-2 bg-[#f36aff] px-5 py-4 font-display text-sm font-black tracking-[0.14em] text-[#16061c] uppercase transition hover:bg-[#ff8edb]"
                href={primaryLink?.loginHref ?? "/admin/login"}
              >
                Sign in and manage content
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 border border-white/14 bg-white/[0.04] px-5 py-4 font-display text-sm font-black tracking-[0.14em] text-white/82 uppercase transition hover:border-white/28 hover:text-white"
                href={primaryLink?.cmsHref ?? cmsBaseUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open CMS directly
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <VisualStack artworks={visuals} />
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStat
            label="Artwork entries"
            tone="text-[#ff8edb]"
            value={archiveData.archiveArtworks.length}
          />
          <AdminStat
            label="Writing capsules"
            tone="text-[#a8fff1]"
            value={archiveData.loreCapsules.length}
          />
          <AdminStat
            label="Page sections"
            tone="text-[#d9b6ff]"
            value={Object.keys(archiveData.sections).length}
          />
          <AdminStat
            label="Featured works"
            tone="text-[#ffe3a3]"
            value={archiveData.featuredArtworks.length}
          />
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center border border-[#f36aff]/35 bg-[#f36aff]/12 text-[#ffb7e8]">
                <Archive className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-black tracking-[-0.02em]">
                  Admin Context
                </h2>
                <p className="text-sm text-white/52">Current platform and CMS targets.</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.22em] text-white/38 uppercase">
                  Workspace
                </dt>
                <dd className="mt-1 break-all font-mono text-sm text-white/78">{workspaceId}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.22em] text-white/38 uppercase">
                  Central Login
                </dt>
                <dd className="mt-1 break-all font-mono text-sm text-white/78">
                  {stripProtocol(webAppUrl)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.22em] text-white/38 uppercase">
                  CMS App
                </dt>
                <dd className="mt-1 break-all font-mono text-sm text-white/78">
                  {stripProtocol(cmsBaseUrl)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {adminLinks.map((link) => {
              const Icon = targetIcons[link.key];

              return (
                <article
                  className="group flex min-h-52 flex-col justify-between border border-white/10 bg-black/28 p-5 transition hover:border-[#f36aff]/36 hover:bg-black/38"
                  key={link.key}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center border border-white/12 bg-white/[0.06] text-white/78 transition group-hover:border-[#f36aff]/34 group-hover:text-[#ffb7e8]">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.22em] text-white/34 uppercase">
                        CMS
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-black tracking-[-0.02em] text-white">
                      {link.label}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/58">{link.description}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <a
                      className="inline-flex items-center gap-2 bg-white px-3.5 py-2.5 font-display text-xs font-black tracking-[0.12em] text-[#08040d] uppercase transition hover:bg-[#ff8edb]"
                      href={link.loginHref}
                    >
                      {link.actionLabel}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                    <a
                      className="inline-flex items-center gap-2 border border-white/12 px-3.5 py-2.5 font-display text-xs font-black tracking-[0.12em] text-white/60 uppercase transition hover:border-white/28 hover:text-white"
                      href={link.cmsHref}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Direct
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
