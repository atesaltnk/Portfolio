import type { Metadata } from "next"
import { getRepos } from "@/lib/github"
import { buildProjects, projectStats } from "@/lib/projects"
import { AboutView } from "@/components/pages/about-view"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "About — Ateş Altınkaynak",
  description: "Software developer in Ankara working across the stack — React, Postgres and C++.",
}

export default async function AboutPage() {
  const projects = buildProjects(await getRepos())
  const latest = projects.find((p) => p.updatedAt) ?? null
  return <AboutView latest={latest} stats={projectStats(projects)} />
}
