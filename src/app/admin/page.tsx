import Link from "next/link";
import { deleteReport, setStatus } from "@/lib/actions";
import { listAll } from "@/lib/db";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let reports: Awaited<ReturnType<typeof listAll>> = [];
  let loadError: string | null = null;

  try {
    reports = await listAll();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not reach the report store.";
  }

  return (
    // overflow-hidden stops a long title from widening the whole page
    <div className="space-y-8 overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Publishing</p>
          <h1 className="font-display mt-3 text-2xl font-bold tracking-[0.06em] text-fg">
            Reports
          </h1>
        </div>
        <Link href="/admin/new" className="btn-gold">
          New report
        </Link>
      </header>

      {saved && (
        <p
          className="border-l-2 px-4 py-3 text-sm"
          style={{
            borderColor: "var(--signal-positive)",
            color: "var(--signal-positive)",
            background: "color-mix(in srgb, var(--signal-positive) 8%, transparent)",
          }}
        >
          Saved as a draft. It is not visible to members yet.
        </p>
      )}

      {loadError && (
        <div className="card px-5 py-6">
          <p className="text-sm text-fg">The report store is not reachable.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{loadError}</p>
        </div>
      )}

      {!loadError && reports.length === 0 && (
        <div className="card px-5 py-10 text-center">
          <p className="font-display text-lg text-fg">Nothing here yet.</p>
          <p className="mt-3 text-sm text-muted">
            Click “New report”, paste the briefing, and publish.
          </p>
        </div>
      )}

      <ul className="grid gap-px bg-line">
        {reports.map((r) => (
          <li key={r.id} className="bg-base px-5 py-5">
            {/* min-w-0 on both the row and the text column is what lets
                the title actually clip instead of pushing the page wide */}
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="font-mono px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase"
                    style={
                      r.status === "published"
                        ? {
                            color: "var(--signal-positive)",
                            background:
                              "color-mix(in srgb, var(--signal-positive) 12%, transparent)",
                          }
                        : {
                            color: "var(--signal-caution)",
                            background:
                              "color-mix(in srgb, var(--signal-caution) 12%, transparent)",
                          }
                    }
                  >
                    {r.status}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {r.category} · {r.report_date}
                  </span>
                </div>

                <h2 className="font-display mt-2.5 line-clamp-2 text-base leading-snug font-bold text-fg">
                  {r.title}
                </h2>
                <p className="font-mono mt-1 truncate text-[11px] text-muted">/{r.slug}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <Link
                  href={`/admin/${r.id}/preview`}
                  className="font-mono border border-gold/50 px-3 py-1.5 text-[10px] tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10"
                >
                  Read
                </Link>

                <Link
                  href={`/admin/${r.id}`}
                  className="font-mono border border-line px-3 py-1.5 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
                >
                  Edit
                </Link>

                {r.status === "published" ? (
                  <form action={setStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="draft" />
                    <button
                      type="submit"
                      className="font-mono border border-line px-3 py-1.5 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
                    >
                      Unpublish
                    </button>
                  </form>
                ) : (
                  <form action={setStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="published" />
                    <button
                      type="submit"
                      className="font-mono border border-line px-3 py-1.5 text-[10px] tracking-[0.14em] text-muted uppercase transition hover:border-gold/50 hover:text-gold"
                    >
                      Publish
                    </button>
                  </form>
                )}

                <form action={deleteReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="font-mono border border-line px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase transition"
                    style={{ color: "var(--signal-negative)" }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}