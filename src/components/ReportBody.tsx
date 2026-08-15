import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a normalised report.
 *
 * The fenced blocks hold ASCII diagrams, bar meters and the command-core
 * box. They must stay monospaced with whitespace preserved, and they must
 * scroll horizontally rather than wrap — a wrapped diagram is unreadable.
 */
export default function ReportBody({ markdown }: { markdown: string }) {
  return (
    <div className="report-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="font-display mt-12 mb-5 text-2xl font-bold tracking-[0.06em] text-fg">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="font-display mt-12 mb-5 border-b border-line pb-3 text-xl font-bold tracking-[0.08em] text-fg">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display mt-9 mb-4 text-base font-bold tracking-[0.12em] text-gold uppercase">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-4 text-[15px] leading-relaxed text-fg/85">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-fg/85">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-fg/85">
              {children}
            </ol>
          ),
          strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
          hr: () => <div className="rule-gold my-10" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-4 hover:text-gold-hi"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-gold/50 pl-4 text-[15px] text-muted italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          th: ({ children }) => (
            <th className="font-mono border-b border-line py-2.5 pr-4 text-left text-[10px] font-normal tracking-[0.16em] text-muted uppercase">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line py-2.5 pr-4 align-top text-fg/85">{children}</td>
          ),
          code: ({ className, children }) => {
            const isBlock = /language-/.test(className ?? "");
            if (!isBlock) {
              return (
                <code className="font-mono rounded-sm bg-sunken px-1.5 py-0.5 text-[13px] text-gold">
                  {children}
                </code>
              );
            }
            return <code className="font-mono">{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="diagram my-6 overflow-x-auto border border-line bg-sunken px-4 py-4 text-[12.5px] leading-[1.65] text-fg/90">
              {children}
            </pre>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

/** Legend for the framework's own provenance markers. */
export function TruthProtocol() {
  const tiers = [
    { mark: "✅", label: "Verified market data" },
    { mark: "🟡", label: "Framework-derived" },
    { mark: "🔵", label: "AI / model probability" },
    { mark: "🟣", label: "Strategic interpretation" },
    { mark: "⚪", label: "Data-gated" },
  ];

  return (
    <aside className="card px-5 py-4">
      <p className="eyebrow">Truth Protocol</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {tiers.map((t) => (
          <li key={t.mark} className="flex items-center gap-2 text-xs text-muted">
            <span aria-hidden>{t.mark}</span>
            {t.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
