import Link from "next/link"
import { getServices } from "@/actions/public-actions"
import { getProducts } from "@/actions/product-actions"
import { getPublishedBlogs } from "@/actions/blog-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Box, Code, FileText, Home, Info, Mail, Shield, Briefcase } from "lucide-react"

export default async function SitemapPage() {
    const [servicesRes, productsRes, blogs] = await Promise.all([
        getServices(),
        getProducts(),
        getPublishedBlogs()
    ])

    const services = servicesRes.success ? (servicesRes.services || []) : []
    const products = productsRes.success ? (productsRes.data || []) : []

    const mainLinks = [
        { title: "Home", href: "/", icon: Home },
        { title: "About Us", href: "/about", icon: Info },
        { title: "Contact", href: "/contact", icon: Mail },
        { title: "Careers", href: "/careers", icon: Briefcase },
        { title: "Legal", href: "/legal", icon: Shield },
    ]

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Sitemap
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        An overview of all content available on MediaGeny.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* Main Pages */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Main Pages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {mainLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors h-full">
                                        <CardContent className="flex items-center gap-4 p-6">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <link.icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-semibold">{link.title}</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service: any) => (
                                <Link key={service.slug} href={`/services/${service.slug}`}>
                                    <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                        <Code className="h-5 w-5 text-secondary" />
                                        <span>{service.title}</span>
                                        <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                            {services.length === 0 && <p className="text-muted-foreground italic">No services listed yet.</p>}
                        </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Our Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product: any) => (
                                <Link key={product.slug} href={`/products/${product.slug}`}>
                                    <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                        <Box className="h-5 w-5 text-secondary" />
                                        <span>{product.title}</span>
                                        <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                            {products.length === 0 && <p className="text-muted-foreground italic">No products listed yet.</p>}
                        </div>
                    </div>

                    {/* Blogs & Resources */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Latest Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {blogs.map((blog: any) => (
                                <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
                                    <div className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                        <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">{blog.title}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{blog.excerpt}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {blogs.length === 0 && <p className="text-muted-foreground italic">No blogs published yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
