import MarkdownContent from '@/components/MarkdownContent';
import { getArtworkById, getLoreCapsule, getYoolaArchiveData } from '@/lib/archive-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export default async function WritingCapsulePage(
  props: PageProps<'/writing/[slug]'>
) {
  const { slug } = await props.params;
  const capsule = await getLoreCapsule(slug);

  if (!capsule) {
    notFound();
  }

  const artwork = capsule.artworkId ? await getArtworkById(capsule.artworkId) : null;
  const { sections } = await getYoolaArchiveData();
  const writingSection = sections.writing ?? null;
  const profileData = asRecord(capsule.profileData);
  const detailNoteMarkdown = asString(profileData.detailNoteMarkdown);
  const bodyMarkdown = capsule.bodyMarkdown?.trim() || capsule.excerptMarkdown;

  return (
    <div className="bg-yoola-grid relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-[#050505] px-4 pt-32 pb-48 text-white md:px-8">
      <div className="noise-overlay absolute inset-0 opacity-45" />
      <div className="scanlines absolute inset-0 opacity-15" />

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Link
            href="/writing"
            className="inline-flex border border-white/20 bg-black/50 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white transition-colors hover:border-[#ff72c9] hover:text-[#ff72c9]"
          >
            ← Back to {writingSection?.title ?? 'Lore'}
          </Link>

          <div className="file-frame border border-white/10 bg-black/70 p-6 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
              {capsule.channel} / {capsule.date}
            </p>
            <h1 className="mt-4 font-display text-5xl font-black tracking-[-0.04em] text-white uppercase md:text-7xl">
              {capsule.title}
            </h1>
            {capsule.subtitle ? (
              <p className="mt-4 font-mono text-sm uppercase tracking-[0.26em] text-white/55">
                {capsule.subtitle}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              {capsule.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="file-frame border border-white/10 bg-black/70 p-6 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
              Excerpt
            </p>
            <div className="mt-6 border-l-2 border-[#b026ff] pl-4">
              <MarkdownContent compact markdown={capsule.excerptMarkdown} />
            </div>
          </div>

          <div className="file-frame border border-white/10 bg-black/70 p-6 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
              Story file
            </p>
            <div className="mt-6 border-t border-white/10 pt-6">
              <MarkdownContent markdown={bodyMarkdown} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {artwork ? (
            <div className="file-frame relative overflow-hidden border border-white/10 bg-black/70 p-4 backdrop-blur">
              <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
                {artwork.src ? (
                  <Image
                    src={artwork.src}
                    alt={artwork.alt || artwork.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,38,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.75))]" />
                )}
              </div>
              <div className="relative mt-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
                  Paired visual / {artwork.label}
                </p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase">
                  {artwork.title}
                </h2>
                <p className="mt-3 font-mono text-sm leading-6 text-white/68">
                  {artwork.caption ?? artwork.note}
                </p>
              </div>
            </div>
          ) : null}

          <div className="clip-ticket bg-white px-6 py-6 text-black shadow-[14px_14px_0px_rgba(176,38,255,0.9)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/70">
              Capsule status
            </p>
            <div className="mt-4 space-y-3 font-mono text-xs uppercase tracking-[0.24em] text-black/75">
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>Status</span>
                <span>{capsule.status}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>Channel</span>
                <span>{capsule.channel}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>{capsule.date}</span>
              </div>
            </div>
          </div>

          {detailNoteMarkdown ? (
            <div className="file-frame border border-white/10 bg-black/70 p-6 backdrop-blur">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff72c9]">
                Side note
              </p>
              <div className="mt-4">
                <MarkdownContent compact markdown={detailNoteMarkdown} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
