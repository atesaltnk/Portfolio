"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { AsciiFire } from "@/components/fx/ascii-fire"
import { Logo } from "./header"

const COUNT_MS = 1450

/**
 * First-visit preloader (nickho-motorsports): the fire ignites while a counter
 * runs to 100, then the curtain wipes up into the hero. It only renders when an
 * inline script marked <html class="intro"> (first visit in this tab, motion
 * allowed); CSS hides it after 4.5s even if this component never hydrates.
 */
export function Preloader() {
  const { t } = useLanguage()
  const [active, setActive] = useState(true)
  const [count, setCount] = useState(0)
  const [lit, setLit] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains("intro")) {
      setActive(false)
      return
    }
    try {
      sessionStorage.setItem("ates:intro", "1")
    } catch {}

    const lenis = window.__lenis
    lenis?.stop()

    let raf = 0
    const timers: number[] = []
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
        return
      }
      setLit(false)
      timers.push(window.setTimeout(() => setLeaving(true), 120))
      timers.push(
        window.setTimeout(() => {
          setActive(false)
          window.__lenis?.start()
        }, 950)
      )
      // Hero animations have long finished by now; later navigations start instantly.
      timers.push(window.setTimeout(() => html.classList.remove("intro"), 4200))
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((id) => window.clearTimeout(id))
      window.__lenis?.start()
    }
  }, [])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      className="preloader scheme-ink fixed inset-0 z-[100] flex-col justify-between overflow-hidden"
      style={{
        clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
        transition: "clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[55%]">
        <AsciiFire lit={lit} reach={0.85} interactive={false} />
      </div>

      <div className="frame relative flex h-[var(--header-h)] items-center justify-between border-b border-line px-4">
        <Logo />
        <span className="t-label text-dim">
          {t.preloader.label}
          <span className="animate-pulse in-[.reduce-motion]:animate-none">…</span>
        </span>
      </div>

      <div className="frame relative flex flex-1 items-end justify-between px-4 pb-6">
        <span className="t-label max-w-[14rem] normal-case text-dim">{t.hero.wordNote}</span>
        <span className="font-display t-mega tabular-nums leading-[0.74] text-paper">
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </div>
  )
}
