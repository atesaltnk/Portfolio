"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"

const COLS = 16
const ROWS = 4

// Deterministic PRNG so server and client agree on the pattern.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(98)
const THRESHOLDS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const row = Math.floor(i / COLS)
  // Lower rows give way first, so ink "drains" upward into paper.
  return 0.08 + ((ROWS - 1 - row) / (ROWS - 1)) * 0.3 + rand() * 0.22
})

function Pixel({ progress, t }: { progress: MotionValue<number>; t: number }) {
  const scale = useTransform(progress, [t, t + 0.22], [1, 0])
  return <motion.span style={{ scale }} className="block bg-ink" />
}

/** Checkered dissolve from an ink section into a paper one. */
export function PixelDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scheme="paper"
      className="relative grid h-[clamp(72px,12vw,180px)] bg-paper"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {THRESHOLDS.map((t, i) => (
        <Pixel key={i} progress={scrollYProgress} t={t} />
      ))}
    </div>
  )
}
