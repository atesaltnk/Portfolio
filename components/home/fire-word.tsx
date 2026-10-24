"use client"

import type { CSSProperties } from "react"
import { AsciiFire } from "@/components/fx/ascii-fire"
import { cn } from "@/lib/utils"

/**
 * A word whose letters are windows onto the live ASCII fire.
 *
 * Knockout trick: the fire (plus a dark ember gradient so letter tops never go
 * black) sits underneath; above it, an ink block holds the word in white with
 * `mix-blend-mode: darken`. min(white, fire) = fire inside the letters, and
 * min(ink, fire) = ink outside them — the gradient never dips below ink in any
 * channel, so the block is invisible against the page and only the letterforms
 * burn. Works in every modern browser.
 *
 * A second, blurred copy of the letters is screened on top as heat haze, so
 * the word lights its surroundings instead of sitting flat on the page.
 */
export function FireWord({
  word,
  className,
  style,
  delay = 0,
}: {
  word: string
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  const chars = Array.from(word)
  // Italic letters overhang their advance, so each mask gets side bleed too.
  const mask = "-mx-[0.12em] -my-[0.2em] inline-block px-[0.12em] py-[0.2em] align-bottom"
  const type = "font-mark whitespace-nowrap px-[0.1em] pb-[0.14em] pt-[0.07em] text-center leading-[0.8]"

  return (
    <div aria-hidden="true" className={cn("relative select-none", className)} style={style}>
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #c22e0e 0%, #7c1a0e 42%, #3a0d0b 100%)" }}
        />
        <AsciiFire reach={1.2} fontSize={13} />
        <p className={cn(type, "relative bg-ink text-white mix-blend-darken")}>
          {chars.map((ch, i) => (
            <span key={i} className={cn(mask, "overflow-hidden")}>
              <span className="inline-block intro-rise" style={{ "--d": `${delay + i * 80}ms` } as CSSProperties}>
                {ch}
              </span>
            </span>
          ))}
        </p>
      </div>

      <p
        className={cn(type, "pointer-events-none absolute inset-0 text-transparent mix-blend-screen")}
        style={{ textShadow: "0 0 0.06em rgb(255 77 18 / 0.35), 0 0 0.22em rgb(255 77 18 / 0.18)" }}
      >
        {chars.map((ch, i) => (
          <span key={i} className={mask}>
            <span className="inline-block intro-fade" style={{ "--d": `${delay + 500 + i * 80}ms` } as CSSProperties}>
              {ch}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}
