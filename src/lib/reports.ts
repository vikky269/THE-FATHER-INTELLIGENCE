/**
 * All briefing content is stored here as static data.
 * Source: THE FATHER FINANCIAL ANALYST MARKET UNIVERSE(TM) v8.2 briefing,
 * 6 August 2026, London / New York pre-market session.
 *
 * To publish a new briefing: update this file and redeploy. Nothing else changes.
 */

export type Signal = "positive" | "caution" | "negative" | "neutral";

export const BRIEFING = {
  version: "v8.2",
  title: "Institutional Mission Control",
  subtitle: "Global Macro Intelligence",
  session: "London / New York Pre-Market",
  dateLabel: "6 August 2026",
  isoDate: "2026-08-06",
  framework:
    "Shekeh THE FATHER Macro Framework\u2122 \u00d7 Institutional Research \u00d7 Quantitative Decision Science \u00d7 AI Probability Engine \u00d7 Continuous Feedback Intelligence",
  missionScore: 98.2,
  frameworkConfidence: 97,
  compositeSentiment: 86,
  strategicBias: "Moderately Bullish",
};

/* ---------------------------------------------------------------- Engines */

export const COMMAND_ENGINES: {
  name: string;
  status: string;
  score: number;
  signal: Signal;
}[] = [
  { name: "Global Macro Cycle", status: "Expansion (Cooling)", score: 96, signal: "positive" },
  { name: "Global Liquidity", status: "Improving", score: 95, signal: "positive" },
  { name: "Central Banks", status: "Data Dependent", score: 94, signal: "caution" },
  { name: "Quant Trend", status: "Bullish", score: 97, signal: "positive" },
  { name: "Event Risk", status: "Maximum", score: 100, signal: "negative" },
  { name: "Institutional Bias", status: "Moderately Bullish", score: 97, signal: "positive" },
];

export const QUANT_ENGINES = [
  { name: "Trend Persistence", score: 97 },
  { name: "Momentum", score: 94 },
  { name: "Liquidity", score: 95 },
  { name: "Cross-Asset Alignment", score: 97 },
  { name: "Macro Alignment", score: 98 },
  { name: "Volatility Management", score: 80 },
  { name: "Portfolio Stability", score: 94 },
];

export const QUANT_ASSESSMENT = [
  "Trend-following remains the dominant quantitative regime.",
  "Lower yields continue supporting non-yielding assets.",
  "Gold has the strongest macro alignment.",
  "Bitcoin remains liquidity-sensitive.",
  "Technology leadership is weakening.",
];

export const PROBABILITY_SCORES = [
  { name: "AI Framework", score: 97 },
  { name: "Quant Model", score: 97 },
  { name: "Institutional Alignment", score: 98 },
  { name: "Macro Environment", score: 98 },
  { name: "Execution Readiness", score: 96 },
  { name: "Data Integrity", score: 99 },
];

/* ------------------------------------------------------------- Causality */

export const MACRO_CAUSALITY = [
  "Weak ADP employment",
  "Lower Treasury yields",
  "US dollar softens",
  "Financial conditions ease",
];

export const CAUSALITY_OUTCOMES = [
  { asset: "Gold", direction: "up" as const, note: "Strongest beneficiary" },
  { asset: "Bitcoin", direction: "up" as const, note: "Liquidity-driven" },
  { asset: "Equities", direction: "flat" as const, note: "Mixed, narrowing leadership" },
];

export const INTERMARKET_CHAIN = [
  "Oil \u2193",
  "Inflation expectations \u2193",
  "Treasury yields \u2193",
  "Dollar \u2193",
  "Gold \u2191",
];

export const EXECUTIVE_INTELLIGENCE =
  "Markets remain anchored to the U.S. labour picture after July's soft ADP employment print. Treasury yields have eased, the dollar index is holding under the psychologically important 100 level, Brent has slipped beneath $80 a barrel, and gold has pushed to a seven-week high. The Nonfarm Payrolls release is the next decisive catalyst.";

/* --------------------------------------------------------- Market tape */

