"use client"

import { useLanguage } from "@/lib/language-context"
import { PageHead } from "@/components/site/page-head"
import { ContactCta } from "@/components/home/contact-cta"

export default function ProcessPage() {
  const { t } = useLanguage()
  const p = t.processPage

  return (
    <main>
      <PageHead label={p.label} kicker={p.kicker} word={p.word} intro={p.intro} />

      <section data-scheme="paper" className="scheme-paper">
        <ol>
          {p.steps.map((step, i) => (
            <li key={step.title} className="group frame grid grid-cols-12 border-b border-line sd-reveal">
              <div className="col-span-3 cell border-r border-line md:col-span-3">
                <span className="font-display t-display text-ember sd-fade">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="col-span-9 flex flex-col justify-end gap-4 cell md:col-span-4 md:border-r md:border-line">
                <h2 className="font-display t-h1 sd-fade">{step.title}</h2>
              </div>
              <div className="col-span-12 flex items-end cell border-t border-line md:col-span-5 md:border-t-0">
                <p className="t-lead max-w-md text-dim">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section data-scheme="ink" className="scheme-ink">
        <div className="frame grid grid-cols-12 border-b border-line">
          <div className="col-span-12 cell border-b border-line md:col-span-6 md:border-b-0 md:border-r md:py-10">
            <p className="t-label mb-6 text-dim">{p.collaborationTitle}</p>
            <ul className="border-t border-line">
              {p.collaboration.map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-line py-3">
                  <span className="t-label text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display t-h3">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 grid md:col-span-6">
            {[p.quality, p.openSource].map((block) => (
              <div key={block.title} className="flex flex-col justify-between gap-6 cell border-b border-line last:border-b-0 md:py-10">
                <h3 className="font-display t-h2">{block.title}</h3>
                <p className="t-lead max-w-md text-dim">{block.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  )
}
