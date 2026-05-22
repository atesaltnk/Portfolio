"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { AnimatedBackgroundLayer } from "@/components/motion/animated-background-layer"
import { CursorSpotlight } from "@/components/motion/cursor-spotlight"
import type { Repo } from "@/lib/github"
import { cn } from "@/lib/utils"

function normalizeHeadlineSpacing(input: string) {
  const plusLike = /[+＋]/g
  return input
    .replace(plusLike, " + ")
    .replace(/([\p{L}\p{N}])([.,;:!?])/gu, "$1$2 ")
    .replace(/([.,;:!?])([\p{L}\p{N}])/gu, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
}

function SplitText({ text, className }: { text: string; className?: string }) {
  const words = normalizeHeadlineSpacing(text).split(" ")

  return (
    <span className={cn(className)}>
      {words.map((word, i) => (
        <span key={i} className="inline pl-0">
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={false}
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && <span aria-hidden>{" "}</span>}
        </span>
      ))}
    </span>
  )
}

// Decorative "editor window" so the hero reads as a developer space, not empty canvas.
function CodeWindow({ repoCount, enableMotion }: { repoCount: number; enableMotion: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="relative w-full max-w-lg"
      initial={false}
      animate={enableMotion ? { y: [0, -14, 0] } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -inset-4 rounded-3xl opacity-40 glow-green-subtle pointer-events-none" />
      <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/50 bg-background/40">
          <span className="h-3.5 w-3.5 rounded-full bg-destructive/70" />
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400/70" />
          <span className="h-3.5 w-3.5 rounded-full bg-primary/70" />
          <span className="ml-3 text-sm text-muted-foreground font-mono">ates.ts</span>
        </div>

        {/* Code body */}
        <div className="p-6 md:p-7 font-mono text-[15px] md:text-base leading-relaxed">
          <p>
            <span className="text-primary">const</span>{" "}
            <span className="text-foreground">ates</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-amber-300/90">Developer</span>
            <span className="text-muted-foreground"> = {"{"}</span>
          </p>
          <p className="pl-5">
            <span className="text-sky-300/80">role</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-300/80">&quot;Software Developer&quot;</span>
            <span className="text-muted-foreground">,</span>
          </p>
          <p className="pl-5">
            <span className="text-sky-300/80">location</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-300/80">&quot;Ankara, TR&quot;</span>
            <span className="text-muted-foreground">,</span>
          </p>
          <p className="pl-5">
            <span className="text-sky-300/80">stack</span>
            <span className="text-muted-foreground">: [</span>
            <span className="text-emerald-300/80">&quot;TypeScript&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-emerald-300/80">&quot;Python&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-emerald-300/80">&quot;C++&quot;</span>
            <span className="text-muted-foreground">],</span>
          </p>
          {repoCount > 0 && (
            <p className="pl-5">
              <span className="text-sky-300/80">projects</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-orange-300/90">{repoCount}</span>
              <span className="text-muted-foreground">,</span>
            </p>
          )}
          <p className="pl-5">
            <span className="text-sky-300/80">openToWork</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-primary">true</span>
            <span className="text-muted-foreground">,</span>
          </p>
          <p>
            <span className="text-muted-foreground">{"}"}</span>
            <motion.span
              className="ml-1 inline-block w-2 h-4 align-middle bg-primary/80"
              animate={enableMotion ? { opacity: [1, 0, 1] } : undefined}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSection({ repos = [] }: { repos?: Repo[] }) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const enableMotion = mounted && !shouldReduceMotion

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  return (
    <CursorSpotlight className="relative">
      <motion.section
        ref={containerRef}
        className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden"
        variants={containerVariants}
        initial={enableMotion ? "hidden" : false}
        animate={enableMotion ? "visible" : undefined}
      >
        <AnimatedBackgroundLayer
          variant="hero"
          showGrid={false}
          disableAnimations={!mounted || Boolean(shouldReduceMotion)}
        />

        <div className="mx-auto max-w-6xl px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: copy */}
            <div className="max-w-xl">
              <motion.h1
                className="font-sans text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-foreground"
                variants={itemVariants}
                initial={false}
              >
                <SplitText text={t.hero.headline} />
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed"
                variants={itemVariants}
                initial={false}
              >
                {t.hero.subheadline}
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
                initial={false}
              >
                <motion.div
                  whileHover={enableMotion ? { scale: 1.05 } : {}}
                  whileTap={enableMotion ? { scale: 0.98 } : {}}
                  initial={false}
                >
                  <Link
                    href="/contact"
                    className={cn(
                      "group relative inline-flex items-center justify-center gap-2 px-6 py-3",
                      "bg-primary text-primary-foreground font-medium rounded-lg",
                      "transition-all duration-300",
                      "hover:shadow-[0_0_30px_oklch(0.45_0.12_155_/_0.4)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                  >
                    <span className="relative z-10">{t.hero.primaryCta}</span>
                    <ArrowRight
                      size={18}
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>

                <Link
                  href="/work"
                  className={cn(
                    "group relative inline-flex items-center justify-center gap-2 px-6 py-3",
                    "bg-transparent border border-border text-foreground font-medium rounded-lg",
                    "transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  {t.hero.secondaryCta}
                  <span className="absolute bottom-2 left-6 right-6 h-[1px] bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
                variants={itemVariants}
                initial={false}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm text-muted-foreground">{t.hero.statusLine}</span>
              </motion.div>
            </div>

            {/* Right: editor window visual */}
            <motion.div
              className="hidden lg:flex justify-end"
              variants={itemVariants}
              initial={false}
            >
              <CodeWindow repoCount={repos.length} enableMotion={enableMotion} />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </CursorSpotlight>
  )
}
