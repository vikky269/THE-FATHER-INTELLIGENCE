import Link from "next/link";
import LiquidityLadder from "@/components/LiquidityLadder";
import { Dot, Meter, SIGNAL_COLOR } from "@/components/ui";
import { getSession } from "@/lib/auth";
import {
  BRIEFING,
  COT_POSITIONING,
  EDGEFINDER,
  EXECUTION_PLAN,
  EXECUTIVE_INTELLIGENCE,
  FEAR_GREED,
  GLOBAL_TAPE,
  INSTITUTIONAL_READ,
  INSTITUTIONAL_VAULTS,
  INTERMARKET_CHAIN,
  MACRO_EVENTS,
  MARKET_DESKS,
  PRIMARY_RISK,
  PROBABILITY_SCORES,
  QUANT_ASSESSMENT,
  QUANT_ENGINES,
  SUPPORTING_FACTORS,
  TIMEFRAME_BIAS,
} from "@/lib/reports";

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      <h2 className="eyebrow border-b border-line px-5 py-3.5">{title}</h2>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

const MATRIX_MARK = {
  on: { glyph: "●", color: "#4ade80", label: "Confirmed" },
  watch: { glyph: "◆", color: "#f5c451", label: "Watching" },
  off: { glyph: "—", color: "#5a5668", label: "No effect" },
};

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* --------------------------------------------------------- header */}
      <header>
        <p className="eyebrow">{BRIEFING.title}</p>
        <h1 className="font-display mt-3 text-2xl font-bold tracking-[0.06em] text-fg sm:text-3xl">
          Good morning{session?.name ? `, ${session.name}` : ""}.
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-fg/75">
          {EXECUTIVE_INTELLIGENCE}
        </p>
      </header>

      {/* ------------------------------------------------------- verdict */}
      <section className="card relative overflow-hidden">
        <div className="dotfield" aria-hidden />
        <div className="relative grid gap-px bg-line md:grid-cols-3">
          <div className="bg-surface px-6 py-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              Strategic bias
            </p>
            <p className="font-display mt-3 flex items-center gap-2.5 text-xl font-bold text-fg">
              <Dot signal="positive" />
              {BRIEFING.strategicBias}
            </p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              Overall mission score
            </p>
            <p className="font-display gilt mt-3 text-3xl font-bold">
              {BRIEFING.missionScore.toFixed(1)}
              <span className="text-base text-muted"> /100</span>
            </p>
          </div>
          <div className="bg-surface px-6 py-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              Composite sentiment
            </p>
            <p className="font-display gilt mt-3 text-3xl font-bold">
              {BRIEFING.compositeSentiment}
              <span className="text-base text-muted"> /100</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- desks + map */}
      <div className="grid gap-8 lg:grid-cols-1">
        <Card title="Desk summary">
          <ul className="divide-y divide-line">
            {MARKET_DESKS.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/dashboard/${d.slug}`}
                  className="group flex items-center gap-4 py-3.5 transition hover:opacity-80"
                >
                  <Dot signal={d.signal} />
                  <span className="font-display w-28 shrink-0 text-sm tracking-[0.1em] text-fg uppercase">
                    {d.name}
                  </span>
                  <span className="hidden flex-1 truncate text-sm text-muted sm:block">
                    {d.headline}
                  </span>
                  <span className="font-mono text-xs text-gold">{d.conviction}</span>
                  <span className="text-muted transition group-hover:translate-x-0.5">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <LiquidityLadder compact />
      </div>

      {/* ------------------------------------------------------ full tape */}
      <Card title="Global market dashboard">
        <ul className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_TAPE.map((t) => (
            <li
              key={t.instrument}
              className="flex items-baseline justify-between gap-3 border-b border-line py-2.5"
            >
              <span className="text-sm text-fg/80">{t.instrument}</span>
              <span className="font-mono text-xs" style={{ color: SIGNAL_COLOR[t.signal] }}>
                {t.value}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* ------------------------------------------------- quant + scores */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Quant fund analysis">
          <ul className="space-y-4">
            {QUANT_ENGINES.map((q) => (
              <li key={q.name}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-fg/85">{q.name}</span>
                  <span className="font-mono text-xs text-gold">{q.score}</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={q.score} />
                </div>
              </li>
            ))}
          </ul>

          <div className="rule-gold my-6" />

          <ul className="space-y-2.5">
            {QUANT_ASSESSMENT.map((a) => (
              <li key={a} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="text-gold-deep">—</span>
                {a}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Probability Score™">
          <ul className="space-y-4">
            {PROBABILITY_SCORES.map((p) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-fg/85">{p.name}</span>
                  <span className="font-mono text-xs text-royal-hi">{p.score}%</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={p.score} tone="royal" />
                </div>
              </li>
            ))}
          </ul>

          <div className="rule-gold my-6" />

          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            Timeframe bias
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6">
            {TIMEFRAME_BIAS.map((t) => (
              <li
                key={t.timeframe}
                className="flex items-center justify-between border-b border-line py-2"
              >
                <span className="font-mono text-[11px] text-muted">{t.timeframe}</span>
                <span className="flex items-center gap-2 text-xs text-fg/85">
                  <Dot signal={t.signal} />
                  {t.bias}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* --------------------------------------------------- edgefinder */}
      <Card title="EdgeFinder™ macro matrix">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="font-mono py-2.5 text-left text-[10px] tracking-[0.16em] font-normal text-muted uppercase">
                  Driver
                </th>
                {["Gold", "Bitcoin", "Equities"].map((h) => (
                  <th
                    key={h}
                    className="font-mono py-2.5 text-center text-[10px] tracking-[0.16em] font-normal text-muted uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EDGEFINDER.map((row) => (
                <tr key={row.driver} className="border-b border-line">
                  <td className="py-2.5 text-fg/85">{row.driver}</td>
                  {(["gold", "bitcoin", "equities"] as const).map((k) => {
                    const m = MATRIX_MARK[row[k]];
                    return (
                      <td key={k} className="py-2.5 text-center">
                        <span
                          className="font-mono text-sm"
                          style={{ color: m.color }}
                          title={m.label}
                        >
                          {m.glyph}
                        </span>
                        <span className="sr-only">{m.label}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-muted">
          {Object.values(MATRIX_MARK).map((m) => (
            <span key={m.label}>
              <span style={{ color: m.color }}>{m.glyph}</span> {m.label}
            </span>
          ))}
        </p>
      </Card>

      {/* -------------------------------------------- positioning + flows */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Institutional positioning (COT)">
          <ul className="divide-y divide-line">
            {COT_POSITIONING.map((c) => (
              <li key={c.participant} className="flex items-center justify-between py-3">
                <span className="text-sm text-fg/85">{c.participant}</span>
                <span className="flex items-center gap-2.5 text-sm text-fg">
                  <Dot signal={c.signal} />
                  {c.position}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-l-2 border-gold/50 pl-4 text-sm leading-relaxed text-muted">
            {INSTITUTIONAL_READ}
          </p>
        </Card>

        <Card title="Fear & greed">
          <ul className="space-y-5">
            {FEAR_GREED.map((f) => (
              <li key={f.market}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-fg/85">{f.market}</span>
                  <span className="font-mono text-xs text-gold">{f.reading}</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={f.reading} tone={f.reading >= 60 ? "gold" : "royal"} />
                </div>
              </li>
            ))}
          </ul>

          <div className="rule-gold my-6" />

          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            Intermarket chain
          </p>
          <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
            {INTERMARKET_CHAIN.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="font-mono border border-line px-2.5 py-1.5 text-[11px] text-fg/85">
                  {step}
                </span>
                {i < INTERMARKET_CHAIN.length - 1 && (
                  <span className="text-gold-deep" aria-hidden>
                    ›
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* ------------------------------------------------ verdict + plan */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Final institutional verdict">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            Supporting factors
          </p>
          <ul className="mt-4 space-y-2.5">
            {SUPPORTING_FACTORS.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                <span style={{ color: SIGNAL_COLOR.positive }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="rule-gold my-6" />

          <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: SIGNAL_COLOR.negative }}>
            Primary risk
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{PRIMARY_RISK}</p>
        </Card>

        <Card title="Execution plan">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Strategic</p>
          <p className="mt-3 text-sm leading-relaxed text-fg/85">
            {EXECUTION_PLAN.strategic}
          </p>

          <div className="rule-gold my-6" />

          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Tactical</p>
          <ol className="mt-4 space-y-3">
            {EXECUTION_PLAN.tactical.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                <span className="font-mono text-[10px] text-gold-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* -------------------------------------------------- events + vaults */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Upcoming macro events">
          <ul className="divide-y divide-line">
            {MACRO_EVENTS.map((e) => (
              <li key={e.event} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-fg/85">{e.event}</span>
                <span className="font-mono shrink-0 text-xs tracking-widest text-gold">
                  {"★".repeat(e.impact)}
                  <span className="text-muted/40">{"★".repeat(5 - e.impact)}</span>
                  <span className="sr-only">{e.impact} out of 5 impact</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Institutional Vaults™">
          <ul className="grid gap-2.5">
            {INSTITUTIONAL_VAULTS.map((v) => (
              <li
                key={v}
                className="font-mono border border-line bg-sunken px-4 py-2.5 text-[11px] tracking-[0.1em] text-fg/80 uppercase"
              >
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Vault zones sit below 4000 and describe where the framework expects strategic
            accumulation, not where price is expected to go.
          </p>
        </Card>
      </div>

      <p className="border-t border-line pt-6 text-xs leading-relaxed text-muted">
        Research and analysis only — not investment advice. Framework zones and scenario
        probabilities are model outputs rather than statistically validated forecasts. Trading
        carries substantial risk of loss.
      </p>
    </div>
  );
}
