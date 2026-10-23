// Motion preference: follows the OS (`prefers-reduced-motion`) unless the
// visitor picks Full or Calm in the footer/menu. An inline script in the root
// layout resolves it before first paint into `html.reduce-motion`, which both
// CSS and JS read — one source of truth.

export const MOTION_KEY = "ates:motion"

export type MotionMode = "full" | "reduced"

export function prefersReducedMotion(): boolean {
  if (typeof document === "undefined") return false
  return document.documentElement.classList.contains("reduce-motion")
}

export function setMotionMode(mode: MotionMode) {
  try {
    localStorage.setItem(MOTION_KEY, mode)
    sessionStorage.setItem("ates:intro", "1")
  } catch {}
  // Lenis, the fire and the cursor all initialise on mount; a reload is the
  // simplest way to bring every one of them up (or down) consistently.
  window.location.reload()
}

/** Runs in <head> before paint. Keep it tiny and dependency-free. */
export const MOTION_SCRIPT = `try{var d=document.documentElement,s=localStorage.getItem('${MOTION_KEY}'),r=s?s==='reduced':matchMedia('(prefers-reduced-motion: reduce)').matches;if(r){d.classList.add('reduce-motion')}else if(!sessionStorage.getItem('ates:intro')){d.classList.add('intro')}}catch(e){}`
