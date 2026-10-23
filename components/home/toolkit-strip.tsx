"use client"

import { useLanguage } from "@/lib/language-context"
import { Marquee } from "@/components/fx/marquee"
import { TECH } from "@/components/site/tech"

/** The toolkit as a running strip between hairlines (mijobello's marquee). */
export function ToolkitStrip() {
  const { t } = useLanguage()

  return (
    <section data-scheme="paper" className="scheme-paper" aria-label={t.toolkit.label}>
      <div className="frame grid grid-cols-12 border-b border-line">
        <div className="col-span-3 hidden items-center cell border-r border-line md:flex">
          <span className="t-label">{t.toolkit.label}</span>
        </div>
        <div className="col-span-12 overflow-hidden py-5 md:col-span-9">
          <Marquee duration={48} pausable>
            {TECH.map(({ name, Icon }) => (
              <span key={name} className="flex shrink-0 items-center">
                <span className="flex items-center gap-3 px-5">
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  <span className="font-display t-h3">{name}</span>
                </span>
                <span aria-hidden="true" className="text-faint">/</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
