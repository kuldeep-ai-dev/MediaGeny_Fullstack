"use client"

import { useEffect, useState } from "react"
import { getServices, createService, deleteService } from "@/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabaseClient } from "@/lib/supabase-client"

export default function ServicesAdminPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [newServiceTitle, setNewServiceTitle] = useState("")
    const [newIconName, setNewIconName] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        loadServices()
    }, [])

    async function loadServices() {
        const res = await getServices()
        if (res.success) {
            setServices(res.data || [])
        } else {
            console.error("Failed to load services:", res.error)
            alert("Failed to load services: " + res.error)
        }
        setLoading(false)
    }

    async function handleCreate() {
        if (!newServiceTitle) return
        setCreating(true)

        let iconValue = newIconName

        if (selectedFile) {
            try {
                const fileExt = selectedFile.name.split('.').pop()
                const fileName = `${newServiceTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`
                const { data, error } = await supabaseClient.storage
                    .from('service-icons')
                    .upload(fileName, selectedFile)

                if (error) throw error

                const { data: { publicUrl } } = supabaseClient.storage
                    .from('service-icons')
                    .getPublicUrl(fileName)

                iconValue = publicUrl
            } catch (error: any) {
                alert("Error uploading icon: " + error.message)
                setCreating(false)
                return
            }
        }

        const res = await createService(newServiceTitle, iconValue)
        setCreating(false)

        if (res.success) {
            setNewServiceTitle("")
            setNewIconName("")
            setSelectedFile(null)
            setIsDialogOpen(false)
            loadServices()
        } else {
            alert("Error creating service: " + res.error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this service? This is irreversible.")) return
        setDeletingId(id)
        const res = await deleteService(id)
        setDeletingId(null)
        if (res.success) {
            loadServices()
        } else {
            alert("Error deleting service: " + res.error)
        }
    }

    if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground mt-2">Manage your service offerings.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Service Title</Label>
                                <Input
                                    placeholder="e.g. Cloud Solutions"
                                    value={newServiceTitle}
                                    onChange={e => setNewServiceTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Service Icon</Label>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Option 1: Upload Custom Icon (Recommended)</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Option 2: Lucide Icon Name</Label>
                                        <Input
                                            placeholder="e.g. Cloud, Code, Smartphone"
                                            value={newIconName}
                                            onChange={e => setNewIconName(e.target.value)}
                                            disabled={!!selectedFile}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleCreate} disabled={creating || !newServiceTitle} className="w-full">
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Service
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.id} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">{service.title}</CardTitle>
                            {service.icon_name && (
                                service.icon_name.startsWith('http') ? (
                                    <img src={service.icon_name} alt="icon" className="h-6 w-6 object-contain" />
                                ) : (
                                    <div className="h-6 w-6" />
                                    // Placeholder if we wanted to render Lucide icon here too, but dynamic import is complex client-side without map. 
                                    // We'll leave it simple for admin list or basic placeholder.
                                )
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                {service.short_description}
                            </p>
                            <div className="flex gap-2">
                                <Link href={`/admin/services/${service.id}`} className="flex-1">
                                    <Button variant="secondary" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" /> Edit Content
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(service.id)}
                                    disabled={deletingId === service.id}
                                >
                                    {deletingId === service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
