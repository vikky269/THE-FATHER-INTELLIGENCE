import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/revalidate
 *
 * Called by the GitHub Actions runner after it saves a report, so the
 * cached pages pick it up immediately instead of waiting for the 5-minute
 * window. Returns in milliseconds, so it stays well inside Netlify's
 * 10-second function limit — unlike generation, which is why that moved
 * out to Actions in the first place.
 */
function authorised(request: NextRequest): boolean {
  const expected = process.env.REVALIDATE_TOKEN;
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

  let slug: string | undefined;
  try {
    slug = (await request.json())?.slug;
  } catch {
    // Body is optional — without a slug we still refresh the index pages.
  }

  const paths = ["/", "/reports", "/dashboard", "/admin"];
  if (slug) paths.push(`/reports/${slug}`, `/dashboard/reports/${slug}`);

  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ ok: true, revalidated: paths });
}
