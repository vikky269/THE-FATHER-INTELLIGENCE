import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Tape from "@/components/Tape";
import LiquidityLadder from "@/components/LiquidityLadder";
import LatestReports from "@/components/LatestReports";
import VideoEmbed from "@/components/VideoEmbed";
import { Dot, GhostButton, GoldButton, Meter, SectionHead, Wordmark } from "@/components/ui";
import {
  BRIEFING,
  CAUSALITY_OUTCOMES,
  CLASSIFICATION,
  COMMAND_ENGINES,
  EXECUTIVE_INTELLIGENCE,
  MACRO_CAUSALITY,
  MARKET_DESKS,
  QUARTERLY_CURRENT,
  QUARTERLY_THEORY,
  SCENARIOS,
} from "@/lib/reports";

/**
 * Revalidated every 5 minutes; publishing also calls revalidatePath("/")
 * so a new briefing appears immediately rather than on the next window.
 */
export const revalidate = 300;

/**
 * Supplied by the brand owner. Set NEXT_PUBLIC_YOUTUBE_URL to any YouTube
 * link (watch, youtu.be, shorts or a bare ID). When unset the section is
 * omitted entirely rather than rendering an empty frame.
 */
const VIDEO_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "";

export default async function Home() {
  return (
    <>
      <SiteNav />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="rise">
            <p className="eyebrow">
              Mission Control · {BRIEFING.version} · {BRIEFING.session}
            </p>

            <h1 className="font-display mt-6 text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl">
              <span className="gilt">Intelligence</span>
              <br />
              <span className="text-fg">before decisions.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-fg/70">
              One institutional-grade macro briefing, published ahead of the London and New York
              sessions. It reads the whole board at once — rates, the dollar, energy, metals,
              equities and crypto — and tells you which chain of cause and effect is actually
              running today.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <GoldButton href="/sign-up">Create your account</GoldButton>
              <GhostButton href="/reports">Read previous reports </GhostButton>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px border border-line bg-line">
              {[
                { k: "Mission score", v: BRIEFING.missionScore.toFixed(1) },
                { k: "Framework confidence", v: `${BRIEFING.frameworkConfidence}` },
                { k: "Composite sentiment", v: `${BRIEFING.compositeSentiment}` },
              ].map((s) => (
                <div key={s.k} className="bg-base px-4 py-4">
                  <dt className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                    {s.k}
                  </dt>
                  <dd className="font-display gilt mt-2 text-2xl font-bold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The signature: today's board, drawn to scale */}
          <div className="rise" style={{ animationDelay: "140ms" }}>
            <LiquidityLadder />
          </div>
        </div>
      </section>

      <Tape />

      {/* -------------------------------------------------------- briefing */}
      <section id="briefing" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <SectionHead
          index="I"
          title="Today's briefing"
          kicker={`${BRIEFING.dateLabel} · ${BRIEFING.session}. Six engines are scored independently, then reconciled into a single strategic bias.`}
        />

        <div className="card relative overflow-hidden p-6 sm:p-8">
          <p className="max-w-3xl text-[15px] leading-relaxed text-fg/85">
            {EXECUTIVE_INTELLIGENCE}
          </p>

          <div className="rule-gold my-8" />

          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {COMMAND_ENGINES.map((e) => (
              <li key={e.name} className="bg-surface px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {e.name}
                  </span>
                  <span className="font-mono text-sm text-gold">{e.score}</span>
                </div>
                <p className="mt-2.5 flex items-center gap-2 text-sm text-fg">
                  <Dot signal={e.signal} />
                  {e.status}
                </p>
                <div className="mt-4">
                  <Meter value={e.score} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- engine */}
      <section id="engine" className="scroll-mt-24 border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHead
            index="II"
            title="How the call is built"
            kicker="Every briefing starts from one causal chain. If the chain breaks, the call changes — that is the whole discipline."
          />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
            {/* Causality chain */}
            <div className="card p-6 sm:p-8">
              <p className="eyebrow">Macro Causality Engine</p>

              <ol className="mt-7 space-y-0">
                {MACRO_CAUSALITY.map((step, i) => (
                  <li key={step}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-gold-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-sm tracking-[0.1em] text-fg uppercase">
                        {step}
                      </span>
                    </div>
                    <div className="my-1 ml-[9px] h-6 w-px bg-gradient-to-b from-gold/50 to-royal/40" />
                  </li>
                ))}
              </ol>

              <div className="mt-2 grid gap-px bg-line sm:grid-cols-3">
                {CAUSALITY_OUTCOMES.map((o) => (
                  <div key={o.asset} className="bg-surface-2 px-4 py-4">
                    <p className="font-display flex items-center gap-2 text-sm tracking-[0.1em] uppercase">
                      <span className={o.direction === "up" ? "text-gold-hi" : "text-muted"}>
                        {o.direction === "up" ? "↑" : "→"}
                      </span>
                      <span className="text-fg">{o.asset}</span>
                    </p>
                    <p className="mt-1.5 text-xs text-muted">{o.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Probability engine + cycle */}
            <div className="space-y-8">
              <div className="card p-6 sm:p-8">
                <p className="eyebrow">AI Probability Engine™</p>
                <p className="mt-3 text-sm text-muted">
                  Scenario weightings for the lead instrument, gold.
                </p>

                <ul className="mt-7 space-y-6">
                  {SCENARIOS.map((s) => (
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
                      {s.path.length > 0 && (
                        <p className="mt-2.5 font-mono text-[11px] text-muted">
                          {s.path.join("  →  ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6 sm:p-8">
                <p className="eyebrow">Quarterly Theory™</p>
                <ol className="mt-6 flex flex-wrap gap-x-2 gap-y-3">
                  {QUARTERLY_THEORY.map((phase, i) => (
                    <li key={phase} className="flex items-center gap-2">
                      <span
                        className={`font-mono border px-2.5 py-1.5 text-[10px] tracking-[0.1em] uppercase ${
                          i === QUARTERLY_CURRENT
                            ? "border-gold bg-gold/14 text-gold-hi"
                            : i < QUARTERLY_CURRENT
                              ? "border-line text-muted line-through decoration-gold-deep"
                              : "border-line text-muted"
                        }`}
                      >
                        {phase}
                      </span>
                      {i < QUARTERLY_THEORY.length - 1 && (
                        <span className="text-gold-deep" aria-hidden>
                          ›
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-xs text-muted">
                  The cycle currently sits in Expansion. Premium Delivery is the next phase, not the
                  current one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- coverage */}
      <section id="coverage" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <SectionHead
          index="III"
          title="Six desks, one board"
          kicker="Each desk carries its own bias and conviction score. Full levels, targets and invalidation points are inside the dashboard."
        />

        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_DESKS.map((d) => (
            <li key={d.slug} className="group bg-base p-6 transition hover:bg-surface">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg tracking-[0.1em] text-fg uppercase">
                  {d.name}
                </span>
                <span className="font-mono text-[10px] text-muted">{d.instrument}</span>
              </div>

              <p className="mt-4 flex items-center gap-2 font-mono text-xs text-fg/85">
                <Dot signal={d.signal} />
                {d.bias}
              </p>

              <p className="mt-4 min-h-[3.5rem] text-sm leading-relaxed text-muted">{d.headline}</p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1">
                  <Meter value={d.conviction} />
                </div>
                <span className="font-mono text-[10px] text-gold">{d.conviction}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------- video */}
      {VIDEO_URL && (
        <section id="how-it-works" className="border-y border-line bg-surface/40">
          <div className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20">
            <SectionHead
              index="IV"
              title="How it works"
              kicker="A short walkthrough of the framework and what a briefing actually tells you."
            />
            <VideoEmbed url={VIDEO_URL} />
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- reports */}
      <LatestReports />

      {/* -------------------------------------------------- classification */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHead
            index="VI"
            title="What is fact, what is framework"
            kicker="Every line in a briefing is labelled by where it came from. You should always know which part is a market price and which part is a model output."
          />

          <ul className="grid gap-px bg-line lg:grid-cols-3">
            {CLASSIFICATION.map((c) => (
              <li key={c.tier} className="bg-surface px-6 py-7">
                <p className="flex items-center gap-2.5">
                  <Dot signal={c.tone} />
                  <span className="font-display text-sm tracking-[0.14em] text-fg uppercase">
                    {c.tier}
                  </span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- access */}
      <section id="access" className="relative scroll-mt-24 overflow-hidden">
        <div className="dotfield" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="eyebrow">Members only</p>
          <h2 className="font-display mt-6 text-3xl leading-tight font-bold sm:text-4xl">
            <span className="text-fg">The full board is</span>{" "}
            <span className="gilt">behind the door.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-fg/70">
            Members get every desk in full: institutional positioning, liquidity zones, timeframe
            bias, fair value gaps, the execution plan and the risk that would invalidate it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <GoldButton href="/sign-up">Create your account</GoldButton>
            <GhostButton href="/sign-in">Sign in</GhostButton>
            <GhostButton href="mailto:access@thefatherintelligence.com">Request access</GhostButton>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- footer */}
      <footer className="border-t border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Wordmark size={38} />
              <p className="font-mono mt-5 text-[10px] tracking-[0.2em] text-gold-deep uppercase">
                Intelligence before decisions.™
              </p>
            </div>

            <div className="max-w-md">
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                Framework
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted">{BRIEFING.framework}</p>
            </div>
          </div>

          <div className="rule-gold my-10" />

          <p className="max-w-3xl text-xs leading-relaxed text-muted">
            <strong className="text-fg/80">Risk notice.</strong> The Father Intelligence
            publishes market research and analysis. Nothing here is investment advice, a
            recommendation, or an offer to buy or sell any instrument. Scenario probabilities and
            framework zones are model outputs, not statistically validated forecasts, and no method
            can predict market movements. Trading carries substantial risk of loss. Make your own
            decisions, and take professional advice where you need it.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] text-muted">
              © {new Date().getFullYear()} The Father Intelligence. All rights reserved.
            </p>
            <Link
              href="/sign-in"
              className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase hover:text-gold-hi"
            >
              Member sign in →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
