"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db, getById, uniqueSlug, type ReportInsert } from "@/lib/db";
import { normaliseReport, slugify, suggestExcerpt } from "@/lib/report-format";

export type FormState = { error?: string; ok?: string } | undefined;

const CATEGORIES = ["markets", "music", "business", "culture", "research"];

/** Refresh every surface a report can appear on. */
function refresh(slug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/dashboard/reports/${slug}`);
}

function readForm(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    id: get("id"),
    title: get("title"),
    slugInput: get("slug"),
    excerpt: get("excerpt"),
    body: String(formData.get("body") ?? ""), // keep whitespace — it's the diagrams
    category: get("category"),
    frameworkVersion: get("frameworkVersion"),
    sessionLabel: get("sessionLabel"),
    reportDate: get("reportDate"),
    authorName: get("authorName"),
    visibility: get("visibility") === "public" ? "public" : "members",
    publish: get("intent") === "publish",
  } as const;
}

/**
 * Create or update a report from the paste form.
 *
 * The pasted text is stored verbatim in body_raw and the normalised
 * markdown in body_md, so the admin can always re-edit the original.
 */
export async function saveReport(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const f = readForm(formData);

  if (f.title.length < 6) return { error: "Give the report a title of at least 6 characters." };
  if (f.body.trim().length < 200) {
    return { error: "The report body looks too short. Paste the full report." };
  }
  if (!CATEGORIES.includes(f.category)) return { error: "Choose a valid category." };

  const reportDate = /^\d{4}-\d{2}-\d{2}$/.test(f.reportDate)
    ? f.reportDate
    : new Date().toISOString().slice(0, 10);

  const baseSlug = slugify(f.slugInput || `${f.title}-${reportDate}`);
  if (!baseSlug) return { error: "Could not build a URL from that title. Add a slug manually." };

  const excerpt = f.excerpt || suggestExcerpt(f.body) || f.title;

  const row: ReportInsert = {
    slug: baseSlug,
    title: f.title,
    excerpt,
    body_raw: f.body,
    body_md: normaliseReport(f.body),
    category: f.category,
    framework_version: f.frameworkVersion || null,
    session_label: f.sessionLabel || null,
    report_date: reportDate,
    status: f.publish ? "published" : "draft",
    visibility: f.visibility,
    author_name: f.authorName || "The Father",
    created_by: admin.id,
    published_at: f.publish ? new Date().toISOString() : null,
  };

  let slug = baseSlug;

  if (f.id) {
    const existing = await getById(f.id);
    if (!existing) return { error: "That report no longer exists." };

    slug = await uniqueSlug(baseSlug, f.id);
    // Don't reset the original publish time when re-saving a live report.
    const publishedAt =
      row.status === "published" ? (existing.published_at ?? row.published_at) : null;

    const { error } = await db()
      .from("reports")
      .update({ ...row, slug, published_at: publishedAt })
      .eq("id", f.id);

    if (error) return { error: `Could not save: ${error.message}` };
    refresh(slug);
    refresh(existing.slug);
  } else {
    slug = await uniqueSlug(baseSlug);
    const { error } = await db()
      .from("reports")
      .insert({ ...row, slug });

    if (error) return { error: `Could not save: ${error.message}` };
    refresh(slug);
  }

  redirect(f.publish ? `/dashboard/reports/${slug}` : "/admin?saved=1");
}

/** Publish or unpublish from the admin list. */
export async function setStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("status") ?? "") === "published" ? "published" : "draft";

  const existing = await getById(id);
  if (!existing) return;

  await db()
    .from("reports")
    .update({
      status: next,
      published_at:
        next === "published" ? (existing.published_at ?? new Date().toISOString()) : null,
    })
    .eq("id", id);

  refresh(existing.slug);
}

export async function deleteReport(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const existing = await getById(id);
  if (!existing) return;

  await db().from("reports").delete().eq("id", id);
  refresh(existing.slug);
}
