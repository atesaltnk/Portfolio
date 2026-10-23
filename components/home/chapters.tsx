"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import type { Project } from "@/lib/projects"
import { scrollToTarget } from "@/lib/scroll"
import { RollingNumber } from "@/components/fx/rolling-number"
import { RollText } from "@/components/fx/roll-text"
import { ProjectCover } from "@/components/site/project-cover"
import { SectionHead } from "@/components/site/section-head"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

function Links({ project }: { project: Project }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {project.homepage && (
        <a
          href={project.homepage}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="Visit"
          className="t-label border-b border-ember pb-1 hover:text-ember"
        >
          <RollText>{`${t.work.viewLive} ↗`}</RollText>
        </a>
      )}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Code"
        className="t-label border-b border-line-strong pb-1 hover:border-fg"
      >
        <RollText>{`${t.work.source} ↗`}</RollText>
      </a>
    </div>
  )
}

function Meta({ project }: { project: Project }) {
  const { t } = useLanguage()
  const rows = [
    [t.work.year, String(project.year)],
    [t.work.stack, project.stack.join(" · ")],
    [t.work.status, project.homepage ? t.work.live : t.work.openSource],
  ]
  return (
    <dl className="border-t border-line">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-2.5">
          <dt className="t-label text-dim">{k}</dt>
          <dd className="t-label">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Desktop: a pinned, scroll-driven chapter reel (nickho's history section). */
function PinnedChapters({ projects }: { projects: Project[] }) {
  const { t, locale } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const n = projects.length
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const stripY = useTransform(scrollYProgress, [0, 1], ["0%", `${-((n - 1) / n) * 100}%`])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const travel = el.offsetHeight - window.innerHeight
    // Cover i sits centred at progress i / (n - 1).
    scrollToTarget(el.offsetTop + (n > 1 ? i / (n - 1) : 0) * travel)
  }
  const skip = () => {
    const el = ref.current
    if (el) scrollToTarget(el.offsetTop + el.offsetHeight)
  }

  const project = projects[active]

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col pt-[var(--header-h)]">
        <div className="frame grid shrink-0 grid-cols-12 border-b border-line">
          <div className="col-span-4 flex items-center gap-3 cell border-r border-line">
            <span className="t-label text-dim">{t.work.chapter}</span>
            <span className="t-label">
              <RollingNumber value={active + 1} pad={2} /> / {String(n).padStart(2, "0")}
            </span>
          </div>
          <div className="col-span-4 flex items-center justify-center gap-1.5 border-r border-line">
            {projects.map((p, i) => (
              <button
                key={p.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${t.work.chapter} ${i + 1}: ${p.title}`}
                className={cn(
                  "size-3 transition-colors duration-300",
                  i <= active ? "bg-ember" : "bg-line-strong hover:bg-fg"
                )}
              />
            ))}
          </div>
          <div className="col-span-4 flex items-center justify-end cell">
            <button type="button" onClick={skip} className="t-label flex items-center gap-2 bg-ember px-3 py-1.5 text-ink">
              <RollText>{t.work.skip}</RollText> »
            </button>
          </div>
        </div>

        <div className="frame grid min-h-0 flex-1 grid-cols-12">
          {/* Title column */}
          <div className="col-span-4 flex flex-col justify-between border-r border-line cell py-8">
            <RollingNumber value={active + 1} pad={2} className="font-display t-display text-ember" />
            <div className="mask-y relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.h3
                  key={project.key}
                  className="font-display text-[clamp(2.75rem,4.6vw,5.25rem)] leading-[0.86]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-105%" }}
                  transition={{ duration: 0.75, ease: EASE }}
                >
                  {project.title}
                </motion.h3>
              </AnimatePresence>
            </div>
          </div>

          {/* Cover reel */}
          <div className="relative col-span-5 overflow-hidden border-r border-line">
            <motion.div
              className="absolute inset-x-0 top-[calc(50%-27svh)] px-[clamp(16px,2vw,32px)]"
              style={{ y: stripY }}
            >
              {projects.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => goTo(i)}
                  tabIndex={-1}
                  aria-hidden={i !== active}
                  data-cursor={i === active ? undefined : p.title}
                  className="block h-[54svh] w-full py-[2.5svh] text-left"
                >
                  <ProjectCover
                    project={p}
                    priority={i === 0}
                    className={cn(
                      "transition-[filter,opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                      i === active ? "scale-100 opacity-100 grayscale-0" : "scale-[0.94] opacity-35 grayscale"
                    )}
                  />
                </button>
              ))}
            </motion.div>
          </div>

          {/* Details */}
          <div className="col-span-3 flex flex-col justify-between gap-8 cell py-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={project.key}
                className="t-lead"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {project.blurb?.[locale] ?? project.description}
              </motion.p>
            </AnimatePresence>
            <div className="space-y-6">
              <Meta project={project} />
              <Links project={project} />
            </div>
          </div>
        </div>

        <div className="frame shrink-0 border-t border-line">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-[3px] origin-left bg-ember" />
        </div>
      </div>
    </div>
  )
}

/** Mobile/tablet: the same chapters as a plain, readable stack. */
function StackedChapters({ projects }: { projects: Project[] }) {
  const { locale } = useLanguage()
  return (
    <div className="lg:hidden">
      {projects.map((p, i) => (
        <article key={p.key} className="frame border-b border-line sd-reveal">
          <div className="flex items-center justify-between cell border-b border-line">
            <span className="font-display t-h2 text-ember">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-label text-dim">{p.year}</span>
          </div>
          <div className="aspect-[16/10] cell border-b border-line">
            <ProjectCover project={p} />
          </div>
          <div className="space-y-5 cell pb-8">
            <h3 className="font-display t-h1 sd-fade">{p.title}</h3>
            <p className="t-lead text-dim">{p.blurb?.[locale] ?? p.description}</p>
            <Meta project={p} />
            <Links project={p} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function Chapters({ projects }: { projects: Project[] }) {
  const { t } = useLanguage()
  if (projects.length === 0) return null

  return (
    <section id="work" data-scheme="paper" className="scheme-paper relative">
      <SectionHead label={t.work.label} kicker={t.work.kicker} word={t.work.word} />
      <PinnedChapters projects={projects} />
      <StackedChapters projects={projects} />
    </section>
  )
}
