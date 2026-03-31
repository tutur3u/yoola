'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the mask
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Velocity for glitch/skew effects
  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);
  
  // Transform velocity into skew and scale
  const skewX = useTransform(velocityX, [-2000, 2000], [-25, 25]);
  const negativeSkewX = useTransform(skewX, v => -v);
  const scale = useTransform(velocityY, [-2000, 2000], [0.8, 1.2]);

  // The dynamic mask template
  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 40%, transparent 100%)`;

  useEffect(() => {
    setIsMounted(true);
    
    // Center initially
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return <div className="h-screen w-screen bg-black" />;

  const handleEnterVoid = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/gallery');
    }, 800);
  };

  return (
    <main className="h-screen w-screen overflow-hidden relative cursor-none bg-black selection:bg-[#ccff00] selection:text-black font-sans">
      
      {/* ==========================================
          LAYER 1: THE BASE (DARK, SLEEK, EDITORIAL)
          ========================================== */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white p-10">
        
        {/* Background Noise */}
        <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        <motion.div style={{ skewX }} className="relative z-10 flex flex-col items-center">
          <h1 className="text-[18vw] font-serif italic font-light leading-[0.6] text-gray-400 tracking-tight">
            Yol
          </h1>
          <Link href="/" className="pointer-events-auto">
            <h1 className="text-[20vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent hover:text-white transition-colors duration-500" style={{ WebkitTextStroke: '2px white' }}>
              YOOLA
            </h1>
          </Link>
        </motion.div>

        {/* Floating Base Images */}
        <div className="absolute top-[15%] left-[10%] w-[25vw] max-w-[300px] aspect-[3/4] grayscale opacity-50">
          <Image src="https://picsum.photos/seed/base1/600/800" alt="Editorial 1" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-[10%] right-[15%] w-[30vw] max-w-[400px] aspect-square rounded-full overflow-hidden grayscale opacity-30">
          <Image src="https://picsum.photos/seed/base2/800/800" alt="Editorial 2" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>

        {/* Diagonal Marquee Base */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] -rotate-12 overflow-hidden opacity-20 pointer-events-none">
          <div className="flex whitespace-nowrap animate-marquee text-[8vw] font-black uppercase tracking-widest">
            <span>YOL YOOLA ✦ THE NEW ERA ✦ YOL YOOLA ✦ THE NEW ERA ✦ YOL YOOLA ✦ THE NEW ERA ✦</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          LAYER 2: THE REVEAL (NEON, CHAOTIC, MAXIMALIST)
          ========================================== */}
      <motion.div 
        className="absolute inset-0 z-20 bg-[#ccff00] flex flex-col items-center justify-center text-black overflow-hidden pointer-events-none"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      >
        {/* Chaotic Grid Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div style={{ skewX: negativeSkewX, scale }} className="relative z-10 flex flex-col items-center">
          <h1 className="text-[22vw] font-serif italic font-black leading-[0.6] text-[#ff003c] tracking-tighter transform -rotate-6 mix-blend-multiply">
            Yol
          </h1>
          <Link href="/" className="pointer-events-auto">
            <h1 className="text-[24vw] font-black uppercase leading-[0.8] tracking-tighter text-black hover:text-white transition-colors duration-500">
              YOOLA
            </h1>
          </Link>
        </motion.div>

        {/* Vibrant Reveal Images */}
        <div className="absolute top-[10%] left-[5%] w-[35vw] max-w-[450px] aspect-[4/5] mix-blend-exclusion shadow-2xl transform rotate-6">
          <Image src="https://picsum.photos/seed/reveal1/800/1000" alt="Chaos 1" fill className="object-cover contrast-150 saturate-200" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-[5%] right-[5%] w-[40vw] max-w-[500px] aspect-video mix-blend-color-burn transform -rotate-12">
          <Image src="https://picsum.photos/seed/reveal2/1000/600" alt="Chaos 2" fill className="object-cover contrast-200 hue-rotate-90" referrerPolicy="no-referrer" />
        </div>

        {/* Giant Spinning Star */}
        <motion.div 
          className="absolute top-[20%] right-[20%] text-[#b026ff] text-[30vw] leading-none mix-blend-multiply"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          ✦
        </motion.div>

        {/* Opposite Diagonal Marquee */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] rotate-12 overflow-hidden pointer-events-none mix-blend-difference text-white">
          <div className="flex whitespace-nowrap animate-marquee text-[10vw] font-serif italic font-black tracking-widest" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
            <span>PURE EXPRESSION ✦ NO RULES ✦ PURE EXPRESSION ✦ NO RULES ✦ PURE EXPRESSION ✦ NO RULES ✦</span>
          </div>
        </div>
      </motion.div>

      {/* ==========================================
          LAYER 3: FOREGROUND UI (ALWAYS VISIBLE)
          ========================================== */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        
        {/* Custom Cursor Dot */}
        <motion.div
          className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ x: mouseX, y: mouseY }}
        />

        {/* Interactive CTA */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button 
            onClick={handleEnterVoid}
            className="group relative px-12 py-6 overflow-hidden rounded-full bg-transparent border border-white/30 hover:border-transparent transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-white transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.8,0,0.2,1)]" />
            <span className="relative z-10 font-sans font-black text-xl uppercase tracking-[0.2em] text-white group-hover:text-black mix-blend-difference transition-colors duration-500">
              Enter The Void
            </span>
          </button>
        </div>

      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] bg-[#ccff00] origin-bottom flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-black font-black text-6xl md:text-8xl uppercase tracking-tighter"
          >
            Entering...
          </motion.div>
        </motion.div>
      )}

    </main>
  );
}
