"use client"

import { motion, useReducedMotion, useInView } from "framer-motion"
import { useRef } from "react"
import { ClipboardList, Code2, FlaskConical, Rocket } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper, AnimatedItem } from "@/components/section-wrapper"
import { cn } from "@/lib/utils"

const icons = [ClipboardList, Code2, FlaskConical, Rocket]

function ProcessStep({ 
  step, 
  index, 
  Icon, 
  isInView 
}: { 
  step: { title: string; description: string }
  index: number
  Icon: typeof ClipboardList
  isInView: boolean
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      animate={
        shouldReduceMotion
          ? {}
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 30 }
      }
      transition={{ 
        duration: 0.5, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Step number and icon with hover effect */}
      <motion.div
        className={cn(
          "w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mb-4",
          "transition-colors duration-300 hover:border-primary/30"
        )}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-7 h-7 text-primary" />
      </motion.div>

      {/* Animated dot on timeline */}
      <motion.div 
        className="hidden lg:flex absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background"
        initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
        animate={
          shouldReduceMotion
            ? {}
            : isInView
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
        }
        transition={{ 
          duration: 0.4, 
          delay: 0.3 + index * 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      <span className="text-xs font-medium text-primary mb-2">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  )
}

export function ProcessPreviewSection() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <SectionWrapper className="bg-card/30">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedItem>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t.process.title}
          </h2>
        </AnimatedItem>

        <div ref={ref} className="relative">
          {/* Background connection line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border/50 z-0" />
          
          {/* Animated progress line with stroke-dashoffset style */}
          {!shouldReduceMotion && (
            <motion.div
              className="hidden lg:block absolute top-8 left-0 h-px bg-primary z-0"
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3,
              }}
            />
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {t.process.steps.map((step, index) => {
              const Icon = icons[index]
              return (
                <ProcessStep
                  key={index}
                  step={step}
                  index={index}
                  Icon={Icon}
                  isInView={isInView}
                />
              )
            })}
          </div>
        </div>

        {/* Boundary statement */}
        <AnimatedItem className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg border border-border/30">
            {t.process.boundary}
          </p>
        </AnimatedItem>
      </div>
    </SectionWrapper>
  )
}
