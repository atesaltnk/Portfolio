"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion, AnimatePresence, LayoutGroup } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { GITHUB_PROFILE_URL, type Repo } from "@/lib/github"
import { RepoCard } from "@/components/repo-card"
import { cn } from "@/lib/utils"

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          layoutId="filter-pill"
          className="absolute inset-0 bg-primary rounded-lg"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      {!isActive && <div className="absolute inset-0 bg-secondary/50 rounded-lg" />}
      <span className="relative z-10">{label}</span>
    </motion.button>
  )
}

export function WorkGallery({ repos }: { repos: Repo[] }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<string>("all")

  const languages = useMemo(() => {
    const set = new Set<string>()
    repos.forEach((r) => r.language && set.add(r.language))
    return Array.from(set).sort()
  }, [repos])

  const filteredRepos =
    filter === "all" ? repos : repos.filter((r) => r.language === filter)

  if (repos.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
        <p className="text-muted-foreground mb-6">{t.work.noRepos}</p>
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:shadow-[0_0_24px_oklch(0.45_0.12_155_/_0.35)] transition-all duration-300"
        >
          {t.work.viewProfile}
          <ArrowUpRight size={16} />
        </a>
      </div>
    )
  }

  return (
    <>
      {languages.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LayoutGroup>
            <FilterChip
              label={t.work.allFilter}
              isActive={filter === "all"}
              onClick={() => setFilter("all")}
            />
            {languages.map((lang) => (
              <FilterChip
                key={lang}
                label={lang}
                isActive={filter === lang}
                onClick={() => setFilter(lang)}
              />
            ))}
          </LayoutGroup>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
