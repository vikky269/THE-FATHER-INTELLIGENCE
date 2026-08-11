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
  title: "The Father Intelligence — Intelligence before decisions",
  description:
    "Institutional-grade global macro intelligence briefings across gold, crypto, equities, FX, rates and energy.",
  openGraph: {
    title: "The Father Intelligence",
    description: "Intelligence before decisions.",
    images: ["/logo.png"],
  },
};

/**
 * Applies the saved theme before first paint so there is no flash of the
 * wrong palette. Light is the default when nothing is stored.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('fi-theme');if(t!=='dark'&&t!=='light'){t='light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
