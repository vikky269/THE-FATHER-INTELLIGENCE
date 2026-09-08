import Link from "next/link";
import SiteNav from "./SiteNav";
import ReportCard from "./ReportCard";
import { SectionHead } from "./ui";
import { listPublishedByCategory } from "@/lib/db";
import type { Category } from "@/lib/db";

/**
 * Shared archive page for a single desk.
 *
 * A database outage renders the empty state rather than a 500 — a desk
 * with nothing in it looks the same as a desk that can't be reached, and
 * neither is worth breaking the page over.
 */
export default async function DeskArchive({
  category,
  title,
  kicker,
}: {
  category: Category;
  title: string;
  kicker: string;
}) {
  let reports: Awaited<ReturnType<typeof listPublishedByCategory>> = [];

  try {
    reports = await listPublishedByCategory(category);
  } catch {
    reports = [];
  }

  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-4xl px-5 py-16">
        <SectionHead index={title} title={`${reports.length} briefings`} kicker={kicker} />

        {reports.length === 0 ? (
          <div className="card px-5 py-12 text-center">
            <p className="font-display text-lg text-fg">No briefings published yet.</p>
            <p className="mt-3 text-sm text-muted">
              The first one will appear here as soon as it is published.
            </p>
          </div>
        ) : (
          <ul className="grid gap-px bg-line">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </ul>
        )}

        <p className="mt-10 text-xs leading-relaxed text-muted">
          Research and analysis only — not investment advice. Framework zones and scenario
          probabilities are model outputs, not statistically validated forecasts.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
          >
            ← Back to the site
          </Link>
          <Link
            href="/reports"
            className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
          >
            All desks →
          </Link>
        </div>
      </main>
    </>
  );
}