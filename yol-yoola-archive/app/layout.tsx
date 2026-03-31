import type {Metadata} from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Yol Yoola Archive',
  description: 'Archive and showcase of Yol Yoola artworks and fanfics.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-uma-pattern text-slate-800 font-sans min-h-screen selection:bg-pink-500/30 selection:text-pink-900 overflow-x-hidden" suppressHydrationWarning>
        {/* Energetic Background Accents */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-400/10 blur-[100px]" />
          <div className="absolute top-[40%] right-[-20%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/10 blur-[100px]" />
        </div>
        <Navbar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
