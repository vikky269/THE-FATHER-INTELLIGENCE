import Link from "next/link";
import ReportCard from "./ReportCard";
import { SectionHead } from "./ui";
import { listPublished } from "@/lib/db";

/**
 * Latest published briefings on the landing page.
 *
 * Renders nothing at all when there are no reports (or the database is
 * unreachable) so a pre-launch landing page never shows an empty shelf.
 */
export default async function LatestReports({ limit = 4 }: { limit?: number }) {
  let reports: Awaited<ReturnType<typeof listPublished>> = [];

  try {
    reports = await listPublished(limit);
  } catch {
    return null;
  }

  if (reports.length === 0) return null;

  return (
    <section id="reports" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
      <SectionHead
        index="V"
        title="Latest briefings"
        kicker="Published across the London and New York sessions. Members-only reports open with a preview."
      />

      <ul className="grid gap-px bg-line">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </ul>

      <div className="mt-8">
        <Link
          href="/reports"
          className="font-mono border border-line px-5 py-3 text-[11px] tracking-[0.18em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
        >
          View the full archive →
        </Link>
      </div>
    </section>
  );
}
