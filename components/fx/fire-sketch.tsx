"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Draw into the fire. With the fire band on screen, D toggles a pen: sketch in
 * white, press D again and the sketch drops as a rigid body — it falls, tips
 * over onto its side, and burns from the bottom up into embers that feed the
 * ASCII flames underneath. Esc throws the sketch away.
 *
 * Built for zero idle cost: no frames run unless something is being drawn,
 * falling or burning, and the canvas is only allocated on first use.
 */

type Point = [number, number]

interface Particle {
  lx: number
  ly: number
  key: number
  alive: boolean
}

interface Body {
  x: number
  y: number
  vx: number
  vy: number
  a: number
  va: number
  radius: number
  parts: Particle[]
  /** Particle it's resting on, if any — the pivot it tips over. */
  contact: number
  /** When the burn starts (set on first touchdown, slightly delayed). */
  burnAt: number | null
  lit: boolean
}

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
}

const PEN = 5 // stroke width, CSS px
const SPACING = 1.5 // particle spacing along a stroke
const GRAVITY = 2600 // px/s²
const BURN_MS = 4200
const MAX_POINTS = 6000
const WHITE = "#f4f1ea"
// Burn front: how far ahead of the flame a particle is → its colour.
const SCORCH: Array<[number, string]> = [
  [0.02, "#ff4d12"],
  [0.05, "#ff8a2c"],
  [0.1, "#ffd79a"],
]

