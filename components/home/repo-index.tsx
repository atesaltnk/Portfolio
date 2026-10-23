"use client"

import { useMemo, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL, languageColor } from "@/lib/github"
import { projectSummary, type Project } from "@/lib/projects"
import { FollowPreview } from "@/components/fx/follow-preview"
import { RollText } from "@/components/fx/roll-text"
import { ButtonLink } from "@/components/site/button-link"
import { ProjectCover } from "@/components/site/project-cover"
import { SectionHead } from "@/components/site/section-head"
import { cn } from "@/lib/utils"

function formatMonth(iso: string | null, year: number, locale: string) {
  if (!iso) return String(year)
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : locale === "de" ? "de-DE" : "en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

/**
 * Every repository as a row — nickho's race calendar — with the project cover
 * trailing the cursor. Rows link to GitHub; live sites get their own chip.
 */
export function RepoIndex({
  projects,
  withFilter = false,
  headless = false,
}: {
  projects: Project[]
  withFilter?: boolean
  headless?: boolean
}) {
  const { t, locale } = useLanguage()
  const [hovered, setHovered] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of projects) if (p.language) counts.set(p.language, (counts.get(p.language) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [projects])

  const visible = filter === "all" ? projects : projects.filter((p) => p.language === filter)

  return (
    <section data-scheme="ink" className="scheme-ink relative overflow-hidden">
      <p
        aria-hidden="true"
        className="font-display pointer-events-none absolute -top-[0.08em] left-0 right-0 select-none whitespace-nowrap text-center text-[34vw] leading-none text-paper/[0.035]"
      >
        Index
      </p>

      {!headless && (
        <SectionHead
          label={t.index.label}
          kicker={t.index.kicker}
          word={t.index.word}
          aside={
            <span className="t-label text-dim">
              {projects.length} {t.index.count}
            </span>
          }
        />
      )}

      {withFilter && languages.length > 1 && (
        <div className="frame flex flex-wrap gap-2 border-b border-line cell" role="group" aria-label={t.index.colStack}>
          {[["all", projects.length] as const, ...languages].map(([lang, count]) => {
            const value = String(lang)
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  "t-label flex items-center gap-2 border px-3 py-2 transition-colors",
                  active ? "border-fg bg-fg text-bg" : "border-line-strong text-dim hover:border-fg hover:text-fg"
                )}
              >
                {value !== "all" && <span className="size-2" style={{ background: languageColor(value) }} />}
                {value === "all" ? t.index.filterAll : value}
                <span className="opacity-60">{String(count).padStart(2, "0")}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="frame hidden grid-cols-12 border-b border-line md:grid">
        <span className="t-label col-span-1 cell text-dim">No.</span>
        <span className="t-label col-span-5 cell text-dim">{t.index.colProject}</span>
        <span className="t-label col-span-3 cell text-dim" />
        <span className="t-label col-span-2 cell text-dim">{t.index.colStack}</span>
        <span className="t-label col-span-1 cell text-right text-dim">{t.index.colUpdated}</span>
      </div>

      {visible.length === 0 ? (
        <div className="frame border-b border-line cell py-16">
          <p className="t-lead text-dim">{t.index.empty}</p>
        </div>
      ) : (
        <ol onPointerLeave={() => setHovered(null)}>
          {visible.map((p, i) => (
            <li
              key={p.key}
              onPointerEnter={() => setHovered(p)}
              className="group frame relative grid grid-cols-12 items-center border-b border-line transition-colors duration-300 hover:bg-paper/[0.04] sd-reveal"
            >
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} — GitHub`}
                className="absolute inset-0 z-0"
              />
              <span className="t-label col-span-2 cell text-dim md:col-span-1">{String(i + 1).padStart(3, "0")}</span>
              <span className="col-span-10 cell md:col-span-5">
                <span className="font-display t-h2 block transition-colors duration-300 group-hover:text-ember sd-fade">
                  <RollText>{p.title}</RollText>
                </span>
              </span>
              <span className="col-span-10 col-start-3 cell pt-0 text-sm text-dim md:col-span-3 md:col-start-auto md:pt-[clamp(14px,1.35vw,22px)]">
                {projectSummary(p, locale)}
              </span>
              <span className="t-label col-span-6 col-start-3 flex items-center gap-2 cell pt-0 md:col-span-2 md:col-start-auto md:pt-[clamp(14px,1.35vw,22px)]">
                <span className="size-2" style={{ background: languageColor(p.language) }} />
                {p.language ?? "—"}
                {p.homepage && (
                  <a
                    href={p.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 ml-1 bg-ember px-1.5 py-0.5 text-ink hover:bg-paper"
                  >
                    Live ↗
                  </a>
                )}
              </span>
              <span
                className="t-label col-span-4 cell pt-0 text-right tabular-nums text-dim md:col-span-1 md:pt-[clamp(14px,1.35vw,22px)]"
                suppressHydrationWarning
              >
                {formatMonth(p.updatedAt, p.year, locale)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {!withFilter && (
        <div className="frame flex flex-col gap-2 border-b border-line cell sm:flex-row sm:justify-end">
          <ButtonLink href="/work" variant="ember">
            {t.index.viewAll}
          </ButtonLink>
          <ButtonLink href={GITHUB_PROFILE_URL} variant="outline" external arrow="↗">
            {t.index.github}
          </ButtonLink>
        </div>
      )}

      <FollowPreview open={hovered !== null} previewKey={hovered?.key} width={340} height={224}>
        {hovered && <ProjectCover project={hovered} />}
      </FollowPreview>
    </section>
  )
}
