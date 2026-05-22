// Motion variants and utilities for consistent animations across the site
// All animations respect prefers-reduced-motion

import type { Variants } from "framer-motion"

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants = {
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
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easeOut
    },
  },
}

export const itemVariantsNoBlur = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// Card hover variants
export const cardHoverVariants = {
  rest: {
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Stagger configuration for different contexts
export const staggerConfig = {
  fast: { staggerChildren: 0.05, delayChildren: 0.1 },
  normal: { staggerChildren: 0.1, delayChildren: 0.15 },
  slow: { staggerChildren: 0.15, delayChildren: 0.2 },
}

// Text split animation variants
export const textRevealVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Line reveal for text animations
export const lineRevealVariants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Underline animation
export const underlineVariants = {
  rest: {
    scaleX: 0,
    originX: 0,
  },
  hover: {
    scaleX: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Arrow nudge animation
export const arrowNudgeVariants = {
  rest: { x: 0, y: 0 },
  hover: {
    x: 3,
    y: -3,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

// Shine sweep animation for cards
export const shineSweepVariants = {
  rest: {
    x: "-100%",
    opacity: 0,
  },
  hover: {
    x: "100%",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

// Scale up animation for filter chips
export const chipVariants = {
  inactive: {
    scale: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  active: {
    scale: 1.02,
    backgroundColor: "rgba(18, 107, 74, 1)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

// Image parallax micro-shift
export const imageParallaxVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Form group highlight
export const formGroupVariants = {
  inactive: {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  active: {
    borderColor: "rgba(18, 107, 74, 0.3)",
    transition: { duration: 0.2 },
  },
}

// Success check animation
export const checkVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -45,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.1,
    },
  },
}

// Validation message animation
export const validationVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    height: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: { duration: 0.15 },
  },
}

// Timeline dot animation
export const timelineDotVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (delay: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: delay * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Path draw animation for timeline lines
export const pathDrawVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
}

// Enhanced card hover with border glow and shadow
export const enhancedCardHoverVariants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    y: -8,
    scale: 1.01,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Border glow animation
export const borderGlowVariants = {
  rest: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

// Icon bounce on hover
export const iconBounceVariants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

// Staggered list reveal
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Button glow on hover
export const buttonGlowVariants = {
  rest: {
    boxShadow: "0 0 0px rgba(18, 107, 74, 0)",
  },
  hover: {
    boxShadow: "0 0 30px rgba(18, 107, 74, 0.4)",
    transition: { duration: 0.3 },
  },
}
