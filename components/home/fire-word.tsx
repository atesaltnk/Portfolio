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
  return (
    <div aria-hidden="true" className={cn("relative isolate select-none overflow-hidden", className)} style={style}>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, #c22e0e 0%, #7c1a0e 42%, #3a0d0b 100%)" }}
      />
      <AsciiFire reach={1.2} fontSize={13} />
      <p className="font-display relative whitespace-nowrap bg-ink pb-[0.14em] pt-[0.07em] text-center leading-[0.8] text-white mix-blend-darken">
        {Array.from(word).map((ch, i) => (
          <span key={i} className="-my-[0.2em] inline-block overflow-hidden py-[0.2em] align-bottom">
            <span className="inline-block intro-rise" style={{ "--d": `${delay + i * 80}ms` } as CSSProperties}>
              {ch}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}
