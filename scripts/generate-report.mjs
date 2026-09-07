#!/usr/bin/env node
/**
 * REPORT GENERATOR — standalone runner
 *
 *   node --env-file=.env.local scripts/generate-report.mjs --desk markets --slot full
 *
 * Runs from GitHub Actions on a cron. Deliberately does NOT go through the
 * website: Netlify's free plan kills any function at 10 seconds and a full
 * report takes 60-90, so generation happens here where nothing is waiting
 * on the response.
 *
 * The script writes straight to Supabase, then asks the site to revalidate
 * its cached pages. If that ping fails the report is still saved — the
 * page just refreshes on its own schedule instead.
 */

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/* ----------------------------------------------------------------- args */

const { values: args } = parseArgs({
  options: {
    desk: { type: "string", default: "markets" },
    slot: { type: "string", default: "full" },
    "dry-run": { type: "boolean", default: false },
  },
});

const DESK = args.desk;
const SLOT = args.slot;

if (!["markets", "music"].includes(DESK)) fail(`Unknown desk: ${DESK}`);
if (!["full", "update", "flash", "close"].includes(SLOT)) fail(`Unknown slot: ${SLOT}`);

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const {
  OPENAI_API_KEY,
  OPENAI_MODEL = "gpt-5.6-terra",
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  FRED_API_KEY,
  TWELVE_DATA_API_KEY,
  SITE_URL,
  REVALIDATE_TOKEN,
} = process.env;

/* --------------------------------------------------------- market data */

const TIMEOUT_MS = 15_000;

async function getJson(url, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      console.warn(`  ! ${label}: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`  ! ${label}: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const FRED_SERIES = [
  { id: "DGS10", label: "US 10Y Treasury", fmt: (v) => `${v.toFixed(3)}%` },
  { id: "DGS2", label: "US 2Y Treasury", fmt: (v) => `${v.toFixed(3)}%` },
  // NOTE: this is the broad trade-weighted index, NOT the ICE DXY that
  // trades near 100. Labelled explicitly so it can't be confused for it.
  {
    id: "DTWEXBGS",
    label: "Broad Trade-Weighted Dollar (FRED DTWEXBGS, not ICE DXY)",
    fmt: (v) => v.toFixed(2),
  },
  { id: "DCOILBRENTEU", label: "Brent Crude", fmt: (v) => `$${v.toFixed(2)}/bbl` },
  { id: "DCOILWTICO", label: "WTI Crude", fmt: (v) => `$${v.toFixed(2)}/bbl` },
];

async function fetchFred() {
  if (!FRED_API_KEY) return [];
  const out = [];

  for (const s of FRED_SERIES) {
    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${s.id}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=10`;

    const data = await getJson(url, `FRED ${s.id}`);
    const obs = data?.observations?.find((o) => o.value !== "." && o.value !== "");
    if (!obs) continue;

    const n = Number(obs.value);
    if (!Number.isFinite(n)) continue;

    out.push({
      instrument: s.label,
      value: s.fmt(n),
      asOf: `${obs.date}T00:00:00Z`,
      source: "FRED (St. Louis Fed)",
      live: false,
    });
  }
  return out;
}

async function fetchCrypto() {
  const url =
    "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=bitcoin,ethereum&vs_currencies=usd&include_last_updated_at=true";

  const data = await getJson(url, "CoinGecko");
  if (!data) return [];

  return [
    ["bitcoin", "Bitcoin"],
    ["ethereum", "Ethereum"],
  ].flatMap(([id, label]) => {
    const e = data[id];
    if (!e?.usd) return [];
    return [
      {
        instrument: label,
        value: `$${e.usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        asOf: new Date((e.last_updated_at ?? Date.now() / 1000) * 1000).toISOString(),
        source: "CoinGecko",
        live: true,
      },
    ];
  });
}

const TD_SYMBOLS = [
  { symbol: "XAU/USD", label: "Spot Gold", prefix: "$", suffix: "/oz" },
  { symbol: "EUR/USD", label: "EUR/USD" },
  { symbol: "GBP/USD", label: "GBP/USD" },
  { symbol: "USD/JPY", label: "USD/JPY" },
  { symbol: "SPY", label: "S&P 500 ETF (SPY, not the index level)", prefix: "$" },
  { symbol: "QQQ", label: "Nasdaq 100 ETF (QQQ, not the index level)", prefix: "$" },
  { symbol: "DIA", label: "Dow Jones ETF (DIA, not the index level)", prefix: "$" },
];

