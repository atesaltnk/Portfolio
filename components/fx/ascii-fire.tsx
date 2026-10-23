"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/lib/motion-pref"
import { createFireGL, supportsFireGL } from "./fire-gl"

/**
 * Real-time ASCII fire — the classic "doom fire" cellular automaton.
 *
 * Every cell holds a heat value (0–MAX). Each step, heat climbs one row with a
 * random sideways jitter and loses a little energy, so flames lick upwards and
 * die out. Heat maps to a glyph ramp and an ember palette; glyphs are drawn
 * from a pre-rendered atlas, which is far cheaper than fillText per cell — and
 * where WebGL is available a single shader samples that atlas for every cell
 * at once (see fire-gl.ts). The pointer acts as a torch.
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
  /**
   * Extra heat: points in canvas-local CSS pixels that flare up on the next
   * step. The list is emptied as it's read, so callers can keep pushing.
   */
  sparks?: { current: Array<[number, number]> }
}

export function AsciiFire({
  className,
  reach = 0.72,
  fontSize = 13,
  interactive = true,
  lit = true,
  fps = 30,
  sparks,
}: AsciiFireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const litRef = useRef(lit)
  litRef.current = lit
  // Read live so toggling the torch never restarts the simulation.
  const interactiveRef = useRef(interactive)
  interactiveRef.current = interactive

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    // Draw on the GPU where possible; the per-cell 2D path is the fallback.
    const gpu = supportsFireGL()
      ? createFireGL(canvas, () => {
          resize()
          settle()
        })
      : null
    const ctx = gpu ? null : canvas.getContext("2d")
    if (!gpu && !ctx) return

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
    let onScreen = true
    let running = true
    // Raw client coordinates; resolved against the canvas once per step rather
    // than on every pointer event, so moving the mouse never forces layout.
    const pointer = { x: 0, y: 0, active: false }

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
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(1, Math.ceil(rect.width / cw))
      rows = Math.max(2, Math.ceil(rect.height / ch))
      heat = new Uint8Array(cols * rows)
      atlas = buildAtlas()
      if (gpu) {
        gpu.resize(cols, rows)
        if (atlas) gpu.setAtlas(atlas, cw, ch, dpr)
      }
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
      const rect = pointer.active && interactiveRef.current && litRef.current ? host.getBoundingClientRect() : null
      const lx = rect ? pointer.x - rect.left : -1
      const ly = rect ? pointer.y - rect.top : -1
      if (rect && lx >= 0 && ly >= 0 && lx <= rect.width && ly <= rect.height) {
        const px = Math.floor(lx / cw)
        const py = Math.floor(ly / ch)
        for (let dy = -1; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const x = px + dx
            const y = py + dy
            if (x < 0 || x >= cols || y < 1 || y >= rows) continue
            if (Math.random() < 0.7) heat[y * cols + x] = MAX - ((Math.random() * 4) | 0)
          }
        }
      }

      // Outside heat (e.g. a sketch burning in the flames).
      const points = sparks?.current
      if (points?.length) {
        for (const [sx, sy] of points) {
          const px = Math.floor(sx / cw)
          const py = Math.floor(sy / ch)
          for (let dx = -1; dx <= 1; dx++) {
            const x = px + dx
            if (x < 0 || x >= cols || py < 1 || py >= rows) continue
            heat[py * cols + x] = MAX - ((Math.random() * 6) | 0)
          }
        }
        points.length = 0
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
      if (gpu) {
        gpu.draw(heat)
        return
      }
      if (!ctx) return
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
      onScreen = entry.isIntersecting
      running = onScreen && !document.hidden
    })
    io.observe(host)
    const onVisibility = () => {
      running = onScreen && !document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onPointer = (e: PointerEvent) => {
      pointer.active = true
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const onLeave = () => {
      pointer.active = false
    }
    if (!reduceMotion) {
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
  }, [fontSize, fps, reach, sparks])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 block", className)}
    />
  )
}
