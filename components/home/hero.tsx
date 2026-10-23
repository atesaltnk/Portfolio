"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { useLanguage } from "@/lib/language-context"
import type { ProjectStats } from "@/lib/projects"
import { AsciiFire } from "@/components/fx/ascii-fire"
import { RollingNumber } from "@/components/fx/rolling-number"
import { useScramble } from "@/components/fx/scramble"
import { ButtonLink } from "@/components/site/button-link"
import { cn } from "@/lib/utils"

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

function Stat({ value, label, pad, delay }: { value: number; label: string; pad: number; delay: number }) {
  return (
    <div className="flex flex-col justify-between gap-6 cell">
      <span className="t-label text-dim intro-fade" style={d(delay)}>
        {label}
      </span>
      <RollingNumber value={value} pad={pad} delay={delay} waitForIntro className="font-display t-h1" />
    </div>
  )
}

export function Hero({ stats }: { stats: ProjectStats }) {
  const { t } = useLanguage()
  const roles = t.hero.roles
  const [roleIndex, setRoleIndex] = useState(0)
  const role = useScramble(roles[roleIndex % roles.length])

  useEffect(() => {
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2800)
    return () => window.clearInterval(id)
  }, [roles.length])

  const tagline = t.hero.tagline
  const taglineBody = tagline.slice(0, -1)
  const taglineEnd = tagline.slice(-1)

  return (
    <section data-scheme="paper" className="scheme-paper relative pt-[var(--header-h)]">
      {/* Row 1 — running labels */}
      <div className="frame grid grid-cols-2 border-b border-line md:grid-cols-12">
        <div className="hidden cell md:col-span-3 md:block md:border-r md:border-line">
          <span className="t-label intro-fade" style={d(0)}>
            {t.hero.index}
          </span>
        </div>
        <div className="col-span-1 flex items-center gap-2.5 cell border-r border-line md:col-span-3">
          <span aria-hidden="true" className="size-2 shrink-0 bg-ember" />
          <span className="t-label truncate intro-fade" style={d(80)} aria-live="off">
            {role}
          </span>
        </div>
        <div className="hidden cell md:col-span-3 md:block md:border-r md:border-line">
          <span className="t-label text-dim intro-fade" style={d(160)}>
            {t.meta.coords} — {t.meta.location}
          </span>
        </div>
        <div className="col-span-1 flex items-center gap-2.5 cell md:col-span-3">
          <span aria-hidden="true" className="ember-dot shrink-0" />
          <span className="t-label truncate intro-fade" style={d(240)}>
            {t.meta.available}
          </span>
        </div>
      </div>

      {/* Row 2 — portrait · statement · telemetry */}
      <div className="frame grid grid-cols-1 border-b border-line md:min-h-[42svh] md:grid-cols-12">
        <figure className="group relative aspect-[16/11] overflow-hidden border-b border-line md:col-span-4 md:aspect-auto md:border-b-0 md:border-r">
          <div className="absolute inset-0 intro-clip" style={d(100)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work/ates-portrait.webp"
              alt="Ateş Altınkaynak"
              className="h-full w-full object-cover object-[50%_30%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-ember mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
          <figcaption className="t-label absolute bottom-3 left-3 bg-paper px-2 py-1 text-ink">
            {t.hero.figure}
          </figcaption>
        </figure>

        <div className="flex flex-col justify-between gap-10 cell border-b border-line md:col-span-5 md:border-b-0 md:border-r md:pt-10">
          <h1 className="font-display text-[clamp(2.6rem,4.9vw,5.4rem)] leading-[0.86]">
            <span className="mask-y block">
              <span className="block intro-rise" style={d(200)}>
                {taglineBody}
                <span className="text-ember">{taglineEnd}</span>
              </span>
            </span>
          </h1>
          <div className="space-y-7">
            <p className="t-lead max-w-[34rem] text-dim intro-fade" style={d(380)}>
              {t.hero.intro}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row intro-fade" style={d(480)}>
              <ButtonLink href="/contact" variant="ember" data-cursor="Say hi">
                {t.hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#work" variant="outline" arrow="↓">
                {t.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:col-span-3 [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-line [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-line">
          <Stat value={stats.repos} label={t.hero.stats.repos} pad={2} delay={250} />
          <Stat value={stats.languages} label={t.hero.stats.languages} pad={2} delay={350} />
          <Stat value={stats.live} label={t.hero.stats.live} pad={2} delay={450} />
          <Stat value={stats.since} label={t.hero.stats.since} pad={4} delay={550} />
        </div>
      </div>

      {/* Row 3 — the wordmark, burning */}
      <div data-scheme="ink" className="scheme-ink relative overflow-hidden">
        <AsciiFire reach={0.7} />
        <div className="frame relative grid min-h-[clamp(12rem,min(29vw,40svh),26rem)] grid-cols-12 items-end">
          <p
            aria-hidden="true"
            className="font-display t-mega col-span-12 whitespace-nowrap pb-[0.02em] pt-[0.1em] text-paper md:col-span-9"
          >
            {Array.from("Ateş").map((ch, i) => (
              <span key={i} className="-my-[0.18em] inline-block overflow-hidden py-[0.18em]">
                <span className="inline-block intro-rise" style={d(300 + i * 70)}>
                  {ch}
                </span>
              </span>
            ))}
          </p>
          <div className="col-span-12 hidden h-full flex-col justify-between gap-6 border-l border-line px-4 py-5 md:col-span-3 md:flex">
            <div className="space-y-2 intro-fade" style={d(700)}>
              <p className="font-display t-h2">Altınkaynak</p>
              <p className="t-label text-dim">{t.meta.role}</p>
            </div>
            <div className="space-y-2 intro-fade" style={d(800)}>
              <p className="t-label normal-case">{t.hero.wordNote}</p>
              <p className="t-label text-dim">↳ {t.hero.fireNote}</p>
            </div>
            <a
              href="#manifesto"
              className={cn("t-label flex items-center gap-2 text-dim hover:text-ember intro-fade")}
              style={d(900)}
            >
              <span className="inline-block animate-bounce in-[.reduce-motion]:animate-none">↓</span>
              {t.hero.scroll}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
