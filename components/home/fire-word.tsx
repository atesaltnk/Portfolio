"use client"

import type { CSSProperties } from "react"
import { AsciiFire } from "@/components/fx/ascii-fire"
import { cn } from "@/lib/utils"

const INK = "#0e0d0b"

/**
 * A word whose letters are windows onto the live ASCII fire.
 *
 * Knockout trick: the fire (plus a dark ember gradient so letter tops never go
 * black) sits underneath; above it, a layer holds the word in white with
 * `mix-blend-mode: darken`. min(white, fire) = fire inside the letters, and
 * min(ink, fire) = ink outside them — the gradient never dips below ink in any
 * channel, so the layer is invisible against the page and only the
 * letterforms burn. Works in every modern browser.
 *
 * With `field`, the same fire spills out of the word: the layer runs the full
 * width of the screen and up past the letters, and above them its colour
 * rises from ink to a dim ember before fading back to ink. darken clamps the
 * flames to that colour, so they climb out of the letters as a low glow and
 * die away — one simulation, no seams, nothing boxed in. `fieldClassName`
 * sets how far up it reaches (e.g. "-top-[40svh]").
 *
 * A blurred copy of the letters is screened on top as heat haze.
 */
export function FireWord({
  word,
  className,
  style,
  delay = 0,
  field = false,
  fieldClassName,
}: {
  word: string
  className?: string
  style?: CSSProperties
  delay?: number
  field?: boolean
  fieldClassName?: string
}) {
  const chars = Array.from(word)
  // Italic letters overhang their advance, so each mask gets side bleed too.
  const mask = "-mx-[0.12em] -my-[0.2em] inline-block px-[0.12em] py-[0.2em] align-bottom"
  const type = "font-mark whitespace-nowrap px-[0.1em] pb-[0.14em] pt-[0.07em] text-center leading-[0.8]"

  const glyphs = (animate: boolean) =>
    chars.map((ch, i) => (
      <span key={i} className={cn(mask, "overflow-hidden")}>
        <span
          className={cn("inline-block", animate && "intro-rise")}
          style={animate ? ({ "--d": `${delay + i * 80}ms` } as CSSProperties) : undefined}
        >
          {ch}
        </span>
      </span>
    ))

  // The cap: ink across the word's own band (so its box never shows — inside
  // the band the ember gradient would turn any non-ink cap into a flat
  // stripe), easing into a dim ember above the letters, then back to ink by
  // the top — scaled to however tall the field is.
  const above = (f: number) => `calc(0.95em + (100% - 0.95em) * ${f})`
  const cap = `linear-gradient(to top, ${INK} 0, ${INK} 0.95em, rgb(96 30 12) ${above(0.32)}, rgb(52 16 9) ${above(0.7)}, ${INK} 100%)`

  return (
    <div aria-hidden="true" className={cn("relative select-none", className)} style={style}>
      {field ? (
        <>
          {/* Keeps the word's size in the layout; the burning copy floats over it. */}
          <p className={cn(type, "invisible")}>{glyphs(false)}</p>
          <div
            className={cn(
              "absolute bottom-0 left-[calc(50%-50vw)] isolate w-screen overflow-hidden bg-ink",
              fieldClassName
            )}
          >
            {/* Only as tall as the letters, so the field above stays pure ink. */}
            <div
              className="absolute inset-x-0 bottom-0 h-[0.95em]"
              style={{ background: "linear-gradient(to top, #c22e0e 0%, #7c1a0e 42%, #3a0d0b 100%)" }}
            />
            <AsciiFire reach={1.05} fontSize={13} />
            <div className="absolute inset-0 text-white mix-blend-darken" style={{ background: cap }}>
              <p className={cn(type, "absolute inset-x-0 bottom-0")}>{glyphs(true)}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #c22e0e 0%, #7c1a0e 42%, #3a0d0b 100%)" }}
          />
          <AsciiFire reach={1.2} fontSize={13} />
          <p className={cn(type, "relative bg-ink text-white mix-blend-darken")}>{glyphs(true)}</p>
        </div>
      )}

      <p
        className={cn(type, "pointer-events-none absolute inset-x-0 bottom-0 text-transparent mix-blend-screen")}
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
