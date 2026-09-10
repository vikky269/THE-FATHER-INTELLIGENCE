import { db } from "./db";
import { parseReportData, type ReportData } from "./report-data";

/**
 * The most recent published markets report that actually has report_data.
 *
 * Deliberately scoped to category=markets: the music desk's report_data is
 * always null, and falling back to a music report here would put a gold
 * price ticker under a report about Afrobeats. Better to show nothing.
 */
export async function getLatestMarketTape(): Promise<{
  data: ReportData;
  reportDate: string;
  slug: string;
} | null> {
  const { data, error } = await db()
    .from("reports")
    .select("report_data, report_date, slug")
    .eq("status", "published")
    .eq("category", "markets")
    .not("report_data", "is", null)
    .order("report_date", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const parsed = parseReportData(data.report_data);
  if (!parsed) return null;

  return { data: parsed, reportDate: data.report_date as string, slug: data.slug as string };
}
