"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

export default function AboutPage() {
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
              {t.aboutPage.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {t.aboutPage.intro}
            </p>
          </motion.div>

          {/* Portrait and intro */}
          <SectionWrapper className="py-12 md:py-16">
            <div className="grid md:grid-cols-5 gap-12 items-start">
              {/* Portrait */}
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="aspect-[3/4] bg-card rounded-2xl border border-border/50 overflow-hidden relative group">
                    <Image
                      src="/ates.jpeg"
                      alt="Ateş Altınkaynak"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {/* Dark overlay for signature readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Signature */}
                    <div className="absolute bottom-6 right-6 text-white/90 font-serif italic text-lg z-10 drop-shadow-md">
                      Ateş
                    </div>
                  </div>
                  {/* Decorative accent */}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/20 rounded-2xl -z-10" />
                </div>
              </div>

              {/* Story */}
              <div className="md:col-span-3">
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  {t.aboutPage.story}
                </p>

                {/* What you get */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                    {t.about.whatYouGet}
                  </h3>
                  <ul className="space-y-3">
                    {t.about.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check size={12} className="text-primary" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* Values */}
          <SectionWrapper>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
              {t.aboutPage.values.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {t.aboutPage.values.items.map((value, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-500"
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          {/* How I Think */}
          <SectionWrapper className="bg-card/30 -mx-6 px-6 rounded-2xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
              {t.aboutPage.principles.title}
            </h2>

            <ul className="space-y-4">
              {t.aboutPage.principles.items.map((principle, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-card/50 transition-colors"
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary font-medium">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-1">{principle}</p>
                </motion.li>
              ))}
            </ul>
          </SectionWrapper>

          {/* Tech Stack */}
          <SectionWrapper>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
              {t.aboutPage.stack.title}
            </h2>

            <div className="flex flex-wrap gap-3">
              {t.aboutPage.stack.items.map((item, index) => (
                <motion.span
                  key={item}
                  className="px-4 py-2 rounded-lg border border-border/50 bg-card/50 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </main>
      <Footer />
    </>
  )
}
