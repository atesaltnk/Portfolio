"use client"

import { useMemo, useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

interface Token {
  word: string
  highlight: boolean
}

/** "plain {highlighted phrase} plain" → word tokens. */
function tokenize(text: string): Token[] {
  const out: Token[] = []
  const re = /\{([^}]+)\}|([^{}]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const highlight = Boolean(m[1])
    const segment = m[1] ?? m[2]
    const words = segment.split(/\s+/).filter(Boolean)
    // Punctuation straight after a highlight ("{phrase}:") belongs to its last word.
    if (!highlight && out.length && !/^\s/.test(segment) && words.length) {
      out[out.length - 1].word += words.shift()
    }
    for (const word of words) out.push({ word, highlight })
  }
  return out
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  highlight: boolean
}) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.22em] inline-block">
      <span className={cn("opacity-[0.14]", highlight && "text-ember opacity-30")}>{children}</span>
      <motion.span style={{ opacity }} className={cn("absolute inset-0", highlight && "text-ember")}>
        {children}
      </motion.span>
    </span>
  )
}

const CHIPS = [
  { text: 'git commit -m "fix: edge case"', x: "6%", y: "18%", speed: 260 },
  { text: "$ npm run build  ✓ 7/7", x: "72%", y: "14%", speed: 420 },
  { text: "#include <thread>", x: "80%", y: "62%", speed: 320 },
  { text: "SELECT * FROM readings;", x: "4%", y: "70%", speed: 380 },
  { text: "p95 < 120ms", x: "60%", y: "84%", speed: 220 },
]

function Chip({ text, x, y, speed, progress }: (typeof CHIPS)[number] & { progress: MotionValue<number> }) {
  const translate = useTransform(progress, [0, 1], [speed, -speed])
  return (
    <motion.span
      aria-hidden="true"
      style={{ left: x, top: y, y: translate }}
      className="t-mono absolute hidden whitespace-nowrap border border-line bg-ink-2 px-3 py-2 text-dim lg:block"
    >
      {text}
    </motion.span>
  )
}

/**
 * Scroll-scrubbed manifesto. Word reveal adapted from Magic UI's TextReveal
 * (MIT, 21st.dev): a ghost layer keeps the text readable at all times, and the
 * solid layer fades in word by word with scroll position — no observers.
 */
export function Manifesto() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const tokens = useMemo(() => tokenize(t.manifesto.text), [t.manifesto.text])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={ref}
      id="manifesto"
      data-scheme="ink"
      className="scheme-ink relative h-[200svh] md:h-[260svh]"
      aria-label={t.manifesto.label}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]">
        <div className="frame flex shrink-0 items-center justify-between border-b border-line cell">
          <span className="t-label">{t.manifesto.label}</span>
          <span className="t-label hidden text-dim sm:block">{t.hero.fireNote}</span>
        </div>

        <div className="frame relative flex flex-1 items-center justify-center px-4">
          {CHIPS.map((chip) => (
            <Chip key={chip.text} {...chip} progress={scrollYProgress} />
          ))}
          <p className="font-display relative max-w-[18ch] text-center text-[clamp(2.1rem,4.4vw,5.6rem)] leading-[0.92] [@media(max-height:760px)]:text-[clamp(2rem,3.6vw,4.4rem)] md:max-w-[23ch]">
            <span className="sr-only">{t.manifesto.text.replace(/[{}]/g, "")}</span>
            <span aria-hidden="true">
            {tokens.map((tok, i) => {
              const start = i / tokens.length
              return (
                <Word
                  key={`${tok.word}-${i}`}
                  progress={scrollYProgress}
                  range={[start * 0.9, (start + 1 / tokens.length) * 0.9]}
                  highlight={tok.highlight}
                >
                  {tok.word}
                </Word>
              )
            })}
            </span>
          </p>
        </div>

        <div className="frame shrink-0 border-t border-line">
          <motion.div style={{ scaleX: bar }} className="h-[3px] origin-left bg-ember" />
        </div>
      </div>
    </section>
  )
}
