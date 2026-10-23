"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { scrollToTarget } from "@/lib/scroll"
import { prefersReducedMotion } from "@/lib/motion-pref"

/** Lenis smooth scrolling (skipped for reduced motion) + scroll-to-top on navigation. */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: true })
    window.__lenis = lenis
    return () => {
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  useEffect(() => {
    scrollToTarget(0, { immediate: true })
  }, [pathname])

  return null
}
