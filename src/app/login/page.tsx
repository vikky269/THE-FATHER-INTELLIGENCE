import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Crest, Wordmark } from "@/components/ui";
import { BRIEFING, MARKET_DESKS } from "@/lib/reports";

export const metadata = { title: "Sign in — The Father Intelligence" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand side */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface/50 p-12 lg:flex">
        <div className="dotfield" aria-hidden />

        <Link href="/" className="relative">
          <Wordmark size={40} />
        </Link>

        <div className="relative max-w-md">
          <p className="eyebrow">
            {BRIEFING.dateLabel} · {BRIEFING.session}
          </p>
          <h2 className="font-display mt-6 text-3xl leading-tight font-bold">
            <span className="gilt">Six desks</span>
            <br />
            <span className="text-fg">waiting inside.</span>
          </h2>

          <ul className="mt-9 grid grid-cols-2 gap-px bg-line">
            {MARKET_DESKS.map((d) => (
              <li key={d.slug} className="bg-surface px-4 py-3.5">
                <p className="font-display text-xs tracking-[0.14em] text-fg uppercase">
                  {d.name}
                </p>
                <p className="font-mono mt-1 text-[10px] text-muted">{d.bias}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono relative text-[10px] tracking-[0.2em] text-gold-deep uppercase">
          Intelligence before decisions.™
        </p>
      </section>

      {/* Form side */}
      <section className="flex flex-col justify-center px-6 py-16 sm:px-14">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="inline-flex lg:hidden">
              <Crest size={44} />
            </Link>
            <ThemeToggle className="ml-auto" />
          </div>

          <p className="eyebrow">Member access</p>
          <h1 className="font-display mt-4 text-2xl font-bold tracking-[0.06em] text-fg">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-muted">
            Your briefings, levels and execution notes live behind this door.
          </p>

          <div className="mt-9">
            <LoginForm />
          </div>

          <div className="rule-gold my-9" />

          <div className="border border-line bg-sunken px-4 py-4">
            <p className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
              Demo credentials
            </p>
            <p className="font-mono mt-2.5 text-[11px] leading-relaxed text-muted">
              member@thefather.io
              <br />
              goldenthrone
            </p>
          </div>

          <p className="mt-8 text-xs text-muted">
            Don&apos;t have an account yet?{" "}
            <a
              href="mailto:access@thefatherintelligence.com"
              className="text-gold underline-offset-4 hover:underline"
            >
              Request access
            </a>
            .
          </p>

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
