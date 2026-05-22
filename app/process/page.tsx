"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ClipboardList, Code2, FlaskConical, Rocket, AlertCircle, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

const icons = [ClipboardList, Code2, FlaskConical, Rocket]

export default function ProcessPage() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  return (
    <>


      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Header */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.processPage.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t.processPage.intro}
            </p>
          </motion.div>

          {/* Process Steps - Vertical Timeline */}
          <SectionWrapper className="py-12 md:py-16">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border/50" />

              {/* Animated progress line */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute left-6 md:left-8 top-0 w-px bg-primary"
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              )}

              <div className="space-y-12">
                {t.process.steps.map((step, index) => {
                  const Icon = icons[index]
                  return (
                    <motion.div
                      key={index}
                      className="relative flex gap-6 md:gap-8"
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      {/* Timeline dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center">
                          <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2 md:pt-4">
                        <span className="text-xs font-medium text-primary mb-1 block">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </SectionWrapper>

          {/* Working Together */}
          <SectionWrapper>
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                {t.processPage.collaboration.title}
              </h2>

              <ul className="space-y-4">
                {t.processPage.collaboration.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SectionWrapper>

          {/* Quality & Open Source */}
          <SectionWrapper className="py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Code Quality */}
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold text-foreground mb-3">
                  {t.processPage.quality.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.processPage.quality.description}
                </p>
              </div>

              {/* Open Source */}
              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t.processPage.openSource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.processPage.openSource.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* CTA */}
          <SectionWrapper className="text-center">
            <p className="text-xl text-muted-foreground mb-6">
              {t.finalCta.text}
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-green transition-all duration-300"
            >
              {t.finalCta.button}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </SectionWrapper>
        </div>
      </main>
      <Footer />
    </>
  )
}
