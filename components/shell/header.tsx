"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { lockScroll } from "@/lib/scroll"
import { cn } from "@/lib/utils"
import { ClockTicker } from "./clocks"
import { LanguageSwitch } from "./language-switch"
import { MenuOverlay } from "./menu-overlay"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-mark flex items-end gap-1 text-[26px] leading-none", className)}>
      Ateş
      <span aria-hidden="true" className="mb-[3px] inline-block h-[0.6em] w-[0.34em] animate-pulse bg-ember in-[.reduce-motion]:animate-none" />
    </span>
  )
}

export function Header() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scheme, setScheme] = useState<"paper" | "ink">("paper")
  const [atTop, setAtTop] = useState(true)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Keep the bar bare (no fill, hairlines or ticker) until the page has
  // actually scrolled.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  // Match the bar to whichever section is currently underneath it. A one-pixel
  // observer strip on the bar's centre line does this without hit-testing the
  // page on every scroll frame.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scheme]")).filter(
      (el) => !el.closest("[data-header]")
    )
    const under = new Set<Element>()
    let io: IntersectionObserver | null = null

    const observe = () => {
      io?.disconnect()
      under.clear()
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) under.add(entry.target)
            else under.delete(entry.target)
          }
          const host = sections.filter((el) => under.has(el)).pop()
          const next = host?.dataset.scheme === "ink" ? "ink" : "paper"
          setScheme((prev) => (prev === next ? prev : next))
        },
        { rootMargin: `-28px 0px ${29 - window.innerHeight}px 0px` }
      )
      sections.forEach((el) => io?.observe(el))
    }

    observe()
    window.addEventListener("resize", observe)
    return () => {
      io?.disconnect()
      window.removeEventListener("resize", observe)
    }
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      lockScroll(false)
    }
  }, [open])

  return (
    <div data-header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="t-label sr-only z-[80] bg-ember px-3 py-2 text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        {t.nav.skip}
      </a>

      <header
        data-top={atTop}
        className={cn(
          "group/bar h-[var(--header-h)] border-b text-fg transition-[background-color,border-color,color,backdrop-filter] duration-500",
          scheme === "ink" ? "scheme-ink" : "scheme-paper",
          atTop ? "bg-transparent! border-transparent" : "border-line bg-bg/90 backdrop-blur-md"
        )}
      >
        <div className="frame grid h-full grid-cols-12 transition-colors duration-500 group-data-[top=true]/bar:border-transparent">
          <div className="col-span-6 flex items-center px-4 transition-colors duration-500 md:col-span-3 md:border-r md:border-line group-data-[top=true]/bar:border-transparent">
            <Link href="/" aria-label="Ateş Altınkaynak — home" data-cursor="Home">
              <Logo />
            </Link>
          </div>
          <div className="col-span-6 hidden items-center overflow-hidden border-r border-line transition-[opacity,border-color] duration-500 md:flex group-data-[top=true]/bar:border-transparent group-data-[top=true]/bar:opacity-0">
            <ClockTicker className="w-full" />
          </div>
          <div className="col-span-6 flex items-center justify-end gap-3 pr-16 md:col-span-3">
            <LanguageSwitch className="hidden sm:grid" />
          </div>
        </div>
      </header>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.nav.close : t.nav.menu}
        data-cursor={open ? t.nav.close : t.nav.menu}
        className={cn(
          "group absolute right-[calc(var(--gutter)+8px)] top-1/2 z-[70] flex size-10 -translate-y-1/2 flex-col items-center justify-center gap-[5px] transition-colors duration-300",
          open ? "bg-ink" : "bg-ember"
        )}
        style={{ top: "calc(var(--header-h) / 2)" }}
      >
        <span
          className={cn(
            "block h-[2px] w-4 transition-transform duration-500 ease-[var(--ease-out-expo)]",
            open ? "translate-y-[3.5px] rotate-45 bg-ember" : "bg-ink group-hover:w-5"
          )}
        />
        <span
          className={cn(
            "block h-[2px] w-4 transition-transform duration-500 ease-[var(--ease-out-expo)]",
            open ? "-translate-y-[3.5px] -rotate-45 bg-ember" : "bg-ink group-hover:w-3"
          )}
        />
      </button>

      <AnimatePresence>
        {open && <MenuOverlay pathname={pathname} onNavigate={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