async function fetchTwelveData() {
  if (!TWELVE_DATA_API_KEY) return [];

  const symbols = TD_SYMBOLS.map((s) => s.symbol).join(",");
  const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbols)}&apikey=${TWELVE_DATA_API_KEY}`;

  const data = await getJson(url, "Twelve Data");
  if (!data) return [];

  const now = new Date().toISOString();

  return TD_SYMBOLS.flatMap((s) => {
    // A gated symbol returns an error object rather than a price.
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

async function buildSnapshot() {
  console.log("→ Fetching market data…");
  const [td, fred, crypto] = await Promise.all([
    fetchTwelveData().catch(() => []),
    fetchFred().catch(() => []),
    fetchCrypto().catch(() => []),
  ]);

  const data = [...td, ...fred, ...crypto];
  const got = new Set(data.map((d) => d.instrument));
  const expected = [
    ...TD_SYMBOLS.map((s) => s.label),
    ...FRED_SERIES.map((s) => s.label),
    "Bitcoin",
    "Ethereum",
  ];

  const missing = [
    ...expected.filter((e) => !got.has(e)),
    "Silver",
    "Platinum",
    "Palladium",
    "VIX",
    "COT positioning",
  ];

  console.log(`  ${data.length} verified instruments, ${missing.length} unavailable`);
  return { fetchedAt: new Date().toISOString(), data, missing };
}

function formatSnapshot(snap) {
  if (snap.data.length === 0) {
    return "NO VERIFIED MARKET DATA AVAILABLE. Mark every price as ⚪ data-gated.";
  }

  const lines = snap.data.map(
    (d) =>
      `${d.instrument}: ${d.value}  [source: ${d.source}; observed: ${d.asOf}${d.live ? "" : "; END-OF-DAY, LAGGED"}]`,
  );

  return (
    `VERIFIED MARKET DATA (fetched ${snap.fetchedAt})\n${lines.join("\n")}` +
    `\n\nUNAVAILABLE THIS RUN (mark ⚪ data-gated, do NOT estimate):\n${snap.missing.join(", ")}`
  );
}

/* ------------------------------------------------------------ generation */

const OUTPUT_CONTRACT = `
Return ONE JSON object and nothing else. No prose before or after, no
markdown code fences around the JSON.

{
  "title":            string. House pattern, e.g.
                      "Gold Price Forecast Today: XAUUSD Analysis, Fed, Oil & Treasury Yields | <Month D, YYYY> - The Father Intelligence | The Father Group"
  "excerpt":          string, 60-400 chars. The one-line read of the session.
  "body":             string. The FULL report in markdown. See BODY RULES.
  "seoTitle":         string, max 70 chars.
  "seoDescription":   string, max 160 chars.
  "sessionLabel":     string, e.g. "London / New York Macro Data · The Father Intelligence Research Desk"
  "frameworkVersion": string, e.g. "THE FATHER FINANCIAL ANALYST MARKET UNIVERSE™"
}

BODY RULES

- Open with a Truth Protocol legend, then the numbered sections 01-30 from
  the master prompt, using "## 01 — SECTION NAME" headings.
- Close with: FAQ, SEO Entity & Topic Coverage, Suggested Internal Links,
  Social / Discover copy, and the Intelligence Integrity Certificate.
- Markdown tables for dashboards. Fenced code blocks for the adventure map,
  causal chains and Hero/Dragon path diagrams.
- Keep the ✅ 🟡 🔵 🟣 ⚪ provenance markers throughout.

ABSOLUTE DATA RULES

- Use ONLY the verified market data supplied below, exactly as given.
- NEVER recall a price from memory or infer one. Anything listed as
  unavailable is ⚪ data-gated: say the framework carries the previous
  governed value forward rather than inventing a fresher number.
