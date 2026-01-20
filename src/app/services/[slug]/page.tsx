import { servicesData } from "@/lib/services-data"
import { ServiceContactForm } from "@/components/services/ServiceContactForm"
import { RecentWorks } from "@/components/services/RecentWorks"
import { notFound } from "next/navigation"
import { Globe, Smartphone, Code, BarChart, Palette, Monitor, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Map icon strings to components
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, BarChart, Palette, Monitor
}

export function generateStaticParams() {
    return servicesData.map((service) => ({
        slug: service.slug,
    }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const service = servicesData.find((s) => s.slug === slug)

    if (!service) {
        notFound()
    }

    const Icon = iconMap[service.iconName] || Code

    return (
        <main className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 text-center md:py-32">
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${service.gradient} opacity-5 blur-[100px]`} />
                <div className="container relative mx-auto max-w-4xl">
                    <Link href="/#services" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
                    </Link>

                    <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-2xl`}>
                        <Icon className="h-10 w-10" />
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl text-foreground">
                        {service.title}
                    </h1>
                    <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
                        {service.fullDescription}
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto max-w-7xl px-4 py-16">
                <div className="grid gap-16 lg:grid-cols-2">

                    {/* Left Column: Why Choose Us & Tech Stack */}
                    <div className="space-y-16">
                        {/* Why Choose Us */}
                        <div>
                            <h2 className="mb-8 text-3xl font-bold">Why Choose Us</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="rounded-xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10">
                                        <CheckCircle className={`mb-4 h-8 w-8 text-primary`} />
                                        <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technology Stack */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold">Technology Stack</h2>
                            <div className="flex flex-wrap gap-3">
                                {service.techStack.map((tech, idx) => (
                                    <span key={idx} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors cursor-default">
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Works */}
                        <RecentWorks works={service.recentWorks} />

                        {/* FAQ */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold">Common Questions</h2>
                            <div className="space-y-4">
                                {service.faq.map((item, idx) => (
                                    <div key={idx} className="rounded-lg border border-white/5 bg-white/5 p-5">
                                        <h4 className="font-semibold mb-2">{item.question}</h4>
                                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ServiceContactForm serviceTitle={service.title} />
                    </div>
                </div>
            </section>
        </main>
    )
}
