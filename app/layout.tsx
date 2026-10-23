import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { SITE_URL } from "@/lib/site"
import { MOTION_SCRIPT } from "@/lib/motion-pref"
import { SmoothScroll } from "@/components/shell/smooth-scroll"
import { Preloader } from "@/components/shell/preloader"
import { Header } from "@/components/shell/header"
import { Footer } from "@/components/shell/footer"
import { GridOverlay } from "@/components/shell/grid-overlay"
import { Cursor } from "@/components/shell/cursor"
import "./globals.css"

// One variable family, two voices: width 62 for display, 100 for reading.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ateş Altınkaynak — Software Developer",
  description:
    "Software developer in Ankara building web apps, backends and systems software in TypeScript, Python and C++. Projects synced live from GitHub.",
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Ateş Altınkaynak",
    "software developer",
    "full-stack developer",
    "TypeScript",
    "Next.js",
    "Python",
    "C++",
    "Ankara",
    "open source",
  ],
  authors: [{ name: "Ateş Altınkaynak" }],
  openGraph: {
    title: "Ateş Altınkaynak — Software Developer",
    description:
      "Web apps, backends and systems software in TypeScript, Python and C++. Projects synced live from GitHub.",
    url: SITE_URL,
    siteName: "Ateş Altınkaynak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ateş Altınkaynak — Software Developer",
    description: "Web apps, backends and systems software in TypeScript, Python and C++.",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Resolves motion mode + first-visit intro before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body className="scheme-paper antialiased">
        <LanguageProvider>
          <SmoothScroll />
          <Preloader />
          <Header />
          <div id="main" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer />
          <GridOverlay />
          <Cursor />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
