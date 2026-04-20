import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownContentProps = {
  markdown: string;
  compact?: boolean;
  className?: string;
};

export default function MarkdownContent({
  markdown,
  compact = false,
  className,
}: MarkdownContentProps) {
  return (
    <div
      className={clsx(
        'space-y-5 font-mono leading-7 text-white/78',
        compact ? 'text-sm' : 'text-sm',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className={clsx(
                'font-display font-black tracking-tight text-white uppercase',
                compact ? 'text-2xl' : 'text-4xl'
              )}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={clsx(
                'font-display font-black tracking-tight text-white uppercase',
                compact ? 'mt-6 text-xl' : 'mt-10 text-3xl'
              )}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={clsx(
                'font-display font-black tracking-tight text-white uppercase',
                compact ? 'mt-5 text-lg' : 'mt-8 text-2xl'
              )}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-white/78">{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-3 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-3 pl-6">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#b026ff] pl-4 text-white/72 italic">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-[#ff72c9] underline decoration-[#b026ff]/60 underline-offset-4 transition-colors hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ inline, children }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) =>
            inline ? (
              <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs text-[#ffd5f2]">
                {children}
              </code>
            ) : (
              <code className="block overflow-x-auto rounded border border-white/10 bg-black/60 p-4 text-xs text-[#ffd5f2]">
                {children}
              </code>
            ),
          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
          hr: () => <hr className="border-white/10" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
