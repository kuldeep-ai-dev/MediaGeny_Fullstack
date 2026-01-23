import { getPublishedBlogs } from "@/actions/blog-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export const metadata = {
    title: "Blog & Insights | MediaGeny",
    description: "Latest news, tech updates, and insights from the MediaGeny team.",
}

export default async function PublicBlogsPage() {
    const blogs = await getPublishedBlogs()

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            {/* Hero */}
            <div className="relative isolate overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-16 text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Insights & Stories
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Discover our latest thoughts on technology, design, and digital innovation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-6xl">
                {blogs.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold">No articles published yet.</h3>
                        <p className="text-muted-foreground mt-2">Check back soon for updates!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <Card key={blog.id} className="flex flex-col overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1 h-full">
                                {blog.cover_image && (
                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : 'Draft'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {blog.author}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight line-clamp-2 hover:text-primary transition-colors">
                                        <Link href={`/blogs/${blog.slug}`}>
                                            {blog.title}
                                        </Link>
                                    </h3>
                                </CardHeader>
                                <CardContent className="p-6 pt-2 flex-grow">
                                    <p className="text-muted-foreground line-clamp-3 text-sm">
                                        {blog.excerpt || "Read more about this topic..."}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 mt-auto">
                                    <Link href={`/blogs/${blog.slug}`} className="w-full">
                                        <Button variant="ghost" className="w-full justify-between group">
                                            Read Article
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
