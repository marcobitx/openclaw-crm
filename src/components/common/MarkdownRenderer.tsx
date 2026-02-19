// src/components/common/MarkdownRenderer.tsx
// react-markdown wrapper with remark-gfm

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold text-surface-100 mt-6 mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold text-surface-100 mt-5 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold text-surface-200 mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-[13px] text-surface-300 leading-relaxed mb-3">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-[13px] text-surface-300 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-[13px] text-surface-300 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-[13px] text-surface-300">{children}</li>,
          code: ({ className: cn, children, ...props }) => {
            const isInline = !cn;
            if (isInline) {
              return <code className="px-1.5 py-0.5 rounded bg-surface-800 text-brand-300 text-[12px] font-mono">{children}</code>;
            }
            return (
              <pre className="bg-surface-800/80 rounded-lg p-4 overflow-x-auto mb-3 border border-surface-700/30">
                <code className="text-[12px] font-mono text-surface-200">{children}</code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-500/30 pl-4 my-3 text-surface-400 italic">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-[12px] border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="text-left py-2 px-3 bg-surface-800/50 text-surface-300 font-semibold border-b border-surface-700/30">{children}</th>,
          td: ({ children }) => <td className="py-2 px-3 text-surface-400 border-b border-surface-800/30">{children}</td>,
          hr: () => <hr className="divider my-4" />,
          strong: ({ children }) => <strong className="text-surface-100 font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-surface-300">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
