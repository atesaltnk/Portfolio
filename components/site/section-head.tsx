import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Font size for one giant display word that always fits its column, whatever the
 * locale: the condensed cut averages ~0.46em per glyph, and the column is ~66vw.
 */
export function fitDisplay(word: string, maxVw: number, maxRem: number, minRem = 2.5) {
  const glyphs = word.length + 1 // + the trailing punctuation mark
  const fit = 66 / (glyphs * 0.46)
  return `clamp(${minRem}rem, ${Math.min(maxVw, fit).toFixed(2)}vw, ${maxRem}rem)`
}

/** Ends a heading word with an ember period unless it already ends in ? or !. */
export function Punctuated({ word }: { word: string }) {
  const last = word.slice(-1)
  if (last === "?" || last === "!") {
    return (
      <>
        {word.slice(0, -1)}
        <span className="text-ember">{last}</span>
      </>
    )
  }
  return (
    <>
      {word}
      <span className="text-ember">.</span>
    </>
  )
}

/**
 * Section heading in the mijobello pattern — a tiny kicker over one giant word —
 * set in the condensed display cut, inside the hairline frame.
 */
export function SectionHead({
  label,
  kicker,
  word,
  aside,
  as: Tag = "h2",
  className,
}: {
  label: string
  kicker: string
  word: string
  aside?: ReactNode
  as?: "h1" | "h2"
  className?: string
}) {
  return (
    <div className={cn("frame grid grid-cols-12 border-b border-line sd-reveal", className)}>
      <div className="col-span-12 flex items-start justify-between gap-4 cell border-b border-line md:col-span-3 md:flex-col md:border-b-0 md:border-r">
        <span className="t-label">{label}</span>
        {aside && <div className="hidden md:block">{aside}</div>}
      </div>
      <div className="col-span-12 cell pb-5 pt-12 md:col-span-9 md:pt-24">
        <p className="t-label mb-3 text-dim sd-fade">{kicker}</p>
        <Tag className="font-display t-display mask-y" style={{ fontSize: fitDisplay(word, 12.5, 13) }}>
          <span className="block sd-rise">
            <Punctuated word={word} />
          </span>
        </Tag>
      </div>
    </div>
  )
}
