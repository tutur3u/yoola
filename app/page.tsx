import Image from 'next/image';
import Link from 'next/link';
import { archiveArtworks } from '@/lib/archive-data';

export default function Home() {
  const heroArtwork = archiveArtworks[9];
  const ribbonArtworks = archiveArtworks.slice(2, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#b026ff] selection:text-white">
      <div className="bg-yoola-grid absolute inset-0" />
      <div className="noise-overlay absolute inset-0 opacity-45" />
      <div className="scanlines absolute inset-0 opacity-15" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col text-center leading-none opacity-10">
        <span
          className="font-display text-[22vw] font-black tracking-tighter text-transparent"
          style={{ WebkitTextStroke: '2px #b026ff' }}
        >
          YOL YOOLA
        </span>
        <span className="-mt-[8vw] font-display text-[22vw] font-black tracking-tighter text-[#b026ff]">
          YOL YOOLA
        </span>
        <span
          className="-mt-[8vw] font-display text-[22vw] font-black tracking-tighter text-transparent"
          style={{ WebkitTextStroke: '2px #b026ff' }}
        >
          YOL YOOLA
        </span>
      </div>

      <div className="absolute top-1/4 -left-10 z-20 flex w-[120%] -rotate-6 overflow-hidden bg-[#b026ff] py-4 text-white shadow-[0_0_50px_rgba(176,38,255,0.3)]">
        <div className="animate-marquee font-display flex whitespace-nowrap text-5xl font-black uppercase tracking-widest">
          <span>CREATOR ARCHIVE • THE VIOLET HORIZON • CREATOR ARCHIVE • THE VIOLET HORIZON • CREATOR ARCHIVE • THE VIOLET HORIZON • </span>
          <span>CREATOR ARCHIVE • THE VIOLET HORIZON • CREATOR ARCHIVE • THE VIOLET HORIZON • CREATOR ARCHIVE • THE VIOLET HORIZON • </span>
        </div>
      </div>

      <div className="absolute bottom-1/4 -left-10 z-20 flex w-[120%] rotate-3 overflow-hidden bg-white py-2 text-black">
        <div
          className="animate-marquee font-display flex whitespace-nowrap text-3xl font-black uppercase tracking-widest"
          style={{ animationDirection: "reverse", animationDuration: "15s" }}
        >
          <span>STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • </span>
          <span>STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • STAY GOLD • FENOMENO • </span>
        </div>
      </div>

      <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-32 pb-20 md:px-8">
        <div className="grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 xl:order-1">
            <div className="mb-8 inline-flex items-center gap-3 border border-white/15 bg-black/55 px-4 py-2 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff72c9]" />
              <span className="font-mono text-[11px] tracking-[0.35em] text-white/75 uppercase">
                Archive Deck / Local Assets Online
              </span>
            </div>

            <h1 className="font-display text-6xl leading-[0.92] font-black uppercase tracking-[-0.05em] text-white md:text-8xl xl:text-[8rem]">
              Break the
              <br />
              <span className="text-[#b026ff]">limits</span>
              <span className="text-white">.</span>
            </h1>

            <p className="mt-8 max-w-xl font-mono text-sm leading-7 text-white/72 md:text-base">
              A neon archive of race-born portraits, dossier fragments, and unfinished
              transmissions. The artwork is local now, the pages hit harder, and the
              gallery opens full-screen like a vault.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/gallery"
                className="animate-glitch inline-flex items-center justify-center border-4 border-transparent bg-[#b026ff] px-10 py-5 font-display text-2xl font-black tracking-[0.18em] text-white uppercase transition-all duration-300 hover:scale-[1.03] hover:border-black hover:bg-white hover:text-black"
              >
                Enter Archive
              </Link>
              <Link
                href="/writing"
                className="inline-flex items-center justify-center border border-white/20 bg-black/45 px-8 py-5 font-mono text-xs tracking-[0.32em] text-white uppercase transition-colors hover:border-[#ff72c9] hover:text-[#ff72c9]"
              >
                Open Dossier Queue
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {ribbonArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className={`file-frame relative overflow-hidden border border-white/10 bg-black/55 p-3 backdrop-blur ${
                    index === 1 ? 'md:-translate-y-6' : ''
                  }`}
                >
                  <div className="spotlight-violet animate-spotlight absolute inset-0 opacity-70" />
                  <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
                    <Image
                      src={artwork.src}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative mt-3 flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.22em] text-white/70 uppercase">
                    <span>{artwork.label}</span>
                    <span>{artwork.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 flex justify-center xl:order-2 xl:justify-end">
            <div className="relative w-full max-w-[540px]">
              <div className="spotlight-violet animate-spotlight absolute -inset-16" />
              <div className="group file-frame animate-drift relative ml-auto aspect-[5/7] w-[82vw] max-w-[500px] overflow-hidden border-[10px] border-[#b026ff] bg-black p-3 shadow-[24px_24px_0px_#b026ff] transition-all duration-300 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[36px_36px_0px_#b026ff] md:w-[36vw]">
                <Image
                  src={heroArtwork.src}
                  alt={heroArtwork.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 82vw, 36vw"
                  className="object-cover grayscale-[0.08] contrast-110 transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-[#b026ff]/10 mix-blend-screen" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-5 left-5 -rotate-3 border border-black bg-white px-4 py-2 font-mono text-[11px] font-bold tracking-[0.3em] text-black uppercase">
                  Classified // {heroArtwork.label}
                </div>

                <div className="absolute right-4 bottom-4 max-w-[75%] border border-white/15 bg-black/75 px-4 py-3 backdrop-blur">
                  <p className="font-mono text-[10px] tracking-[0.34em] text-[#ff72c9] uppercase">
                    {heroArtwork.category} / {heroArtwork.year}
                  </p>
                  <p className="mt-2 font-display text-2xl font-black tracking-tight text-white uppercase">
                    {heroArtwork.title}
                  </p>
                </div>
              </div>

              <div className="absolute -right-2 -bottom-8 rotate-[8deg] border-4 border-black bg-white px-5 py-4 font-display text-5xl font-black text-black shadow-[10px_10px_0px_rgba(176,38,255,1)]">
                10
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
