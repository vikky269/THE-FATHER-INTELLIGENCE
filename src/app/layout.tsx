import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Cinzel, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "The Father Intelligence — Intelligence before decisions",
  description:
    "Institutional-grade global macro intelligence briefings across gold, crypto, equities, FX, rates and energy.",
  openGraph: {
    title: "The Father Intelligence",
    description: "THE FATHER INTELLIGENCE | Data, Economic Insights, Macro & Market Analytics For Traders, Institutions, Culture",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Father Intelligence",
    description: "Intelligence before decisions.",
    images: ["/og.png"],
  },
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
      className={`${cinzel.variable} ${instrument.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="vignette" aria-hidden />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
    </ClerkProvider>
  );
}
