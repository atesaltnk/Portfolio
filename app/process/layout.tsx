import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Process — Ateş Altınkaynak",
  description: "Plan, build, test, ship — how Ateş Altınkaynak works on every project.",
}

export default function ProcessLayout({ children }: { children: ReactNode }) {
  return children
}
