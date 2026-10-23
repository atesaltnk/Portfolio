import { getRepos } from "@/lib/github"
import { buildProjects, featuredProjects, projectStats } from "@/lib/projects"
import { Hero } from "@/components/home/hero"
import { Manifesto } from "@/components/home/manifesto"
import { PixelDivider } from "@/components/fx/pixel-divider"
import { Chapters } from "@/components/home/chapters"
import { ToolkitStrip } from "@/components/home/toolkit-strip"
import { Capabilities } from "@/components/home/capabilities"
import { RepoIndex } from "@/components/home/repo-index"
import { ContactCta } from "@/components/home/contact-cta"

export const revalidate = 3600

export default async function HomePage() {
  const projects = buildProjects(await getRepos())

  return (
    <main>
      <Hero stats={projectStats(projects)} />
      <Manifesto />
      <PixelDivider />
      <Chapters projects={featuredProjects(projects)} />
      <ToolkitStrip />
      <Capabilities />
      <RepoIndex projects={projects} />
      <ContactCta />
    </main>
  )
}
