"use client"

import { useLanguage } from "@/lib/language-context"
import type { Project } from "@/lib/projects"
import { PageHead } from "@/components/site/page-head"
import { RepoIndex } from "@/components/home/repo-index"
import { ContactCta } from "@/components/home/contact-cta"

export function WorkView({ projects }: { projects: Project[] }) {
  const { t } = useLanguage()

  return (
    <main>
      <PageHead
        label={t.workPage.label}
        kicker={t.workPage.kicker}
        word={t.workPage.word}
        intro={t.workPage.intro}
        aside={
          <span className="t-label text-dim">
            {String(projects.length).padStart(2, "0")} {t.index.count}
          </span>
        }
      />
      <RepoIndex projects={projects} withFilter headless />
      <ContactCta />
    </main>
  )
}
