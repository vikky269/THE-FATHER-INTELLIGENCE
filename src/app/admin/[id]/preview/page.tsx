import Link from "next/link";
import { notFound } from "next/navigation";
import ReportBody, { TruthProtocol } from "@/components/ReportBody";
import { setStatus } from "@/lib/actions";
import { getById } from "@/lib/db";

/**
 * Read a draft in full before it goes live.
 *
 * Renders exactly what members would see, so the diagrams, tables and
 * provenance markers can be checked against the real layout rather than
 * guessed at from the raw markdown.
 */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getById(id);
  if (!report) notFound();

  const date = new Date(`${report.report_date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="mx-auto max-w-3xl">
      {/* Action bar stays reachable while reading a long report */}
      <div className="sticky top-16 z-40 -mx-5 mb-8 border-y border-line bg-base/90 px-5 py-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
            >
              ← All reports
            </Link>
            <span
              className="font-mono px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase"
              style={
                report.status === "published"
                  ? {
                      color: "var(--signal-positive)",
                      background: "color-mix(in srgb, var(--signal-positive) 12%, transparent)",
                    }
                  : {
                      color: "var(--signal-caution)",
                      background: "color-mix(in srgb, var(--signal-caution) 12%, transparent)",
                    }
              }
            >
              {report.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/${report.id}`}
              className="font-mono border border-line px-3 py-1.5 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
            >
              Edit
            </Link>

            {report.status === "draft" ? (
              <form action={setStatus}>
                <input type="hidden" name="id" value={report.id} />
                <input type="hidden" name="status" value="published" />
                <button
                  type="submit"
                  className="font-mono border border-gold/50 px-4 py-1.5 text-[10px] tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10"
                >
                  Publish
                </button>
              </form>
            ) : (
              <form action={setStatus}>
                <input type="hidden" name="id" value={report.id} />
                <input type="hidden" name="status" value="draft" />
                <button
                  type="submit"
                  className="font-mono border border-line px-4 py-1.5 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
                >
                  Unpublish
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <article>
        <header>
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

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{report.excerpt}</p>
        </header>

        <div className="rule-gold my-8" />

        <TruthProtocol />

        <div className="mt-8">
          <ReportBody markdown={report.body_md} />
        </div>
      </article>
    </div>
  );
}