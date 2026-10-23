"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL } from "@/lib/github"
import { CONTACT_EMAIL } from "@/lib/site"
import { RollText } from "@/components/fx/roll-text"
import { cn } from "@/lib/utils"
import { LanguageSwitch } from "./language-switch"
import { MotionToggle } from "./motion-toggle"
import { formatClock, HOME_TZ, useNow } from "./clocks"

const EASE = [0.76, 0, 0.24, 1] as const

/** Full-screen ember takeover with numbered, rolling links. */
export function MenuOverlay({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { t } = useLanguage()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const now = useNow()
  const { time, offset } = formatClock(now, HOME_TZ)

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/work", label: t.nav.work },
    { href: "/about", label: t.nav.about },
    { href: "/process", label: t.nav.process },
    { href: "/contact", label: t.nav.contact },
  ]

  useEffect(() => {
    const id = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 450)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      data-scheme="ember"
      className="scheme-ember fixed inset-0 z-[60] flex flex-col"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(100% 0 0 0)" }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <div className="frame flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-4 pr-16">
        <span className="t-label">{t.nav.menu}</span>
        <span className="t-label tabular-nums" suppressHydrationWarning>
          Ankara {time} {offset}
        </span>
      </div>

      <div className="frame grid min-h-0 flex-1 grid-cols-12">
        <nav className="col-span-12 flex flex-col justify-center border-line md:col-span-8 md:border-r">
          {links.map((link, i) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="group flex items-center gap-4 border-b border-line px-4 py-1 first:border-t md:gap-8"
              >
                <span className="t-label w-10 shrink-0 opacity-70">({String(i + 1).padStart(2, "0")})</span>
                <span className="mask-y block">
                  <motion.span
                    className="font-display block text-[clamp(2.6rem,7.2vw,7.4rem)]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.28 + i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <RollText>{link.label}</RollText>
                  </motion.span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-auto size-3 shrink-0 bg-ink transition-transform duration-300",
                    active ? "scale-100" : "scale-0 group-hover:scale-100"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <motion.div
          className="col-span-12 flex flex-col justify-between gap-8 px-4 py-6 md:col-span-4 md:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <div>
            <p className="t-label mb-3 opacity-70">{t.menu.language}</p>
            <LanguageSwitch size="lg" className="w-full max-w-xs" />
            <MotionToggle className="mt-5" />
          </div>
          <div>
            <p className="t-label mb-3 opacity-70">{t.menu.elsewhere}</p>
            <ul className="space-y-1">
              <li>
                <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="font-display t-h3">
                  <RollText>GitHub ↗</RollText>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-display t-h3">
                  <RollText>Email ↗</RollText>
                </a>
              </li>
            </ul>
          </div>
          <p className="t-label flex items-center gap-2">
            <span className="inline-block size-2 bg-ink" />
            {t.meta.available}
          </p>
        </motion.div>
      </div>

      <div className="frame flex h-12 shrink-0 items-center justify-between border-t border-line px-4">
        <span className="t-label normal-case">{t.hero.wordNote}</span>
        <span className="t-label hidden sm:block">{t.meta.coords}</span>
      </div>
    </motion.div>
  )
}