- Where a figure is flagged END-OF-DAY, say so rather than implying it is live.
- Where an instrument is an ETF proxy, do not report it as the index level.
- Probabilities are 🔵 forecasts. Never state or imply a forecast is a fact,
  a guarantee, or advice.
`;

const SLOT_BRIEF = {
  full: "Produce the FULL Market Universe report — every section, 2,000+ words.",
  update:
    "Produce a LIVE UPDATE focused on what has changed since the last report. 600-1,200 words. Do not repeat unchanged sections in full.",
  flash:
    "Produce a DATA FLASH: a short, urgent read on the just-released economic data and its immediate cross-asset transmission. 300-600 words.",
  close:
    "Produce the DAILY CLOSING REPORT: what resolved today, what was confirmed or invalidated, and what carries into tomorrow. 800-1,500 words.",
};

async function generate(snapshot) {
  const file = DESK === "music" ? "music-framework.md" : "father-framework.md";
  const promptPath = path.resolve(process.cwd(), "prompts", file);

  let master;
  try {
    master = await readFile(promptPath, "utf8");
  } catch {
    fail(`Master prompt not found at prompts/${file}`);
  }

  const marketBlock = DESK === "markets" ? formatSnapshot(snapshot) : "";
  const today = new Date().toISOString().slice(0, 10);

  console.log(`→ Calling ${OPENAI_MODEL}…`);
  const started = Date.now();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: master },
        { role: "system", content: OUTPUT_CONTRACT },
        {
          role: "user",
          content: [`Today is ${today}.`, SLOT_BRIEF[SLOT], marketBlock].filter(Boolean).join("\n\n"),
        },
      ],
    }),
  });

  if (!res.ok) fail(`OpenAI ${res.status}: ${(await res.text()).slice(0, 400)}`);

  const payload = await res.json();
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) fail("Model returned no content.");

  console.log(`  model responded in ${Math.round((Date.now() - started) / 1000)}s`);

  let report;
  try {
    report = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    fail(`Model did not return valid JSON:\n${raw.slice(0, 400)}`);
  }

  // Validation. A rejected run publishes nothing, which is always the
  // right failure mode here.
  const problems = [];
  if (!report.title || report.title.length < 20) problems.push("title too short");
  if (!report.excerpt || report.excerpt.length < 60) problems.push("excerpt too short");
  if (!report.body || report.body.length < 1500) problems.push("body too short (truncated?)");
  if (report.seoTitle && report.seoTitle.length > 70) problems.push("seoTitle over 70 chars");
  if (report.seoDescription && report.seoDescription.length > 160)
    problems.push("seoDescription over 160 chars");

  if (problems.length) fail(`Generated report failed validation: ${problems.join("; ")}`);

  return report;
}

/* ---------------------------------------------------------- persistence */

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fences ASCII diagrams so whitespace survives markdown rendering.
 *
 * Two shapes to handle: box-drawing blocks (the command core, adventure
 * map) and arrow chains, which the model writes with blank lines between
 * each step. Chains are tightened first so the whole ladder becomes one
 * block instead of a fence around every individual arrow.
 */
function normaliseBody(md) {
  const BOX = /[\u2500-\u257F\u2580-\u259F]/;
  const ARROWS = /[\u2193\u2191\u2192\u2190\u25b2\u25bc]/;
  const ARROW_ONLY = (l) => /^[\s\u2193\u2191\u2192\u2190\u25b2\u25bc|+]+$/.test(l) && ARROWS.test(l);

  const protectedLine = (l) => {
    const t = l.trim();
    return t.startsWith("|") || t.startsWith("#") || /^(-{3,}|\*{3,}|_{3,})$/.test(t);
  };

  let lines = md.replace(/\r\n?/g, "\n").split("\n");

  // Pass 1 — close the gaps around isolated arrows so a chain reads as
  // one contiguous block.
  const shortLabel = (l) => {
    const t = l.trim();
    return t.length > 0 && t.length <= 40 && !protectedLine(l);
  };
  const drop = new Set();
  for (let i = 0; i < lines.length; i += 1) {
    if (!ARROW_ONLY(lines[i])) continue;
    if (i >= 2 && lines[i - 1].trim() === "" && shortLabel(lines[i - 2])) drop.add(i - 1);
    if (i + 2 < lines.length && lines[i + 1].trim() === "" && shortLabel(lines[i + 2]))
      drop.add(i + 1);
  }
  lines = lines.filter((_, i) => !drop.has(i));

  // Pass 2 — mark diagram lines. Strong = unambiguous. Weak = a short
  // label that only counts when it sits next to something strong.
  const strong = lines.map((l) => !protectedLine(l) && l.trim() !== "" && (BOX.test(l) || ARROW_ONLY(l)));
  const weak = lines.map(
    (l, i) => !strong[i] && !protectedLine(l) && l.trim() !== "" && l.trim().length <= 40,
  );

  const inBlock = new Array(lines.length).fill(false);
  for (let i = 0; i < lines.length; i += 1) {
    if (!strong[i]) continue;
    inBlock[i] = true;
    for (let k = i + 1; k < lines.length && (strong[k] || weak[k]); k += 1) inBlock[k] = true;
    for (let k = i - 1; k >= 0 && (strong[k] || weak[k]); k -= 1) inBlock[k] = true;
  }

  // Pass 3 — emit, leaving any pre-existing fenced block untouched.
  const out = [];
  let open = false;
  let insideFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (open) {
        out.push("```");
        open = false;
      }
      insideFence = !insideFence;
      out.push(line);
      continue;
    }

    if (insideFence) {
      out.push(line);
      continue;
    }

    if (inBlock[i] && !open) {
      out.push("```text");
      open = true;
    } else if (!inBlock[i] && open) {
      out.push("```");
      open = false;
    }
    out.push(line);
  }
  if (open) out.push("```");

  return out.join("\n");
}

