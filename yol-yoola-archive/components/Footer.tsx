import { Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-20 border-t border-purple-900/20 flex flex-col items-center justify-center gap-6 bg-[#0a0a0c]/50 backdrop-blur-sm">
      <div className="flex items-center gap-6 text-zinc-600">
        <a href="#" className="hover:text-purple-400 transition-colors duration-300">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="#" className="hover:text-purple-400 transition-colors duration-300">
          <Instagram className="w-4 h-4" />
        </a>
        <a href="#" className="hover:text-purple-400 transition-colors duration-300">
          <Github className="w-4 h-4" />
        </a>
      </div>
      <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase">
        welcome • 2026 - ∞
      </p>
    </footer>
  );
}
