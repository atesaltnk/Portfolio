import type { Metadata } from "next"
import { getRepos } from "@/lib/github"
import { buildProjects } from "@/lib/projects"
import { WorkView } from "@/components/pages/work-view"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Work — Ateş Altınkaynak",
  description: "Every public repository by Ateş Altınkaynak, synced live from GitHub.",
}

export default async function WorkPage() {
  const projects = buildProjects(await getRepos())
  return <WorkView projects={projects} />
}
