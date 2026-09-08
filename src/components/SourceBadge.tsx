/**
 * Shows where a report came from.
 *
 * created_by holds either "<source>:<slot>" for generated reports or a
 * Clerk user id for anything pasted into /admin by hand. "auto:" is the
 * legacy prefix from before cron and manual runs were distinguished, so
 * rows created then still render sensibly.
 */
export default function SourceBadge({ createdBy }: { createdBy: string | null }) {
  if (!createdBy) return null;

  const [source, slot] = createdBy.split(":");

  const style = (color: string) => ({
    color: `var(${color})`,
    borderColor: `color-mix(in srgb, var(${color}) 45%, transparent)`,
  });

  const config: Record<string, { label: string; style: React.CSSProperties }> = {
    cron: { label: `auto · ${slot}`, style: style("--royal") },
    dispatch: { label: `manual run · ${slot}`, style: style("--gold") },
    actions: { label: `actions · ${slot}`, style: style("--royal") },
    local: { label: `local · ${slot}`, style: style("--muted") },
    auto: { label: `auto · ${slot}`, style: style("--royal") }, // legacy rows
  };

  const badge = config[source] ?? {
    label: "pasted by hand",
    style: style("--muted"),
  };

  return (
    <span
      className="font-mono border px-2 py-0.5 text-[9px] tracking-[0.14em] uppercase"
      style={badge.style}
    >
      {badge.label}
    </span>
  );
}