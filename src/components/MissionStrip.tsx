import Link from "next/link";
import { Dot } from "./ui";
import TimeStamp from "./TimeStamps";
import type { ReportRow } from "@/lib/db";
import type { PublishingStats } from "@/lib/db";

const SCOREBOARD_LINE = "Reality owns the scoreboard.";

/**
 * Compact live-status strip beneath the hero copy.
 *
 * Deliberately built from real counts and the latest published report
 * rather than analytical fields like Hero vs Dragon or Capital Permission
 * — those only exist inside generated markdown bodies today, and reading
 * them back out with regex would risk showing a wrong number on the one
 * page whose whole pitch is data integrity. Once the generator writes a
 * structured report_data column, those fields belong here instead.
 */
export default function MissionStrip({
  stats,
  latest,
}: {
  stats: PublishingStats;
  latest: ReportRow | null;
}) {
  const items: { label: string; value: React.ReactNode; signal: "positive" | "caution" | "neutral" }[] = [
    {
      label: "Latest desk",
      value: latest ? latest.category : "—",
      signal: latest ? "positive" : "neutral",
    },
    {
      label: "Latest briefing",
      value: latest ? (
        <Link href={`/reports/${latest.slug}`} className="hover:text-gold truncate">
          {latest.title}
        </Link>
      ) : (
        "Awaiting first report"
      ),
      signal: latest ? "positive" : "caution",
    },
    {
      label: "Last updated",
      value: latest ? <TimeStamp iso={latest.created_at} /> : "—",
      signal: "neutral",
    },
    {
      label: "Published, 30 days",
      value: String(stats.publishedLast30Days),
      signal: stats.publishedLast30Days > 0 ? "positive" : "caution",
    },
    {
      label: "Active desks",
      value: String(stats.activeDesks),
      signal: stats.activeDesks > 0 ? "positive" : "caution",
    },
  ];

  return (
    <div className="mt-14">
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item.label} className="min-w-0 bg-base px-4 py-4">
            <p className="font-mono text-[9px] leading-tight tracking-[0.16em] text-muted uppercase">
              {item.label}
            </p>
            <p className="mt-2.5 flex items-center gap-2 truncate font-mono text-[13px] text-fg">
              <Dot signal={item.signal} />
              {item.value}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {[
            { mark: "✅", label: "Verified data" },
            { mark: "🟡", label: "Framework-derived" },
            { mark: "🔵", label: "Forecasts" },
            { mark: "🟣", label: "Strategic interpretation" },
          ].map((t) => (
            <li key={t.mark} className="font-mono flex items-center gap-1.5 text-[10px] text-muted">
              <span aria-hidden>{t.mark}</span>
              {t.label}
            </li>
          ))}
        </ul>

        <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
          {SCOREBOARD_LINE}
        </p>
      </div>
    </div>
  );
}