import Image from "next/image";
import type { Signal } from "@/lib/reports";

/**
 * Signal colours resolve through CSS variables rather than hex literals,
 * so they follow the active theme. Never inline a hex here.
 */
export const SIGNAL_COLOR: Record<Signal, string> = {
  positive: "var(--signal-positive)",
  caution: "var(--signal-caution)",
  negative: "var(--signal-negative)",
  neutral: "var(--signal-neutral)",
};

export function Crest({ size = 34 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="The Father Intelligence"
      width={size}
      height={size}
      priority
      className="rounded-[3px]"
    />
  );
}

export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <Crest size={size} />
      <span className="leading-none">
        <span className="font-display block text-[13px] font-bold tracking-[0.3em] text-fg">
          THE FATHER
        </span>
        <span className="font-mono block text-[9px] tracking-[0.34em] text-royal">INTELLIGENCE</span>
      </span>
    </span>
  );
}

export function Dot({ signal }: { signal: Signal }) {
  return <span aria-hidden className="signal-dot" data-signal={signal} />;
}

export function Meter({ value, tone = "gold" }: { value: number; tone?: "gold" | "royal" }) {
  return (
    <div className="meter-track">
      <div className="meter-fill" data-tone={tone} style={{ width: `${value}%` }} />
    </div>
  );
}

export function SectionHead({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-gold-deep">{index}</span>
        <span className="rule-gold w-10" />
        <h2 className="font-display text-xl font-bold tracking-[0.12em] text-fg uppercase sm:text-2xl">
          {title}
        </h2>
      </div>
      {kicker && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{kicker}</p>}
    </header>
  );
}

export function GoldButton({
  href,
  children,
  type,
}: {
  href?: string;
  children: React.ReactNode;
  type?: "submit";
}) {
  if (type === "submit") {
    return (
      <button type="submit" className="btn-gold w-full">
        {children}
      </button>
    );
  }
  return (
    <a href={href} className="btn-gold">
      {children}
    </a>
  );
}

export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn-ghost">
      {children}
    </a>
  );
}
