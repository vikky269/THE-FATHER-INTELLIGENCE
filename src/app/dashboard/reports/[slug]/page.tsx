import Link from "next/link";
import { notFound } from "next/navigation";
import ReportBody, { TruthProtocol } from "@/components/ReportBody";
import { requireViewer } from "@/lib/auth";
import { getPublished } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const report = await getPublished(slug);
    return {
      title: report ? `${report.title} — The Father Intelligence` : "Report not found",
      description: report?.excerpt,
    };
  } catch {
    return { title: "Report — The Father Intelligence" };
  }
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireViewer();
  const { slug } = await params;

  const report = await getPublished(slug);
  if (!report) notFound();

  const date = new Date(`${report.report_date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
      >
        ← All briefings
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
            {report.category}
          </span>
          {report.framework_version && (
            <span className="font-mono border border-line px-2 py-0.5 text-[10px] text-muted">
              {report.framework_version}
            </span>
          )}
        </div>

        <h1 className="font-display mt-4 text-3xl leading-tight font-bold text-fg">
          {report.title}
        </h1>

        <p className="font-mono mt-4 text-[11px] tracking-[0.14em] text-muted uppercase">
          {date}
          {report.session_label ? ` · ${report.session_label}` : ""} · {report.author_name}
        </p>
      </header>

      <div className="rule-gold my-8" />

      <TruthProtocol />

      <div className="mt-8">
        <ReportBody markdown={report.body_md} />
      </div>

      <footer className="mt-14 border-t border-line pt-6">
        <p className="text-xs leading-relaxed text-muted">
          Research and analysis only — not investment advice, a recommendation, or an offer to buy
          or sell any instrument. Scenario probabilities and framework zones are model outputs
          rather than statistically validated forecasts. Trading carries substantial risk of loss.
        </p>
      </footer>
    </article>
  );
}
