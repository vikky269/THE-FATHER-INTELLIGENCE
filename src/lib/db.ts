import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Uses the SERVICE ROLE key, which bypasses
 * row-level security, so this module must only ever be imported from server
 * components, server actions, route handlers or scripts — never the browser.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export type ReportStatus = "draft" | "published";
export type ReportVisibility = "members" | "public";

export type ReportInsert = {
  slug: string;
  title: string;
  excerpt: string;
  body_raw: string;
  body_md: string;
  category: string;
  framework_version: string | null;
  session_label: string | null;
  report_date: string;
  status: ReportStatus;
  visibility: ReportVisibility;
  author_name: string;
  created_by: string | null;
  published_at: string | null;
};

export type ReportRow = ReportInsert & {
  id: string;
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: Partial<ReportInsert>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

let cached: ReturnType<typeof createClient<Database>> | null = null;

export function db() {
  if (!cached) {
    cached = createClient<Database>(
      required("SUPABASE_URL"),
      required("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return cached;
}

/* --------------------------------------------------------------- queries */

/** Published reports, newest first — the member dashboard feed. */
export async function listPublished(limit = 50): Promise<ReportRow[]> {
  const { data, error } = await db()
    .from("reports")
    .select("*")
    .eq("status", "published")
    .order("report_date", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(`Could not load reports: ${error.message}`);
  return data ?? [];
}

export async function getPublished(slug: string): Promise<ReportRow | null> {
  const { data, error } = await db()
    .from("reports")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Could not load report: ${error.message}`);
  return data ?? null;
}

/** Everything, including drafts — admin only. */
export async function listAll(limit = 100): Promise<ReportRow[]> {
  const { data, error } = await db()
    .from("reports")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Could not load reports: ${error.message}`);
  return data ?? [];
}

export async function getById(id: string): Promise<ReportRow | null> {
  const { data, error } = await db().from("reports").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load report: ${error.message}`);
  return data ?? null;
}

/** Appends -2, -3 … until the slug is free. */
export async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let candidate = base;
  for (let n = 2; n < 60; n += 1) {
    const { data } = await db().from("reports").select("id").eq("slug", candidate).maybeSingle();
    if (!data || (ignoreId && data.id === ignoreId)) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}
