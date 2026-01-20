"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
    return (
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),rgba(0,0,0,0)_50%)]" />
            <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] opacity-30" />

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="h-4 w-4" />
                <span>Inovation Meets Excellence</span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-100">
                Empowering Your{" "}
                <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                    Digital Future
                </span>
            </h1>

            {/* Subtext */}
            <p className="mb-8 max-w-2xl text-base text-muted-foreground md:text-lg animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-200">
                We craft world-class websites, enterprise ERP solutions, and cutting-edge digital
                experiences that transform businesses into industry leaders.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-300">
                <Link href="/services">
                    <Button size="lg" className="h-12 min-w-[180px] rounded-full text-base font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:-translate-y-1 transition-all duration-300">
                        Explore Our Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <Link href="/portfolio">
                    <Button variant="outline" size="lg" className="h-12 min-w-[180px] rounded-full border-white/10 bg-white/5 text-base backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                        View Portfolio
                    </Button>
                </Link>
            </div>
        </section>
    )
}