export const GLOBAL_TAPE: {
  instrument: string;
  value: string;
  signal: Signal;
}[] = [
  { instrument: "Spot Gold", value: "$4,276/oz", signal: "positive" },
  { instrument: "Gold Futures", value: "$4,314/oz", signal: "positive" },
  { instrument: "Silver", value: "$61.84/oz", signal: "positive" },
  { instrument: "DXY", value: "Below 100", signal: "negative" },
  { instrument: "US 2Y", value: "4.178%", signal: "negative" },
  { instrument: "US 10Y", value: "4.616%", signal: "negative" },
  { instrument: "Brent", value: "$79.84/bbl", signal: "negative" },
  { instrument: "WTI", value: "$75.38/bbl", signal: "negative" },
  { instrument: "Bitcoin", value: "$64,900", signal: "positive" },
  { instrument: "Dow Jones", value: "Near record highs", signal: "positive" },
  { instrument: "S&P 500", value: "Slight pullback", signal: "caution" },
  { instrument: "Nasdaq", value: "Tech under pressure", signal: "caution" },
];

/* -------------------------------------------------- Signature: the ladder */

export type Zone = {
  name: string;
  low: number;
  high: number;
  label: string;
  tier: "throne" | "premium" | "expansion" | "battle" | "hero" | "treasure" | "vault";
};

/** Liquidity Heat Map(TM) zones for gold, priced in USD/oz. */
export const LIQUIDITY_ZONES: Zone[] = [
  { name: "Golden Throne", low: 4500, high: 4620, label: "4500+", tier: "throne" },
  { name: "Premium Castle", low: 4350, high: 4400, label: "4350\u20134400", tier: "premium" },
  { name: "Expansion Bridge", low: 4250, high: 4300, label: "4250\u20134300", tier: "expansion" },
  { name: "Battle Fortress", low: 4180, high: 4250, label: "4180\u20134250", tier: "battle" },
  { name: "Hero Village", low: 4120, high: 4180, label: "4120\u20134180", tier: "hero" },
  { name: "Treasure Cave", low: 4050, high: 4120, label: "4050\u20134120", tier: "treasure" },
  { name: "Institutional Vaults", low: 3900, high: 4000, label: "Below 4000", tier: "vault" },
];

export const SPOT_GOLD = 4276;
export const FRAMEWORK_PIVOT = 4235;

export const INSTITUTIONAL_VAULTS = [
  "Alpha Vault",
  "Bravo Vault",
  "Charlie Vault",
  "Delta Vault",
  "Omega Vault (Strategic Accumulation)",
];

/* ------------------------------------------------------------ Scenarios */

export const SCENARIOS = [
  {
    name: "Hero Continuation",
    probability: 84,
    path: [4235, 4300, 4350, 4500],
    tone: "positive" as const,
  },
  { name: "Consolidation", probability: 12, path: [], tone: "neutral" as const },
  {
    name: "Dragon Reversal",
    probability: 4,
    path: [4235, 4175, 4100, 4000],
    tone: "negative" as const,
  },
];

export const QUARTERLY_THEORY = [
  "Discount",
  "Accumulation",
  "Recovery",
  "Expansion",
  "Premium Delivery",
  "Golden Throne",
];
export const QUARTERLY_CURRENT = 3; // Expansion

/* ------------------------------------------------------- Positioning */

export const COT_POSITIONING: { participant: string; position: string; signal: Signal }[] = [
  { participant: "Managed Money", position: "Net long gold", signal: "positive" },
  { participant: "Commercial Hedgers", position: "Net short", signal: "negative" },
  { participant: "Producers", position: "Hedged", signal: "negative" },
  { participant: "Central Banks", position: "Structural buyers", signal: "positive" },
];

export const INSTITUTIONAL_READ =
  "The structural backdrop stays supportive for gold, but Friday's payroll data could force meaningful short-term repositioning.";

export const FEAR_GREED = [
  { market: "Gold", reading: 90 },
  { market: "Equities", reading: 83 },
  { market: "Crypto", reading: 69 },
  { market: "Dollar", reading: 43 },
];

export const TIMEFRAME_BIAS: { timeframe: string; bias: string; signal: Signal }[] = [
  { timeframe: "Quarterly", bias: "Bullish", signal: "positive" },
  { timeframe: "Monthly", bias: "Bullish", signal: "positive" },
  { timeframe: "Weekly", bias: "Bullish", signal: "positive" },
  { timeframe: "Daily", bias: "Bullish", signal: "positive" },
  { timeframe: "H4", bias: "Bullish", signal: "positive" },
  { timeframe: "H1", bias: "Neutral", signal: "caution" },
];

