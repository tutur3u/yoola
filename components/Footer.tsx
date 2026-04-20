import { Circle as Github, Circle as Instagram, Circle as Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 flex w-full flex-col items-center justify-center gap-6 border-t border-purple-900/20 bg-[#0a0a0c]/50 py-12 backdrop-blur-sm">
      <div className="flex items-center gap-6 text-zinc-600">
        <a href="#" className="transition-colors duration-300 hover:text-purple-400">
          <Twitter className="h-4 w-4" />
        </a>
        <a href="#" className="transition-colors duration-300 hover:text-purple-400">
          <Instagram className="h-4 w-4" />
        </a>
        <a href="#" className="transition-colors duration-300 hover:text-purple-400">
          <Github className="h-4 w-4" />
        </a>
      </div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
        welcome • 2026 - ∞
      </p>
    </footer>
  );
}
