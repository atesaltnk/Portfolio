"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function WorkHeader() {
  const { t } = useLanguage()

  return (
    <div className="mb-12">
      <motion.h1
        className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {t.work.title}
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {t.work.subtitle}
      </motion.p>
    </div>
  )
}
