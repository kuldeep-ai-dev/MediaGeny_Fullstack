"use client"

import { useEffect, useState } from "react"
import { getProduct, createProduct, updateProduct } from "@/actions/product-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, Save, ArrowLeft, GripVertical } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductEditorProps {
    productId: string // "new" or uuid
}

export function ProductEditor({ productId }: ProductEditorProps) {
    const isNew = productId === "new"
    const router = useRouter()

    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        short_description: "",
        full_description: "",
        hero_image_url: "",
        demo_link: "",
        trust_client_count: 0,
        features: [] as any[],
        key_highlights: [] as string[],
        success_stories: [] as any[]
    })

    useEffect(() => {
        if (!isNew) {
            loadProduct()
        }
    }, [productId])

    async function loadProduct() {
        const res = await getProduct(productId)
        if (res.success && res.data) {
            setFormData({
                ...res.data,
                features: res.data.features || [],
                key_highlights: res.data.key_highlights || [],
                success_stories: res.data.success_stories || []
            })
        } else {
            alert("Failed to load product")
            router.push("/admin/products")
        }
        setLoading(false)
    }

    async function handleSave() {
        if (!formData.title) return alert("Title is required")
        setSaving(true)

        const payload = { ...formData }

        let res;
        if (isNew) {
            res = await createProduct(payload)
        } else {
            res = await updateProduct(productId, payload)
        }

        if (res.success) {
            router.push("/admin/products")
        } else {
            alert("Error saving: " + res.error)
        }
        setSaving(false)
    }

    // --- Helper Handlers ---

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, { title: "", description: "", icon: "Check" }]
        }))
    }

    const updateFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = { ...newFeatures[index], [field]: value }
        setFormData(prev => ({ ...prev, features: newFeatures }))
    }

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            success_stories: [...prev.success_stories, { client: "", quote: "", result: "" }]
        }))
    }

    const updateReference = (index: number, field: string, value: string) => {
        const newRefs = [...formData.success_stories]
        newRefs[index] = { ...newRefs[index], [field]: value }
        setFormData(prev => ({ ...prev, success_stories: newRefs }))
    }

    const removeReference = (index: number) => {
        setFormData(prev => ({
            ...prev,
            success_stories: prev.success_stories.filter((_, i) => i !== index)
        }))
    }

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{isNew ? "Create Product" : "Edit Product"}</h1>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Product
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General Info</TabsTrigger>
                    <TabsTrigger value="content">Features & Highlights</TabsTrigger>
                    <TabsTrigger value="social">Success Stories</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Product Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. ERP Pro" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Slug (URL) - Leave empty to auto-generate</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="erp-pro" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Short Description (Hero Section)</Label>
                                <Textarea value={formData.short_description} onChange={e => setFormData({ ...formData, short_description: e.target.value })} placeholder="A brief hook..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Trust: Client Count</Label>
                                <Input type="number" value={formData.trust_client_count} onChange={e => setFormData({ ...formData, trust_client_count: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Demo Link URL (Button Target)</Label>
                                <Input value={formData.demo_link} onChange={e => setFormData({ ...formData, demo_link: e.target.value })} placeholder="https://..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Detailed Content</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Full Description / Brand Story</Label>
                                <Textarea className="min-h-[200px]" value={formData.full_description} onChange={e => setFormData({ ...formData, full_description: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Features</CardTitle>
                            <Button size="sm" variant="outline" onClick={addFeature}><Plus className="h-4 w-4 mr-2" /> Add Feature</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.features.map((feat, idx) => (
                                <div key={idx} className="flex gap-4 items-start border p-4 rounded-lg bg-black/20">
                                    <div className="mt-2"><GripVertical className="h-4 w-4 text-muted-foreground" /></div>
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={feat.title}
                                            onChange={e => updateFeature(idx, 'title', e.target.value)}
                                            placeholder="Feature Title"
                                        />
                                        <Textarea
                                            value={feat.description}
                                            onChange={e => updateFeature(idx, 'description', e.target.value)}
                                            placeholder="Description"
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            {formData.features.length === 0 && <p className="text-muted-foreground text-center py-4">No features added yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Key Highlights (Bullet Points)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Enter highlights separated by new lines</Label>
                                <Textarea
                                    className="min-h-[150px]"
                                    value={formData.key_highlights.join('\n')}
                                    onChange={e => setFormData({ ...formData, key_highlights: e.target.value.split('\n') })}
                                    placeholder="24/7 Support&#10;Mobile Ready&#10;Cloud Hosted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Success Stories</CardTitle>
                            <Button size="sm" variant="outline" onClick={addReference}><Plus className="h-4 w-4 mr-2" /> Add Story</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.success_stories.map((story, idx) => (
                                <div key={idx} className="flex gap-4 items-start border p-4 rounded-lg bg-black/20">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                value={story.client}
                                                onChange={e => updateReference(idx, 'client', e.target.value)}
                                                placeholder="Client/Company Name"
                                                className="flex-1"
                                            />
                                            <Input
                                                value={story.result}
                                                onChange={e => updateReference(idx, 'result', e.target.value)}
                                                placeholder="Key Result (e.g. 200% Growth)"
                                                className="flex-1"
                                            />
                                        </div>
                                        <Textarea
                                            value={story.quote}
                                            onChange={e => updateReference(idx, 'quote', e.target.value)}
                                            placeholder="Customer Quote..."
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeReference(idx)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
