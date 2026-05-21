"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { SectionWrapper, AnimatedItem } from "@/components/section-wrapper"
import { GITHUB_PROFILE_URL, type Repo } from "@/lib/github"
import { RepoCard, FeaturedRepoCard } from "@/components/repo-card"

export function FeaturedWorkSection({ repos }: { repos: Repo[] }) {
  const { t } = useLanguage()

  const featured = repos[0]
  const others = repos.slice(1, 4)

  return (
    <SectionWrapper className="bg-card/30">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedItem className="flex items-end justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            {t.work.featuredTitle}
          </h2>
          <Link
            href="/work"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            {t.hero.secondaryCta}
            <motion.span
              initial={{ x: 0, y: 0 }}
              whileHover={{ x: 2, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight size={16} />
            </motion.span>
          </Link>
        </AnimatedItem>

        {featured ? (
          <>
            <FeaturedRepoCard repo={featured} />

            {others.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {others.map((repo, index) => (
                  <RepoCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
            <p className="text-muted-foreground mb-6">{t.work.noRepos}</p>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-300"
            >
              {t.work.viewProfile}
              <ArrowUpRight size={16} />
            </a>
          </div>
        )}

        <Link
          href="/work"
          className="mt-8 sm:hidden inline-flex items-center gap-1 text-sm text-primary"
        >
          {t.hero.secondaryCta}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </SectionWrapper>
  )
}
