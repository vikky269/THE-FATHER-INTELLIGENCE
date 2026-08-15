import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { listPublished } from "@/lib/db";
import { TruthProtocol } from "@/components/ReportBody";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const viewer = await requireViewer();
  const { denied } = await searchParams;

  let reports: Awaited<ReturnType<typeof listPublished>> = [];
  let loadError: string | null = null;

  try {
    reports = await listPublished();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not reach the report store.";
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Institutional Mission Control</p>
        <h1 className="font-display mt-3 text-2xl font-bold tracking-[0.06em] text-fg sm:text-3xl">
          Welcome back, {viewer.name}.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          Every published Market Universe briefing, newest first.
        </p>
      </header>

      {denied && (
        <p className="border-l-2 px-4 py-3 text-sm"
           style={{ borderColor: "var(--signal-caution)", color: "var(--signal-caution)",
                    background: "color-mix(in srgb, var(--signal-caution) 8%, transparent)" }}>
          That area is restricted to administrators.
        </p>
      )}

      <TruthProtocol />

      {loadError && (
        <div className="card px-5 py-6">
          <p className="text-sm text-fg">The report store is not reachable yet.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{loadError}</p>
        </div>
      )}

      {!loadError && reports.length === 0 && (
        <div className="card px-5 py-10 text-center">
          <p className="font-display text-lg text-fg">No briefings published yet.</p>
          <p className="mt-3 text-sm text-muted">
            {viewer.isAdmin
              ? "Head to Admin → New report to publish the first one."
              : "The first briefing will appear here as soon as it is published."}
          </p>
        </div>
      )}

      <ul className="grid gap-px bg-line">
        {reports.map((r) => (
          <li key={r.id} className="bg-base transition hover:bg-surface">
            <Link href={`/dashboard/reports/${r.slug}`} className="group block px-5 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                  {r.category}
                </span>
                <span className="text-muted" aria-hidden>·</span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  {formatDate(r.report_date)}
                </span>
                {r.framework_version && (
                  <span className="font-mono border border-line px-2 py-0.5 text-[10px] text-muted">
                    {r.framework_version}
                  </span>
                )}
              </div>

              <h2 className="font-display mt-3 text-lg leading-snug font-bold text-fg group-hover:text-gold">
                {r.title}
              </h2>

              {r.session_label && (
                <p className="font-mono mt-1.5 text-[11px] text-muted">{r.session_label}</p>
              )}

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{r.excerpt}</p>

              <span className="font-mono mt-4 inline-block text-[10px] tracking-[0.18em] text-gold uppercase">
                Read report →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="border-t border-line pt-6 text-xs leading-relaxed text-muted">
        Research and analysis only — not investment advice. Framework zones and scenario
        probabilities are model outputs, not statistically validated forecasts. Trading carries
        substantial risk of loss.
      </p>
    </div>
  );
}
