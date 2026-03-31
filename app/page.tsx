'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { archiveArtworks } from '@/lib/archive-data';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const basePortrait = archiveArtworks[0];
  const baseOrb = archiveArtworks[4];
  const revealPortrait = archiveArtworks[9];
  const revealWide = archiveArtworks[7];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  const skewX = useTransform(velocityX, [-2000, 2000], [-25, 25]);
  const negativeSkewX = useTransform(skewX, (value) => -value);
  const scale = useTransform(velocityY, [-2000, 2000], [0.8, 1.2]);

  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 40%, transparent 100%)`;

  useEffect(() => {
    setIsMounted(true);

    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isMounted) {
    return <div className="h-screen w-screen bg-black" />;
  }

  const handleEnterVoid = () => {
    setIsTransitioning(true);

    window.setTimeout(() => {
      router.push('/gallery');
    }, 800);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black font-sans text-white selection:bg-[#ccff00] selection:text-black">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-10 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />

        <motion.div style={{ skewX }} className="relative z-10 flex flex-col items-center">
          <h1 className="font-serif text-[18vw] font-light leading-[0.6] tracking-tight text-gray-400 italic">
            Yol
          </h1>
          <h1
            className="text-[20vw] font-black leading-[0.8] tracking-tighter text-transparent uppercase"
            style={{ WebkitTextStroke: '2px white' }}
          >
            YOOLA
          </h1>
        </motion.div>

        <div className="absolute top-[15%] left-[10%] w-[25vw] max-w-[300px] aspect-[3/4] opacity-50 grayscale">
          <Image
            src={basePortrait.src}
            alt={basePortrait.title}
            fill
            sizes="(max-width: 768px) 35vw, 25vw"
            className="object-cover"
          />
        </div>

        <div className="absolute right-[15%] bottom-[10%] aspect-square w-[30vw] max-w-[400px] overflow-hidden rounded-full opacity-30 grayscale">
          <Image
            src={baseOrb.src}
            alt={baseOrb.title}
            fill
            sizes="(max-width: 768px) 40vw, 30vw"
            className="object-cover"
          />
        </div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 w-[200vw] -translate-x-1/2 -translate-y-1/2 -rotate-12 overflow-hidden opacity-20">
          <div className="animate-marquee flex whitespace-nowrap text-[8vw] font-black tracking-widest uppercase">
            <span>YOL YOOLA ✦ THE NEW ERA ✦ YOL YOOLA ✦ THE NEW ERA ✦ YOL YOOLA ✦ THE NEW ERA ✦</span>
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#ccff00] text-black"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div
          style={{ skewX: negativeSkewX, scale }}
          className="relative z-10 flex flex-col items-center"
        >
          <h1 className="font-serif text-[22vw] font-black leading-[0.6] tracking-tighter text-[#ff003c] italic mix-blend-multiply -rotate-6">
            Yol
          </h1>
          <h1 className="text-[24vw] font-black leading-[0.8] tracking-tighter text-black uppercase">
            YOOLA
          </h1>
        </motion.div>

        <div className="absolute top-[10%] left-[5%] aspect-[4/5] w-[35vw] max-w-[450px] rotate-6 mix-blend-exclusion shadow-2xl">
          <Image
            src={revealPortrait.src}
            alt={revealPortrait.title}
            fill
            sizes="(max-width: 768px) 44vw, 35vw"
            className="object-cover contrast-150 saturate-150"
          />
        </div>

        <div className="absolute right-[5%] bottom-[5%] aspect-video w-[40vw] max-w-[500px] -rotate-12 mix-blend-color-burn">
          <Image
            src={revealWide.src}
            alt={revealWide.title}
            fill
            sizes="(max-width: 768px) 48vw, 40vw"
            className="object-cover contrast-200 hue-rotate-[35deg]"
          />
        </div>

        <motion.div
          className="absolute top-[20%] right-[20%] text-[30vw] leading-none text-[#b026ff] mix-blend-multiply"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          ✦
        </motion.div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 w-[200vw] -translate-x-1/2 -translate-y-1/2 rotate-12 overflow-hidden text-white mix-blend-difference">
          <div
            className="animate-marquee flex whitespace-nowrap text-[10vw] font-serif font-black tracking-widest italic"
            style={{ animationDirection: 'reverse', animationDuration: '15s' }}
          >
            <span>PURE EXPRESSION ✦ NO RULES ✦ PURE EXPRESSION ✦ NO RULES ✦ PURE EXPRESSION ✦ NO RULES ✦</span>
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-30">
        <motion.div
          className="fixed top-0 left-0 z-50 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
          style={{ x: mouseX, y: mouseY }}
        />

        <div className="pointer-events-auto absolute bottom-12 left-1/2 -translate-x-1/2">
          <button
            type="button"
            onClick={handleEnterVoid}
            className="group relative overflow-hidden rounded-full border border-white/30 bg-transparent px-12 py-6 transition-colors duration-500 hover:border-transparent"
          >
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] group-hover:scale-y-100" />
            <span className="relative z-10 text-xl font-black tracking-[0.2em] text-white uppercase transition-colors duration-500 group-hover:text-black">
              Enter The Void
            </span>
          </button>
        </div>
      </div>

      {isTransitioning ? (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] flex origin-bottom items-center justify-center bg-[#ccff00]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-6xl font-black tracking-tighter text-black uppercase md:text-8xl"
          >
            Entering...
          </motion.div>
        </motion.div>
      ) : null}
    </main>
  );
}
