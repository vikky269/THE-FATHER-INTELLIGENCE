import { NextResponse } from "next/server";
import { fetchMarketSnapshot } from "@/lib/market-data";

/**
 * GET /api/live-tape
 *
 * A genuinely live feed, distinct from the report-anchored tape: that one
 * only moves when a report publishes, this one refreshes continuously.
 *
 * The 180s revalidate + Cache-Control pair is load-bearing, not decorative.
 * Twelve Data's free tier caps at 800 requests/day. Without server-side
 * caching, every open browser tab polling this route would fire its own
 * upstream call — a handful of visitors would exhaust the daily quota in
 * minutes. With caching, Next.js serves one shared response to everyone
 * for the whole window: worst case is 480 upstream calls/day (24h ÷ 3min),
 * regardless of traffic.
 */
export const revalidate = 180;

export async function GET() {
  try {
    const snapshot = await fetchMarketSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    // A failed fetch should not take the widget down — it should just
    // leave whatever the client already has on screen.
    return NextResponse.json(
      { fetchedAt: new Date().toISOString(), data: [], missing: [], error: "fetch_failed" },
      { status: 502 },
    );
  }
}
