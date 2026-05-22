"use client"

import { forwardRef, type ReactNode, type ElementType } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useMagnetic } from "@/hooks/use-magnetic"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  href?: string
  as?: ElementType
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  strength?: number
}

export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(
  ({ children, className, href, as, onClick, type = "button", disabled, strength = 0.2 }, forwardedRef) => {
    const { ref, magnetic } = useMagnetic(strength)
    const shouldReduceMotion = useReducedMotion()

    const Component = as || (href ? "a" : "button")
    const isLink = Component === "a"

    const combinedRef = (node: HTMLElement | null) => {
      ref.current = node
      if (typeof forwardedRef === "function") {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    }

    return (
      <motion.div
        animate={{
          x: shouldReduceMotion ? 0 : magnetic.x,
          y: shouldReduceMotion ? 0 : magnetic.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        className="inline-block"
      >
        <Component
          ref={combinedRef}
          href={href}
          onClick={onClick}
          type={!isLink ? type : undefined}
          disabled={disabled}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
        >
          {/* Hover glow effect */}
          <span className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 glow-green-subtle" />
          
          {/* Underline animation */}
          <span className="relative z-10">{children}</span>
        </Component>
      </motion.div>
    )
  }
)

MagneticButton.displayName = "MagneticButton"
