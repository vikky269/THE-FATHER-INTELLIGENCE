import Link from "next/link";
import { notFound } from "next/navigation";
import LiquidityLadder from "@/components/LiquidityLadder";
import { Dot, Meter } from "@/components/ui";
import { MARKET_DESKS, SCENARIOS, SMC, getDesk } from "@/lib/reports";

export function generateStaticParams() {
  return MARKET_DESKS.map((d) => ({ market: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const desk = getDesk(market);
  return { title: desk ? `${desk.name} desk — The Father Intelligence` : "Desk not found" };
}

export default async function MarketPage({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const desk = getDesk(market);
  if (!desk) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
        >
          ← Mission control
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{desk.instrument}</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-[0.08em] text-fg uppercase">
              {desk.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono flex items-center justify-end gap-2.5 text-sm text-fg">
              <Dot signal={desk.signal} />
              {desk.bias}
            </p>
            <p className="font-mono mt-1.5 text-[10px] tracking-[0.14em] text-muted uppercase">
              Conviction {desk.conviction}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/80">{desk.headline}</p>
        <div className="mt-5 max-w-xs">
          <Meter value={desk.conviction} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card">
          <h2 className="eyebrow border-b border-line px-5 py-3.5">What is driving it</h2>
          <ul className="space-y-4 px-5 py-5">
            {desk.drivers.map((d, i) => (
              <li key={d} className="flex gap-4 text-sm leading-relaxed text-fg/85">
                <span className="font-mono text-[10px] text-gold-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="eyebrow border-b border-line px-5 py-3.5">Levels</h2>
          <dl className="px-5 py-2">
            {desk.levels.map((l) => (
              <div
                key={l.label}
                className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0"
              >
                <dt className="text-sm text-muted">{l.label}</dt>
                <dd className="font-mono text-sm text-fg">{l.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Gold gets the full framework treatment — it is the lead instrument. */}
      {desk.slug === "gold" && (
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <LiquidityLadder compact />

          <div className="space-y-8">
            <section className="card">
              <h2 className="eyebrow border-b border-line px-5 py-3.5">Hero vs Dragon™</h2>
              <ul className="space-y-6 px-5 py-5">
                {SCENARIOS.filter((s) => s.path.length > 0).map((s) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-sm tracking-[0.1em] text-fg uppercase">
                        {s.name}
                      </span>
                      <span className="font-mono text-lg text-gold-hi">{s.probability}%</span>
                    </div>
                    <div className="mt-2.5">
                      <Meter value={s.probability} tone={s.tone === "positive" ? "gold" : "royal"} />
                    </div>
                    <p className="font-mono mt-2.5 text-[11px] text-muted">{s.path.join("  →  ")}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card">
              <h2 className="eyebrow border-b border-line px-5 py-3.5">Smart money concepts</h2>
              <div className="px-5 py-5">
                <ul className="space-y-2.5">
                  {SMC.structure.map((s) => (
                    <li key={s} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                      <span className="text-gold-deep">—</span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="rule-gold my-6" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                      Fair value gaps
                    </p>
                    <p className="font-mono mt-2.5 text-sm text-fg">
                      {SMC.fairValueGaps.join("  ·  ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                      Upside targets
                    </p>
                    <p className="font-mono mt-2.5 text-sm text-fg">{SMC.upsideTargets}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <nav className="flex flex-wrap gap-2 border-t border-line pt-6">
        {MARKET_DESKS.filter((d) => d.slug !== desk.slug).map((d) => (
          <Link
            key={d.slug}
            href={`/dashboard/${d.slug}`}
            className="font-mono border border-line px-4 py-2 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
          >
            {d.name}
          </Link>
        ))}
      </nav>

      <p className="text-xs leading-relaxed text-muted">
        Research and analysis only — not investment advice. Levels are framework-derived reference
        zones, not price predictions.
      </p>
    </div>
  );
}
