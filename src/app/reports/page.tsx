import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import ReportCard from "@/components/ReportCard";
import { SectionHead } from "@/components/ui";
import { listPublished } from "@/lib/db";

export const revalidate = 300;

export const metadata = {
  title: "Briefing archive",
  alternates: { canonical: "/reports" },
  description:
    "Every published Market Universe briefing — macro, quant, liquidity, positioning and reaction intelligence.",
};

export default async function ReportsArchivePage() {
  let reports: Awaited<ReturnType<typeof listPublished>> = [];
  try {
    reports = await listPublished(100);
  } catch {
    reports = [];
  }

  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-4xl px-5 py-16">
        <SectionHead
          index="Archive"
          title="Published briefings"
          kicker="Every Market Universe briefing, newest first. Members-only reports open with a preview."
        />

        {reports.length === 0 ? (
          <div className="card px-5 py-12 text-center">
            <p className="font-display text-lg text-fg">No briefings published yet.</p>
            <p className="mt-3 text-sm text-muted">
              The first briefing will appear here as soon as it is published.
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

        <Link
          href="/"
          className="font-mono mt-8 inline-block text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
        >
          ← Back to the site
        </Link>
      </main>
    </>
  );
}
