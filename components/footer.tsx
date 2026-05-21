"use client"

import Link from "next/link"
import { Github, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL } from "@/lib/github"

const CONTACT_EMAIL = "atesaltinkaynak@gmail.com"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Ateş Altınkaynak
            </Link>
            <p className="text-sm text-muted-foreground">{t.footer.role}</p>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/work" className="hover:text-foreground transition-colors">
              {t.nav.work}
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/process" className="hover:text-foreground transition-colors">
              {t.nav.process}
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              {t.nav.contact}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Github size={18} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            ©{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span> Ateş Altınkaynak.{" "}
            {t.footer.copyright}
          </p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}
