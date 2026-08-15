"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Runs before paint in the document head — see ThemeScript in layout.tsx. */
export const THEME_KEY = "fi-theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read whatever the pre-paint script already applied, so the button label
  // matches the rendered theme rather than fighting it.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing or storage disabled — the theme still applies for
      // this session, it just won't be remembered.
    }
    setTheme(next);
  }

  const goingDark = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${goingDark ? "dark" : "light"} mode` : "Switch theme"}
      title={mounted ? `Switch to ${goingDark ? "dark" : "light"} mode` : undefined}
      className={`inline-flex size-9 items-center justify-center border border-line text-muted transition hover:border-gold/60 hover:text-gold ${className}`}
    >
      {/* Rendered only after mount so server and client markup agree. */}
      {mounted &&
        (goingDark ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="size-4"
            aria-hidden
          >
            {/* Crescent — switch to dark */}
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="size-4"
            aria-hidden
          >
            {/* Sun — switch to light */}
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ))}
    </button>
  );
}
