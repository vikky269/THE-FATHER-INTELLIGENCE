/**
 * Central place for the site's identity strings so the metadata, the
 * structured data and any share cards can never drift apart.
 */

export const SITE = {
  name: "The Father Intelligence",
  legalName: "The Father Intelligence",
  tagline: "Intelligence before decisions.",

  /**
   * Google typically renders only the first ~60 characters of a title in
   * results, so the brand and the two highest-value words come first and
   * the long tail trails behind.
   */
  title:
    "THE FATHER INTELLIGENCE | Data, Economic Insights, Macro & Market Analytics For Traders, Institutions, Culture.",

  description:
    "Institutional-grade macro and market intelligence. Daily briefings across gold, crypto, equities, FX, rates and energy — data, economic insight and cross-asset analysis for traders and institutions.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thefatherintelligence.com",

  keywords: [
    "macro analysis",
    "market intelligence",
    "gold analysis",
    "XAUUSD outlook",
    "economic insights",
    "market analytics",
    "institutional research",
    "cross-asset analysis",
    "trading research",
  ],
} as const;

/**
 * Organization + WebSite structured data.
 *
 * Tells search engines the brand is a single publishing entity so results
 * can carry the name and logo consistently rather than guessing from page
 * titles. Injected once, in the root layout.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        description: SITE.description,
        slogan: SITE.tagline,
        logo: {
          "@type": "ImageObject",
          url: `${SITE.url}/logo.png`,
          width: 697,
          height: 695,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

/** Per-report structured data, used on public report pages. */
export function reportJsonLd(report: {
  title: string;
  excerpt: string;
  slug: string;
  report_date: string;
  author_name: string;
  published_at: string | null;
  updated_at: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AnalysisNewsArticle",
    headline: report.title.slice(0, 110),
    description: report.excerpt,
    url: `${SITE.url}/reports/${report.slug}`,
    datePublished: report.published_at ?? `${report.report_date}T00:00:00Z`,
    dateModified: report.updated_at,
    author: { "@type": "Person", name: report.author_name },
    publisher: { "@id": `${SITE.url}/#organization` },
    isAccessibleForFree: false,
    inLanguage: "en",
  };
}
