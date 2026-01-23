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
import Link from "next/link"
import {
    ArrowRight, GraduationCap, Dumbbell, Utensils, Globe, Pill,
    Zap, Box, Monitor, Smartphone, Lock, Activity, ShoppingCart
} from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { getProducts } from "@/actions/product-actions"

// Map icon strings to components
const iconMap: Record<string, any> = {
    GraduationCap, Dumbbell, Utensils, Globe, Pill,
    Zap, Box, Monitor, Smartphone, Lock, Activity, ShoppingCart
}

const colorres = [
    { text: "text-blue-400", bg: "bg-blue-400/10" },
    { text: "text-purple-400", bg: "bg-purple-400/10" },
    { text: "text-orange-400", bg: "bg-orange-400/10" },
    { text: "text-emerald-400", bg: "bg-emerald-400/10" },
    { text: "text-pink-400", bg: "bg-pink-400/10" },
    { text: "text-cyan-400", bg: "bg-cyan-400/10" },
]

export function ProductsSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )
    const [products, setProducts] = React.useState<any[]>([])

    React.useEffect(() => {
        getProducts().then(res => {
            if (res.success && res.data) {
                setProducts(res.data)
            }
        })
    }, [])

    if (products.length === 0) return null

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
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent className="-ml-4">
                            {products.map((product, index) => {
                                // Dynamic Styling
                                const style = colorres[index % colorres.length]

                                // Dynamic Icon
                                const features = product.features || []
                                const firstIconName = features[0]?.icon
                                const Icon = iconMap[firstIconName] || Box

                                return (
                                    <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                            <Card className="h-full border-white/10 bg-black/40 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                                                <CardContent className="flex flex-col items-start justify-between p-6 h-full min-h-[300px]">
                                                    <div>
                                                        <div className={`p-3 w-fit rounded-xl ${style.bg} ${style.text} mb-4`}>
                                                            <Icon className="h-8 w-8" />
                                                        </div>

                                                        <div className="space-y-2 mb-6">
                                                            <h3 className="text-2xl font-bold line-clamp-1">{product.title}</h3>
                                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                                {product.short_description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Link href={`/products/${product.slug}`} className="w-full group">
                                                        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent hover:text-primary group-hover:text-primary">
                                                            View Product <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-white/10 hover:bg-white/10 hover:text-primary" />
                        <CarouselNext className="hidden md:flex -right-12 border-white/10 hover:bg-white/10 hover:text-primary" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
