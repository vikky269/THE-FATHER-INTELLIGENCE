/**
 * Shape of the `report_data` column.
 *
 * Written once by scripts/generate-report.mjs, straight from the verified
 * market snapshot that also fed the model — never derived from the
 * markdown body. Reports created by hand in /admin have this as null,
 * which every reader of this type must handle.
 */
export type ReportDataTapeItem = {
  instrument: string;
  value: string;
  live: boolean;
  asOf: string;
};

export type ReportData = {
  version: 1;
  fetchedAt: string;
  tape: ReportDataTapeItem[];
  missing: string[];
};

/** Narrows an unknown JSONB value into ReportData, or null if it doesn't fit. */
export function parseReportData(raw: unknown): ReportData | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;

  if (d.version !== 1 || !Array.isArray(d.tape)) return null;

  const tape = d.tape.filter(
    (t): t is ReportDataTapeItem =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as ReportDataTapeItem).instrument === "string" &&
      typeof (t as ReportDataTapeItem).value === "string",
  );

  if (tape.length === 0) return null;

  return {
    version: 1,
    fetchedAt: typeof d.fetchedAt === "string" ? d.fetchedAt : new Date().toISOString(),
    tape,
    missing: Array.isArray(d.missing) ? d.missing.filter((m): m is string => typeof m === "string") : [],
  };
}
