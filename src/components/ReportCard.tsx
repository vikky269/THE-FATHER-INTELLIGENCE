import Link from "next/link";
import type { ReportRow } from "@/lib/db";

export function formatReportDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Feed row used on the landing page and the public archive. */
export default function ReportCard({ report }: { report: ReportRow }) {
  return (
    <li className="bg-base transition hover:bg-surface">
      <Link href={`/reports/${report.slug}`} className="group block px-5 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
            {report.category}
          </span>
          <span className="text-muted" aria-hidden>
            ·
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
            {formatReportDate(report.report_date)}
          </span>
          {report.framework_version && (
            <span className="font-mono border border-line px-2 py-0.5 text-[10px] text-muted">
              {report.framework_version}
            </span>
          )}
          {report.visibility === "members" && (
            <span className="font-mono border border-gold/40 px-2 py-0.5 text-[9px] tracking-[0.14em] text-gold uppercase">
              Members
            </span>
          )}
        </div>

        <h3 className="font-display mt-3 text-lg leading-snug font-bold text-fg group-hover:text-gold">
          {report.title}
        </h3>

        {report.session_label && (
          <p className="font-mono mt-1.5 text-[11px] text-muted">{report.session_label}</p>
        )}

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{report.excerpt}</p>

        <span className="font-mono mt-4 inline-block text-[10px] tracking-[0.18em] text-gold uppercase">
          Read report →
        </span>
      </Link>
    </li>
  );
}
