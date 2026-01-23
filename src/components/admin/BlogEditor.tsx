"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft, Save, Globe } from "lucide-react"
import Link from "next/link"
import { createBlog, updateBlog, Blog } from "@/actions/blog-actions"

interface BlogEditorProps {
    blog?: Blog
}

export function BlogEditor({ blog }: BlogEditorProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isPublished, setIsPublished] = useState(blog?.is_published || false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        const blogData: Partial<Blog> = {
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            content: formData.get("content") as string,
            excerpt: formData.get("excerpt") as string,
            cover_image: formData.get("cover_image") as string,
            author: formData.get("author") as string,
            is_published: isPublished,
            published_at: isPublished ? (blog?.published_at || new Date().toISOString()) : null
        }

        let result
        if (blog?.id) {
            result = await updateBlog(blog.id, blogData)
        } else {
            result = await createBlog(blogData)
        }

        if (result.success) {
            router.push("/admin/blogs")
            router.refresh()
        } else {
            alert("Failed to save blog: " + result.error)
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{blog ? "Edit Article" : "Write New Article"}</h2>
                        <p className="text-muted-foreground">{blog ? "Update your content." : "Create a new blog post."}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Article Title</Label>
                                    <Input id="title" name="title" defaultValue={blog?.title} placeholder="Enter a catchy title..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Markdown Content</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        defaultValue={blog?.content}
                                        placeholder="# Hello World\nWrite your article in markdown..."
                                        className="min-h-[400px] font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Supports Markdown formatting.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                                    <div className="space-y-0.5">
                                        <Label>Publish Status</Label>
                                        <p className="text-xs text-muted-foreground">Visible to the public?</p>
                                    </div>
                                    <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input id="slug" name="slug" defaultValue={blog?.slug} placeholder="my-awesome-post" />
                                    <p className="text-xs text-muted-foreground">Leave empty to auto-generate from title.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt / Summary</Label>
                                    <Textarea id="excerpt" name="excerpt" defaultValue={blog?.excerpt} placeholder="Short summary for SEO..." className="h-24" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Author Name</Label>
                                    <Input id="author" name="author" defaultValue={blog?.author || "MediaGeny Team"} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cover_image">Cover Image URL</Label>
                                    <Input id="cover_image" name="cover_image" defaultValue={blog?.cover_image} placeholder="https://..." />
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {blog ? "Update Post" : "Create Post"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
