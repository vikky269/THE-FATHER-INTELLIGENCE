import { GLOBAL_TAPE } from "@/lib/reports";
import { SIGNAL_COLOR } from "./ui";

export default function Tape() {
  const items = [...GLOBAL_TAPE, ...GLOBAL_TAPE];

  return (
    <div className="tape-rail relative overflow-hidden border-y border-line bg-surface/70 py-3">
      <div className="tape-track" aria-hidden>
        {items.map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2.5 px-6">
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              {t.instrument}
            </span>
            <span
              className="font-mono text-[12px] font-medium"
              style={{ color: SIGNAL_COLOR[t.signal] }}
            >
              {t.value}
            </span>
            <span className="text-gold-deep">·</span>
          </span>
        ))}
      </div>

      {/* Readable, non-animated version for assistive tech */}
      <ul className="sr-only">
        {GLOBAL_TAPE.map((t) => (
          <li key={t.instrument}>
            {t.instrument}: {t.value}
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base to-transparent" />
    </div>
  );
}
