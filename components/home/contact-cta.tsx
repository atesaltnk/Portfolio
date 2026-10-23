"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { CONTACT_EMAIL } from "@/lib/site"
import { RollText } from "@/components/fx/roll-text"
import { ButtonLink } from "@/components/site/button-link"
import { fitDisplay, Punctuated } from "@/components/site/section-head"

/** "WANT TO / TALK?" — mijobello's closing block, with a copyable address. */
export function ContactCta() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <section data-scheme="paper" className="scheme-paper relative">
      <div className="frame grid grid-cols-12 border-b border-line sd-reveal">
        <div className="col-span-12 cell border-b border-line md:col-span-3 md:border-b-0 md:border-r">
          <span className="t-label">{t.contact.label}</span>
        </div>
        <div className="col-span-12 cell pb-6 pt-14 md:col-span-9 md:pt-28">
          <p className="t-label mb-3 text-dim sd-fade">{t.contact.kicker}</p>
          <h2
            className="font-display mask-y leading-[0.78]"
            style={{ fontSize: fitDisplay(t.contact.word, 19, 20, 3.5) }}
          >
            <span className="block sd-rise">
              <Punctuated word={t.contact.word} />
            </span>
          </h2>
        </div>
      </div>

      <div className="frame grid grid-cols-12 border-b border-line">
        <div className="col-span-12 flex flex-col justify-between gap-8 cell border-b border-line md:col-span-5 md:border-b-0 md:border-r md:py-10">
          <p className="t-lead max-w-md text-dim">{t.contact.text}</p>
          <ButtonLink href="/contact" variant="ink" className="self-start">
            {t.contact.cta}
          </ButtonLink>
        </div>
        <div className="col-span-12 flex flex-col justify-between gap-6 cell md:col-span-7 md:py-10">
          <span className="t-label text-dim">{t.contact.emailLabel}</span>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-cursor="Write"
              className="break-all text-[clamp(1.5rem,3.6vw,3.4rem)] font-semibold leading-none tracking-tight hover:text-ember"
            >
              <RollText>{CONTACT_EMAIL}</RollText>
            </a>
            <button
              type="button"
              onClick={copy}
              className="t-label border border-line-strong px-3 py-2 hover:border-fg"
              aria-live="polite"
            >
              {copied ? `${t.contact.copied} ✓` : t.contact.copy}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
