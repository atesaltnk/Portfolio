"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/lib/motion-pref"

/**
 * Real-time ASCII fire — the classic "doom fire" cellular automaton.
 *
 * Every cell holds a heat value (0–MAX). Each step, heat climbs one row with a
 * random sideways jitter and loses a little energy, so flames lick upwards and
 * die out. Heat maps to a glyph ramp and an ember palette; glyphs are drawn
 * from a pre-rendered atlas, which is far cheaper than fillText per cell.
 * The pointer acts as a torch.
 */

const MAX = 36
const RAMP = " .:-=+*#%@"

// Heat → colour stops, interpolated into MAX + 1 entries.
const STOPS: Array<[number, [number, number, number, number]]> = [
  [0, [14, 13, 11, 0]],
  [5, [70, 14, 6, 0.85]],
  [11, [125, 24, 7, 1]],
  [18, [196, 44, 9, 1]],
  [24, [255, 77, 18, 1]],
  [29, [255, 135, 44, 1]],
  [33, [255, 196, 108, 1]],
  [36, [255, 241, 214, 1]],
]

function buildPalette(): string[] {
  const out: string[] = []
  for (let v = 0; v <= MAX; v++) {
    let i = 0
    while (i < STOPS.length - 2 && v > STOPS[i + 1][0]) i++
    const [a, ca] = STOPS[i]
    const [b, cb] = STOPS[i + 1]
    const k = b === a ? 0 : Math.min(1, Math.max(0, (v - a) / (b - a)))
    const c = ca.map((x, j) => x + (cb[j] - x) * k)
    out.push(`rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${c[3].toFixed(3)})`)
  }
  return out
}

interface AsciiFireProps {
  className?: string
  /** Fraction of the canvas height the flames reach (0–1). */
  reach?: number
  /** Glyph size in CSS pixels. */
  fontSize?: number
  /** Pointer injects heat like a torch. */
  interactive?: boolean
  /** Set to false to cut the fuel and let the flames die out. */
  lit?: boolean
  fps?: number
}

export function AsciiFire({
  className,
  reach = 0.72,
  fontSize = 13,
  interactive = true,
  lit = true,
  fps = 30,
}: AsciiFireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const litRef = useRef(lit)
  litRef.current = lit

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !host || !ctx) return

    const reduceMotion = prefersReducedMotion()
    const family =
      getComputedStyle(document.body).getPropertyValue("--font-jetbrains-mono").trim() || "monospace"
    const palette = buildPalette()
    const cw = Math.round(fontSize * 0.62)
    const ch = Math.round(fontSize * 1.02)

    let dpr = 1
    let cols = 0
    let rows = 0
    let heat = new Uint8Array(0)
    let atlas: HTMLCanvasElement | null = null
    let raf = 0
    let last = 0
    let running = true
    const pointer = { x: -1, y: -1, active: false }

    const buildAtlas = () => {
      const a = document.createElement("canvas")
      a.width = (MAX + 1) * cw * dpr
      a.height = ch * dpr
      const actx = a.getContext("2d")
      if (!actx) return null
      actx.scale(dpr, dpr)
      actx.font = `500 ${fontSize}px ${family}`
      actx.textBaseline = "middle"
      actx.textAlign = "center"
      for (let v = 1; v <= MAX; v++) {
        const glyph = RAMP[Math.min(RAMP.length - 1, Math.ceil((v / MAX) * (RAMP.length - 1)))]
        actx.fillStyle = palette[v]
        actx.fillText(glyph, v * cw + cw / 2, ch / 2)
      }
      return a
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(1, Math.ceil(rect.width / cw))
      rows = Math.max(2, Math.ceil(rect.height / ch))
      heat = new Uint8Array(cols * rows)
      atlas = buildAtlas()
    }

    const step = () => {
      const avgDecay = MAX / Math.max(3, rows * reach)
      const spread = avgDecay * 2 + 1
      const base = (rows - 1) * cols

      // Fuel row: mostly white-hot, with gaps that become tongues of flame.
      for (let x = 0; x < cols; x++) {
        const i = base + x
        if (litRef.current) {
          heat[i] = Math.random() < 0.82 ? MAX : MAX - ((Math.random() * 10) | 0)
        } else {
          heat[i] = heat[i] > 3 ? heat[i] - 3 : 0
        }
      }

      // Torch under the pointer.
      if (pointer.active && litRef.current) {
        const px = Math.floor(pointer.x / cw)
        const py = Math.floor(pointer.y / ch)
        for (let dy = -1; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const x = px + dx
            const y = py + dy
            if (x < 0 || x >= cols || y < 1 || y >= rows) continue
            if (Math.random() < 0.7) heat[y * cols + x] = MAX - ((Math.random() * 4) | 0)
          }
        }
      }

      // Propagate upward with jitter and decay.
      for (let y = 1; y < rows; y++) {
        const row = y * cols
        for (let x = 0; x < cols; x++) {
          const src = row + x
          const h = heat[src]
          if (h === 0) {
            heat[src - cols] = 0
            continue
          }
          const r = (Math.random() * 3) | 0
          let dst = src - cols - r + 1
          if (dst < 0) dst = 0
          const next = h - ((Math.random() * spread) | 0)
          heat[dst] = next > 0 ? next : 0
        }
      }
    }

    const render = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      if (!atlas) return
      const sw = cw * dpr
      const sh = ch * dpr
      // Skip the fuel row itself so there's no hard white line at the bottom.
      for (let y = 0; y < rows - 1; y++) {
        const row = y * cols
        const dy = y * ch
        for (let x = 0; x < cols; x++) {
          const v = heat[row + x]
          if (v < 3) continue
          ctx.drawImage(atlas, v * sw, 0, sw, sh, x * cw, dy, cw, ch)
        }
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!running) return
      if (now - last < 1000 / fps) return
      last = now
      step()
      render()
    }

    const settle = () => {
      for (let i = 0; i < rows * 2; i++) step()
      render()
    }

    resize()
    settle()

    const ro = new ResizeObserver(() => {
      resize()
      settle()
    })
    ro.observe(host)

    // Only spend frames while the fire is on screen and the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !document.hidden
    })
    io.observe(host)
    const onVisibility = () => {
      running = !document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      pointer.x = x
      pointer.y = y
    }
    const onLeave = () => {
      pointer.active = false
    }
    if (interactive && !reduceMotion) {
      window.addEventListener("pointermove", onPointer, { passive: true })
      document.addEventListener("pointerleave", onLeave)
    }

    if (!reduceMotion) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onPointer)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [fontSize, fps, interactive, reach])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 block", className)}
    />
  )
}
