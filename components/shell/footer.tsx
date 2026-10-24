"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL } from "@/lib/github"
import { CONTACT_EMAIL } from "@/lib/site"
import { scrollToTarget } from "@/lib/scroll"
import { cn } from "@/lib/utils"
import { AsciiFire } from "@/components/fx/ascii-fire"
import { FireSketch } from "@/components/fx/fire-sketch"
import { RollText } from "@/components/fx/roll-text"
import { formatClock, HOME_TZ, useNow } from "./clocks"
import { MotionToggle } from "./motion-toggle"

export function Footer() {
  const { t } = useLanguage()
  const [drawing, setDrawing] = useState(false)
  const sparks = useRef<Array<[number, number]>>([])
  const now = useNow()
  const { time, offset } = formatClock(now, HOME_TZ)

  const nav = [
    { href: "/work", label: t.nav.work },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  return (
    <footer data-scheme="ink" className="scheme-ink relative overflow-hidden">
      <nav className="frame grid grid-cols-1 border-b border-line sd-reveal md:grid-cols-3">
        {nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            data-cursor="Open"
            className="group relative flex items-end justify-between overflow-hidden border-b border-line px-4 pb-5 pt-14 last:border-b-0 md:border-b-0 md:border-r md:pt-24 md:last:border-r-0"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
            />
            <span className="relative flex flex-col gap-3 transition-colors duration-300 group-hover:text-ink">
              <span className="t-label opacity-70">({String(i + 1).padStart(2, "0")})</span>
              <span className="font-display t-h1 sd-fade">
                <RollText>{item.label}</RollText>
              </span>
            </span>
            <span className="font-display relative text-3xl transition-all duration-500 group-hover:-rotate-45 group-hover:text-ink">
              →
            </span>
          </Link>
        ))}
      </nav>

      <div className="frame grid grid-cols-2 border-b border-line md:grid-cols-12">
        <div className="col-span-1 cell border-r border-line md:col-span-3">
          <p className="t-label mb-4 text-dim">{t.footer.elsewhere}</p>
          <ul className="space-y-1.5">
            <li>
              <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="t-h3 font-display">
                <RollText>GitHub ↗</RollText>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="t-h3 font-display">
                <RollText>Email ↗</RollText>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1 cell md:col-span-3 md:border-r md:border-line">
          <p className="t-label mb-4 text-dim">{t.footer.localTime}</p>
          <p className="font-display t-h3 tabular-nums" suppressHydrationWarning>
            {time}
          </p>
          <p className="t-label mt-1 text-dim">Ankara · {offset}</p>
        </div>
        <div className="col-span-2 cell border-t border-line md:col-span-4 md:border-r md:border-t-0">
          <p className="t-label mb-4 text-dim">{t.footer.colophon}</p>
          <p className="max-w-md text-sm leading-relaxed text-dim">{t.footer.colophonText}</p>
        </div>
        <div className="col-span-2 flex flex-col items-start justify-between gap-6 cell border-t border-line md:col-span-2 md:border-t-0">
          <MotionToggle className="flex-wrap" />
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="t-label flex items-center gap-2 hover:text-ember"
          >
            <RollText>{t.footer.backToTop}</RollText> ↑
          </button>
        </div>
      </div>

      <div className="relative h-[clamp(15rem,34vw,32rem)] overflow-hidden">
        <AsciiFire reach={0.78} fontSize={12} interactive={!drawing} sparks={sparks} />
        <div className="frame relative flex h-full items-end justify-between gap-6 border-x-0 md:border-x">
          {/* Plain S, so nothing hangs below the baseline: the letters stand
              exactly on the bottom edge. */}
          <p aria-hidden="true" className="font-mark t-mega flush-base select-none pr-[0.08em] text-paper">
            Ates
          </p>
          {/* Up at the band's ceiling, clear of the flames. */}
          <div className="relative mt-6 hidden max-w-[17rem] space-y-2 self-start pr-4 text-right md:block">
            <p className="t-label normal-case text-paper/80">{t.hero.wordNote}</p>
            <p className="t-label text-paper/50">© {new Date().getFullYear()} Ateş Altınkaynak</p>
            <p
              className={cn(
                "t-label transition-colors duration-300 in-[.reduce-motion]:transition-none",
                drawing ? "text-ember" : "text-paper/50"
              )}
            >
              {drawing ? t.footer.drawActive : t.footer.drawHint}
            </p>
          </div>
        </div>
        <FireSketch sparks={sparks} onModeChange={setDrawing} />
      </div>
    </footer>
  )
}
