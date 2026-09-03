import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { db, uniqueSlug, type ReportInsert } from "@/lib/db";
import { generateReport, type Desk, type SlotKind } from "@/lib/generate";
import { normaliseReport, slugify } from "@/lib/report-format";
import { getSetting } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // a full 30-section report takes a while

/**
 * POST /api/generate
 *
 * Called by the Netlify scheduled functions, and manually during testing:
 *
 *   curl -X POST "$SITE/api/generate?desk=markets&slot=full" \
 *     -H "Authorization: Bearer $GENERATE_API_TOKEN"
 *
 * Reports land as DRAFTS. Flip the `auto_publish` setting in /admin once
 * the pipeline has earned it.
 */

function authorised(request: NextRequest): boolean {
  const expected = process.env.GENERATE_API_TOKEN;
  if (!expected) return false; // fail closed

  const [scheme, token] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!authorised(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const desk = (params.get("desk") ?? "markets") as Desk;
  const slot = (params.get("slot") ?? "full") as SlotKind;

  if (!["markets", "music"].includes(desk)) {
    return NextResponse.json({ ok: false, error: "Unknown desk." }, { status: 400 });
  }
  if (!["full", "update", "flash", "close"].includes(slot)) {
    return NextResponse.json({ ok: false, error: "Unknown slot." }, { status: 400 });
  }

  const started = Date.now();

  try {
    const { report, modelId, dataPoints } = await generateReport({ desk, slot });

    // Auto-publish is opt-in and lives in the database, so it can be
    // switched without a deploy once the pipeline is trusted.
    const auto = (await getSetting("auto_publish", "off")) === "on";
    const status = auto ? "published" : "draft";

    const date = new Date().toISOString().slice(0, 10);
    const base = slugify(`${report.title}-${date}`) || `${desk}-${slot}-${date}`;
    const slug = await uniqueSlug(base);

    const row: ReportInsert = {
      slug,
      title: report.title,
      excerpt: report.excerpt,
      body_raw: report.body,
      body_md: normaliseReport(report.body),
      category: desk,
      framework_version: report.frameworkVersion ?? null,
      session_label: report.sessionLabel ?? null,
      report_date: date,
      status,
      visibility: "members",
      author_name: "The Father Intelligence Research Desk",
      created_by: `auto:${slot}`,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { error } = await db().from("reports").insert(row);
    if (error) throw new Error(`Database insert failed: ${error.message}`);

    revalidatePath("/admin");
    if (status === "published") {
      revalidatePath("/");
      revalidatePath("/reports");
      revalidatePath(`/reports/${slug}`);
      revalidatePath("/dashboard");
    }

    return NextResponse.json({
      ok: true,
      slug,
      status,
      desk,
      slot,
      modelId,
      verifiedDataPoints: dataPoints,
      tookMs: Date.now() - started,
    });
  } catch (err) {
    // A failed run must publish nothing. Log loudly and return non-200 so
    // the Netlify function log shows a failure rather than a silent no-op.
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[generate] ${desk}/${slot} failed after ${Date.now() - started}ms:`, message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