/** EdgeFinder(TM) matrix. "on" = confirmed driver, "watch" = pending, "off" = no effect. */
export const EDGEFINDER: {
  driver: string;
  gold: "on" | "watch" | "off";
  bitcoin: "on" | "watch" | "off";
  equities: "on" | "watch" | "off";
}[] = [
  { driver: "Dollar weakness", gold: "on", bitcoin: "on", equities: "off" },
  { driver: "Lower yields", gold: "on", bitcoin: "on", equities: "on" },
  { driver: "Labor data", gold: "watch", bitcoin: "watch", equities: "watch" },
  { driver: "Oil prices", gold: "on", bitcoin: "off", equities: "on" },
  { driver: "Fed expectations", gold: "watch", bitcoin: "watch", equities: "watch" },
  { driver: "Liquidity", gold: "watch", bitcoin: "watch", equities: "watch" },
];

export const MACRO_EVENTS = [
  { event: "U.S. Nonfarm Payrolls", impact: 5 },
  { event: "Weekly Jobless Claims", impact: 4 },
  { event: "Productivity & Unit Labor Costs", impact: 3 },
  { event: "Federal Reserve Speakers", impact: 3 },
];

/* -------------------------------------------------------------- Verdict */

export const SUPPORTING_FACTORS = [
  "Treasury yields continue to soften.",
  "DXY remains below 100.",
  "Oil prices remain below $80/bbl.",
  "Liquidity conditions continue to improve.",
  "Central-bank demand remains supportive for gold.",
];

export const PRIMARY_RISK =
  "The upcoming U.S. Nonfarm Payrolls report is the decisive macro event. A stronger-than-expected print would lift the dollar and push Treasury yields higher; another soft report reinforces the backdrop that has favoured gold and other liquidity-sensitive assets.";

export const EXECUTION_PLAN = {
  strategic:
    "Maintain a constructive higher-timeframe bias while the macro backdrop stays supportive.",
  tactical: [
    "Watch DXY around the 100 threshold.",
    "Monitor the 10-year Treasury yield for confirmation.",
    "Expect elevated volatility around payroll data.",
    "Prefer disciplined pullbacks into institutional demand zones.",
    "Reassess positioning immediately after the employment release.",
  ],
};

export const CLASSIFICATION = [
  {
    tier: "Verified",
    tone: "positive" as const,
    body: "Current market prices, Treasury yields, oil prices, labour-market developments and the macro backdrop, sourced from same-day reporting.",
  },
  {
    tier: "Framework-derived",
    tone: "caution" as const,
    body: "Liquidity Heat Map\u2122, CRT, Institutional Vaults\u2122, fair value gaps, order blocks, fixed range volume profile and weekly tradeable zones.",
  },
  {
    tier: "AI-derived",
    tone: "neutral" as const,
    body: "Probability Engine outputs, quant scores, Hero vs Dragon\u2122 paths and confidence metrics. Scenario probabilities are framework-generated, not statistically validated forecasts.",
  },
];

export const SMC = {
  structure: [
    "Higher-high sequence remains intact.",
    "Buy-side liquidity remains the primary objective.",
    "Institutional demand continues to absorb pullbacks.",
  ],
  fairValueGaps: ["4240\u20134275", "4175\u20134205"],
  upsideTargets: "4300 \u2192 4350",
};

/* --------------------------------------------------------- Market desks */

export type MarketDesk = {
  slug: string;
  name: string;
  instrument: string;
  bias: string;
  signal: Signal;
  conviction: number;
  headline: string;
  drivers: string[];
  levels: { label: string; value: string }[];
};

