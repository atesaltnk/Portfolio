import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Contact — Ateş Altınkaynak",
  description: "Internships, collaborations or a project you want built — get in touch with Ateş Altınkaynak.",
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
