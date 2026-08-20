import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SiteNav from "@/components/SiteNav";
import ReportBody, { TruthProtocol } from "@/components/ReportBody";
import { GhostButton, GoldButton } from "@/components/ui";
import { getPublished } from "@/lib/db";
import { previewMarkdown } from "@/lib/report-format";
import { reportJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const report = await getPublished(slug);
    if (!report) return { title: "Report not found" };
    return {
      title: report.title,
      description: report.excerpt,
      alternates: { canonical: `/reports/${slug}` },
      openGraph: { title: report.title, description: report.excerpt, type: "article" },
    };
  } catch {
    return { title: "Report" };
  }
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let report: Awaited<ReturnType<typeof getPublished>> = null;
  try {
    report = await getPublished(slug);
  } catch {
    report = null;
  }
  if (!report) notFound();

  const { userId } = await auth();
  const signedIn = Boolean(userId);

  // Members-only reports show a substantial teaser, then a gate. Public
  // reports are readable in full by anyone — that is the SEO surface.
  const gated = report.visibility === "members" && !signedIn;
  const { preview, truncated } = gated
    ? previewMarkdown(report.body_md)
    : { preview: report.body_md, truncated: false };

  const date = new Date(`${report.report_date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportJsonLd(report)) }}
      />
      <SiteNav />

      <article className="mx-auto max-w-3xl px-5 py-12">
        <Link
          href="/reports"
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

        <div className="relative mt-8">
          <ReportBody markdown={preview} />

          {gated && truncated && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
              style={{ background: "linear-gradient(to bottom, transparent, var(--base) 85%)" }}
            />
          )}
        </div>

        {gated && (
          <section className="card relative mt-2 px-6 py-10 text-center">
            <div className="dotfield" aria-hidden />
            <div className="relative">
              <p className="eyebrow">Members only</p>
              <h2 className="font-display mt-4 text-2xl leading-tight font-bold">
                <span className="text-fg">The rest of this briefing is</span>{" "}
                <span className="gilt">behind the door.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Sign in to read the full report — institutional positioning, liquidity zones,
                scenario paths, the execution plan and the risk that would invalidate it.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <GoldButton href="/sign-up">Create your account</GoldButton>
                <GhostButton href="/sign-in">Sign in</GhostButton>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-14 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-muted">
            Research and analysis only — not investment advice, a recommendation, or an offer to
            buy or sell any instrument. Scenario probabilities and framework zones are model
            outputs rather than statistically validated forecasts. Trading carries substantial risk
            of loss.
          </p>
        </footer>
      </article>
    </>
  );
}
