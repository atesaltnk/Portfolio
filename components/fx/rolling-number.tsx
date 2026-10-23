"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/lib/motion-pref"

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function introDelayMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--intro-delay").trim()
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return 0
  return raw.endsWith("ms") ? n : n * 1000
}

/**
 * Odometer digits that roll into place (nickho-motorsports' counters).
 * Inspired by Magic UI's NumberTicker (MIT, 21st.dev) but reworked so the real
 * value is what the server renders: if JS or the observer never runs, the
 * number is still correct — the roll is purely an enhancement. Later value
 * changes (e.g. a chapter counter) roll between digits.
 */
export function RollingNumber({
  value,
  pad = 2,
  className,
  delay = 0,
  waitForIntro = false,
}: {
  value: number
  pad?: number
  className?: string
  delay?: number
  waitForIntro?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState<"static" | "zero" | "roll">("static")
  const [baseDelay, setBaseDelay] = useState(0)
  const digits = String(value).padStart(pad, "0").split("")

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const start = () => {
      setBaseDelay(delay + (waitForIntro ? introDelayMs() : 0))
      setPhase("zero")
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("roll")))
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      start()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        start()
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
    // Run once on mount; value changes afterwards animate via CSS transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      {digits.map((d, i) => (
        <span
          key={`${digits.length}-${i}`}
          aria-hidden="true"
          className="relative inline-block h-[1.08em] overflow-hidden leading-[1.08em]"
        >
          <span
            className="flex flex-col"
            style={{
              transform: `translateY(${-(phase === "zero" ? 0 : Number(d)) * 10}%)`,
              transition:
                phase === "roll"
                  ? `transform 1.35s var(--ease-out-expo) ${baseDelay + i * 90}ms`
                  : "none",
            }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1.08em]">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
