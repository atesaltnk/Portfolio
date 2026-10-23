import type Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/** Scroll to a position or element, through Lenis when it's running. */
export function scrollToTarget(target: number | HTMLElement, opts: { immediate?: boolean } = {}) {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined
  if (lenis) {
    lenis.scrollTo(target, { immediate: opts.immediate, duration: 1.4, force: true })
    return
  }
  const top =
    typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: opts.immediate ? "instant" : "smooth" })
}

export function lockScroll(locked: boolean) {
  const lenis = window.__lenis
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? "hidden" : ""
}
