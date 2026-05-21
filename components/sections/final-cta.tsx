"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper, AnimatedItem } from "@/components/section-wrapper"
import { CtaGlow } from "@/components/motion/CtaGlow"
import { cn } from "@/lib/utils"

export function FinalCTASection() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedItem>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 md:p-12 lg:p-16 text-center">
            {/* Clqu.dev-style animated glow behind CTA (clipped by border radius) */}
            <CtaGlow noiseOpacity={0.08} />

            <div className="relative z-10">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground max-w-2xl mx-auto text-balance leading-tight">
                {t.finalCta.text}
              </p>

              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="inline-block mt-8"
              >
                <Link
                  href="/contact"
                  className={cn(
                    "group inline-flex items-center gap-2 px-8 py-4",
                    "bg-primary text-primary-foreground font-medium rounded-xl",
                    "transition-all duration-300",
                    "hover:shadow-[0_0_30px_oklch(0.45_0.12_155_/_0.4)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  {t.finalCta.button}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </AnimatedItem>
      </div>
    </SectionWrapper>
  )
}
