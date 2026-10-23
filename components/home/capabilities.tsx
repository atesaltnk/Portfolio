"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { FollowPreview } from "@/components/fx/follow-preview"
import { SectionHead } from "@/components/site/section-head"

// Illustrative snippets shown beside the cursor — one per capability row.
const SNIPPETS = [
  {
    file: "app/page.tsx",
    code: `export default function Page() {\n  return (\n    <Hero motion="with-intent" />\n  )\n}`,
  },
  {
    file: "queries/risk.sql",
    code: `SELECT shipment_id,\n       max(temp_c) AS peak\nFROM readings\nWHERE ts > now() - '1 hour'\nGROUP BY 1;`,
  },
  {
    file: "relay/chain.cpp",
    code: `std::vector<Drone> chain;\nchain.reserve(relays);\nfor (auto& d : fleet)\n  if (d.signal > 0.6)\n    chain.push_back(d);`,
  },
  {
    file: "~/scripts",
    code: `$ python sync.py --watch\n→ 128 files changed\n✓ done in 0.42s`,
  },
]

function Snippet({ index }: { index: number }) {
  const s = SNIPPETS[index % SNIPPETS.length]
  return (
    <div className="scheme-ink flex h-full flex-col border border-line">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <i className="size-1.5 bg-ember" />
        <span className="t-label text-dim">{s.file}</span>
      </div>
      <pre className="t-mono flex-1 overflow-hidden whitespace-pre px-4 py-3 leading-relaxed text-paper/90">
        {s.code}
      </pre>
    </div>
  )
}

/** mijobello's numbered service rows, with a code card trailing the cursor. */
export function Capabilities() {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section data-scheme="paper" className="scheme-paper relative">
      <SectionHead label={t.capabilities.label} kicker={t.capabilities.kicker} word={t.capabilities.word} />

      <ul onPointerLeave={() => setHovered(null)}>
        {t.capabilities.items.map((item, i) => (
          <li
            key={item.title}
            onPointerEnter={() => setHovered(i)}
            className="group frame relative grid grid-cols-12 overflow-hidden border-b border-line sd-reveal"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
            />
            <div className="relative col-span-2 cell border-r border-line md:col-span-1">
              <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="relative col-span-10 cell md:col-span-6 md:border-r md:border-line md:py-9">
              <h3 className="font-display t-h1 sd-fade">{item.title}</h3>
            </div>
            <ul className="relative col-span-6 col-start-3 space-y-1 cell pt-0 md:col-span-3 md:col-start-auto md:border-r md:border-line md:pt-[clamp(14px,1.35vw,22px)]">
              {item.tags.map((tag) => (
                <li key={tag} className="t-label">
                  {tag}
                </li>
              ))}
            </ul>
            <p className="relative col-span-4 cell pt-0 text-sm leading-relaxed text-dim transition-colors group-hover:text-ink md:col-span-2 md:pt-[clamp(14px,1.35vw,22px)]">
              {item.blurb}
            </p>
          </li>
        ))}
      </ul>

      <FollowPreview open={hovered !== null} previewKey={String(hovered)} width={300} height={176}>
        <Snippet index={hovered ?? 0} />
      </FollowPreview>
    </section>
  )
}
