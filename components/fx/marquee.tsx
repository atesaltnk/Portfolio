import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Seamless CSS marquee: two identical tracks that each slide a full width. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  pausable = false,
  className,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  pausable?: boolean
  className?: string
}) {
  const trackStyle: CSSProperties | undefined = reverse ? { animationDirection: "reverse" } : undefined

  return (
    <div
      className={cn("marquee", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      data-pausable={pausable || undefined}
    >
      <div className="marquee-track" style={trackStyle}>
        {children}
      </div>
      <div className="marquee-track" style={trackStyle} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}
