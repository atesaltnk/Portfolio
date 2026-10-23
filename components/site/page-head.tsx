import type { CSSProperties, ReactNode } from "react"
import { fitDisplay, Punctuated } from "./section-head"

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

/** Top-of-page heading: same anatomy as SectionHead, but an h1 that animates on arrival. */
export function PageHead({
  label,
  kicker,
  word,
  intro,
  aside,
}: {
  label: string
  kicker: string
  word: string
  intro?: string
  aside?: ReactNode
}) {
  return (
    <header data-scheme="paper" className="scheme-paper pt-[var(--header-h)]">
      <div className="frame grid grid-cols-12 border-b border-line">
        <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
          <span className="t-label enter-fade">{label}</span>
        </div>
        <div className="col-span-12 cell pb-5 pt-16 md:col-span-9 md:pt-32">
          <p className="t-label mb-3 text-dim enter-fade" style={d(80)}>
            {kicker}
          </p>
          <h1 className="font-display t-display mask-y" style={{ fontSize: fitDisplay(word, 12.5, 13) }}>
            <span className="block enter-rise" style={d(120)}>
              <Punctuated word={word} />
            </span>
          </h1>
        </div>
      </div>
      {(intro || aside) && (
        <div className="frame grid grid-cols-12 border-b border-line">
          <div className="col-span-12 hidden cell md:col-span-3 md:block md:border-r md:border-line">{aside}</div>
          <div className="col-span-12 cell md:col-span-9 md:py-8">
            {intro && (
              <p className="t-lead max-w-2xl text-dim enter-fade" style={d(260)}>
                {intro}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
