"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL } from "@/lib/github"
import { CONTACT_EMAIL } from "@/lib/site"
import { RollText } from "@/components/fx/roll-text"
import { PageHead } from "@/components/site/page-head"
import { formatClock, HOME_TZ, useNow } from "@/components/shell/clocks"
import { cn } from "@/lib/utils"

interface Fields {
  fullName: string
  email: string
  subject: string
  message: string
}

type Errors = Partial<Record<keyof Fields, string>>

const EMPTY: Fields = { fullName: "", email: "", subject: "", message: "" }

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="border-b border-line cell">
      <label htmlFor={id} className="t-label mb-3 flex justify-between text-dim">
        {label}
        {error && (
          <span id={`${id}-error`} className="text-ember">
            {error}
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full bg-transparent text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug tracking-tight placeholder:text-faint focus:outline-none"

export default function ContactPage() {
  const { t } = useLanguage()
  const f = t.form
  const c = t.contactPage
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const now = useNow()
  const { time, offset } = formatClock(now, HOME_TZ)

  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!fields.fullName.trim()) next.fullName = f.errors.required
    if (!fields.email.trim()) next.email = f.errors.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = f.errors.email
    if (!fields.message.trim()) next.message = f.errors.required
    setErrors(next)
    if (Object.keys(next).length) return

    const subject = fields.subject.trim() || `Portfolio — ${fields.fullName.trim()}`
    const body = `${fields.message.trim()}\n\n— ${fields.fullName.trim()} (${fields.email.trim()})`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main>
      <PageHead label={c.label} kicker={c.kicker} word={c.word} intro={c.intro} />

      <section data-scheme="paper" className="scheme-paper">
        <div className="frame grid grid-cols-12 border-b border-line">
          <div className="col-span-12 border-b border-line md:col-span-7 md:border-b-0 md:border-r">
            {sent ? (
              <div className="flex min-h-[28rem] flex-col justify-between gap-10 cell py-10" aria-live="polite">
                <div className="space-y-4">
                  <span className="ember-dot" />
                  <h2 className="font-display t-h1">{f.successTitle}</h2>
                  <p className="t-lead max-w-md text-dim">{f.successMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFields(EMPTY)
                    setSent(false)
                  }}
                  className="t-label self-start border border-line-strong px-4 py-3 hover:border-fg"
                >
                  <RollText>{f.again}</RollText>
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid sm:grid-cols-2">
                  <div className="sm:border-r sm:border-line">
                    <Field id="fullName" label={f.fullName} error={errors.fullName}>
                      <input
                        id="fullName"
                        autoComplete="name"
                        value={fields.fullName}
                        onChange={set("fullName")}
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field id="email" label={f.email} error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={set("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field id="subject" label={f.subject}>
                  <input
                    id="subject"
                    value={fields.subject}
                    onChange={set("subject")}
                    placeholder={f.subjectPlaceholder}
                    className={inputClass}
                  />
                </Field>
                <Field id="message" label={f.message} error={errors.message}>
                  <textarea
                    id="message"
                    rows={6}
                    value={fields.message}
                    onChange={set("message")}
                    placeholder={f.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={cn(inputClass, "resize-none")}
                  />
                </Field>
                <div className="cell">
                  <button
                    type="submit"
                    className="group t-label flex w-full items-center justify-between bg-ember px-5 py-4 !text-[11.5px] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    <RollText>{f.submit}</RollText>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="col-span-12 flex flex-col md:col-span-5">
            <div className="cell border-b border-line md:py-8">
              <p className="t-label mb-4 text-dim">{c.direct}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="block break-all text-[clamp(1.25rem,2vw,1.9rem)] font-semibold tracking-tight hover:text-ember">
                <RollText>{CONTACT_EMAIL}</RollText>
              </a>
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display t-h3 mt-3 block hover:text-ember"
              >
                <RollText>GitHub ↗</RollText>
              </a>
            </div>
            <div className="grid grid-cols-2 border-b border-line">
              <div className="cell border-r border-line">
                <p className="t-label mb-3 text-dim">{t.footer.localTime}</p>
                <p className="font-display t-h3 tabular-nums" suppressHydrationWarning>
                  {time}
                </p>
                <p className="t-label mt-1 text-dim">Ankara · {offset}</p>
              </div>
              <div className="cell">
                <p className="t-label mb-3 text-dim">{t.work.status}</p>
                <p className="t-label flex items-start gap-2">
                  <span className="ember-dot mt-1 shrink-0" />
                  {t.meta.available}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section data-scheme="ink" className="scheme-ink">
        <div className="frame grid grid-cols-12 border-b border-line">
          <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
            <span className="t-label">{c.faqTitle}</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            {c.faq.map((item, i) => (
              <details key={item.q} className="group border-b border-line last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center gap-5 cell py-6 [&::-webkit-details-marker]:hidden">
                  <span className="t-label text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display t-h2 flex-1">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="t-lead max-w-2xl px-[clamp(14px,1.35vw,22px)] pb-8 pl-[calc(clamp(14px,1.35vw,22px)+2.6rem)] text-dim">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
