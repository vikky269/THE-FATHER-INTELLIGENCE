import type { MetadataRoute } from "next";
import { listPublished } from "@/lib/db";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

/**
 * Generated from the database, so a published report is in the sitemap
 * without anyone remembering to add it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/reports`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const reports = await listPublished(500);
    return [
      ...staticRoutes,
      ...reports.map((r) => ({
        url: `${SITE.url}/reports/${r.slug}`,
        lastModified: new Date(r.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // A database blip shouldn't produce an empty sitemap.
    return staticRoutes;
  }
}
