"use client"

import { useEffect, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion-pref"

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/"

/**
 * Decode-style text reveal. Same reveal logic as motion-primitives'
 * TextScramble (MIT, 21st.dev), reworked as a hook: the real text is the
 * initial state, so the server HTML is always correct and readable.
 */
export function useScramble(text: string, { duration = 0.7, speed = 0.035, chars = DEFAULT_CHARS } = {}) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text)
      return
    }
    const steps = Math.max(1, Math.round(duration / speed))
    let step = 0
    const id = window.setInterval(() => {
      const progress = step / steps
      let out = ""
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === " ") {
          out += " "
        } else if (progress * text.length > i) {
          out += c
        } else {
          out += chars[(Math.random() * chars.length) | 0]
        }
      }
      setDisplay(out)
      step++
      if (step > steps) {
        window.clearInterval(id)
        setDisplay(text)
      }
    }, speed * 1000)
    return () => window.clearInterval(id)
  }, [text, duration, speed, chars])

  return display
}

export function Scramble({ text, className }: { text: string; className?: string }) {
  const display = useScramble(text)
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
