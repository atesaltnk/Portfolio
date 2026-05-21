"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Globe, Server, Cpu, Wrench, Palette } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper, AnimatedItem } from "@/components/section-wrapper"
import { cn } from "@/lib/utils"

const icons = [Globe, Server, Cpu, Wrench, Palette]

function CapabilityCard({
  item,
  index,
  Icon
}: {
  item: { title: string; description: string }
  index: number
  Icon: typeof Globe
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "group relative p-6 rounded-xl border border-border/50 bg-card/50",
        "hover:bg-card hover:border-primary/20 transition-colors duration-500"
      )}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={shouldReduceMotion ? {} : { y: -6 }}
    >
      {/* Icon with bounce on hover */}
      <motion.div
        className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.1,
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Icon className="w-6 h-6 text-primary" />
      </motion.div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {item.description}
      </p>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />

      {/* Subtle corner glow */}
      <div
        className="absolute -top-px -right-px w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, oklch(0.45 0.12 155 / 0.15), transparent 70%)",
        }}
      />
    </motion.div>
  )
}

export function CapabilitiesSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedItem>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t.capabilities.title}
          </h2>
        </AnimatedItem>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.capabilities.items.map((item, index) => {
            const Icon = icons[index]
            return (
              <CapabilityCard
                key={index}
                item={item}
                index={index}
                Icon={Icon}
              />
            )
          })}
        </div>

        {/* Not included note */}
        <AnimatedItem className="mt-10 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg border border-border/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            {t.capabilities.techNote}
          </p>
        </AnimatedItem>
      </div>
    </SectionWrapper>
  )
}
