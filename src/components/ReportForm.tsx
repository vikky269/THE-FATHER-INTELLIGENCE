"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveReport, type FormState } from "@/lib/actions";
import type { ReportRow } from "@/lib/db";

const CATEGORIES = ["markets", "music", "business", "culture", "research"] as const;

function Buttons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        name="intent"
        value="publish"
        disabled={pending}
        className="btn-gold"
      >
        {pending ? "Saving…" : "Publish now"}
      </button>
      <button type="submit" name="intent" value="draft" disabled={pending} className="btn-ghost">
        Save as draft
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono block text-[10px] tracking-[0.18em] text-muted uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export default function ReportForm({ report }: { report?: ReportRow }) {
  const [state, formAction] = useActionState<FormState, FormData>(saveReport, undefined);
  const [body, setBody] = useState(report?.body_raw ?? "");

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <form action={formAction} className="space-y-6">
      {report && <input type="hidden" name="id" value={report.id} />}

      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={report?.title}
          placeholder="Gold vs Long-End Yields — Reaction Confirmation Meets New Resistance"
          className="field mt-2.5"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Report date">
          <input
            type="date"
            name="reportDate"
            defaultValue={report?.report_date ?? new Date().toISOString().slice(0, 10)}
            className="field mt-2.5"
          />
        </Field>

        <Field label="Category">
          <select name="category" defaultValue={report?.category ?? "markets"} className="field mt-2.5">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Framework version" hint="Optional — e.g. v3.0">
          <input
            name="frameworkVersion"
            defaultValue={report?.framework_version ?? ""}
            placeholder="v3.0"
            className="field mt-2.5"
          />
        </Field>

        <Field label="Session" hint="Optional — e.g. London / New York Pre-Market">
          <input
            name="sessionLabel"
            defaultValue={report?.session_label ?? ""}
            placeholder="London / New York"
            className="field mt-2.5"
          />
        </Field>

        <Field label="Author" hint="Shown on the report. Use a real, credentialed name.">
          <input
            name="authorName"
            defaultValue={report?.author_name ?? "The Father"}
            className="field mt-2.5"
          />
        </Field>

        <Field label="Visibility">
          <select name="visibility" defaultValue={report?.visibility ?? "members"} className="field mt-2.5">
            <option value="members">Members only</option>
            <option value="public">Public</option>
          </select>
        </Field>
      </div>

      <Field label="URL slug" hint="Leave blank to build one from the title and date.">
        <input
          name="slug"
          defaultValue={report?.slug ?? ""}
          placeholder="gold-xauusd-outlook-2026-08-14"
          className="field mt-2.5"
        />
      </Field>

      <Field label="Excerpt" hint="Leave blank and the first solid paragraph is used.">
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={report?.excerpt ?? ""}
          className="field mt-2.5 resize-y"
        />
      </Field>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            Report body
          </span>
          <span className="font-mono text-[10px] text-muted">{words.toLocaleString()} words</span>
        </div>

        <textarea
          name="body"
          required
          rows={22}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste the full report here, exactly as it comes out of ChatGPT…"
          className="field font-mono mt-2.5 resize-y text-[12.5px] leading-relaxed whitespace-pre"
          spellCheck={false}
        />

        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Paste the raw text. ASCII diagrams, bar meters, tab-separated tables and{" "}
          <span className="font-mono">⸻</span> separators are all converted automatically — you do
          not need to reformat anything.
        </p>
      </div>

      {state?.error && (
        <p
          role="alert"
          className="border-l-2 px-4 py-3 text-sm"
          style={{
            borderColor: "var(--signal-negative)",
            color: "var(--signal-negative)",
            background: "color-mix(in srgb, var(--signal-negative) 8%, transparent)",
          }}
        >
          {state.error}
        </p>
      )}

      <Buttons />
    </form>
  );
}
