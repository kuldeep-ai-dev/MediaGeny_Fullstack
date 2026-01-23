'use client'

import { useState, useEffect } from 'react'
import { getProjects, createProject, updateProject, deleteProject, type Project } from '@/actions/project-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pencil, Trash2, Plus, Loader2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import NextImage from 'next/image'

export function PortfolioManager() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        image_url: '',
        tags: '',
        live_link: ''
    })

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        setLoading(true)
        const res = await getProjects()
        if (res.success && res.projects) {
            setProjects(res.projects)
        } else {
            toast.error("Failed to load projects")
        }
        setLoading(false)
    }

    const handleOpen = (project?: Project) => {
        if (project) {
            setEditingProject(project)
            setFormData({
                title: project.title,
                slug: project.slug,
                description: project.description,
                image_url: project.image_url,
                tags: project.tags.join(', '),
                live_link: project.live_link || ''
            })
        } else {
            setEditingProject(null)
            setFormData({
                title: '',
                slug: '',
                description: '',
                image_url: '',
                tags: '',
                live_link: ''
            })
        }
        setIsOpen(true)
    }

    async function handleSave() {
        if (!formData.title || !formData.slug || !formData.description || !formData.image_url) {
            toast.error("Please fill in all required fields")
            return
        }

        setSaving(true)
        const payload = {
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            image_url: formData.image_url,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            live_link: formData.live_link || undefined
        }

        let res;
        if (editingProject) {
            res = await updateProject(editingProject.id, payload)
        } else {
            res = await createProject(payload)
        }

        if (res.success) {
            toast.success(editingProject ? "Project updated" : "Project created")
            setIsOpen(false)
            loadProjects()
        } else {
            console.error("Save error:", res.error)
            toast.error(res.error || "Operation failed. Please check console.")
        }
        setSaving(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return
        const res = await deleteProject(id)
        if (res.success) {
            toast.success("Project deleted")
            loadProjects()
        } else {
            toast.error("Failed to delete project")
        }
    }

    // Auto-generate slug from title
    useEffect(() => {
        if (!editingProject && formData.title) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }))
        }
    }, [formData.title, editingProject])

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

    return (
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Portfolio Projects</CardTitle>
                <Button onClick={() => handleOpen()} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id} className="border-white/10 hover:bg-white/5">
                                <TableCell>
                                    <div className="relative h-12 w-20 overflow-hidden rounded-md border border-white/10 bg-muted">
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {project.title}
                                    {project.live_link && (
                                        <a href={project.live_link} target="_blank" rel="noreferrer" className="ml-2 inline-flex text-muted-foreground hover:text-primary">
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(project)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {projects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No projects found. Add your first one!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-white/10">
                    <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                        <DialogDescription>
                            Showcase your work to the world.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. E-Commerce Platform"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="e-commerce-platform"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.image_url && (
                                    <div className="h-10 w-10 relative overflow-hidden rounded border border-white/10 flex-shrink-0">
                                        <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the project..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="React, Next.js, Stripe"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="link">Live Link (Optional)</Label>
                            <Input
                                id="link"
                                value={formData.live_link}
                                onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
