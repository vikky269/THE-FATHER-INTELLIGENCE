import Link from "next/link";
import { getLatestMarketTape } from "@/lib/live-tape";
import { formatReportDate } from "./ReportCard";

/**
 * Scrolling ticker built from a real report's report_data — the same
 * verified snapshot that was fed to the model when that report generated.
 *
 * Renders nothing when there is no markets report with structured data
 * yet, rather than falling back to any placeholder figures. A missing
 * section is honest; a stale or invented one is not.
 */
export default async function LiveMarketTape() {
  const latest = await getLatestMarketTape().catch(() => null);
  if (!latest || latest.data.tape.length === 0) return null;

  const items = [...latest.data.tape, ...latest.data.tape]; // duplicated for the seamless scroll

  return (
    <section id="markets" className="scroll-mt-24">
      <div className="tape-rail relative overflow-hidden border-y border-line bg-surface/70 py-3">
        <div className="tape-track" aria-hidden>
          {items.map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 px-6">
              <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                {t.instrument}
              </span>
              <span className="font-mono text-[12px] font-medium text-fg">{t.value}</span>
              {!t.live && <span className="font-mono text-[9px] text-gold-deep">EOD</span>}
              <span className="text-gold-deep">·</span>
            </span>
          ))}
        </div>

        {/* Static, readable version for assistive tech — the marquee above is aria-hidden */}
        <ul className="sr-only">
          {latest.data.tape.map((t) => (
            <li key={t.instrument}>
              {t.instrument}: {t.value}
              {!t.live ? " (end of day)" : ""}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent" />
      </div>

      <p className="font-mono mx-auto max-w-6xl px-5 py-2.5 text-[10px] tracking-[0.12em] text-muted uppercase">
        As published ·{" "}
        <Link href={`/reports/${latest.slug}`} className="hover:text-gold">
          {formatReportDate(latest.reportDate)}
        </Link>{" "}
        · not a live feed
      </p>
    </section>
  );
}
