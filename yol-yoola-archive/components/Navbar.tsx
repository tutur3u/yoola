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
      className="fixed top-0 left-0 w-full z-50 mix-blend-difference p-6 flex flex-col md:flex-row justify-between items-center pointer-events-none gap-4"
    >
      <div className="font-display font-black text-white text-4xl tracking-tighter pointer-events-auto hover:scale-105 transition-transform">
        <Link href="/">
          YOOLA<span className="text-[#b026ff]">.</span>
        </Link>
      </div>
      <div className="flex gap-4 md:gap-8 pointer-events-auto bg-black/50 backdrop-blur-md px-6 py-3 border-2 border-white/20">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`font-display font-black text-lg md:text-xl uppercase transition-all hover:animate-glitch ${
                isActive ? 'text-[#b026ff] underline decoration-4 underline-offset-4' : 'text-white hover:text-[#b026ff]'
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
