-- Adds a structured data column alongside the markdown body.
-- Run once in the Supabase SQL editor.

alter table reports
  add column if not exists report_data jsonb;

comment on column reports.report_data is
  'Structured snapshot of the verified figures used to build this report
   (spot prices, yields, etc). Populated by scripts/generate-report.mjs
   from the same market-data fetch that fed the model — never parsed back
   out of the markdown body. Null for hand-pasted reports.';
