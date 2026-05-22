"use client"

import { motion, useReducedMotion } from "framer-motion"
import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { containerVariants } from "@/lib/motion"

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  stagger?: "fast" | "normal" | "slow"
}

const staggerDelays = {
  fast: { staggerChildren: 0.05, delayChildren: 0.1 },
  normal: { staggerChildren: 0.1, delayChildren: 0.15 },
  slow: { staggerChildren: 0.15, delayChildren: 0.2 },
}

export function SectionWrapper({ 
  children, 
  className, 
  id,
  stagger = "normal" 
}: SectionWrapperProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <section id={id} className={cn("py-20 md:py-28", className)}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={cn("py-20 md:py-28", className)}
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: staggerDelays[stagger],
        },
      }}
      initial={false}
      animate="visible"
    >
      {children}
    </motion.section>
  )
}

// Animated item component for use within SectionWrapper
interface AnimatedItemProps {
  children: ReactNode
  className?: string
}

export function AnimatedItem({ children, className }: AnimatedItemProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 20,
          filter: "blur(4px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
