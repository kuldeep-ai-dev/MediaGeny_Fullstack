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
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-2"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Gradient Glow on Hover */}
                            <div className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br ${service.gradient}`} />

                            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}>
                                {isUrl ? (
                                    <NextImage src={service.icon_name} alt={service.title} width={24} height={24} className="h-6 w-6 object-contain" />
                                ) : (

                                    Icon && <Icon className="h-6 w-6" />
                                )}
                            </div>

                            <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                            <p className="mb-6 text-muted-foreground line-clamp-3">{service.short_description}</p>

                            <Link
                                href={`/services/${service.slug}`}
                                className="inline-flex items-center text-sm font-medium text-primary transition-colors group-hover:text-white"
                            >
                                Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
