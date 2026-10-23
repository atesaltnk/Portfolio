"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { useScramble } from "@/components/fx/scramble"
import { FireWord } from "./fire-word"

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/** Cycles the role label. Kept apart so each scramble tick re-renders only this. */
function RoleTicker() {
  const { t } = useLanguage()
  const roles = t.hero.roles
  const [roleIndex, setRoleIndex] = useState(0)
  const role = useScramble(roles[roleIndex % roles.length])

  useEffect(() => {
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3200)
    return () => window.clearInterval(id)
  }, [roles.length])

  return <span>{role}</span>
}

/**
 * The landing screen: one idea, nothing competing with it. A full-height ink
 * stage, the name burning in its own letters, and four quiet annotations in
 * the corners. Everything else waits for the next section.
 */
export function Hero() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)

  // As the hero leaves, the word drifts up and dims — depth without clutter.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"])
  const wordOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  const tagline = t.hero.tagline

  return (
    <section
      ref={ref}
      data-scheme="ink"
      className="scheme-ink relative flex min-h-[92svh] flex-col overflow-hidden pt-[var(--header-h)] md:min-h-[100svh]"
    >
      {/* Top annotations */}
      <div className="gutter relative z-20 flex items-start justify-between gap-6 pt-6 md:pt-8">
        <p className="t-label flex items-center gap-2.5 intro-fade" style={d(150)}>
          <span aria-hidden="true" className="size-2 shrink-0 bg-ember" />
          <RoleTicker />
        </p>
        <p className="t-label flex items-center gap-2.5 text-right intro-fade" style={d(250)}>
          <span aria-hidden="true" className="ember-dot shrink-0" />
          <span className="hidden sm:inline">{t.meta.available}</span>
          <span className="sm:hidden">{t.meta.location}</span>
        </p>
      </div>

      {/* The word */}
      <div className="relative z-0 flex flex-1 items-center gutter py-4 sm:py-8">
        <motion.div className="w-full" style={{ y: wordY, opacity: wordOpacity }}>
          <h1 className="sr-only">
            Ateş Altınkaynak — {t.meta.role}. {tagline}
          </h1>
          {/* Phones get a stacked AT / EŞ poster instead of a thin strip. */}
          <FireWord
            word="Ateş"
            delay={120}
            breakAt={2}
            className="w-full [font-size:min(86vw,calc((100svh_-_19rem)/1.8))] sm:[font-size:min(48vw,calc(100svh_-_19rem))]"
          />
        </motion.div>
      </div>

      {/* Soft glow over the stage, screened so it never boxes in the word. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
        style={{ background: "radial-gradient(70% 50% at 50% 92%, rgba(255,77,18,0.16), transparent 70%)" }}
      />

      {/* Bottom annotations */}
      <div className="gutter relative z-20 flex items-end justify-between gap-8 pb-7 md:pb-9">
        <div className="mask-y">
          <p
            className="font-display max-w-[16ch] text-[clamp(1.6rem,2.6vw,2.7rem)] leading-[0.9] intro-rise"
            style={d(500)}
          >
            {tagline.slice(0, -1)}
            <span className="text-ember">{tagline.slice(-1)}</span>
          </p>
        </div>
        <a
          href="#intro"
          className="group flex shrink-0 flex-col items-center gap-3 text-dim transition-colors hover:text-fg intro-fade"
          style={d(700)}
        >
          <span className="t-label">{t.hero.scroll}</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line-strong">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ember" />
          </span>
        </a>
      </div>
    </section>
  )
}
