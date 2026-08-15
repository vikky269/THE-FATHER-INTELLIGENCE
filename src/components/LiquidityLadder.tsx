import { LIQUIDITY_ZONES, SPOT_GOLD, FRAMEWORK_PIVOT } from "@/lib/reports";

/**
 * The Liquidity Heat Map(TM) rendered as a vertical price ladder.
 *
 * Zone heights are proportional to their real price ranges, so the shape of
 * the ladder is information rather than decoration. Colours come from
 * `[data-tier]` rules in globals.css so both themes are handled in CSS —
 * the only inline styles here are the geometry, which is data-driven.
 */
export default function LiquidityLadder({ compact = false }: { compact?: boolean }) {
  const top = LIQUIDITY_ZONES[0].high;
  const bottom = LIQUIDITY_ZONES[LIQUIDITY_ZONES.length - 1].low;
  const span = top - bottom;
  const pct = (v: number) => ((v - bottom) / span) * 100;

  return (
    <figure className="card relative overflow-hidden rounded-sm">
      <div className="dotfield" aria-hidden />

      <figcaption className="relative flex items-baseline justify-between border-b border-line px-5 py-4">
        <span className="eyebrow">Liquidity Heat Map™</span>
        <span className="font-mono text-[11px] text-muted">XAU/USD · USD per oz</span>
      </figcaption>

      <div
        className="relative px-2 py-4"
        style={{ height: compact ? 320 : 420 }}
        role="img"
        aria-label={`Gold liquidity zones from Institutional Vaults below 4000 up to Golden Throne above 4500. Spot is ${SPOT_GOLD} dollars, inside the Expansion Bridge zone.`}
      >
        {LIQUIDITY_ZONES.map((z, i) => (
          <div
            key={z.name}
            className="ladder-zone absolute inset-x-2"
            data-tier={z.tier}
            style={{
              bottom: `${pct(z.low)}%`,
              height: `${pct(z.high) - pct(z.low)}%`,
              animationDelay: `${i * 70}ms`,
            }}
          >
            <span className="zone-name font-display text-[11px] tracking-[0.14em] uppercase sm:text-xs">
              {z.name}
            </span>
            <span className="font-mono text-[11px] text-fg/70">{z.label}</span>
          </div>
        ))}

        {/* Live spot marker */}
        <div
          className="marker-slide pointer-events-none absolute inset-x-2 z-20"
          style={{ bottom: `${pct(SPOT_GOLD)}%` }}
        >
          <div className="relative">
            <div className="spot-line" />
            <span className="absolute -top-2.5 right-0 bg-base px-2 font-mono text-[11px] font-bold text-gold-hi">
              SPOT {SPOT_GOLD.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Framework pivot */}
        <div
          className="pointer-events-none absolute inset-x-2 z-10"
          style={{ bottom: `${pct(FRAMEWORK_PIVOT)}%` }}
        >
          <div className="h-px w-full border-t border-dashed border-royal/60" />
          <span className="absolute -top-2.5 left-0 bg-base px-2 font-mono text-[10px] text-royal">
            PIVOT {FRAMEWORK_PIVOT}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-4 border-t border-line px-5 py-3">
        <p className="font-mono text-[10px] leading-relaxed text-muted">
          Zone heights are drawn to scale. Framework-derived, not a price forecast.
        </p>
      </div>
    </figure>
  );
}
