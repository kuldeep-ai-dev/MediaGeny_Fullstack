import { getBlogBySlug } from "@/actions/blog-actions"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import { Calendar, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)
    if (!blog) return { title: "Article Not Found" }

    return {
        title: `${blog.title} | MediaGeny Blog`,
        description: blog.excerpt || blog.title,
    }
}

export default async function BlogParamsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-background pt-24 pb-20">
            {/* Header/Hero */}
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/blogs">
                    <Button variant="ghost" size="sm" className="mb-8 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
                    </Button>
                </Link>

                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : 'Draft'}
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {blog.author}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary pb-2">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {blog.excerpt}
                        </p>
                    )}
                </div>

                {blog.cover_image && (
                    <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 max-w-3xl mt-16">
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-li:text-muted-foreground">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                    <p className="text-muted-foreground italic">
                        Thanks for reading!
                    </p>
                    <Link href="/blogs">
                        <Button variant="outline">Read More Articles</Button>
                    </Link>
                </div>
            </div>
        </article>
    )
}
