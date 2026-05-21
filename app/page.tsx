import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero"
import { AboutPreviewSection } from "@/components/sections/about-preview"
import { FeaturedWorkSection } from "@/components/sections/featured-work"
import { CapabilitiesSection } from "@/components/sections/capabilities"
import { ProcessPreviewSection } from "@/components/sections/process-preview"
import { FAQSection } from "@/components/sections/faq"
import { FinalCTASection } from "@/components/sections/final-cta"
import { AtmosphericSection } from "@/components/motion/atmospheric-section"
import { getRepos } from "@/lib/github"

export const revalidate = 3600

export default async function HomePage() {
  const repos = await getRepos()

  return (
    <>
      <main className="flex flex-col gap-0">
        <AtmosphericSection>
          <HeroSection repos={repos} />
        </AtmosphericSection>

        <AtmosphericSection>
          <AboutPreviewSection />
        </AtmosphericSection>

        <AtmosphericSection>
          <FeaturedWorkSection repos={repos} />
        </AtmosphericSection>

        <AtmosphericSection>
          <CapabilitiesSection />
        </AtmosphericSection>

        <AtmosphericSection>
          <ProcessPreviewSection />
        </AtmosphericSection>

        <AtmosphericSection>
          <FAQSection />
        </AtmosphericSection>

        <AtmosphericSection className="mb-20">
          <FinalCTASection />
        </AtmosphericSection>
      </main>
      <Footer />
    </>
  )
}
