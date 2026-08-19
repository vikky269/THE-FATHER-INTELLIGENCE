import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Wordmark } from "./ui";

const LINKS = [
  { href: "/reports", label: "Briefings" },
  { href: "/#engine", label: "The engine" },
  { href: "/#coverage", label: "Coverage" },
  { href: "/#access", label: "Access" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        <Link href="/" aria-label="The Father Intelligence home">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase transition hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
          className="border border-gold/50 bg-gold/8 px-5 py-2 font-mono text-[11px] tracking-[0.18em] text-gold-hi uppercase transition hover:border-gold hover:bg-gold/16"
        >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
