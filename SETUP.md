# Live market tape — setup

## What this does

The tape on the landing page now reads real figures instead of sample
data. The numbers come from `report_data`, a new JSONB column populated
directly from the verified market snapshot the generator already fetches
for every markets report — never parsed back out of the generated prose.
A hand-pasted report (or the music desk) simply has `report_data = null`,
and the tape hides itself rather than showing something stale or invented.

## 1. Run the migration

`supabase/report_data.sql` in the Supabase SQL editor. Adds one nullable
column; nothing else changes, no existing rows are touched.

## 2. Replace `scripts/generate-report.mjs`

Same generator, with two additions:

- `buildReportData(snapshot)` — builds the tape straight from the fetched
  snapshot (13 tracked instruments: gold, EUR/USD, GBP/USD, USD/JPY,
  US 10Y/2Y, Brent, WTI, BTC, ETH, SPY, QQQ, DIA). Anything the snapshot
  didn't have is simply absent, and its label is recorded under `missing`.
- `save()` now writes `report_data: buildReportData(snapshot)` on insert.

The music desk always gets `report_data: null` — it never has a market
snapshot to build one from.

## 3. Add the two library files

`src/lib/report-data.ts` — the type, plus `parseReportData()`, which
validates the JSONB value before anything renders it. Tested against
eight malformed shapes (wrong version, non-array tape, missing fields,
a bare string); every one safely returns `null` rather than throwing or
rendering garbage.

`src/lib/live-tape.ts` — fetches the most recent **published markets**
report that actually has `report_data`. Scoped to `category=markets` on
purpose: falling back to a music report here would put a gold ticker
under an Afrobeats piece.

## 4. Add the component

`src/components/LiveMarketTape.tsx` — same scrolling-rail visual as
before. End-of-day figures (Treasuries, oil) carry an `EOD` tag inline,
matching how the report body itself flags them. Renders nothing until a
markets report with data exists.

## 5. Wire it into the homepage

In `page.tsx`:

```tsx
import LiveMarketTape from "@/components/LiveMarketTape";
```

Replace:

```tsx
{!latest && <MarketTape />}
```

with:

```tsx
<LiveMarketTape />
```

No conditional needed — the component decides for itself whether it has
anything real to show.

You can delete the old `MarketTape` export from `HeroPanels.tsx` once
this is confirmed working, along with the sample `GLOBAL_TAPE` array in
`reports.ts` if nothing else references it.

## After deploying

Every markets report generated **from now on** carries `report_data`.
Anything published earlier has `report_data = null` and the tape simply
skips it — it will start showing real figures from the next scheduled
run onward, not retroactively.
