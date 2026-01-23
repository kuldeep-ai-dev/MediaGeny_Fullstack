"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, FileText, Trash2, Edit, ExternalLink, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllBlogs, deleteBlog, Blog } from "@/actions/blog-actions"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setIsLoading(true)
        const data = await getAllBlogs()
        setBlogs(data)
        setIsLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this post?")) return
        await deleteBlog(id)
        loadData()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
                    <p className="text-muted-foreground">Create and manage your articles and content.</p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                        <Plus className="mr-2 h-4 w-4" /> Write New Article
                    </Button>
                </Link>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                    <CardDescription>
                        {blogs.length} articles found.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Published / Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading posts...</TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No blog posts yet. Start writing!</TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{blog.title}</span>
                                                <span className="text-xs text-muted-foreground">/{blog.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {blog.is_published ? (
                                                <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                                    <Globe className="h-3 w-3 mr-1" /> Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <Lock className="h-3 w-3 mr-1" /> Draft
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{blog.author}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : '-'}</span>
                                                <span className="text-xs text-muted-foreground">Created: {format(new Date(blog.created_at), 'MMM d')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {blog.is_published && (
                                                    <Link href={`/blogs/${blog.slug}`} target="_blank">
                                                        <Button variant="ghost" size="icon" title="View Live">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/blogs/${blog.id}`)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(blog.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
