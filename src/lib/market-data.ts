/**
 * MARKET DATA
 *
 * The framework's Truth Protocol treats prices as ✅ verified facts. A
 * language model cannot know a price, so every number below is fetched
 * from a named source and carried with its own timestamp.
 *
 * The governing rule: if a source fails, that instrument is OMITTED, never
 * estimated. The prompt is told to mark anything missing as ⚪ data-gated —
 * which is what the framework already does for COT positioning. An absent
 * number is honest; an invented one ends the business.
 *
 * Sources
 *   FRED       — Treasuries, DXY, Brent, WTI.  Free, needs a key.
 *                NOTE: FRED is end-of-day and lags ~1 business day.
 *   CoinGecko  — BTC, ETH.  Free, no key, live.
 *   Twelve Data— metals, FX, indices, VIX.  Paid tier, live.
 */

export type MarketDatum = {
  instrument: string;
  value: string;
  asOf: string; // ISO timestamp of the observation, not of the fetch
  source: string;
  live: boolean; // false = end-of-day / lagged
};

const TIMEOUT_MS = 12_000;

async function getJson(url: string): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) {
      console.warn(`[market-data] ${res.status} from ${new URL(url).host}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[market-data] fetch failed: ${new URL(url).host}`, err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ FRED */

const FRED_SERIES: { id: string; label: string; format: (v: number) => string }[] = [
  { id: "DGS10", label: "US 10Y Treasury", format: (v) => `${v.toFixed(3)}%` },
  { id: "DGS2", label: "US 2Y Treasury", format: (v) => `${v.toFixed(3)}%` },
  { id: "DTWEXBGS", label: "Dollar Index (broad)", format: (v) => v.toFixed(2) },
  { id: "DCOILBRENTEU", label: "Brent Crude", format: (v) => `$${v.toFixed(2)}/bbl` },
  { id: "DCOILWTICO", label: "WTI Crude", format: (v) => `$${v.toFixed(2)}/bbl` },
];

async function fetchFred(): Promise<MarketDatum[]> {
  const key = process.env.FRED_API_KEY;
  if (!key) return [];

  const out: MarketDatum[] = [];

  for (const series of FRED_SERIES) {
    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${series.id}&api_key=${key}&file_type=json` +
      `&sort_order=desc&limit=5`;

    const data = (await getJson(url)) as
      | { observations?: { date: string; value: string }[] }
      | null;
    if (!data?.observations) continue;

    // FRED writes "." for missing days (holidays); take the newest real value.
    const obs = data.observations.find((o) => o.value !== "." && o.value !== "");
    if (!obs) continue;

    const n = Number(obs.value);
    if (!Number.isFinite(n)) continue;

    out.push({
      instrument: series.label,
      value: series.format(n),
      asOf: `${obs.date}T00:00:00Z`,
      source: "FRED (St. Louis Fed)",
      live: false,
    });
  }

  return out;
}

/* -------------------------------------------------------------- CoinGecko */

async function fetchCrypto(): Promise<MarketDatum[]> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=bitcoin,ethereum&vs_currencies=usd&include_last_updated_at=true";

  const data = (await getJson(url)) as Record<
    string,
    { usd?: number; last_updated_at?: number }
  > | null;
  if (!data) return [];

  const rows: [string, string][] = [
    ["bitcoin", "Bitcoin"],
    ["ethereum", "Ethereum"],
  ];

  return rows.flatMap(([id, label]) => {
    const entry = data[id];
    if (!entry?.usd) return [];
    return [
      {
        instrument: label,
        value: `$${entry.usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        asOf: new Date((entry.last_updated_at ?? Date.now() / 1000) * 1000).toISOString(),
        source: "CoinGecko",
        live: true,
      },
    ];
  });
}

/* ------------------------------------------------------------ Twelve Data */

/**
 * Free-tier symbol set, verified against Twelve Data.
 *
 * Index symbols (SPX, IXIC, DJI) and silver (XAG/USD) are gated behind a
 * paid plan, so equities are tracked through their ETF proxies instead —
 * which is what the framework's own reports already do. VIX has no free
 * symbol at all; it is simply absent and gets flagged ⚪ data-gated.
 */
const TD_SYMBOLS: { symbol: string; label: string; prefix?: string; suffix?: string }[] = [
  { symbol: "XAU/USD", label: "Spot Gold", prefix: "$", suffix: "/oz" },
  { symbol: "EUR/USD", label: "EUR/USD" },
  { symbol: "GBP/USD", label: "GBP/USD" },
  { symbol: "USD/JPY", label: "USD/JPY" },
  { symbol: "SPY", label: "S&P 500 (SPY)", prefix: "$" },
  { symbol: "QQQ", label: "Nasdaq 100 (QQQ)", prefix: "$" },
  { symbol: "DIA", label: "Dow Jones (DIA)", prefix: "$" },
];

async function fetchTwelveData(): Promise<MarketDatum[]> {
  const key = process.env.TWELVE_DATA_API_KEY;
  if (!key) return [];

  const symbols = TD_SYMBOLS.map((s) => s.symbol).join(",");
  const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbols)}&apikey=${key}`;

  const data = (await getJson(url)) as Record<string, { price?: string }> | null;
  if (!data) return [];

  const now = new Date().toISOString();

  return TD_SYMBOLS.flatMap((s) => {
    const raw = data[s.symbol]?.price;
    const n = raw ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return [];

    const formatted = n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: n < 10 ? 4 : 2,
    });

    return [
      {
        instrument: s.label,
        value: `${s.prefix ?? ""}${formatted}${s.suffix ?? ""}`,
        asOf: now,
        source: "Twelve Data",
        live: true,
      },
    ];
  });
}

/* ------------------------------------------------------------------ main */

export type MarketSnapshot = {
  fetchedAt: string;
  data: MarketDatum[];
  missing: string[];
};

/**
 * Every source runs independently. One provider being down degrades the
 * report's coverage rather than failing the run.
 */
export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  const [fred, crypto, td] = await Promise.all([
    fetchFred().catch(() => [] as MarketDatum[]),
    fetchCrypto().catch(() => [] as MarketDatum[]),
    fetchTwelveData().catch(() => [] as MarketDatum[]),
  ]);

  const data = [...td, ...fred, ...crypto];
  const got = new Set(data.map((d) => d.instrument));

  const expected = [
    ...TD_SYMBOLS.map((s) => s.label),
    ...FRED_SERIES.map((s) => s.label),
    "Bitcoin",
    "Ethereum",
  ];

  return {
    fetchedAt: new Date().toISOString(),
    data,
    missing: expected.filter((e) => !got.has(e)),
  };
}

/** Renders the snapshot for injection into the prompt. */
export function formatSnapshotForPrompt(snap: MarketSnapshot): string {
  if (snap.data.length === 0) {
    return "NO VERIFIED MARKET DATA AVAILABLE. Mark every price as ⚪ data-gated.";
  }

  const lines = snap.data.map(
    (d) =>
      `${d.instrument}: ${d.value}  [source: ${d.source}; observed: ${d.asOf}${d.live ? "" : "; END-OF-DAY, LAGGED"}]`,
  );

  const missing =
    snap.missing.length > 0
      ? `\n\nUNAVAILABLE THIS RUN (mark ⚪ data-gated, do NOT estimate):\n${snap.missing.join(", ")}`
      : "";

  return `VERIFIED MARKET DATA (fetched ${snap.fetchedAt})\n${lines.join("\n")}${missing}`;
}
