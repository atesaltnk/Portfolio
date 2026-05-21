import { Footer } from "@/components/footer"
import { WorkGallery } from "@/components/sections/work-gallery"
import { WorkHeader } from "@/components/sections/work-header"
import { getRepos } from "@/lib/github"

export const revalidate = 3600

export default async function WorkPage() {
  const repos = await getRepos()

  return (
    <>
      <main className="relative pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <WorkHeader />
          <WorkGallery repos={repos} />
        </div>
      </main>
      <Footer />
    </>
  )
}