async function save(report) {
  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const date = new Date().toISOString().slice(0, 10);
  // Trim the title before appending the date, so the date is never cut off.
  const base = `${slugify(report.title).slice(0, 60).replace(/-+$/, "")}-${date}`;

  let slug = base;
  for (let n = 2; n < 40; n += 1) {
    const { data } = await db.from("reports").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${n}`;
  }

  const { data: setting } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "auto_publish")
    .maybeSingle();

  const status = setting?.value === "on" ? "published" : "draft";

  const { error } = await db.from("reports").insert({
    slug,
    title: report.title,
    excerpt: report.excerpt,
    body_raw: report.body,
    body_md: normaliseBody(report.body),
    category: DESK,
    framework_version: report.frameworkVersion ?? null,
    session_label: report.sessionLabel ?? null,
    report_date: date,
    status,
    visibility: "members",
    author_name: "The Father Intelligence Research Desk",
    created_by: `auto:${SLOT}`,
    published_at: status === "published" ? new Date().toISOString() : null,
  });

  if (error) fail(`Supabase insert failed: ${error.message}`);
  return { slug, status };
}

/** Best-effort cache refresh. Never fatal — the report is already saved. */
async function revalidate(slug) {
  if (!SITE_URL || !REVALIDATE_TOKEN) return;
  try {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVALIDATE_TOKEN}`,
      },
      body: JSON.stringify({ slug }),
    });
    console.log(`→ Revalidate: ${res.status}`);
  } catch (err) {
    console.warn(`  ! Revalidate failed (report is still saved): ${err.message}`);
  }
}

/* -------------------------------------------------------------- run it */

if (!OPENAI_API_KEY) fail("OPENAI_API_KEY is not set.");
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail("Supabase credentials are not set.");

console.log(`\n${DESK} · ${SLOT} · ${new Date().toISOString()}`);

const snapshot = DESK === "markets" ? await buildSnapshot() : { data: [], missing: [] };

if (DESK === "markets" && snapshot.data.length === 0) {
  fail("No verified market data this run. Refusing to generate from an empty snapshot.");
}

const report = await generate(snapshot);

if (args["dry-run"]) {
  console.log("\n--- DRY RUN, nothing saved ---");
  console.log(`title: ${report.title}`);
  console.log(`body:  ${report.body.length} chars`);
  process.exit(0);
}

const { slug, status } = await save(report);
await revalidate(slug);

console.log(`\n✓ ${status.toUpperCase()} — /${slug}`);
console.log(`  ${snapshot.data.length} verified data points\n`);
