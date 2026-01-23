import { getProductBySlug } from "@/actions/product-actions"
import { getProducts } from "@/actions/public-actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, Star, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ServiceContactForm } from "@/components/services/ServiceContactForm" // Reusing this as it's a lead form

export async function generateStaticParams() {
    const { products } = await getProducts()
    return (products || []).map((product: any) => ({
        slug: product.slug,
    }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { success, data: product } = await getProductBySlug(slug)

    if (!success || !product) {
        notFound()
    }

    return (
        <main className="min-h-screen pt-0 bg-black">
            {/* 1. Hero Section - pt-32 to clear fixed navbar (~64px) + spacing */}
            <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500/20 to-transparent blur-3xl opacity-80" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <span className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                        {product.key_highlights?.[0] || "Enterprise Ready Solution"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {product.title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        {product.short_description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="#demo">
                            <Button size="lg" className="h-12 px-8 text-base">
                                Schedule a Free Demo <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        {product.demo_link && (
                            <Link href={product.demo_link} target="_blank">
                                <Button size="lg" variant="outline" className="h-12 px-8">
                                    Watch Video
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Trust Counter */}
                    {product.trust_client_count > 0 && (
                        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Users className="h-5 w-5 text-blue-500" />
                            <span className="font-semibold text-foreground">{product.trust_client_count}+</span> Organizations trust {product.title}
                        </div>
                    )}
                </div>
            </section>

            {/* 2. Features Grid */}
            {product.features?.length > 0 && (
                <section className="py-24 bg-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
                            <p className="text-muted-foreground">Everything you need to scale your operations.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {product.features.map((feature: any, idx: number) => (
                                <div key={idx} className="p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-4px]">
                                    <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Detailed Content & Highlights */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold">Why Choose {product.title}?</h2>
                        <div className="prose prose-invert prose-lg text-muted-foreground whitespace-pre-wrap">
                            {product.full_description}
                        </div>

                        {/* Key Highlights */}
                        <div className="grid sm:grid-cols-2 gap-4 mt-8">
                            {product.key_highlights?.map((hl: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span>{hl}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Contact Form / Lead Gen */}
                    <div id="demo" className="relative">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[60px] -z-10" />
                        <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold mb-2">Get Started Today</h3>
                                <p className="text-muted-foreground mb-6">Fill out the form below to request a personalized demo.</p>
                                <ServiceContactForm serviceTitle={product.title} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 5. Success Stories */}
            {product.success_stories?.length > 0 && (
                <section className="py-24 bg-white/5 border-t border-white/10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-16">Success Stories</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {product.success_stories.map((story: any, idx: number) => (
                                <Card key={idx} className="bg-black/40 border-white/10">
                                    <CardContent className="p-8">
                                        <div className="flex gap-1 mb-6">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </div>
                                        <blockquote className="text-lg mb-6 leading-relaxed">
                                            "{story.quote}"
                                        </blockquote>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                            <div>
                                                <p className="font-semibold">{story.client}</p>
                                                {story.result && <p className="text-sm text-blue-400">{story.result}</p>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
