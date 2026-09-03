import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { fetchMarketSnapshot, formatSnapshotForPrompt } from "./market-data";

/**
 * REPORT GENERATION
 *
 * Loads THE FATHER master prompt, injects verified market data, asks the
 * model for a report as JSON, and validates the result before anything
 * touches the database.
 *
 * Validation is not bureaucracy — it is the last gate before a malformed
 * generation reaches subscribers. A rejected run publishes nothing, which
 * is always the right failure mode here.
 */

export type Desk = "markets" | "music";

/* --------------------------------------------------------- output shape */

export const generatedReportSchema = z.object({
  title: z.string().min(20).max(200),
  excerpt: z.string().min(60).max(400),
  body: z.string().min(1500), // a 30-section report is never short
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  sessionLabel: z.string().max(120).optional(),
  frameworkVersion: z.string().max(80).optional(),
});

export type GeneratedReport = z.infer<typeof generatedReportSchema>;

/* -------------------------------------------------------- output contract */

const OUTPUT_CONTRACT = `
Return ONE JSON object and nothing else. No prose before or after, no
markdown code fences around the JSON.

{
  "title":            string. Follow the house pattern, e.g.
                      "Gold Price Forecast Today: XAUUSD Analysis, Fed, Oil & Treasury Yields | <Month D, YYYY> - The Father Intelligence | The Father Group"
  "excerpt":          string, 60-400 chars. The one-line read of the session.
  "body":             string. The FULL report in markdown. See BODY RULES.
  "seoTitle":         string, max 70 chars.
  "seoDescription":   string, max 160 chars.
  "sessionLabel":     string, e.g. "London / New York Macro Data · The Father Intelligence Research Desk"
  "frameworkVersion": string, e.g. "THE FATHER FINANCIAL ANALYST MARKET UNIVERSE™"
}

BODY RULES

- Open with a Truth Protocol legend, then the numbered sections 01-30 as
  defined in the master prompt, using "## 01 — SECTION NAME" headings.
- Close with: FAQ, SEO Entity & Topic Coverage, Suggested Internal Links,
  Social / Discover copy, and the Intelligence Integrity Certificate.
- Use markdown tables for dashboards. Use fenced code blocks for the
  adventure map, causal chains and Hero/Dragon path diagrams.
- Keep the ✅ 🟡 🔵 🟣 ⚪ provenance markers throughout.

ABSOLUTE DATA RULES

- Use ONLY the verified market data supplied below. Quote each figure with
  the value given.
- NEVER recall a price from memory or infer one. If an instrument is listed
  as unavailable, mark it ⚪ data-gated and say the framework carries the
  previous governed value forward rather than inventing a fresher number.
- Where a figure is flagged END-OF-DAY, say so rather than implying it is live.
- Probabilities must sum coherently and be labelled 🔵 as forecasts.
- Never state or imply that a forecast is a fact, a guarantee, or advice.
`;

/* ------------------------------------------------------------- assembly */

async function loadMasterPrompt(desk: Desk): Promise<string> {
  const file = desk === "music" ? "music-framework.md" : "father-framework.md";
  const full = path.resolve(process.cwd(), "prompts", file);

  try {
    return await readFile(full, "utf8");
  } catch {
    throw new Error(
      `Master prompt not found at prompts/${file}. ` +
        `Paste the framework prompt into that file (it is git-ignored).`,
    );
  }
}

/** Which of the seven daily slots this run is, for context in the prompt. */
export type SlotKind = "full" | "update" | "flash" | "close";

const SLOT_BRIEF: Record<SlotKind, string> = {
  full: "Produce the FULL Market Universe report — every section, 2,000+ words.",
  update:
    "Produce a LIVE UPDATE: the same structure but focused on what has changed since the last report. 600-1,200 words. Do not repeat unchanged sections in full.",
  flash:
    "Produce a DATA FLASH: a short, urgent read on the just-released economic data and its immediate cross-asset transmission. 300-600 words.",
  close:
    "Produce the DAILY CLOSING REPORT: what resolved today, what was confirmed or invalidated, and what carries into tomorrow. 800-1,500 words.",
};

export async function generateReport(opts: {
  desk: Desk;
  slot: SlotKind;
}): Promise<{ report: GeneratedReport; modelId: string; dataPoints: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");

  const model = process.env.OPENAI_MODEL ?? "gpt-4o";
  const master = await loadMasterPrompt(opts.desk);

  // Music reports are cultural analysis, not price analysis — no market
  // data injection, and no pretence of one.
  const marketBlock =
    opts.desk === "markets" ? formatSnapshotForPrompt(await fetchMarketSnapshot()) : "";

  const dataPoints =
    opts.desk === "markets" ? marketBlock.split("\n").filter((l) => l.includes("[source:")).length : 0;

  if (opts.desk === "markets" && dataPoints === 0) {
    throw new Error(
      "No verified market data available this run. Refusing to generate a markets report from an empty snapshot.",
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: master },
        { role: "system", content: OUTPUT_CONTRACT },
        {
          role: "user",
          content: [
            `Today is ${today}.`,
            SLOT_BRIEF[opts.slot],
            marketBlock,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI call failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Model returned no content.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    throw new Error(`Model did not return valid JSON. First 400 chars:\n${raw.slice(0, 400)}`);
  }

  const check = generatedReportSchema.safeParse(parsed);
  if (!check.success) {
    const issues = check.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Generated report failed validation — ${issues}`);
  }

  return { report: check.data, modelId: model, dataPoints };
}
