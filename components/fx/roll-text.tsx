import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

/**
 * Per-letter roll on hover of the closest link/button — the duplicated-text
 * hover from mijobello.com. Logic adapted from motion-primitives' TextRoll
 * (MIT, Julien Thibeaut / 21st.dev) but done in CSS (see `.roll-c` in
 * globals.css): no JS, no hydration cost, works with keyboard focus.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  const chars = Array.from(children)

  return (
    <span className={cn("roll", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {chars.map((c, i) => {
          const ch = c === " " ? " " : c
          return (
            <span key={i} className="roll-c" style={{ "--i": i } as CSSProperties}>
              <span>{ch}</span>
              <span>{ch}</span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
