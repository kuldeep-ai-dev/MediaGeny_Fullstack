"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight, GraduationCap, Dumbbell, Utensils, Globe, Pill } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

const products = [
    {
        title: "School Management",
        description: "Comprehensive education management for schools and colleges.",
        icon: GraduationCap,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        title: "Gym Management",
        description: "Member tracking, billing, and scheduling for modern fitness centers.",
        icon: Dumbbell,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
    },
    {
        title: "Restaurant POS",
        description: "Streamlined point-of-sale and inventory for restaurants.",
        icon: Utensils,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
    },
    {
        title: "Custom Websites",
        description: "Tailored high-performance websites for your business.",
        icon: Globe,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
    },
    {
        title: "AI Pharmacy Stock",
        description: "Smart inventory prediction and tracking for pharmacies.",
        icon: Pill,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
    },
]

export function ProductsSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    return (
        <section className="w-full py-24 bg-white/5">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Our Proprietary <span className="text-primary">Products</span>
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Scalable SaaS solutions built in-house to solve complex industry challenges.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="-ml-4">
                            {products.map((product, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card className="border-white/10 bg-black/40 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                                            <CardContent className="flex aspect-square flex-col items-start justify-between p-6">
                                                <div className={`p-3 rounded-xl ${product.bg} ${product.color} mb-4`}>
                                                    <product.icon className="h-8 w-8" />
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-bold">{product.title}</h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent hover:text-primary group">
                                                    View Product <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-white/10 hover:bg-white/10 hover:text-primary" />
                        <CarouselNext className="hidden md:flex -right-12 border-white/10 hover:bg-white/10 hover:text-primary" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
