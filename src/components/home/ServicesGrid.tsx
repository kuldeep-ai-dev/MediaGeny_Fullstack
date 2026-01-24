"use client"

import { Globe, Smartphone, Code, BarChart, ArrowRight, Palette, Monitor } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

// Map icon strings to components
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, BarChart, Palette, Monitor
}

interface Service {
    title: string
    short_description: string // DB field name
    slug: string
    icon_name: string // DB field name
    gradient: string
}

interface ServicesGridProps {
    services: Service[]
}

export function ServicesGrid({ services }: ServicesGridProps) {
    // Fallback if no services passed (e.g. during build or error)
    if (!services || services.length === 0) return null

    return (
        <section className="container py-16 md:py-24" id="services">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Our <span className="text-primary">Expertise</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    We deliver end-to-end digital solutions designed to help your business grow and succeed in the modern era.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => {
                    const isUrl = service.icon_name && service.icon_name.startsWith('http')
                    const Icon = !isUrl ? (iconMap[service.icon_name] || Code) : null

                    return (
                        <div
                            key={service.slug}
                            className="group relative h-full"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            <Link href={`/services/${service.slug}`} className="block h-full">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-0 group-hover:opacity-70 transition duration-500 blur opacity-20"></div>
                                <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1">
                                    {/* Gradient Glow */}
                                    <div className={`absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-gradient-to-br ${service.gradient} opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-30`} />

                                    <div>
                                        <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg ring-1 ring-white/20`}>
                                            {isUrl ? (
                                                <NextImage src={service.icon_name} alt={service.title} width={28} height={28} className="h-7 w-7 object-contain" />
                                            ) : (
                                                Icon && <Icon className="h-7 w-7" />
                                            )}
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold tracking-tight">{service.title}</h3>
                                        <p className="mb-6 text-muted-foreground line-clamp-3 text-sm leading-relaxed">{service.short_description}</p>
                                    </div>

                                    <div className="flex items-center text-sm font-semibold text-primary group-hover:text-purple-400 transition-colors mt-auto">
                                        Learn more
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
