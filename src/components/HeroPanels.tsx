import { BRIEFING, GLOBAL_TAPE, COMMAND_ENGINES } from "@/lib/reports";
import { SIGNAL_COLOR } from "./ui";

/* ------------------------------------------------------------ stat card */

const ICONS = {
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.7-7 10-4-2.3-7-5.5-7-10V6l7-3z" />,
  pulse: <path d="M3 12h3.5l2.5-6 4 12 2.5-6H21" />,
};

export function StatCard({
  icon,
  value,
  label,
  status,
  progress,
}: {
  icon: keyof typeof ICONS;
  value: string;
  label: string;
  status: string;
  progress: number;
}) {
  return (
    <div className="card px-5 py-5">
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 text-gold"
          aria-hidden
        >
          {ICONS[icon]}
        </svg>
        <span className="font-display gilt text-3xl leading-none font-bold">{value}</span>
      </div>

      <p className="font-mono mt-4 text-[10px] tracking-[0.16em] text-fg uppercase">{label}</p>
      <p className="font-mono mt-1.5 text-[10px] tracking-[0.12em] text-gold uppercase">{status}</p>

      <div className="meter-track mt-3.5">
        <div className="meter-fill" data-tone="gold" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------- regime panel */

export function RegimePanel() {
  const rows = COMMAND_ENGINES.slice(0, 4);

  return (
    <div className="card px-5 py-5">
      <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">Global regime</p>

      <p className="font-display gilt mt-2 text-xl leading-tight font-bold tracking-[0.06em] uppercase sm:text-2xl">
        {BRIEFING.strategicBias}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
        {rows.map((r) => (
          <div key={r.name}>
            <dt className="font-mono text-[9px] leading-tight tracking-[0.12em] text-muted uppercase">
              {r.name}
            </dt>
            <dd
              className="font-mono mt-1.5 text-[12px] tracking-[0.08em] uppercase"
              style={{ color: SIGNAL_COLOR[r.signal] }}
            >
              {r.status}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ----------------------------------------------------------- market tape */

/**
 * Scrolling instrument ticker.
 *
 * Levels come from the last published briefing, not a live feed, so the
 * caption says so plainly — a ticker that moves implies streaming data, and
 * on a paid financial product that implication needs correcting in text.
 *
 * The marquee is aria-hidden and mirrored by a screen-reader-only list:
 * assistive tech gets a static, readable version instead of a moving one.
 */
export function MarketTape() {
  const items = [...GLOBAL_TAPE, ...GLOBAL_TAPE];

  return (
    <section id="tape" className="scroll-mt-24">
      <div className="tape-rail relative overflow-hidden border-y border-line bg-surface/70 py-3">
        <div className="tape-track" aria-hidden>
          {items.map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 px-6">
              <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                {t.instrument}
              </span>
              <span
                className="font-mono text-[12px] font-medium"
                style={{ color: SIGNAL_COLOR[t.signal] }}
              >
                {t.value}
              </span>
              <span className="text-gold-deep">·</span>
            </span>
          ))}
        </div>

        <ul className="sr-only">
          {GLOBAL_TAPE.map((t) => (
            <li key={t.instrument}>
              {t.instrument}: {t.value}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent" />
      </div>

      <p className="font-mono mx-auto max-w-6xl px-5 py-2.5 text-[10px] tracking-[0.12em] text-muted uppercase">
        Levels as published · {BRIEFING.dateLabel} · not a live feed
      </p>
    </section>
  );
}
