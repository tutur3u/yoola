import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtworkById, getLoreCapsule, loreCapsules } from '@/lib/archive-data';

export async function generateStaticParams() {
  return loreCapsules.map((capsule) => ({ slug: capsule.slug }));
}

export default async function WritingCapsulePage(
  props: PageProps<'/writing/[slug]'>,
) {
  const { slug } = await props.params;
  const capsule = getLoreCapsule(slug);

  if (!capsule) {
    notFound();
  }

  const artwork = getArtworkById(capsule.artworkId);

  return (
    <div className="bg-yoola-grid relative min-h-screen max-w-6xl mx-auto overflow-hidden bg-[#050505] px-4 pt-32 pb-48 text-white md:px-8">
      <div className="noise-overlay absolute inset-0 opacity-45" />
      <div className="scanlines absolute inset-0 opacity-15" />

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Link
            href="/writing"
            className="inline-flex border border-white/20 bg-black/50 px-4 py-3 font-mono text-[11px] tracking-[0.32em] text-white uppercase transition-colors hover:border-[#ff72c9] hover:text-[#ff72c9]"
          >
            ← Back to Lore Queue
          </Link>

          <div className="file-frame border border-white/10 bg-black/70 p-6 backdrop-blur">
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
              {capsule.channel} / {capsule.date}
            </p>
            <h1 className="mt-4 font-display text-5xl font-black tracking-[-0.04em] text-white uppercase md:text-7xl">
              {capsule.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {capsule.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/20 px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/75 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-[#b026ff] pl-4">
              <p className="font-mono text-sm leading-7 text-white/75">{capsule.excerpt}</p>
            </div>
          </div>

          <div className="clip-ticket bg-white px-6 py-6 text-black shadow-[14px_14px_0px_rgba(176,38,255,0.9)]">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
              Publication Status
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase">
              {capsule.status}
            </h2>
            <p className="mt-3 font-mono text-sm leading-6 text-black/70">
              This page is a polished placeholder. The route is real, the aesthetic is
              intentional, and the final prose can land here later without changing the
              archive structure.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {artwork ? (
            <div className="file-frame relative overflow-hidden border border-white/10 bg-black/70 p-4 backdrop-blur">
              <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
                <Image
                  src={artwork.src}
                  alt={artwork.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-4">
                <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
                  Paired Visual / {artwork.label}
                </p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white uppercase">
                  {artwork.title}
                </h2>
                <p className="mt-3 font-mono text-sm leading-6 text-white/68">
                  {artwork.note}
                </p>
              </div>
            </div>
          ) : null}

          <div className="file-frame border border-white/10 bg-black/55 p-6 backdrop-blur">
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#ff72c9] uppercase">
              Coming Soon
            </p>
            <ul className="mt-5 space-y-4 font-mono text-sm leading-6 text-white/68">
              <li>Full prose body with scene transitions and polished formatting.</li>
              <li>Optional chapter navigation once more capsules are published.</li>
              <li>Expanded notes, links, and archival metadata for each entry.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
