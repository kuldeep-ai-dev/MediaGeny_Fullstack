import { getProjects } from "@/actions/project-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"

export const metadata = {
    title: 'Our Portfolio | MediaGeny',
    description: 'Explore our latest projects and success stories.',
}

export default async function PortfolioPage() {
    const { projects } = await getProjects()

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] -z-20" />

                <div className="container px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Masterpieces</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        We don't just build websites; we craft digital experiences that drive growth and engagement.
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="container px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(projects || []).map((project) => (
                        <div key={project.id} className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                            <Card className="relative h-full flex flex-col bg-zinc-950 border-white/10 overflow-hidden rounded-xl h-full">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <NextImage
                                        src={project.image_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        {project.live_link && (
                                            <a href={project.live_link} target="_blank" rel="noreferrer">
                                                <Button variant="secondary" className="rounded-full">
                                                    Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {project.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="border-primary/30 bg-primary/10 text-primary-foreground text-xs font-medium px-3 py-0.5">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    {project.live_link && (
                                        <a href={project.live_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center transition-colors">
                                            View Project <ArrowRight className="ml-1 h-4 w-4" />
                                        </a>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>

                {(projects || []).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No projects listed yet. Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    )
}
