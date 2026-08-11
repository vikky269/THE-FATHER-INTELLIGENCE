import Link from "next/link";
import { requireSession, signOut } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { Dot, Wordmark } from "@/components/ui";
import { BRIEFING, MARKET_DESKS } from "@/lib/reports";

export const metadata = { title: "Dashboard — The Father Intelligence" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* -------------------------------------------------------- sidebar */}
      <aside className="shrink-0 border-b border-line bg-surface/60 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col">
          <div className="border-b border-line px-5 py-4">
            <Link href="/">
              <Wordmark />
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <p className="font-mono px-2 text-[9px] tracking-[0.2em] text-muted uppercase">
              Briefing
            </p>
            <Link
              href="/dashboard"
              className="mt-2.5 block px-2 py-2 font-mono text-[11px] tracking-[0.12em] text-fg uppercase transition hover:text-gold"
            >
              Mission control
            </Link>

            <p className="font-mono mt-7 px-2 text-[9px] tracking-[0.2em] text-muted uppercase">
              Desks
            </p>
            <ul className="mt-2.5 space-y-0.5">
              {MARKET_DESKS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/dashboard/${d.slug}`}
                    className="flex items-center justify-between gap-2 px-2 py-2 text-sm text-fg/80 transition hover:bg-hover hover:text-fg"
                  >
                    <span className="flex items-center gap-2.5">
                      <Dot signal={d.signal} />
                      {d.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted">{d.conviction}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-line px-5 py-4">
            <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
              {session.name}
            </p>
            <p className="mt-1 truncate text-[11px] text-fg/60">{session.email}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <form action={signOut}>
                <button
                  type="submit"
                  className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase transition hover:text-gold"
                >
                  Sign out →
                </button>
              </form>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------- main */}
      <div className="min-w-0 flex-1">
        <div className="border-b border-line bg-base/85 px-5 py-3 backdrop-blur-md sm:px-8">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            {BRIEFING.dateLabel} · {BRIEFING.session} ·{" "}
            <span className="text-gold">{BRIEFING.version}</span>
          </p>
        </div>
        <main className="px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
