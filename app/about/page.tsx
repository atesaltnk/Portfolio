"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiCplusplus,
  SiTailwindcss,
  SiGit,
} from "react-icons/si"
import type { IconType } from "react-icons"
import Image from "next/image"
import { Footer } from "@/components/footer"

import { useLanguage } from "@/lib/language-context"
import { SectionWrapper } from "@/components/section-wrapper"

const techStack: { name: string; Icon: IconType; color: string }[] = [
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Python", Icon: SiPython, color: "#4B8BBE" },
  { name: "C++", Icon: SiCplusplus, color: "#649AD2" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
]

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

          {/* Tech Stack */}
          <SectionWrapper>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t.aboutPage.stack.title}
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl">
              {t.aboutPage.stack.subtitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {techStack.map(({ name, Icon, color }, index) => (
                <motion.div
                  key={name}
                  className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 text-center transition-colors duration-300 hover:border-primary/40 hover:bg-card"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={shouldReduceMotion ? {} : { y: -5 }}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-background/70 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={34} style={{ color }} aria-hidden />
                  </span>
                  <span className="text-base font-semibold text-foreground">{name}</span>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 glow-green-subtle" />
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </main>
      <Footer />
    </>
  )
}
