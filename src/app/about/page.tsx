import SiteNav from "@/components/SiteNav";
import { SectionHead } from "@/components/ui";

export const metadata = {
  title: "About",
  description:
    "The Father Intelligence is an independent intelligence, analytics and research platform connecting global markets, macroeconomics, AI and culture into one decision system.",
  alternates: { canonical: "/about" },
};

const DISCIPLINES = [
  { label: "Global Macro Intelligence", body: "Economies, central banks, inflation, interest rates, currencies, commodities, liquidity and global capital flows." },
  { label: "Financial Market Analytics", body: "Equities, Gold, FX, Bitcoin, digital assets and major cross-asset relationships." },
  { label: "Quantitative & AI Intelligence", body: "Probability models, data analysis, forecasting systems, regime detection and decision-support technology." },
  { label: "Institutional & Liquidity Intelligence", body: "Positioning, market structure, capital flows, important price levels and changes in market behavior." },
  { label: "Economic Intelligence", body: "How economic conditions, policy decisions and structural changes influence businesses, markets and society." },
  { label: "Business & Technology Intelligence", body: "Monitoring industries, emerging technologies, competitive landscapes and new economic opportunities." },
  { label: "Culture & Trend Intelligence", body: "Shifts in attention, consumer behavior, entertainment, digital culture and emerging global narratives." },
  { label: "Risk & Decision Intelligence", body: "Separating opportunity from speculation through probabilities, invalidation, expected value and disciplined capital allocation." },
];

const CHAIN = ["Data", "Context", "Causality", "Probability", "Risk", "Decision", "Outcome", "Learning"];

export default function AboutPage() {
  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">About</p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-[0.04em] text-fg sm:text-4xl">
          The Father Intelligence<span className="text-gold">™</span>
        </h1>
        <p className="font-display gilt mt-3 text-lg">Intelligence before decisions.</p>

        <div className="mt-10 space-y-5 text-[15px] leading-relaxed text-fg/85">
          <p>
            The Father Intelligence™ is an independent intelligence, analytics and research
            platform built to help people see what matters before it becomes obvious.
          </p>
          <p>
            We operate at the intersection of global markets, macroeconomics, financial data,
            artificial intelligence, quantitative analysis, business intelligence, technology,
            culture and emerging trends.
          </p>
          <p>
            The world produces more information than any individual can reasonably process. Prices
            move. Liquidity shifts. Narratives change. Economies evolve. Technology accelerates.
            Opportunities appear and disappear. Our mission is to turn that noise into structured
            intelligence for better decisions.
          </p>
        </div>

        <div className="rule-gold my-10" />

        <h2 className="font-display text-xl font-bold tracking-[0.06em] text-fg uppercase">
          We do not simply ask what is happening
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-fg/85">We go deeper:</p>
        <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-fg/85">
          {[
            "Why is it happening?",
            "What changed?",
            "What is driving it?",
            "What happens next?",
            "What are the probabilities?",
            "Where are the risks?",
            "And what action does the evidence actually permit?",
          ].map((q) => (
            <li key={q} className="flex gap-3">
              <span className="text-gold-deep">—</span>
              {q}
            </li>
          ))}
        </ul>

        <div className="rule-gold my-10" />

        <h2 className="font-display text-xl font-bold tracking-[0.06em] text-fg uppercase">
          See the system, not just the signal
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-fg/85">
          <p>Markets and economies do not operate in isolation.</p>
          <p>
            Interest rates affect currencies. Currencies affect commodities. Liquidity affects
            equities and digital assets. Inflation changes policy. Policy changes capital flows.
            Technology changes industries. Culture changes demand. Data reveals those transitions
            before many narratives catch up.
          </p>
          <p>
            The Father Intelligence™ connects these moving parts into one broader
            decision-making system, combining macroeconomic analysis, market structure, liquidity,
            institutional positioning, quantitative models, intermarket relationships, sentiment,
            probability analysis, risk management, historical behavior, artificial intelligence and
            human strategic judgment.
          </p>
          <p className="font-display text-lg text-fg">
            The objective is not more information. The objective is <span className="gilt">better intelligence</span>.
          </p>
        </div>

        <div className="rule-gold my-10" />

        <h2 className="font-display text-xl font-bold tracking-[0.06em] text-fg uppercase">
          Our intelligence system
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-fg/85">
          Our work is built around several core disciplines.
        </p>

        <div className="mt-6 grid gap-px bg-line sm:grid-cols-2">
          {DISCIPLINES.map((d) => (
            <div key={d.label} className="bg-surface px-5 py-5">
              <p className="font-display text-sm font-bold tracking-[0.04em] text-gold">
                {d.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
            </div>
          ))}
        </div>

        <div className="rule-gold my-10" />

        <h2 className="font-display text-xl font-bold tracking-[0.06em] text-fg uppercase">
          From data to decision
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-fg/85">
          Our philosophy follows a simple chain, and every serious intelligence system should
          learn from what happens after the forecast.
        </p>

        <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
          {CHAIN.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="font-mono border border-line px-2.5 py-1.5 text-[10px] tracking-[0.1em] text-fg uppercase">
                {step}
              </span>
              {i < CHAIN.length - 1 && <span className="text-gold-deep">→</span>}
            </li>
          ))}
        </ol>

        <p className="mt-6 text-[15px] leading-relaxed text-fg/85">
          The Father Intelligence™ is being developed as more than a publishing platform — the
          long-term architecture is designed around a closed-loop system capable of recording
          forecasts, comparing expectations with realized outcomes, measuring forecast quality,
          identifying changing regimes, evaluating signal performance and continuously improving
          future decisions.
        </p>
        <p className="font-display mt-4 text-lg text-fg">
          The goal is not artificial certainty. The goal is <span className="gilt">better-calibrated judgment</span>.
        </p>

        <div className="rule-gold my-10" />

        <h2 className="font-display text-xl font-bold tracking-[0.06em] text-fg uppercase">
          Independent thinking
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-fg/85">
          <p>We believe intelligence becomes most valuable when it is willing to challenge consensus.</p>
          <p>
            We study multiple scenarios rather than becoming emotionally attached to a single
            prediction. We distinguish verified information, model-derived analysis, probability
            estimates and strategic interpretation so readers can understand what is known, what is
            inferred and what remains uncertain.
          </p>
          <p>
            When reliable information is unavailable, we would rather identify the gap than
            manufacture confidence.
          </p>
          <p className="font-display text-lg text-fg">
            Because credibility is not created by always appearing certain.
            <br />
            It is created by <span className="gilt">knowing where certainty ends</span>.
          </p>
        </div>

        <div className="rule-gold my-10" />

        <p className="text-center">
          <span className="font-display gilt block text-2xl font-bold tracking-[0.06em]">
            THE FATHER INTELLIGENCE™
          </span>
          <span className="font-mono mt-3 block text-[11px] tracking-[0.2em] text-gold-deep uppercase">
            Intelligence before decisions.
          </span>
          <span className="mt-4 block text-sm text-muted">
            See the market. Understand the system. Anticipate the change. Decide with intelligence.
          </span>
        </p>
      </main>
    </>
  );
}