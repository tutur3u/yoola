'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Twitter, Github, Mail, Link as LinkIcon } from 'lucide-react';

const stats = [
  { label: 'SPEED', value: 1200, max: 1200 },
  { label: 'STAMINA', value: 850, max: 1200 },
  { label: 'POWER', value: 1050, max: 1200 },
  { label: 'GUTS', value: 600, max: 1200 },
  { label: 'WISDOM', value: 950, max: 1200 },
];

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-48 px-4 md:px-8 max-w-5xl mx-auto bg-[#050505] text-white bg-yoola-grid">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative border-2 border-white/10 p-6 md:p-12 bg-black"
      >
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#b026ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#b026ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#b026ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#b026ff]" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Profile Image & Basic Info */}
          <div className="flex flex-col gap-6 shrink-0 w-full lg:w-80">
            <div className="relative w-full aspect-square border-2 border-white/20 p-2 group">
              <div className="relative w-full h-full bg-black overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/yoola_profile/800/800"
                  alt="Yol Yoola"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#b026ff] mix-blend-overlay opacity-20 group-hover:opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiPjwvcmVjdD4KPC9zdmc+')] pointer-events-none" />
              </div>
              
              {/* Floating Rank Badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#b026ff] text-white font-mono font-black text-xl px-4 py-2 border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                RANK: UG
              </div>
            </div>
            
            <div className="mt-4">
              <div className="font-mono text-[#b026ff] text-xs tracking-widest uppercase mb-2">
                {`// ENTITY_ID: 987-654-321`}
              </div>
              <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
                Yol Yoola
              </h1>
              <p className="font-mono text-white/50 text-sm mt-2 uppercase tracking-widest">
                Creator {`//`} Artist
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              {[
                { icon: Twitter, label: 'TWITTER' },
                { icon: Github, label: 'GITHUB' },
                { icon: Mail, label: 'COMM' },
                { icon: LinkIcon, label: 'LINK' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -4 }}
                  className="w-12 h-12 flex items-center justify-center border-2 border-white/20 hover:border-[#b026ff] hover:text-[#b026ff] transition-colors bg-black"
                  title={social.label}
                >
                  <social.icon size={20} strokeWidth={2} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Details & Stats */}
          <div className="flex-grow w-full space-y-12">
            
            {/* Bio Section */}
            <div className="space-y-4">
              <h2 className="font-mono font-bold text-xl text-[#b026ff] uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-[2px] bg-[#b026ff]" />
                Profile_Data
              </h2>
              <div className="font-mono text-sm leading-relaxed text-white/80 border-l-2 border-white/20 pl-4 space-y-4">
                <p>
                  &gt; INITIALIZING PROFILE SEQUENCE...
                </p>
                <p>
                  &gt; Passionate creator blending the thrill of the race with brutalist artistic expression. Specializing in high-contrast character illustrations and compelling, glitch-ridden narratives.
                </p>
                <p>
                  &gt; Always aiming for the top spot on the podium. Let&apos;s create something legendary together.
                </p>
                <p className="text-[#b026ff] animate-pulse">
                  &gt; STATUS: ONLINE _
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-xl text-[#b026ff] uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-[2px] bg-[#b026ff]" />
                System_Parameters
              </h2>
              
              <div className="grid gap-4 font-mono text-sm">
                {stats.map((stat, index) => {
                  const percentage = (stat.value / stat.max) * 100;
                  const blocks = Math.floor(percentage / 5);
                  const emptyBlocks = 20 - blocks;
                  
                  return (
                    <motion.div 
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                    >
                      <div className="w-24 shrink-0 text-white/60">
                        {stat.label}
                      </div>
                      
                      <div className="flex-grow flex items-center gap-2 text-[#b026ff]">
                        <span>[</span>
                        <span className="tracking-tighter">
                          {'█'.repeat(blocks)}
                          <span className="text-white/20">{'█'.repeat(emptyBlocks)}</span>
                        </span>
                        <span>]</span>
                      </div>
                      
                      <div className="w-16 shrink-0 text-right">
                        {stat.value}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
