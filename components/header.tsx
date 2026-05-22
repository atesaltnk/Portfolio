"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

// Nav link with animated underline
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm transition-colors py-2 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: shouldReduceMotion ? 0 : 0.5,
          }}
        />
      )}

      {/* Hover underline (only for non-active) */}
      {!isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      )}
    </Link>
  )
}

// CTA button with glow effect
function CTAButton({ href, label }: { href: string; label: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      <Link
        href={href}
        className={cn(
          "relative px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg",
          "transition-all duration-300",
          "hover:shadow-[0_0_20px_oklch(0.45_0.12_155_/_0.35)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {label}
      </Link>
    </motion.div>
  )
}

const MORPH_SPRING = { type: "spring" as const, stiffness: 260, damping: 30, mass: 1 }

export function Header() {
  const { locale, setLocale, t } = useLanguage()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const [isScrolled, setIsScrolled] = useState(false)

  // Single scroll source: one passive window listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/work", label: t.nav.work },
    { href: "/about", label: t.nav.about },
    { href: "/process", label: t.nav.process },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      {/* Single inner motion node: morphs between full-width bar and centered pill */}
      <motion.div
        className={cn(
          "mx-auto w-full pointer-events-auto flex items-center justify-between border-border/30",
          "glass-panel",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-lg border"
            : "bg-background/60 backdrop-blur-md shadow-none border-b"
        )}
        initial={false}
        animate={{
          maxWidth: isScrolled ? "72rem" : "100%",
          borderRadius: isScrolled ? "999px" : "0px",
          marginTop: isScrolled ? "12px" : "0px",
          padding: isScrolled ? "10px 24px" : "16px 48px",
        }}
        transition={MORPH_SPRING}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          )}
        >
          Ateş Altınkaynak
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Right side: Language toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle with pill animation */}
          <div className="relative flex items-center gap-1 bg-secondary/50 rounded-full p-1">
            {/* Animated background pill */}
            <motion.div
              className="absolute top-1 bottom-1 bg-primary rounded-full"
              layoutId="lang-toggle"
              initial={false}
              animate={{
                left: locale === "tr" ? 4 : locale === "en" ? "calc(50% + 2px)" : "calc(100% - 54px)",
                width: "calc(50% - 6px)",
              }}
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: shouldReduceMotion ? 0 : 0.4,
              }}
            />

            <button
              onClick={() => setLocale("tr")}
              className={cn(
                "relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors",
                locale === "tr" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              TR
            </button>
            <button
              onClick={() => setLocale("en")}
              className={cn(
                "relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors",
                locale === "en" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("de")}
              className={cn(
                "relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors",
                locale === "de" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              DE
            </button>
          </div>

          {/* CTA Button */}
          <CTAButton href="/contact" label={t.nav.contact} />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded relative z-[70]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Mobile: full-screen overlay, fixed inset-0, z above header; body scroll locked; close on link + ESC */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden pointer-events-auto"
            style={{ touchAction: "none" }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden={!mobileMenuOpen}
          >
            <nav
              className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-20 pt-[calc(5rem+env(safe-area-inset-top))] space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-3xl font-serif font-medium transition-colors",
                      pathname === item.href ? "text-primary" : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center gap-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => setLocale("tr")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all border",
                    locale === "tr" ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"
                  )}
                >
                  Türkçe
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all border",
                    locale === "en" ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"
                  )}
                >
                  English
                </button>
                <button
                  onClick={() => setLocale("de")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all border",
                    locale === "de" ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"
                  )}
                >
                  Deutsch
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl text-lg shadow-lg shadow-primary/20"
                >
                  {t.nav.contact}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
