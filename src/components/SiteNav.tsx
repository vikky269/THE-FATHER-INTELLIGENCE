"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Wordmark } from "./ui";

/**
 * Every link points at something real. "Track record" and "Pricing" are
 * deliberately absent until those pages exist — a nav item that scrolls
 * nowhere is worse than one that isn't there.
 */
const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#markets", label: "Markets" },
  { href: "/#research", label: "Research" },
  { href: "/#reports", label: "Reports" },
  { href: "/#business", label: "Business" },
  { href: "/#intelligence", label: "Intelligence" },

];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  // Lock scroll behind the mobile sheet, and release it on unmount so a
  // client-side navigation can never leave the page stuck.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        <Link href="/" aria-label="The Father Intelligence home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
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
            className="font-mono hidden border border-gold/50 bg-gold/8 px-5 py-2 text-[11px] tracking-[0.18em] text-gold-hi uppercase transition hover:border-gold hover:bg-gold/16 sm:inline-block"
          >
            Sign in
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-9 items-center justify-center border border-line text-muted transition hover:border-gold/60 hover:text-gold lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="size-4"
              aria-hidden
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-base/98 backdrop-blur-md lg:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-line last:border-0">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono block py-4 text-[12px] tracking-[0.16em] text-fg uppercase transition hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-6">
            <Link href="/sign-up" onClick={() => setOpen(false)} className="btn-gold w-full">
              Create your account
            </Link>
            <Link href="/sign-in" onClick={() => setOpen(false)} className="btn-ghost w-full">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}