import type { Config } from "@netlify/functions";

/**
 * Post-data read
 * markets - update - 0 13 * * 1-5 (UTC)
 *
 * Netlify scheduled functions run in UTC and only on PUBLISHED deploys;
 * they do not fire on branch or deploy previews. They also cannot call
 * revalidatePath directly, so this function pokes the Next.js route
 * handler, which does have access to those APIs.
 */
export default async function handler() {
  const site = process.env.SITE_URL ?? process.env.URL;
  const token = process.env.GENERATE_API_TOKEN;

  if (!site || !token) {
    console.error("[markets-update-pm] SITE_URL or GENERATE_API_TOKEN missing - skipping run.");
    return;
  }

  const res = await fetch(`${site}/api/generate?desk=markets&slot=update`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(`[markets-update-pm] ${res.status} ${(await res.text()).slice(0, 300)}`);
}

export const config: Config = { schedule: "0 13 * * *" };
