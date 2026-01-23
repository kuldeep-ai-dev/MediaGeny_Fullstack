import { Star } from "lucide-react"
import { getFeaturedTestimonials } from "@/actions/testimonial-actions"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export async function TestimonialsSection() {
    const testimonials = await getFeaturedTestimonials()

    if (testimonials.length === 0) return null

    return (
        <section className="py-24 bg-black/40 border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Trusted by Clients Worldwide
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        See what our partners have to say about their journey with MediaGeny.
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {testimonials.map((t) => (
                            <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Card className="bg-white/5 border-white/10 h-full hover:bg-white/10 transition-colors">
                                    <CardContent className="p-8 flex flex-col h-full">
                                        <div className="flex gap-1 mb-4">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                            ))}
                                        </div>

                                        <blockquote className="flex-grow mb-6 text-muted-foreground italic">
                                            "{t.content}"
                                        </blockquote>

                                        <div className="flex items-center gap-4 mt-auto">
                                            {t.image_url ? (
                                                <img
                                                    src={t.image_url}
                                                    alt={t.client_name}
                                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                                    {t.client_name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-foreground">{t.client_name}</div>
                                                {t.client_role && (
                                                    <div className="text-xs text-muted-foreground">{t.client_role}</div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 border-white/10 hover:bg-white/10" />
                    <CarouselNext className="hidden md:flex -right-12 border-white/10 hover:bg-white/10" />
                </Carousel>
            </div>
        </section>
    )
}
