#!/usr/bin/env node
/**
 * Seeds one report so you can see the dashboard working immediately.
 *
 *   node --env-file=.env.local scripts/seed.mjs path/to/report.txt
 *
 * It runs the same normaliser the admin form uses, so what you see here is
 * exactly what pasting into the form would produce.
 */
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { register } from "node:module";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node --env-file=.env.local scripts/seed.mjs <report.txt>");
  process.exit(1);
}

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// The normaliser is TypeScript; compile-on-import via tsx if available.
let normaliseReport, suggestExcerpt, slugify;
try {
  register("tsx/esm", import.meta.url);
  ({ normaliseReport, suggestExcerpt, slugify } = await import("../src/lib/report-format.ts"));
} catch {
  console.error("Install tsx first:  npm i -D tsx");
  process.exit(1);
}

const raw = await readFile(file, "utf8");
const date = new Date().toISOString().slice(0, 10);
const title = "Gold vs Long-End Yields — Reaction Confirmation Meets New Resistance";

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { error } = await db.from("reports").upsert(
  {
    slug: slugify(`${title}-${date}`),
    title,
    excerpt: suggestExcerpt(raw) || title,
    body_raw: raw,
    body_md: normaliseReport(raw),
    category: "markets",
    framework_version: "v3.0",
    session_label: "London / New York",
    report_date: date,
    status: "published",
    visibility: "members",
    author_name: "The Father",
    published_at: new Date().toISOString(),
  },
  { onConflict: "slug" },
);

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log("✓ Seeded one published report. Sign in and open /dashboard.");
