import { Hero } from "@/components/home/Hero"
import { ServicesGrid } from "@/components/home/ServicesGrid"
import { ProductsSection } from "@/components/home/ProductsSection"

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />
      <ProductsSection />
    </main>
  )
}
