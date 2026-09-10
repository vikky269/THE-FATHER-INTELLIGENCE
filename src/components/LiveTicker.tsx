"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketSnapshot } from "@/lib/market-data";

const POLL_MS = 180_000; // matches the server cache window in /api/live-tape

/**
 * Genuinely live ticker, polling every 3 minutes.
 *
 * Deliberately separate from LiveMarketTape (the report-anchored one) and
 * captioned "Live" rather than "As published" so the two are never
 * confused — one moves with the market, the other moves with editorial
 * review. Showing both without the distinction would let a visitor think
 * a report-anchored price was current when it might be hours old, or vice
 * versa assume a live price had been through review when it hasn't.
 */
export default function LiveTicker() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [stale, setStale] = useState(false);
  const failuresRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/live-tape", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data: MarketSnapshot = await res.json();
        if (cancelled) return;
        setSnapshot(data);
        setStale(false);
        failuresRef.current = 0;
      } catch {
        if (cancelled) return;
        failuresRef.current += 1;
        // Keep showing the last good snapshot rather than blanking the
        // widget on a single failed poll — only flag it after repeated
        // misses, so a brief network blip doesn't read as an outage.
        if (failuresRef.current >= 2) setStale(true);
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!snapshot || snapshot.data.length === 0) return null;

  const items = [...snapshot.data, ...snapshot.data]; // duplicated for the seamless scroll

  return (
    <section aria-label="Live market prices" className="scroll-mt-24">
      <div className="tape-rail relative overflow-hidden border-y border-line bg-surface/70 py-3">
        <div className="tape-track" aria-hidden>
          {items.map((d, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 px-6">
              <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                {d.instrument}
              </span>
              <span className="font-mono text-[12px] font-medium text-fg">{d.value}</span>
              {!d.live && <span className="font-mono text-[9px] text-gold-deep">EOD</span>}
              <span className="text-gold-deep">·</span>
            </span>
          ))}
        </div>

        <ul className="sr-only">
          {snapshot.data.map((d) => (
            <li key={d.instrument}>
              {d.instrument}: {d.value}
              {!d.live ? " (end of day)" : ""}
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent" />
      </div>

      <p className="font-mono mx-auto flex max-w-6xl items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.12em] text-muted uppercase">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{
            background: stale ? "var(--signal-caution)" : "var(--signal-positive)",
            boxShadow: `0 0 6px ${stale ? "var(--signal-caution)" : "var(--signal-positive)"}`,
          }}
          aria-hidden
        />
        {stale ? "Live · reconnecting" : "Live"} · updates every 3 minutes · not for execution
      </p>
    </section>
  );
}
