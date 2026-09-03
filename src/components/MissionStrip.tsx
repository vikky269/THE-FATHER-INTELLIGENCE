import { MISSION_STRIP, SCOREBOARD_LINE } from "@/lib/reports";
import { Dot } from "./ui";

/**
 * Compact readings strip beneath the hero copy.
 *
 * Scrolls horizontally on narrow screens rather than wrapping into a
 * ragged grid — five short readings in a row is the point of it.
 */
export default function MissionStrip() {
  return (
    <div className="mt-14">
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {MISSION_STRIP.map((item) => (
          <li key={item.label} className="bg-base px-4 py-4">
            <p className="font-mono text-[9px] leading-tight tracking-[0.16em] text-muted uppercase">
              {item.label}
            </p>
            <p className="mt-2.5 flex items-center gap-2 font-mono text-[13px] text-fg">
              <Dot signal={item.signal} />
              {item.value}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {[
            { mark: "✅", label: "Verified data" },
            { mark: "🟡", label: "Framework-derived" },
            { mark: "🔵", label: "Forecasts" },
            { mark: "🟣", label: "Strategic interpretation" },
          ].map((t) => (
            <li key={t.mark} className="font-mono flex items-center gap-1.5 text-[10px] text-muted">
              <span aria-hidden>{t.mark}</span>
              {t.label}
            </li>
          ))}
        </ul>

        <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
          {SCOREBOARD_LINE}
        </p>
      </div>
    </div>
  );
}