"use client"

import { useLanguage } from "@/lib/language-context"
import type { ProjectStats } from "@/lib/projects"
import { RollingNumber } from "@/components/fx/rolling-number"
import { ButtonLink } from "@/components/site/button-link"

/**
 * What used to be crammed into the first screen, given room: portrait and a
 * single statement on one row, the live telemetry on the next.
 */
export function Intro({ stats }: { stats: ProjectStats }) {
  const { t } = useLanguage()

  const telemetry = [
    { value: stats.repos, label: t.hero.stats.repos, pad: 2 },
    { value: stats.languages, label: t.hero.stats.languages, pad: 2 },
    { value: stats.live, label: t.hero.stats.live, pad: 2 },
    { value: stats.since, label: t.hero.stats.since, pad: 4 },
  ]

  return (
    <section id="intro" data-scheme="paper" className="scheme-paper scroll-mt-[var(--header-h)]">
      <div className="frame grid grid-cols-12 border-b border-line sd-reveal">
        <figure className="group relative col-span-12 aspect-[4/5] overflow-hidden border-b border-line md:col-span-5 md:border-b-0 md:border-r lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/ates-portrait.webp"
            alt="Ateş Altınkaynak"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03] sd-clip"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-ember mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <figcaption className="t-label absolute bottom-3 left-3 bg-paper px-2 py-1 text-ink">
            {t.hero.figure}
          </figcaption>
        </figure>

        <div className="col-span-12 flex flex-col justify-between gap-14 px-[clamp(16px,3vw,56px)] py-[clamp(28px,5vw,72px)] md:col-span-7 lg:col-span-8">
          <p className="t-label flex items-center gap-3">
            <span>{t.intro.label}</span>
            <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            <span className="text-dim">
              {t.meta.role} · {t.meta.location}
            </span>
          </p>
          <p className="max-w-[30ch] text-[clamp(1.55rem,2.55vw,2.85rem)] font-medium leading-[1.14] tracking-[-0.025em] sd-fade">
            {t.hero.intro}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/contact" variant="ember" data-cursor="Say hi">
              {t.hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#work" variant="outline" arrow="↓">
              {t.hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </div>

      <dl className="frame grid grid-cols-2 border-b border-line md:grid-cols-4">
        {telemetry.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col justify-between gap-12 px-[clamp(16px,2vw,32px)] py-[clamp(20px,3vw,40px)] max-md:[&:nth-child(-n+2)]:border-b max-md:odd:border-r md:border-r md:last:border-r-0 border-line"
          >
            <dt className="t-label text-dim">{s.label}</dt>
            <dd>
              <RollingNumber value={s.value} pad={s.pad} delay={i * 90} className="font-display t-display" />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
