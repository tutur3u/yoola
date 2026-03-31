'use client';
import { motion } from 'motion/react';

const writings = [
  { id: 'FILE_01', title: 'THE VIOLET HORIZON', date: '2025.10.14', tags: ['MAIN_STORY', 'ANGST'], summary: 'In the quiet aftermath of the race, the stadium lights flickered against the dark sky. She stood there, adjusting her cap, the purple highlights of her hair catching the artificial glow.', isClear: true },
  { id: 'FILE_02', title: 'UNSPOKEN RULES', date: '2025.08.22', tags: ['EVENT', 'SLICE_OF_LIFE'], summary: 'There were rules to how one should act in the presence of a champion. Fenomeno rarely cared for them, preferring to let her presence speak volumes.', isClear: true },
  { id: 'FILE_03', title: 'ECHOES OF THE TRACK', date: '2025.05.03', tags: ['MAIN_STORY', 'INTROSPECTIVE'], summary: 'The sound of hooves hitting the turf was a rhythm she knew better than her own heartbeat. A deep dive into the mind of a racer who only knows how to move forward.', isClear: false },
  { id: 'FILE_04', title: 'MIDNIGHT STRATEGY', date: '2025.02.11', tags: ['EXTRA', 'TACTICS'], summary: 'Maps, times, and statistics scattered across the desk. The glow of the monitor illuminated her focused expression. Winning wasn\'t just physical; it was a calculated game of chess.', isClear: false }
];

export default function Writing() {
  return (
    <div className="min-h-screen pt-32 pb-48 px-4 md:px-8 max-w-5xl mx-auto bg-[#050505] text-white bg-yoola-grid">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-20 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase text-white mix-blend-difference">
          [ LORE ]
        </h1>
        <p className="font-mono text-[#b026ff] mt-4 tracking-widest text-sm uppercase">
          {`// Textual Data Records //`}
        </p>
      </motion.div>

      <div className="flex flex-col border-t-2 border-white/10">
        {writings.map((post, index) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center py-8 border-b-2 border-white/10 hover:bg-[#b026ff] hover:text-white transition-colors duration-300 cursor-pointer px-4"
          >
            {/* ID & Date */}
            <div className="shrink-0 flex flex-col gap-1 font-mono w-32">
              <span className="text-xl font-bold tracking-tighter">{post.id}</span>
              <span className="text-xs text-white/50 group-hover:text-white/80">{post.date}</span>
            </div>
            
            {/* Content */}
            <div className="flex-grow space-y-3">
              <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight">
                {post.title}
              </h2>
              <p className="font-sans text-sm md:text-base text-white/70 group-hover:text-white/90 max-w-2xl leading-relaxed">
                {post.summary}
              </p>
              
              {/* Tags */}
              <div className="flex gap-2 pt-2">
                {post.tags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-white/20 group-hover:border-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Stamp */}
            <div className="shrink-0 md:w-32 flex justify-end mt-4 md:mt-0">
              {post.isClear ? (
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#b026ff] group-hover:text-white border-2 border-[#b026ff] group-hover:border-white px-3 py-1 transform -rotate-6">
                  [ DECRYPTED ]
                </div>
              ) : (
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-white/30 group-hover:text-white/60 border-2 border-white/30 group-hover:border-white/60 px-3 py-1">
                  [ ENCRYPTED ]
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
