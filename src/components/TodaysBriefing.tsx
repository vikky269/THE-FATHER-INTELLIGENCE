import Link from "next/link";
import LiquidityLadder from "./LiquidityLadder";
import { SectionHead } from "./ui";
import { formatReportDate } from "./ReportCard";
import { BRIEFING, EXECUTIVE_INTELLIGENCE } from "@/lib/reports";
import type { ReportRow } from "@/lib/db";

/**
 * The latest published briefing, headlined on the landing page.
 *
 * Driven by the database rather than the static BRIEFING constant, so the
 * date and session can never disagree with what is actually published. If
 * nothing has been published yet it falls back to the sample content, so a
 * pre-launch page still reads as finished.
 *
 * The Liquidity Heat Map is gold-specific, so it only appears when the
 * latest report is a markets briefing — a XAU/USD price ladder beside a
 * music report would be nonsense.
 */
export default function TodaysBriefing({ report }: { report: ReportRow | null }) {
  const isMarkets = report ? report.category === "markets" : true;

  const dateLabel = report ? formatReportDate(report.report_date) : BRIEFING.dateLabel;
  const session = report?.session_label ?? BRIEFING.session;
  const title = report?.title ?? "Today's briefing";
  const body = report?.excerpt ?? EXECUTIVE_INTELLIGENCE;

  return (
    <section id="briefing" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHead
        index="I"
        title={report ? "Latest briefing" : "Today's briefing"}
        kicker={`${dateLabel}${session ? ` · ${session}` : ""}`}
      />

      <div className={isMarkets ? "grid gap-8 lg:grid-cols-[1fr_400px]" : ""}>
        <article className="card flex flex-col p-6 sm:p-8">
          {report && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                {report.category}
              </span>
              {report.framework_version && (
                <span className="font-mono border border-line px-2 py-0.5 text-[10px] text-muted">
                  {report.framework_version}
                </span>
              )}
            </div>
          )}

          <h3 className="font-display text-xl leading-snug font-bold text-fg sm:text-2xl">
            {title}
          </h3>

          <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{body}</p>

          {report && (
            <Link
              href={`/reports/${report.slug}`}
              className="font-mono mt-7 inline-block text-[11px] tracking-[0.18em] text-gold uppercase hover:text-gold-hi"
            >
              Read the full briefing →
            </Link>
          )}
        </article>

        {isMarkets && <LiquidityLadder compact />}
      </div>
    </section>
  );
}