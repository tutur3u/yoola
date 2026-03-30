'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const navItems = [
  { name: 'INDEX', path: '/' },
  { name: 'ARCHIVE', path: '/gallery' },
  { name: 'LORE', path: '/writing' },
  { name: 'TRAINER', path: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 p-6 mix-blend-difference md:flex-row"
    >
      <div className="font-display pointer-events-auto text-4xl font-black tracking-tighter text-white">
        YOOLA<span className="text-[#b026ff]">.</span>
      </div>
      <div className="pointer-events-auto flex gap-4 border-2 border-white/20 bg-black/50 px-6 py-3 backdrop-blur-md md:gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`font-display text-lg font-black uppercase transition-all hover:animate-glitch md:text-xl ${
                isActive
                  ? 'text-[#b026ff] underline decoration-4 underline-offset-4'
                  : 'text-white hover:text-[#b026ff]'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