export const MARKET_DESKS: MarketDesk[] = [
  {
    slug: "gold",
    name: "Gold",
    instrument: "XAU/USD",
    bias: "Moderately Bullish",
    signal: "positive",
    conviction: 97,
    headline: "Strongest macro alignment across the board. Seven-week high intact.",
    drivers: [
      "Central banks remain structural buyers.",
      "Real yields falling as the dollar holds below 100.",
      "Managed money net long; commercials hedged into strength.",
    ],
    levels: [
      { label: "Spot", value: "$4,276/oz" },
      { label: "Futures", value: "$4,314/oz" },
      { label: "Upside targets", value: "4300 \u2192 4350" },
      { label: "Fair value gaps", value: "4240\u20134275 / 4175\u20134205" },
      { label: "Invalidation", value: "Below 4000" },
    ],
  },
  {
    slug: "bitcoin",
    name: "Bitcoin",
    instrument: "BTC/USD",
    bias: "Stable, liquidity-driven",
    signal: "positive",
    conviction: 88,
    headline: "Tracks the liquidity impulse rather than the macro cycle.",
    drivers: [
      "Improving global liquidity is the dominant input.",
      "Dollar weakness supportive; yield path matters more than flows.",
      "Sensitive to any hawkish repricing after payrolls.",
    ],
    levels: [
      { label: "Spot", value: "$64,900" },
      { label: "Sentiment", value: "69 / 100" },
      { label: "Regime", value: "Liquidity-sensitive" },
    ],
  },
  {
    slug: "equities",
    name: "Equities",
    instrument: "US Indices",
    bias: "Mixed",
    signal: "caution",
    conviction: 74,
    headline: "Index strength masks narrowing leadership underneath.",
    drivers: [
      "Dow near record highs while the S&P pulls back slightly.",
      "Technology leadership is weakening.",
      "Lower yields help, but breadth is the problem.",
    ],
    levels: [
      { label: "Dow Jones", value: "Near record highs" },
      { label: "S&P 500", value: "Slight pullback" },
      { label: "Nasdaq", value: "Tech under pressure" },
      { label: "Sentiment", value: "83 / 100" },
    ],
  },
  {
    slug: "dollar-fx",
    name: "Dollar & FX",
    instrument: "DXY",
    bias: "Weak",
    signal: "negative",
    conviction: 92,
    headline: "Below 100 and supportive for the entire commodity complex.",
    drivers: [
      "Soft ADP print removed the near-term rate support.",
      "The 100 threshold is the line that decides the next leg.",
      "A hot payroll number is the single biggest reversal risk.",
    ],
    levels: [
      { label: "DXY", value: "Below 100" },
      { label: "Sentiment", value: "43 / 100" },
      { label: "Trigger", value: "Nonfarm Payrolls" },
    ],
  },
  {
    slug: "rates",
    name: "Rates",
    instrument: "US Treasuries",
    bias: "Falling",
    signal: "positive",
    conviction: 95,
    headline: "Yields easing across the curve; the engine behind everything else.",
    drivers: [
      "Weak employment data pulled the front end lower.",
      "Falling yields lift every non-yielding asset.",
      "The 10-year is the confirmation instrument to watch.",
    ],
    levels: [
      { label: "US 2Y", value: "4.178%" },
      { label: "US 10Y", value: "4.616%" },
      { label: "Direction", value: "Softening" },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    instrument: "Brent / WTI",
    bias: "Soft",
    signal: "negative",
    conviction: 86,
    headline: "Brent under $80 is quietly doing the disinflation work.",
    drivers: [
      "Lower crude feeds straight into inflation expectations.",
      "That easing flows through to yields, then the dollar, then gold.",
      "Supportive for equities via the input-cost channel.",
    ],
    levels: [
      { label: "Brent", value: "$79.84/bbl" },
      { label: "WTI", value: "$75.38/bbl" },
      { label: "Threshold", value: "$80/bbl" },
    ],
  },
];

export function getDesk(slug: string) {
  return MARKET_DESKS.find((d) => d.slug === slug);
}


/* ------------------------------------------------------- mission strip */

/**
 * The five headline readings under the hero.
 *
 * Hand-maintained for now. When the generator lands, these come off the
 * latest report record instead — the shape stays the same, so nothing in
 * the UI has to change.
 */
export const MISSION_STRIP: { label: string; value: string; signal: Signal }[] = [
  { label: "Market state", value: "Expansion (cooling)", signal: "positive" },
  { label: "Primary battlefield", value: "Gold · 4,395–4,400", signal: "caution" },
  { label: "Hero vs Dragon™", value: "84% / 4%", signal: "positive" },
  { label: "Capital permission™", value: "62 / 100", signal: "caution" },
  { label: "Next decision level", value: "4,400", signal: "neutral" },
];

export const SCOREBOARD_LINE = "Reality owns the scoreboard.";