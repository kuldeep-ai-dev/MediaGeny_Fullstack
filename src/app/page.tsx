import { Hero } from "@/components/home/Hero"
import { ServicesGrid } from "@/components/home/ServicesGrid"
import { ProductsSection } from "@/components/home/ProductsSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { getServices } from "@/actions/public-actions"

import { getCompanyProfile } from "@/actions/about-actions"
import { StatsCounter } from "@/components/home/StatsCounter"

export default async function Home() {
  const [profile, { services }] = await Promise.all([
    getCompanyProfile(),
    getServices()
  ])

  return (
    <main>
      <Hero />
      <StatsCounter
        projects={profile?.stat_projects || 100}
        clients={profile?.stat_clients || 50}
        years={profile?.stat_years || 5}
        team={profile?.stat_team || 10}
      />
      <ServicesGrid services={services || []} />
      <ProductsSection />
      <TestimonialsSection />
    </main>
  )
}
