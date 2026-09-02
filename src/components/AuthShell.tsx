import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Crest, Wordmark } from "./ui";

/**
 * Split brand panel wrapping Clerk's own sign-in / sign-up widgets, so the
 * hosted auth flow still feels like part of the site.
 */
export default function AuthShell({
  eyebrow,
  heading,
  sub,
  children,
}: {
  eyebrow: string;
  heading: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface/50 p-12 lg:flex">
        <div className="dotfield" aria-hidden />

        <Link href="/" className="relative">
          <Wordmark size={40} />
        </Link>

        <div className="relative max-w-md">
          <p className="eyebrow">Institutional Mission Control</p>
          <h2 className="font-display mt-6 text-3xl leading-tight font-bold">
            <span className="gilt">The father </span>
            <br />
            <span className="text-fg">Intelligence</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Macro, quant, liquidity, positioning and reaction intelligence — published across the
            London and New York sessions.
          </p>
        </div>

        <p className="font-mono relative text-[10px] tracking-[0.2em] text-gold-deep uppercase">
          Intelligence before decisions.™
        </p>
      </section>

      <section className="flex flex-col justify-center px-6 py-16 sm:px-14">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="inline-flex lg:hidden">
              <Crest size={44} />
            </Link>
            <ThemeToggle className="ml-auto" />
          </div>

          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-display mt-4 text-2xl font-bold tracking-[0.06em] text-fg">
            {heading}
          </h1>
          <p className="mt-3 text-sm text-muted">{sub}</p>

          <div className="mt-8">{children}</div>

          <Link
            href="/"
            className="font-mono mt-10 inline-block text-[10px] tracking-[0.18em] text-muted uppercase hover:text-fg"
          >
            ← Back to the site
          </Link>
        </div>
      </section>
    </main>
  );
}