export function FireSketch({
  sparks,
  onModeChange,
}: {
  sparks: { current: Point[] }
  onModeChange?: (drawing: boolean) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const modeRef = useRef(onModeChange)
  modeRef.current = onModeChange

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    let ctx: CanvasRenderingContext2D | null = null
    let w = 0
    let h = 0
    let dpr = 1
    let visible = false
    let active = false
    let raf = 0
    let last = 0
    let strokes: Point[][] = []
    let pointCount = 0
    let pen: Point[] | null = null
    const bodies: Body[] = []
    const embers: Ember[] = []

    const size = () => {
      const rect = host.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx = canvas.getContext("2d")
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const setMode = (next: boolean) => {
      active = next
      setDrawing(next)
      modeRef.current?.(next)
    }

    // ── Rendering ────────────────────────────────────────────────
    const render = (now: number) => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // The live pen.
      if (strokes.length) {
        ctx.strokeStyle = WHITE
        ctx.fillStyle = WHITE
        ctx.lineWidth = PEN
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        for (const s of strokes) {
          if (s.length === 1) {
            ctx.beginPath()
            ctx.arc(s[0][0], s[0][1], PEN / 2, 0, Math.PI * 2)
            ctx.fill()
            continue
          }
          ctx.beginPath()
          ctx.moveTo(s[0][0], s[0][1])
          for (let i = 1; i < s.length; i++) ctx.lineTo(s[i][0], s[i][1])
          ctx.stroke()
        }
      }

      // Falling / burning sketches, batched into one path per colour.
      const r = PEN / 2
      for (const b of bodies) {
        const cos = Math.cos(b.a)
        const sin = Math.sin(b.a)
        const progress = b.burnAt === null ? -1 : burnProgress(now - b.burnAt)
        const buckets: Array<Path2D> = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]
        for (const p of b.parts) {
          if (!p.alive) continue
          const x = b.x + p.lx * cos - p.ly * sin
          const y = b.y + p.lx * sin + p.ly * cos
          const ahead = p.key - progress
          let slot = 3
          for (let i = 0; i < SCORCH.length; i++) {
            if (ahead <= SCORCH[i][0]) {
              slot = i
              break
            }
          }
          buckets[slot].rect(x - r, y - r, PEN, PEN)
        }
        for (let i = 0; i < SCORCH.length; i++) {
          ctx.fillStyle = SCORCH[i][1]
          ctx.fill(buckets[i])
        }
        ctx.fillStyle = WHITE
        ctx.fill(buckets[3])
      }

      // Embers drift up and cool from yellow to red.
      if (embers.length) {
        const hot = new Path2D()
        const warm = new Path2D()
        const cool = new Path2D()
        for (const e of embers) {
          const t = e.age / e.life
          const s = 2.5 * (1 - t) + 1
          ;(t < 0.3 ? hot : t < 0.65 ? warm : cool).rect(e.x - s / 2, e.y - s / 2, s, s)
        }
        ctx.fillStyle = "#ffe2a8"
        ctx.fill(hot)
        ctx.fillStyle = "#ff8a2c"
        ctx.fill(warm)
        ctx.fillStyle = "rgb(255 77 18 / 0.7)"
        ctx.fill(cool)
      }
    }

    const burnProgress = (elapsed: number) => -0.08 + (1.2 * elapsed) / BURN_MS

    // ── Physics ──────────────────────────────────────────────────
    const simulate = (dt: number, now: number) => {
      const floor = h * 0.9
      const r = PEN / 2

      for (let bi = bodies.length - 1; bi >= 0; bi--) {
        const b = bodies[bi]
        b.vy += GRAVITY * dt
        b.x += b.vx * dt
        b.y += b.vy * dt

        // Rotate about the resting point when there is one, so the sketch
        // pivots over its edge instead of spinning in place.
        const pivot = b.contact >= 0 ? b.parts[b.contact] : null
        if (pivot) {
          const c0 = Math.cos(b.a)
          const s0 = Math.sin(b.a)
          b.a += b.va * dt
          const c1 = Math.cos(b.a)
          const s1 = Math.sin(b.a)
          b.x += pivot.lx * (c0 - c1) - pivot.ly * (s0 - s1)
          b.y += pivot.lx * (s0 - s1) + pivot.ly * (c0 - c1)
        } else {
          b.a += b.va * dt
        }

        const cos = Math.cos(b.a)
        const sin = Math.sin(b.a)
        let lowest = -Infinity
        let lowIdx = -1
        let contactX = b.x
        let minX = Infinity
        let maxX = -Infinity
        b.parts.forEach((p, i) => {
          if (!p.alive) return
          const x = b.x + p.lx * cos - p.ly * sin
          const y = b.y + p.lx * sin + p.ly * cos
          if (y > lowest) {
            lowest = y
            lowIdx = i
            contactX = x
          }
          if (x < minX) minX = x
          if (x > maxX) maxX = x
        })

        // Floor: push out, bounce a little, and let gravity tip it over the
        // contact point (torque about the pivot) until it lies on its side.
        b.contact = -1
        if (lowest + r > floor) {
          b.y -= lowest + r - floor
          if (b.vy > 0) {
            b.vy = b.vy > 160 ? -b.vy * 0.28 : 0
            b.vx *= 0.7
          }
          const dx = b.x - contactX
          const dy = b.y - lowest
          const k = b.radius * 0.45
          b.va += (GRAVITY * dx * dt) / (k * k + dx * dx + dy * dy)
          b.va *= 0.92
          b.vx *= 0.94
          b.contact = lowIdx
          if (b.burnAt === null) b.burnAt = now + 450
        }

        // Once it has had a moment to settle, set a ragged burn front that
        // starts at whatever is lowest now.
        if (b.burnAt !== null && !b.lit && now >= b.burnAt) {
          b.lit = true
          const ys = b.parts.map((p) => b.y + p.lx * sin + p.ly * cos)
          let top = Infinity
          let bottom = -Infinity
          for (const y of ys) {
            if (y < top) top = y
            if (y > bottom) bottom = y
          }
          const span = Math.max(1, bottom - top)
          b.parts.forEach((p, i) => {
            p.key = 0.8 * ((bottom - ys[i]) / span) + 0.2 * Math.random()
          })
        }

        // Walls.
        if (minX - r < 0) {
          b.x += r - minX
          b.vx = Math.abs(b.vx) * 0.4
        } else if (maxX + r > w) {
          b.x -= maxX + r - w
          b.vx = -Math.abs(b.vx) * 0.4
        }

        // Burning: particles past the front turn to embers and feed the fire.
        if (b.lit && b.burnAt !== null) {
          const progress = burnProgress(now - b.burnAt)
          let alive = 0
          for (const p of b.parts) {
            if (!p.alive) continue
            if (p.key > progress) {
              alive++
              continue
            }
            p.alive = false
            const x = b.x + p.lx * cos - p.ly * sin
            const y = b.y + p.lx * sin + p.ly * cos
            if (Math.random() < 0.45 && embers.length < 1400) {
              embers.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 60,
                vy: -60 - Math.random() * 110,
                age: 0,
                life: 0.6 + Math.random() * 0.9,
              })
            }
            if (Math.random() < 0.3 && sparks.current.length < 120) sparks.current.push([x, Math.min(y, h - 2)])
          }
          if (alive === 0) bodies.splice(bi, 1)
        }
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.age += dt
        if (e.age >= e.life) {
          embers[i] = embers[embers.length - 1]
          embers.pop()
          continue
        }
        e.vy -= 140 * dt
        e.vx += (Math.random() - 0.5) * 240 * dt
        e.x += e.vx * dt
        e.y += e.vy * dt
      }
    }

    // Frames only while something is in motion.
    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60)
      last = now
      simulate(dt, now)
      render(now)
      raf = bodies.length || embers.length ? requestAnimationFrame(tick) : 0
    }
    const wake = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    // ── Pen ──────────────────────────────────────────────────────
    const local = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return [e.clientX - rect.left, e.clientY - rect.top]
    }
    // One redraw per frame for pen input; the physics loop redraws anyway.
    let queued = 0
    const paint = () => {
      if (raf || queued) return
      queued = requestAnimationFrame((now) => {
        queued = 0
        render(now)
      })
    }
    const onDown = (e: PointerEvent) => {
      if (!active || e.button !== 0) return
      e.preventDefault()
      canvas.setPointerCapture(e.pointerId)
      pen = [local(e)]
      strokes.push(pen)
      pointCount++
      paint()
    }
    const onMove = (e: PointerEvent) => {
      if (!active || !pen || pointCount >= MAX_POINTS) return
      const [x, y] = local(e)
      const [px, py] = pen[pen.length - 1]
      if (Math.hypot(x - px, y - py) < SPACING) return
      pen.push([x, y])
      pointCount++
      paint()
    }
    const onUp = () => {
      pen = null
    }

    // Turn the pen strokes into one rigid body made of particles.
    const drop = () => {
      const pts: Point[] = []
      for (const s of strokes) {
        pts.push(s[0])
        for (let i = 1; i < s.length; i++) {
          const [x0, y0] = s[i - 1]
          const [x1, y1] = s[i]
          const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / SPACING))
          for (let k = 1; k <= n; k++) pts.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n])
        }
      }
      strokes = []
      pointCount = 0
      pen = null
      if (!pts.length) {
        paint()
        return
      }
      let cx = 0
      let cy = 0
      for (const [x, y] of pts) {
        cx += x
        cy += y
      }
      cx /= pts.length
      cy /= pts.length
      let radius = 0
      const parts = pts.map(([x, y]) => {
        radius = Math.max(radius, Math.hypot(x - cx, y - cy))
        return { lx: x - cx, ly: y - cy, key: 1, alive: true }
      })
      bodies.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        a: 0,
        va: (Math.random() - 0.5) * 0.8,
        radius,
        parts,
        contact: -1,
        burnAt: null,
        lit: false,
      })
      wake()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return
      const key = e.key.toLowerCase()
      if (key === "escape" && active) {
        strokes = []
        pointCount = 0
        pen = null
        setMode(false)
        paint()
        return
      }
      if (key !== "d" || (!visible && !active)) return
      if (!active) {
        if (!ctx) size()
        setMode(true)
      } else {
        setMode(false)
        drop()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { threshold: 0.25 })
    io.observe(host)
    // Resizing clears a canvas, so redraw straight after.
    const ro = new ResizeObserver(() => {
      if (!ctx) return
      size()
      render(performance.now())
    })
    ro.observe(host)

    window.addEventListener("keydown", onKey)
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(queued)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("keydown", onKey)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
    }
  }, [sparks])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "absolute inset-0 z-20 h-full w-full touch-none",
        drawing ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
      )}
    />
  )
}
