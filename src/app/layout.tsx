import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { SITE, organizationJsonLd } from "@/lib/seo";
import "./globals.css";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-face",
  display: "swap",
});

/**
 * Icons are file-based conventions, not metadata:
 *   src/app/favicon.ico     → browser tabs, bookmarks
 *   src/app/icon.png        → modern browsers, higher resolution
 *   src/app/apple-icon.png  → iOS home-screen
 * Next.js finds these by filename and emits the <link> tags itself.
 *
 * metadataBase resolves relative image paths to absolute URLs, which social
 * platforms require. Without it Next warns and falls back to localhost, so
 * shared links show no preview image.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: SITE.title,
    // Child pages set only their own name; the brand is appended here.
    template: `%s | THE FATHER INTELLIGENCE`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: "en",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },

  category: "finance",
};

/**
 * Applies the saved theme before first paint so there is no flash of the
 * wrong palette. Light is the default when nothing is stored.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('fi-theme');if(t!=='dark'&&t!=='light'){t='light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${instrument.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="vignette" aria-hidden />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
    </ClerkProvider>
  );
}
