'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

const artworks = [
  { id: 1, title: 'FINAL_SPRINT.obj', seed: 'sprint', rarity: 'SSR', type: 'SPEED', level: 50, limitBreak: 4 },
  { id: 2, title: 'QUIET_RESOLVE.sys', seed: 'resolve', rarity: 'SR', type: 'STAMINA', level: 45, limitBreak: 3 },
  { id: 3, title: 'CENTER_STAGE.exe', seed: 'stage', rarity: 'SSR', type: 'POWER', level: 50, limitBreak: 4 },
  { id: 4, title: 'MORNING_TRAINING.log', seed: 'training', rarity: 'R', type: 'GUTS', level: 30, limitBreak: 0 },
  { id: 5, title: 'RIVALRY.dat', seed: 'rival', rarity: 'SR', type: 'WISDOM', level: 45, limitBreak: 2 },
  { id: 6, title: 'WINNING_TICKET.bin', seed: 'ticket', rarity: 'SSR', type: 'SPEED', level: 50, limitBreak: 4 },
];

const filters = ['ALL', 'SPEED', 'STAMINA', 'POWER', 'GUTS', 'WISDOM'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div className="min-h-screen pt-32 pb-48 px-4 md:px-8 max-w-7xl mx-auto bg-[#050505] text-white bg-yoola-grid">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-16 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase text-white mix-blend-difference">
          [ ARCHIVE ]
        </h1>
        <p className="font-mono text-[#b026ff] mt-4 tracking-widest text-sm uppercase">
          {`// Visual Data Repository //`}
        </p>
      </motion.div>

      {/* Brutalist Filter Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 font-mono font-bold text-sm tracking-widest uppercase transition-all border-2 ${
              activeFilter === filter 
                ? 'bg-[#b026ff] text-white border-[#b026ff]' 
                : 'bg-transparent text-white border-white/20 hover:border-[#b026ff] hover:text-[#b026ff]'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((art, index) => (
          <motion.div 
            key={art.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative border-2 border-white/10 hover:border-[#b026ff] transition-colors duration-300 bg-black p-4"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden mb-4 border border-white/5">
              <Image
                src={`https://picsum.photos/seed/${art.seed}/600/800`}
                alt={art.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#b026ff] mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Rarity Badge */}
              <div className="absolute top-4 left-4 bg-black text-white font-mono text-xs px-2 py-1 border border-white/20 group-hover:border-[#b026ff] group-hover:text-[#b026ff] transition-colors">
                CLASS: {art.rarity}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-2 font-mono">
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg tracking-tight group-hover:text-[#b026ff] transition-colors uppercase">
                  {art.title}
                </h2>
                <span className="text-xs text-white/50">LVL.{art.level}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-white/50">
                <span className="uppercase tracking-widest border border-white/10 px-2 py-1">
                  {art.type}
                </span>
                <span className="tracking-widest">
                  [{Array(4).fill('0').map((_, i) => i < art.limitBreak ? 'X' : '-').join('')}]
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
