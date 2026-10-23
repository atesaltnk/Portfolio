"use client"

import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion-pref"

/**
 * A small ember block that trails the pointer and opens into a label over
 * anything marked `data-cursor="Label"`. The native cursor stays visible;
 * fine pointers only, off for reduced motion.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = prefersReducedMotion()
    setEnabled(fine && !reduce)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const label = labelRef.current
    if (!enabled || !root || !label) return

    let x = -100
    let y = -100
    let cx = x
    let cy = y
    let raf = 0
    let current = ""

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      root.dataset.visible = "true"
      const host = (e.target as Element | null)?.closest?.("[data-cursor]")
      const next = host?.getAttribute("data-cursor") ?? ""
      if (next !== current) {
        current = next
        label.textContent = next
        root.dataset.active = next ? "true" : "false"
      }
    }
    const onLeave = () => {
      root.dataset.visible = "false"
    }
    const loop = () => {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      root.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-active="false"
      data-visible="false"
      className="group pointer-events-none fixed left-0 top-0 z-[95] opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
    >
      <div className="absolute left-3 top-3 flex h-2.5 min-w-2.5 items-center bg-ember text-ink transition-all duration-300 ease-out group-data-[active=true]:h-7 group-data-[active=true]:px-2.5">
        <span
          ref={labelRef}
          className="t-label hidden whitespace-nowrap group-data-[active=true]:block"
        />
      </div>
    </div>
  )
}
