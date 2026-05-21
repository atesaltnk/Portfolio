"use client"

import React, { useState } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Github, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { AnimatedBackgroundLayer } from "@/components/motion/animated-background-layer"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL } from "@/lib/github"
import { cn } from "@/lib/utils"

const CONTACT_EMAIL = "atesaltinkaynak@gmail.com"

interface FormData {
  fullName: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  message?: string
}

function ValidationMessage({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mt-1 flex items-center gap-1 text-sm text-destructive"
    >
      <AlertCircle size={14} />
      {message}
    </motion.p>
  )
}

function DirectLinks({ label }: { label: string }) {
  return (
    <div className="mt-10 pt-8 border-t border-border/30">
      <p className="text-sm text-muted-foreground mb-4">{label}</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 bg-card/50 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <Mail size={16} />
          {CONTACT_EMAIL}
        </a>
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 bg-card/50 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </div>
  )
}

function SuccessState({ t }: { t: ReturnType<typeof useLanguage>["t"] }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      <main className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="absolute inset-x-0 top-0 h-[400px] overflow-hidden">
          <AnimatedBackgroundLayer variant="minimal" />
        </div>

        <div className="mx-auto max-w-xl px-6 text-center relative z-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <CheckCircle size={40} className="text-primary" />
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {t.form.successTitle}
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t.form.successMessage}
          </motion.p>

          <div className="mx-auto max-w-md text-left">
            <DirectLinks label={t.form.orReachMe} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ContactPage() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = t.form.errors.required
    if (!formData.email.trim()) {
      newErrors.email = t.form.errors.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.form.errors.email
    }
    if (!formData.message.trim()) newErrors.message = t.form.errors.required

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const subject = formData.subject.trim() || `Portfolio — ${formData.fullName}`
    const body = `${formData.message}\n\n— ${formData.fullName} (${formData.email})`
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setIsSubmitted(true)
  }

  if (isSubmitted) return <SuccessState t={t} />

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground/50",
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300",
      hasError ? "border-destructive" : "border-border/50"
    )

  return (
    <>
      <main className="relative pt-32 pb-20">
        <div className="absolute inset-x-0 top-0 h-[400px] overflow-hidden">
          <AnimatedBackgroundLayer variant="minimal" />
        </div>

        <div className="mx-auto max-w-2xl px-6 relative z-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.form.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.form.subtitle}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-6"
            noValidate
          >
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                {t.form.fullName} *
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={inputClass(!!errors.fullName)}
              />
              <AnimatePresence>
                {errors.fullName && <ValidationMessage message={errors.fullName} />}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {t.form.email} *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass(!!errors.email)}
              />
              <AnimatePresence>
                {errors.email && <ValidationMessage message={errors.email} />}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                {t.form.subject}
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                placeholder={t.form.subjectPlaceholder}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={inputClass(false)}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                {t.form.message} *
              </label>
              <textarea
                id="message"
                value={formData.message}
                rows={6}
                placeholder={t.form.messagePlaceholder}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={cn(inputClass(!!errors.message), "resize-none")}
              />
              <AnimatePresence>
                {errors.message && <ValidationMessage message={errors.message} />}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              className={cn(
                "w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "hover:shadow-[0_0_30px_oklch(0.45_0.12_155_/_0.4)]"
              )}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              {t.form.submit}
            </motion.button>
          </motion.form>

          <DirectLinks label={t.form.orReachMe} />
        </div>
      </main>
      <Footer />
    </>
  )
}
