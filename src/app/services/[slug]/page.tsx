import { getServiceBySlug, getServices } from "@/actions/public-actions"
import { ServiceContactForm } from "@/components/services/ServiceContactForm"
import { RecentWorks } from "@/components/services/RecentWorks"
import { notFound } from "next/navigation"
import { Globe, Smartphone, Code, BarChart, Palette, Monitor, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Map icon strings to components
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, BarChart, Palette, Monitor
}

export async function generateStaticParams() {
    const { services } = await getServices()
    return (services || []).map((service: any) => ({
        slug: service.slug,
    }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { success, service, features = [], techStack = [], portfolio = [], faqs = [] } = await getServiceBySlug(slug)

    if (!success || !service) {
        notFound()
    }

    const Icon = iconMap[service.icon_name] || Code

    // Transform DB portfolio to component format
    const recentWorksFormatted = portfolio.map((p: any) => ({
        title: p.title,
        category: p.category,
        image: p.image_url
    }))

    return (
        <main className="min-h-screen bg-black text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
                {/* Dynamic Gradient Background */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${service.gradient} opacity-50 blur-[100px]`} />

                {/* Decorative Elements */}
                <div className="absolute top-20 right-0 z-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-0 left-0 z-0 h-64 w-64 rounded-full bg-secondary/20 blur-[80px]" />

                <div className="container relative z-10 mx-auto max-w-7xl px-4">
                    <Link href="/#services" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors group">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Services
                    </Link>

                    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                        {/* Icon Container */}
                        <div className={`shrink-0 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${service.gradient} text-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] animate-in fade-in zoom-in duration-500`}>
                            <Icon className="h-12 w-12 md:h-16 md:w-16" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h1 className="text-4xl md:text-6xl md:leading-[1.1] font-bold tracking-tight text-white">
                                {service.title}
                            </h1>
                            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                                {service.short_description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto max-w-7xl px-4 py-16 -mt-10 relative z-10">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Left Column: Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-20">
                        {/* Overview */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-semibold text-white">Overview</h2>
                            <div className="prose prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
                                {service.full_description}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-semibold text-white">Why Choose Us</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {features.map((feature: any, idx: number) => (
                                    <div key={idx} className="group rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-medium text-white">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white">Technology Stack</h2>
                            <div className="flex flex-wrap gap-3">
                                {techStack.map((tech: any, idx: number) => (
                                    <span key={idx} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium hover:border-white/20 hover:bg-white/10 transition-colors cursor-default">
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Works */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-semibold text-white">Recent Projects</h2>
                            <RecentWorks works={recentWorksFormatted} />
                        </div>

                        {/* FAQ */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
                            <div className="grid gap-4">
                                {faqs.map((item: any, idx: number) => (
                                    <div key={idx} className="rounded-xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors">
                                        <h4 className="text-lg font-medium text-white mb-2">{item.question}</h4>
                                        <p className="text-muted-foreground">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Contact Form (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl shadow-2xl">
                                <div className="rounded-[20px] bg-black/40 p-6 md:p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Get a Quote</h3>
                                    <p className="text-muted-foreground mb-6">Ready to start your project? Let's discuss your needs.</p>
                                    <ServiceContactForm serviceTitle={service.title} />
                                </div>
                            </div>

                            {/* Trust Signal */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Free Consultation & Confidentiality</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
