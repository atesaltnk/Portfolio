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
    <span className={cn("font-display flex items-end gap-1 text-[26px] leading-none", className)}>
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
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Match the bar to whichever section is currently underneath it.
  useEffect(() => {
    let raf = 0
    const probe = () => {
      raf = 0
      const hits = document.elementsFromPoint(window.innerWidth / 2, 28)
      const host = hits
        .filter((el) => !el.closest("[data-header]"))
        .map((el) => el.closest<HTMLElement>("[data-scheme]"))
        .find(Boolean)
      const next = host?.dataset.scheme === "ink" ? "ink" : "paper"
      setScheme((prev) => (prev === next ? prev : next))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe)
    }
    probe()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
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
        className={cn(
          "h-[var(--header-h)] border-b border-line bg-bg/90 text-fg backdrop-blur-md transition-colors duration-500",
          scheme === "ink" ? "scheme-ink" : "scheme-paper"
        )}
      >
        <div className="frame grid h-full grid-cols-12">
          <div className="col-span-6 flex items-center px-4 md:col-span-3 md:border-r md:border-line">
            <Link href="/" aria-label="Ateş Altınkaynak — home" data-cursor="Home">
              <Logo />
            </Link>
          </div>
          <div className="col-span-6 hidden items-center overflow-hidden border-r border-line md:flex">
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
