"use client"

import { useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Star, GitFork, ArrowUpRight, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { languageColor, type Repo } from "@/lib/github"
import { useCursorSpotlight } from "@/hooks/use-cursor-spotlight"
import { CursorSpotlight } from "@/components/cursor-spotlight"
import { cn } from "@/lib/utils"

function formatUpdated(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return ""
  }
}

function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: languageColor(language) }}
      />
      {language}
    </span>
  )
}

function MetaRow({ repo }: { repo: Repo }) {
  const { locale, t } = useLanguage()
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <LanguageDot language={repo.language} />
      {repo.stars > 0 && (
        <span className="inline-flex items-center gap-1">
          <Star size={13} className="text-muted-foreground/80" />
          {repo.stars}
        </span>
      )}
      {repo.forks > 0 && (
        <span className="inline-flex items-center gap-1">
          <GitFork size={13} className="text-muted-foreground/80" />
          {repo.forks}
        </span>
      )}
      <span className="text-muted-foreground/70">
        {t.work.updated} {formatUpdated(repo.updatedAt, locale)}
      </span>
    </div>
  )
}

function TopicChips({ topics, max = 4 }: { topics: string[]; max?: number }) {
  if (!topics.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {topics.slice(0, max).map((topic) => (
        <span
          key={topic}
          className="px-2.5 py-0.5 text-xs font-medium bg-secondary/60 text-muted-foreground rounded-full"
        >
          {topic}
        </span>
      ))}
    </div>
  )
}

export function RepoCard({ repo, index = 0 }: { repo: Repo; index?: number }) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-6",
        "transition-colors duration-500 hover:border-primary/30"
      )}
      layout
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={shouldReduceMotion ? {} : { y: -6 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {repo.displayName}
        </h3>
        <ArrowUpRight
          size={18}
          className="flex-shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {repo.description || t.work.viewOnGitHub}
      </p>

      <div className="mt-4">
        <TopicChips topics={repo.topics} />
      </div>

      <div className="mt-4 pt-4 border-t border-border/40">
        <MetaRow repo={repo} />
      </div>

      <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
    </motion.a>
  )
}

export function FeaturedRepoCard({ repo }: { repo: Repo }) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const { position, isVisible } = useCursorSpotlight(cardRef)

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card transition-colors duration-500 hover:border-primary/30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={shouldReduceMotion ? {} : { y: -6 }}
    >
      <div ref={cardRef} className="relative p-8 md:p-12">
        <CursorSpotlight position={position} isVisible={isVisible} size={420} />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex w-fit items-center gap-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-5">
            <Star size={13} />
            {t.work.featuredTitle}
          </span>

          <h3 className="font-serif text-2xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {repo.displayName}
          </h3>

          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            {repo.description || t.work.viewOnGitHub}
          </p>

          <div className="mt-6">
            <TopicChips topics={repo.topics} max={6} />
          </div>

          <div className="mt-6">
            <MetaRow repo={repo} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              {t.work.viewOnGitHub}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
            {repo.homepage && (
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(repo.homepage as string, "_blank", "noopener,noreferrer")
                }}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe size={14} />
                {t.work.liveDemo}
              </span>
            )}
          </div>
        </div>

        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-green-subtle" />
      </div>
    </motion.a>
  )
}
