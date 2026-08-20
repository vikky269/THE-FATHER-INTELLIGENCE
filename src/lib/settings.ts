import { db } from "./db";

/**
 * Small key/value store for values the admin edits from the dashboard
 * rather than through a redeploy.
 *
 * Reads are wrapped so a missing table or unreachable database degrades to
 * the fallback instead of taking down the landing page.
 */

export type SettingKey = "youtube_url" | "youtube_title";

export async function getSetting(key: SettingKey, fallback = ""): Promise<string> {
  try {
    const { data, error } = await db()
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return fallback;
    return (data as { value: string }).value || fallback;
  } catch {
    return fallback;
  }
}

export async function getSettings<K extends SettingKey>(keys: K[]): Promise<Record<K, string>> {
  const out = {} as Record<K, string>;
  for (const k of keys) out[k] = "";

  try {
    const { data, error } = await db().from("site_settings").select("key, value").in("key", keys);
    if (error || !data) return out;

    for (const row of data as { key: string; value: string }[]) {
      if ((keys as string[]).includes(row.key)) out[row.key as K] = row.value ?? "";
    }
  } catch {
    // fall through to blanks
  }
  return out;
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  const { error } = await db().from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(`Could not save setting: ${error.message}`);
}