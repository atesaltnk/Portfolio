"use client"

import { useLanguage } from "@/lib/language-context"
import type { Project, ProjectStats } from "@/lib/projects"
import { RollingNumber } from "@/components/fx/rolling-number"
import { RollText } from "@/components/fx/roll-text"
import { PageHead } from "@/components/site/page-head"
import { TECH } from "@/components/site/tech"
import { ContactCta } from "@/components/home/contact-cta"

function relativeTime(iso: string | null, locale: string) {
  if (!iso) return null
  const days = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (Math.abs(days) < 1) return rtf.format(0, "day")
  if (Math.abs(days) < 30) return rtf.format(days, "day")
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month")
  return rtf.format(Math.round(days / 365), "year")
}

export function AboutView({ latest, stats }: { latest: Project | null; stats: ProjectStats }) {
  const { t, locale } = useLanguage()
  const a = t.aboutPage

  const telemetry = [
    { value: stats.repos, label: t.hero.stats.repos, pad: 2 },
    { value: stats.languages, label: t.hero.stats.languages, pad: 2 },
    { value: stats.live, label: t.hero.stats.live, pad: 2 },
    { value: stats.since, label: t.hero.stats.since, pad: 4 },
  ]

  return (
    <main>
      <PageHead label={a.label} kicker={a.kicker} word={a.word} />

      {/* Story */}
      <section data-scheme="paper" className="scheme-paper">
        <div className="frame grid grid-cols-12 border-b border-line">
          <figure className="group relative col-span-12 aspect-[4/5] overflow-hidden border-b border-line md:col-span-4 md:border-b-0 md:border-r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work/ates-portrait.webp"
              alt="Ateş Altınkaynak"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] enter-fade"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-ember mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <figcaption className="t-label absolute bottom-3 left-3 bg-paper px-2 py-1 text-ink">
              {t.hero.figure}
            </figcaption>
          </figure>
          <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-8">
            <div className="space-y-6 cell md:py-10">
              <p className="max-w-3xl text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.3] tracking-tight">{a.p1}</p>
              <p className="t-lead max-w-2xl text-dim">{a.p2}</p>
            </div>
            <div className="border-t border-line">
              <p className="t-label cell border-b border-line text-dim">{a.focusTitle}</p>
              <ul className="grid sm:grid-cols-2">
                {a.focus.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 cell border-b border-line sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <span className="t-label text-ember">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display t-h3">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry */}
      <section data-scheme="ink" className="scheme-ink">
        <div className="frame grid grid-cols-12 border-b border-line">
          <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
            <span className="t-label">{a.statsTitle}</span>
          </div>
          <div className="col-span-12 grid grid-cols-2 md:col-span-9 md:grid-cols-4">
            {telemetry.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col justify-between gap-10 cell border-line max-md:[&:nth-child(-n+2)]:border-b max-md:odd:border-r md:border-r md:last:border-r-0"
              >
                <span className="t-label text-dim">{s.label}</span>
                <RollingNumber value={s.value} pad={s.pad} delay={i * 90} className="font-display t-display" />
              </div>
            ))}
          </div>
        </div>
        {latest && (
          <div className="frame grid grid-cols-12 border-b border-line">
            <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
              <span className="t-label flex items-center gap-2">
                <span className="ember-dot" />
                {a.nowTitle}
              </span>
            </div>
            <a
              href={latest.homepage ?? latest.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open"
              className="group col-span-12 flex flex-wrap items-end justify-between gap-4 cell md:col-span-9 md:py-8"
            >
              <span className="font-display t-h1 transition-colors group-hover:text-ember">
                <RollText>{latest.title}</RollText>
              </span>
              <span className="t-label text-dim" suppressHydrationWarning>
                {a.nowText} · {relativeTime(latest.updatedAt, locale) ?? latest.year} ↗
              </span>
            </a>
          </div>
        )}
      </section>

      {/* Toolkit */}
      <section data-scheme="paper" className="scheme-paper">
        <div className="frame grid grid-cols-12 border-b border-line sd-reveal">
          <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
            <span className="t-label">{a.stackTitle}</span>
          </div>
          <div className="col-span-12 cell md:col-span-9 md:py-8">
            <p className="t-lead max-w-xl text-dim">{a.stackSubtitle}</p>
          </div>
        </div>
        <ul className="frame grid grid-cols-2 border-b border-line sm:grid-cols-3 lg:grid-cols-5">
          {TECH.map(({ name, Icon, color }, i) => (
            <li
              key={name}
              className="group relative flex aspect-[5/4] flex-col justify-between overflow-hidden border-b border-r border-line cell"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <span className="t-label relative flex items-center justify-between text-dim transition-colors group-hover:text-paper/60">
                {String(i + 1).padStart(2, "0")}
                <span className="size-2" style={{ background: color }} />
              </span>
              <Icon
                aria-hidden="true"
                className="relative size-[clamp(2.25rem,4vw,3.25rem)] text-ink transition-colors duration-300 group-hover:text-paper"
              />
              <span className="font-display t-h3 relative transition-colors group-hover:text-paper">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta />
    </main>
  )
}
