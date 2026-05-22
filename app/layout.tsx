import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { ScrollToTop } from "@/components/system/ScrollToTop"
import "./globals.css"

const _inter = Inter({ subsets: ["latin", "latin-ext"] })
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})



export const metadata: Metadata = {
  title: "Ateş Altınkaynak | Software Developer",
  description:
    "Software developer building web apps, backends, and systems software. Most of my work is open source — explore my projects, synced live from GitHub.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "software developer",
    "full-stack developer",
    "TypeScript",
    "Python",
    "C++",
    "Next.js",
    "Ankara",
    "open source",
  ],
  authors: [{ name: "Ateş Altınkaynak" }],
  openGraph: {
    title: "Ateş Altınkaynak | Software Developer",
    description:
      "Software developer building web apps, backends, and systems software. Projects synced live from GitHub.",
    url: "https://atesaltinkaynak.com",
    siteName: "Ateş Altınkaynak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ateş Altınkaynak | Software Developer",
    description:
      "Software developer building web apps, backends, and systems software.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#126B4A",
  width: "device-width",
  initialScale: 1,
}

import { Header } from "@/components/header"
import { GlobalAtmosphericBackground } from "@/components/motion/global-atmospheric-background"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground relative`}
      >
        <LanguageProvider>
          <Header />
          <ScrollToTop />
          <GlobalAtmosphericBackground />
          <div className="relative z-10 transition-colors duration-1000">
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
