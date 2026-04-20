'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { YoolaNavigationItem } from '@/lib/archive-data';

type NavbarProps = {
  brand: string;
  items: YoolaNavigationItem[];
};

export default function Navbar({ brand, items }: NavbarProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 p-6 mix-blend-difference md:flex-row"
    >
      <Link
        href="/"
        className="font-display pointer-events-auto text-4xl font-black tracking-tighter text-white transition-transform hover:scale-105"
      >
        {brand}
        <span className="text-[#b026ff]">.</span>
      </Link>
      <div className="pointer-events-auto flex gap-4 border-2 border-white/20 bg-black/50 px-6 py-3 backdrop-blur-md md:gap-8">
        {items.map((item) => {
          const isActive =
            item.path === '/'
              ? pathname === '/'
              : pathname === item.path || pathname.startsWith(`${item.path}/`);

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
