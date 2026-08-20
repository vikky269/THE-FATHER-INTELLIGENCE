import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing behind the login should be crawled.
      disallow: ["/admin", "/admin/", "/dashboard", "/dashboard/", "/sign-in", "/sign-up"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
