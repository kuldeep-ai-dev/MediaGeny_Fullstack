"use client"

import { Globe, Smartphone, Code, BarChart, ArrowRight, Palette, Monitor } from "lucide-react"
import Link from "next/link"

const services = [
    {
        title: "Web Development",
        description: "High-performance websites built with Next.js, tailored to convert visitors into customers.",
        icon: Globe,
        href: "/services/web-development",
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        title: "App Development",
        description: "Native and cross-platform mobile apps that provide seamless user experiences.",
        icon: Smartphone,
        href: "/services/app-development",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "Custom Software",
        description: "Scalable enterprise software solutions to automate and optimize your business flows.",
        icon: Code,
        href: "/services/custom-software",
        gradient: "from-emerald-500 to-teal-400",
    },
    {
        title: "Social Media",
        description: "Strategic content and management to elevate your brand's presence across all platforms.",
        icon: BarChart,
        href: "/services/social-media",
        gradient: "from-orange-500 to-red-500",
    },
    {
        title: "Branding",
        description: "Identity design and brand strategy to make your business stand out.",
        icon: Palette,
        href: "/services/branding",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        title: "Kiosk Hardware",
        description: "Bespoke hardware solutions for interactive customer experiences.",
        icon: Monitor,
        href: "/services/kiosk-hardware",
        gradient: "from-yellow-500 to-amber-500",
    },
]

export function ServicesGrid() {
    return (
        <section className="container py-24">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Our <span className="text-primary">Expertise</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    We deliver end-to-end digital solutions designed to help your business grow and succeed in the modern era.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                    <div
                        key={service.title}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-2"
                        style={{
                            animationDelay: `${index * 100}ms`,
                        }}
                    >
                        {/* Gradient Glow on Hover */}
                        <div className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br ${service.gradient}`} />

                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}>
                            <service.icon className="h-6 w-6" />
                        </div>

                        <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                        <p className="mb-6 text-muted-foreground">{service.description}</p>

                        <Link
                            href={service.href}
                            className="inline-flex items-center text-sm font-medium text-primary transition-colors group-hover:text-white"
                        >
                            Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
