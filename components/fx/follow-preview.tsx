"use client"

import { useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"

/**
 * Tracks the pointer and floats `children` beside it while `open` — the hover
 * image that trails the race-calendar rows on nickho-motorsports. Desktop only.
 */
export function useFollowPointer() {
  const x = useMotionValue(-999)
  const y = useMotionValue(-999)
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches)
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [x, y])

  return { x: sx, y: sy, fine }
}

export function FollowPreview({
  open,
  children,
  width = 320,
  height = 210,
  previewKey,
}: {
  open: boolean
  children: ReactNode
  width?: number
  height?: number
  previewKey?: string
}) {
  const { x, y, fine } = useFollowPointer()
  if (!fine) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[85]"
      style={{ x, y, width, height, translateX: 24, translateY: -height / 2 }}
    >
      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key={previewKey}
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.86, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
