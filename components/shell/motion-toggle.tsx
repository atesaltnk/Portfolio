"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { prefersReducedMotion, setMotionMode, type MotionMode } from "@/lib/motion-pref"
import { cn } from "@/lib/utils"

/**
 * Full / Calm motion switch. Defaults to the OS setting; a visitor's choice is
 * remembered. Calm keeps every layout and fade, but drops smooth scrolling,
 * the live fire, the cursor, marquees and the preloader.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { t } = useLanguage()
  const [mode, setMode] = useState<MotionMode | null>(null)

  useEffect(() => {
    setMode(prefersReducedMotion() ? "reduced" : "full")
  }, [])

  const options: Array<[MotionMode, string]> = [
    ["full", t.footer.motionFull],
    ["reduced", t.footer.motionCalm],
  ]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="t-label text-dim">{t.footer.motion}</span>
      <div role="group" aria-label={t.footer.motion} className="flex border border-line-strong">
        {options.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => mode !== value && setMotionMode(value)}
            className={cn(
              "t-label px-2.5 py-1.5 transition-colors",
              mode === value ? "bg-fg text-bg" : "text-dim hover:text-fg"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
